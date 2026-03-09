/** @format */

'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { GlobalDrawer } from '@/components/layout/global-drawer';
import { PageHeader } from '@/components/layout/page-header';
import { useHeaderStore } from '@/lib/store/header-store';
import { usePathname } from 'next/navigation';
import React from 'react';

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
      <Sidebar />
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
      <GlobalDrawer />
    </div>
  );
}
