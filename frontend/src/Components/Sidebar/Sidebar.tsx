import React, { useState } from "react";
import {
  AppstoreOutlined,
  FileOutlined,
  FolderOutlined,
  PlusOutlined,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  HomeOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Button, Tooltip, Dropdown, Input, Modal } from "antd";
import type { MenuProps } from "antd";
import styles from "./Sidebar.module.scss";

export interface PageItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: PageItem[];
}

export interface SidebarProps {
  pages?: PageItem[];
  activePageId?: string;
  onPageSelect?: (pageId: string) => void;
  onPageAdd?: (parentId?: string) => void;
  onPageDelete?: (pageId: string) => void;
  onPageRename?: (pageId: string, newName: string) => void;
  onPageDuplicate?: (pageId: string) => void;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const defaultPages: PageItem[] = [
  {
    id: "home",
    name: "首页",
    icon: <HomeOutlined />,
  },
  {
    id: "page-1",
    name: "页面 1",
    icon: <FileOutlined />,
  },
  {
    id: "page-2",
    name: "页面 2",
    icon: <FileOutlined />,
    children: [
      {
        id: "page-2-1",
        name: "子页面 2-1",
        icon: <FileOutlined />,
      },
      {
        id: "page-2-2",
        name: "子页面 2-2",
        icon: <FileOutlined />,
      },
    ],
  },
  {
    id: "folder-1",
    name: "文件夹",
    icon: <FolderOutlined />,
    children: [
      {
        id: "page-3",
        name: "页面 3",
        icon: <FileOutlined />,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  pages = defaultPages,
  activePageId = "home",
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageRename,
  onPageDuplicate,
  collapsed = false,
  onCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [selectedKey, setSelectedKey] = useState(activePageId);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renamingPage, setRenamingPage] = useState<PageItem | null>(null);
  const [newName, setNewName] = useState("");

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedKey(pageId);
    onPageSelect?.(pageId);
  };

  const handleRename = (page: PageItem) => {
    setRenamingPage(page);
    setNewName(page.name);
    setRenameModalVisible(true);
  };

  const handleRenameConfirm = () => {
    if (renamingPage && newName.trim()) {
      onPageRename?.(renamingPage.id, newName.trim());
    }
    setRenameModalVisible(false);
    setRenamingPage(null);
    setNewName("");
  };

  const getDropdownMenu = (page: PageItem): MenuProps["items"] => [
    {
      key: "rename",
      icon: <EditOutlined />,
      label: "重命名",
      onClick: () => handleRename(page),
    },
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: "复制",
      onClick: () => onPageDuplicate?.(page.id),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "删除",
      danger: true,
      onClick: () => onPageDelete?.(page.id),
    },
  ];

  type MenuItem = {
    key: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    children?: MenuItem[];
  };

  const renderPageItem = (page: PageItem, depth: number = 0): MenuItem => {
    if (page.children && page.children.length > 0) {
      return {
        key: page.id,
        icon: page.icon || <FolderOutlined />,
        label: (
          <div className={styles.menuItemContent}>
            <span className={styles.menuItemLabel}>{page.name}</span>
            {!isCollapsed && (
              <Dropdown
                menu={{ items: getDropdownMenu(page) }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  size="small"
                  className={styles.moreButton}
                  icon={<MoreOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            )}
          </div>
        ),
        children: page.children.map((child) =>
          renderPageItem(child, depth + 1)
        ),
      };
    }

    return {
      key: page.id,
      icon: page.icon || <FileOutlined />,
      label: (
        <div className={styles.menuItemContent}>
          <span className={styles.menuItemLabel}>{page.name}</span>
          {!isCollapsed && (
            <Dropdown
              menu={{ items: getDropdownMenu(page) }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                className={styles.moreButton}
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          )}
        </div>
      ),
    };
  };

  const menuItems: MenuProps["items"] = pages.map((page) =>
    renderPageItem(page)
  );

  // 底部菜单
  const bottomMenuItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
  ];

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* 顶部区域 */}
      <div className={styles.header}>
        {!isCollapsed && (
          <div className={styles.logo}>
            <AppstoreOutlined className={styles.logoIcon} />
            <span className={styles.logoText}>Duck Design</span>
          </div>
        )}
        <Button
          type="text"
          className={styles.collapseButton}
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleCollapse}
        />
      </div>

      {/* 页面列表区域 */}
      <div className={styles.pageSection}>
        <div className={styles.sectionHeader}>
          {!isCollapsed && <span className={styles.sectionTitle}>页面</span>}
          <Tooltip title="新建页面">
            <Button
              type="text"
              size="small"
              className={styles.addButton}
              icon={<PlusOutlined />}
              onClick={() => onPageAdd?.()}
            />
          </Tooltip>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={pages
            .filter((p) => p.children && p.children.length > 0)
            .map((p) => p.id)}
          items={menuItems}
          inlineCollapsed={isCollapsed}
          className={styles.pageMenu}
          onClick={({ key }) => handlePageSelect(key)}
        />
      </div>

      {/* 底部菜单 */}
      <div className={styles.bottomSection}>
        <Menu
          mode="inline"
          items={bottomMenuItems}
          inlineCollapsed={isCollapsed}
          className={styles.bottomMenu}
          selectable={false}
        />
      </div>

      {/* 重命名弹窗 */}
      <Modal
        title="重命名页面"
        open={renameModalVisible}
        onOk={handleRenameConfirm}
        onCancel={() => setRenameModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="请输入页面名称"
          onPressEnter={handleRenameConfirm}
        />
      </Modal>
    </div>
  );
};

export default Sidebar;
