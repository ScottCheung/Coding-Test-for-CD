'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 text-red-500'>
          <div className='rounded-full bg-red-50 p-4 dark:bg-red-500/10'>
            <svg
              className='size-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <p className='text-center'>
            Something went wrong. <br />
            <span className='text-sm opacity-70'>
              {this.state.error?.message || 'Unknown error'}
            </span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95'
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
