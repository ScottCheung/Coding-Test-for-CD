/** @format */

'use client';

import {
  Users,
  IdCard,
  Layers,
  TrendingUp,
  Minus,
  Plus,
  FilePenLine,
  UserPlus,
  PlusCircle,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/card';

import { TextTruncate } from '@/components/custom/text-truncate';
import { Switch } from '@/components/UI/switch';
import * as React from 'react';
import { H1, H2, P, Muted } from '@/components/UI/text/typography';
import Link from 'next/link';

export default function DashboardPage() {
  const [isFullView, setIsFullView] = React.useState(false);

  return (
    <div className='space-y-10'>
      {/* Page Heading */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex min-w-72 flex-col gap-1'>
          <H1 className='text-primary'>Dashboard</H1>
          <Muted className='text-ink-secondary'>
            Welcome back, Admin! Here&apos;s what&apos;s happening today.
          </Muted>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <Card className='group relative overflow-hidden transition-'>
          <div className='pointer-events-none absolute bottom-0 right-6 opacity-5 transition-transform duration-700'>
            <Users className='size-[100px] text-primary' strokeWidth={1.5} />
          </div>
          <div className='relative z-10 flex flex-col'>
            <P className='text-ink-secondary dark:text-gray-400'>
              Total User Accounts
            </P>
            <div className='mt-1 flex items-center gap-2'>
              <p className='text-4xl font-bold text-primary'>1,240</p>
              <span className='flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400'>
                <TrendingUp className='size-3' /> +1.5%
              </span>
            </div>
          </div>
        </Card>

        <Card className='group relative overflow-hidden transition-'>
          <div className='pointer-events-none absolute bottom-0 right-6 opacity-5 transition-transform duration-700'>
            <IdCard className='size-[100px] text-primary' strokeWidth={1.5} />
          </div>
          <div className='relative z-10 flex flex-col '>
            <P className='text-ink-secondary dark:text-gray-400'>
              Active Employee Types
            </P>
            <div className='mt-1 flex items-center gap-2'>
              <p className='text-4xl font-bold text-primary'>5</p>
              <span className='flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-bold text-ink-secondary dark:bg-zinc-800'>
                <Minus className='size-3' /> 0%
              </span>
            </div>
          </div>
        </Card>

        <Card className='group relative overflow-hidden transition-'>
          <div className='pointer-events-none absolute bottom-0 right-6 opacity-5 transition-transform duration-700'>
            <Layers className='size-[100px] text-primary' strokeWidth={1.5} />
          </div>
          <div className='relative z-10 flex flex-col '>
            <P className='text-ink-secondary dark:text-gray-400'>
              Total Leave Types
            </P>
            <div className='mt-1 flex items-center gap-2'>
              <p className='text-4xl font-bold text-primary'>12</p>
              <span className='flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400'>
                <TrendingUp className='size-3' /> +8%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <H2 className='mb-5 text-primary'>Quick Actions</H2>
        <div className='flex flex-wrap gap-4'>
          <Button>
            <Plus className='mr-2 size-5' />
            New Account
          </Button>
          <Button variant='outline'>Create Employment Type</Button>
          <Button variant='outline'>Create Leave Type</Button>
          <Button variant='outline'>Define Leave Rule</Button>
          <Link href='/playground/toast'>
            <Button variant='outline'>Toast Playground</Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-8'>
        {/* Recent Activity Section */}
        <div className='col-span-12 md:col-span-6 lg:col-span-8'>
          <div className='mb-5 flex items-center justify-between'>
            <H2 className='text-primary'>Recent Operations</H2>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={isFullView}
                  onCheckedChange={setIsFullView}
                  id='view-mode'
                />
                <label
                  htmlFor='view-mode'
                  className='text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer'
                >
                  {isFullView ? 'Full View' : 'Compact View'}
                </label>
              </div>
              <a
                href='#'
                className='text-sm font-medium text-primary transition-colors hover:text-primary-dark'
              >
                View All
              </a>
            </div>
          </div>

          <Card className='overflow-hidden'>
            <div className=''>
              {[
                {
                  icon: FilePenLine,
                  text: "Rule updated for 'Annual Leave' - Changed accrual rate from 0.0769 to 0.0833 per hour worked based on new policy",
                  user: 'Jane Doe',
                  time: '2 hours ago',
                },
                {
                  icon: UserPlus,
                  text: "New employee 'John Smith' added to Engineering department with Full Time status",
                  user: 'Jane Doe',
                  time: '5 hours ago',
                },
                {
                  icon: PlusCircle,
                  text: "New leave type 'Sick Leave' created with standard entitlement rules",
                  user: 'Admin',
                  time: '1 day ago',
                },
                {
                  icon: IdCard,
                  text: "Employment type 'Part-time' updated - Modified maximum weekly hours limit",
                  user: 'Admin',
                  time: '2 days ago',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className='flex cursor-pointer items-start gap-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                >
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary dark:bg-primary/20'>
                    <item.icon className='size-5' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-primary'>
                      <TextTruncate
                        text={item.text}
                        maxLength={40}
                        isExpanded={isFullView}
                      />
                    </p>
                    <p className='mt-0.5 text-xs text-ink-secondary'>
                      Updated by{' '}
                      <span className='font-medium text-ink-primary'>
                        {item.user}
                      </span>{' '}
                      • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side Widgets */}
        <div className='col-span-12 flex flex-col gap-8 md:col-span-6 lg:col-span-4'>
          {/* Expiring Rules */}
          <div>
            <H2 className='mb-5 text-primary'>Expiring Rules</H2>
            <Card className='flex flex-col gap-4 p-card'>
              {[
                { name: 'Probation Policy', days: 5 },
                { name: 'Health Insurance', days: 12 },
              ].map((item, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800'
                >
                  <div className='flex items-center gap-3'>
                    <span className='size-2 rounded-full bg-primary'></span>
                    <p className='text-sm font-medium text-ink-primary'>
                      {item.name}
                    </p>
                  </div>
                  <span className='rounded-full border border/20 bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-blue-200'>
                    {item.days} days
                  </span>
                </div>
              ))}
            </Card>
          </div>

          {/* Cashout Limit */}
          <div>
            <H2 className='mb-5 text-primary'>Cashout Limit</H2>
            <div className='group relative overflow-hidden rounded-card bg-primary-gradient p-card text-white'>
              <div className='absolute right-0 top-0 p-8 opacity-5 transition-transform duration-700'>
                <DollarSign className='size-[100px]' strokeWidth={1.5} />
              </div>
              <div className='relative z-10'>
                <p className='mb-1 text-sm font-medium text-blue-100'>
                  System-wide Total
                </p>
                <p className='text-3xl font-bold tracking-tight'>$125,480.00</p>
                <div className='mt-4 flex gap-2'>
                  <span className='rounded-lg border border-white/20 bg-panel/20 px-2 py-1 text-xs backdrop-blur-sm'>
                    FY 2024-25
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
