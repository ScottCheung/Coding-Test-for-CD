/** @format */

'use client';

import { Sidebar } from '@/components/layout/sidebar';
import AuthGuard from '@/components/auth/auth-guard';
import { GlobalDrawer } from '@/components/layout/global-drawer';
import { PageHeader } from '@/components/layout/page-header';
import { useHeaderStore } from '@/lib/store/header-store';
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

  return (
    // <AuthGuard>
    <div className='flex h-screen w-screen flex-row overflow-hidden bg-background'>
      <Sidebar />
      <main
        ref={scrollContainerRef}
        className='flex-1 overflow-y-auto overflow-x-hidden relative'
      >
        <div>
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
          <div className='mt-18 p-page min-h-screen'>{children}</div>
        </div>
      </main>
      <GlobalDrawer />
    </div>
    // </AuthGuard>
  );
}
