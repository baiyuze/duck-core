package example

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Upgrader 用于将 HTTP 连接升级为 WebSocket 连接
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// 允许跨域连接（实际生产环境中应限制来源）
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Client 结构体代表一个 WebSocket 连接的客户端
type Client struct {
	conn *websocket.Conn
	// channel 用于发送数据
	send chan []byte
}

// Hub 结构体负责管理所有客户端连接和广播消息
type Hub struct {
	// 注册的客户端
	clients map[*Client]bool
	// 广播通道，所有待广播的消息都发送到此
	broadcast chan []byte
	// 注册客户端的通道
	register chan *Client
	// 注销客户端的通道
	unregister chan *Client
	// 保护 clients map 的锁
	mu sync.RWMutex
}

// NewHub 创建并返回一个新的 Hub 实例
func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

// Run 启动 Hub 的主循环
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			// 新客户端注册
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Printf("Client connected. Total clients: %d", len(h.clients))

		case client := <-h.unregister:
			// 客户端注销
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()
			log.Printf("Client disconnected. Total clients: %d", len(h.clients))

		case message := <-h.broadcast:
			// 接收到广播消息，分发给所有客户端
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
					// 成功发送
				default:
					// 发送失败（可能是 channel 满了或客户端已关闭），注销它
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// readPump 负责从 WebSocket 连接中读取消息
func (c *Client) readPump(h *Hub) {
	defer func() {
		h.unregister <- c
		c.conn.Close()
	}()
	// 设置读取的最大消息大小和心跳等
	c.conn.SetReadLimit(512)

	for {
		// 读取客户端发送的消息
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading message: %v", err)
			}
			break
		}
		// 将消息发送到 Hub 的广播通道
		h.broadcast <- message
	}
}

// writePump 负责将 Hub 广播的消息写入 WebSocket 连接
func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// Hub 关闭了 channel，发送关闭帧
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			// 写入消息到连接
			err := c.conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Printf("error writing message: %v", err)
				return
			}
		}
	}
}

// wsHandler 处理 WebSocket 连接请求
func wsHandler(h *Hub, w http.ResponseWriter, r *http.Request) {
	// 升级 HTTP 连接到 WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade failed:", err)
		return
	}

	// 创建新的客户端
	client := &Client{conn: conn, send: make(chan []byte, 256)}
	// 注册到 Hub
	h.register <- client

	// 启动两个 goroutine：一个用于读取，一个用于写入
	go client.writePump()
	go client.readPump(h)
}

func main() {
	// 1. 创建 Hub
	hub := NewHub()
	// 2. 在一个 goroutine 中启动 Hub 的主循环
	go hub.Run()

	// 3. 注册 WebSocket 处理器
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wsHandler(hub, w, r)
	})

	// 4. 注册一个简单的静态文件处理器（用于加载 index.html）
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	log.Println("Server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
