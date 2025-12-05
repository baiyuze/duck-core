import React, { useState, useCallback } from "react";
import Sidebar, { type PageItem } from "../Sidebar";
import styles from "./MainLayout.module.scss";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [pages, setPages] = useState<PageItem[]>([
    {
      id: "home",
      name: "首页",
    },
    {
      id: "page-1",
      name: "页面 1",
    },
    {
      id: "page-2",
      name: "页面 2",
      children: [
        {
          id: "page-2-1",
          name: "子页面 2-1",
        },
        {
          id: "page-2-2",
          name: "子页面 2-2",
        },
      ],
    },
  ]);

  const [activePageId, setActivePageId] = useState("home");
  const [collapsed, setCollapsed] = useState(false);

  const generateId = () => `page-${Date.now()}`;

  const handlePageSelect = useCallback((pageId: string) => {
    setActivePageId(pageId);
    console.log("Selected page:", pageId);
  }, []);

  const handlePageAdd = useCallback((parentId?: string) => {
    const newPage: PageItem = {
      id: generateId(),
      name: `新页面`,
    };

    setPages((prevPages) => {
      if (!parentId) {
        return [...prevPages, newPage];
      }

      const addToParent = (items: PageItem[]): PageItem[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newPage],
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToParent(item.children),
            };
          }
          return item;
        });
      };

      return addToParent(prevPages);
    });
  }, []);

  const handlePageDelete = useCallback((pageId: string) => {
    setPages((prevPages) => {
      const deleteFromList = (items: PageItem[]): PageItem[] => {
        return items
          .filter((item) => item.id !== pageId)
          .map((item) => ({
            ...item,
            children: item.children ? deleteFromList(item.children) : undefined,
          }));
      };
      return deleteFromList(prevPages);
    });
  }, []);

  const handlePageRename = useCallback((pageId: string, newName: string) => {
    setPages((prevPages) => {
      const renameInList = (items: PageItem[]): PageItem[] => {
        return items.map((item) => {
          if (item.id === pageId) {
            return { ...item, name: newName };
          }
          if (item.children) {
            return { ...item, children: renameInList(item.children) };
          }
          return item;
        });
      };
      return renameInList(prevPages);
    });
  }, []);

  const handlePageDuplicate = useCallback((pageId: string) => {
    setPages((prevPages) => {
      const findAndDuplicate = (items: PageItem[]): PageItem[] => {
        const result: PageItem[] = [];
        for (const item of items) {
          result.push({
            ...item,
            children: item.children
              ? findAndDuplicate(item.children)
              : undefined,
          });
          if (item.id === pageId) {
            const duplicatedPage: PageItem = {
              ...item,
              id: generateId(),
              name: `${item.name} (副本)`,
              children: item.children?.map((child) => ({
                ...child,
                id: generateId(),
              })),
            };
            result.push(duplicatedPage);
          }
        }
        return result;
      };
      return findAndDuplicate(prevPages);
    });
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        onPageSelect={handlePageSelect}
        onPageAdd={handlePageAdd}
        onPageDelete={handlePageDelete}
        onPageRename={handlePageRename}
        onPageDuplicate={handlePageDuplicate}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>
            {pages.find((p) => p.id === activePageId)?.name ||
              pages
                .flatMap((p) => p.children || [])
                .find((p) => p.id === activePageId)?.name ||
              "未知页面"}
          </h1>
        </div>
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
