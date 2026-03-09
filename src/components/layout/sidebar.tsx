/** @format */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Settings2,
  CircleHelp,
  LogOut,
  Building,
  Sun,
  Scroll,
  List,
  Settings2Icon,
  Trophy,
  Menu,
  X,
  AlignRight,
  ArrowRight,
  AlignRightIcon,
  ArrowRightIcon,
  PanelRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ListGridToggle } from '@/components/global/list-grid-toggle';
import { ModeToggle } from '@/components/global/mode-toggle';
import { ColorPicker } from '@/components/global/color-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AFL Teams', href: '/afl-teams', icon: Users },
  { name: 'AFL Fixture', href: '/afl-fixture', icon: Trophy },
];

// 认证功能已禁用
// import { useAuthStore } from '@/lib/store';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useEffect, useState } from 'react';

import {
  Tooltip,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/UI/tooltip';
import { H4 } from '@/components/UI/text/typography';
import { div } from 'framer-motion/client';

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const { toggleSidebar } = useLayoutStore((state) => state.actions);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 40,
  } as const;

  const textVariants = {
    hidden: { opacity: 0, x: -10, width: 0, display: 'none' },
    visible: {
      opacity: 1,
      x: 0,
      width: 'auto',
      display: 'block',
      transition: { delay: 0.05, duration: 0.2 },
    },
    exit: { opacity: 0, x: -10, width: 0, transition: { duration: 0.1 } },
  };

  const SidebarContent = () => (
    <>
      <div className='flex flex-col  lg:h-screen justify-between gap-4'>
        {/* Brand */}
        <div
          className={cn(
            'flex items-start gap-4',
            isCollapsed ? 'justify-center px-0' : 'px-2',
          )}
        >
          <div
            className={cn(
              isCollapsed ? 'size-12' : 'size-20',
              'transition-all',
            )}
          >
            <img
              src='https://www.afl.com.au/resources/v5.44.20/i/elements/afl-logo.png'
              alt=''
            />
          </div>
          {/* <AnimatePresence mode='popLayout'>
            {!isCollapsed && (
              <motion.div
                variants={textVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex flex-col whitespace-nowrap overflow-hidden'
              >
                <H4>AFL</H4>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>

        {/* Navigation */}
        <nav className='flex-1 flex-col gap-1'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip
                key={item.name}
                content={isCollapsed ? item.name : null}
                side='right'
              >
                <Link
                  href={item.href}
                  scroll={true}
                  className={cn(
                    'group flex items-center gap-3 rounded-full transition-all',
                    isCollapsed ? 'justify-center p-2.5' : 'px-4 py-3.5',
                    isActive ?
                      'text-primary bg-primary/5'
                    : 'text-ink-secondary hover:bg-background',
                  )}
                >
                  <div className='shrink-0'>
                    <item.icon className='size-5' />
                  </div>
                  <AnimatePresence mode='popLayout'>
                    {!isCollapsed && (
                      <motion.p
                        variants={textVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'
                        className={cn(
                          'text-sm whitespace-nowrap overflow-hidden',
                          isActive ? 'font-bold' : 'font-medium',
                        )}
                      >
                        {item.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Link>
              </Tooltip>
            );
          })}
        </nav>
        {/* Footer Nav */}
        <div>
          <AnimatePresence mode='popLayout'>
            {!isCollapsed && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    width: 0,
                    // marginBottom: 0,
                    // paddingTop: 0,
                    // borderTopWidth: 0,
                  },
                  visible: {
                    opacity: 1,
                    width: 'auto',
                    // marginBottom: 24,
                    // paddingTop: 24,
                    // borderTopWidth: 1,
                  },
                  exit: {
                    opacity: 0,
                    width: 0,
                    // marginBottom: 0,
                    // paddingTop: 0,
                    // borderTopWidth: 0,
                  },
                }}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <div
                  className='flex flex-col gap-4 border-primary/10
                overflow-hidden'
                >
                  <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium text-ink-secondary '>
                      View
                    </p>
                    <ListGridToggle />
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium text-ink-secondary '>
                      Theme
                    </p>
                    <ModeToggle />
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs font-medium text-ink-secondary '>
                      Color
                    </p>
                    <ColorPicker />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className='hidden md:flex '>
            <AnimatePresence mode='popLayout'>
              <motion.div
                variants={textVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex-col flex-1 min-w-0 overflow-hidden'
              >
                <Tooltip
                  content={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  side='right'
                >
                  <motion.div
                    layout
                    onClick={toggleSidebar}
                    className='flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary-gradient text-white transition-transform '
                  >
                    <PanelRight className='size-6' />
                  </motion.div>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className='fixed bottom-1/4 -left-4 z-50 flex lg:hidden items-center justify-center size-12 rounded-xl bg-panel border border-black/5 dark:border-white/5 shadow-lg text-ink-primary hover:bg-primary hover:text-white transition-all'
        aria-label='Open menu'
      >
        <PanelRight className='size-6' />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden'
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className='fixed top-0 left-0 z-50 h-screen w-72 flex-col justify-between bg-panel p-sidebar lg:hidden shadow-2xl'
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className='absolute top-4 right-4 flex items-center justify-center size-8 rounded-lg text-ink-secondary hover:bg-background transition-colors'
              aria-label='Close menu'
            >
              <X className='size-5' />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        layout
        initial={{ width: 288 }}
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={springTransition}
        className={cn(
          'top-0 left-0 z-10 sticky h-screen flex-col justify-between bg-panel hidden lg:flex overflow-hidden',
          isCollapsed ? 'p-4' : 'p-sidebar',
        )}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
});
