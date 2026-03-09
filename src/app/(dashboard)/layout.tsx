/** @format */

'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { GlobalDrawer } from '@/components/layout/global-drawer';
import { PageHeader } from '@/components/layout/page-header';
import { useHeaderStore } from '@/lib/store/header-store';
import { usePathname } from 'next/navigation';
import React, { memo } from 'react';

// 将 Sidebar 包装在一个独立的组件中，避免因为 layout 的其他状态变化而重新渲染
const MemoizedSidebar = memo(Sidebar);

// 将主内容区域也 memo 化
const MainContent = memo(function MainContent({
  children,
  title,
  description,
  actions,
  headerChildren,
  scrollContainerRef,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  headerChildren?: React.ReactNode;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <main
      ref={scrollContainerRef}
      className='flex-1 overflow-y-auto overflow-x-hidden relative transition-all'
    >
      <div className=''>
        {title && (
          <PageHeader
            title={title}
            description={description}
            actions={actions}
            scrollContainerRef={scrollContainerRef}
          >
            {headerChildren}
          </PageHeader>
        )}
        <div className='mt-18 p-page min-h-screen '>{children}</div>
      </div>
    </main>
  );
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    title,
    description,
    actions,
    children: headerChildren,
  } = useHeaderStore();
  const scrollContainerRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();

  // 路由切换时滚动到顶部
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className='flex h-screen w-screen flex-row overflow-hidden bg-background'>
      <MemoizedSidebar />
      <MainContent
        title={title}
        description={description}
        actions={actions}
        headerChildren={headerChildren}
        scrollContainerRef={scrollContainerRef}
      >
        {children}
      </MainContent>
      <GlobalDrawer />
    </div>
  );
}
