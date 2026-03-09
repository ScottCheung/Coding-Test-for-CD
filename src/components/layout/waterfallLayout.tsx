/** @format */

// {uninstall plan}
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

export interface WaterfallLayoutProps {
  children: ReactNode[];
  gap?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  className?: string;
  itemClassName?: string;
  minColumnWidth?:
    | number
    | { sm?: number; md?: number; lg?: number; xl?: number };
  padding?: boolean;
  itemScale?: number;
  disableAnimation?: boolean;
}

export const WaterfallLayout: React.FC<WaterfallLayoutProps> = ({
  children,
  gap = { sm: 12, md: 16, lg: 20, xl: 24 },
  className = '',
  itemClassName = '',
  minColumnWidth = { sm: 250, md: 250, lg: 280, xl: 300 },
  padding = false,
  itemScale = 1,
  disableAnimation = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [containerHeight, setContainerHeight] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<boolean[]>([]);

  // 【新增】：使用 Set 记录已经触发过动画的索引，使用 useRef 避免引发多余渲染
  const animatedIndices = useRef<Set<number>>(new Set());

  const resizeTimer = useRef<NodeJS.Timeout | null>(null);

  const getColumnConfig = useCallback(
    (width: number) => {
      const numericGap =
        typeof gap === 'number' ? gap
        : width >= 1280 ? (gap as any).xl || 24
        : width >= 1024 ? (gap as any).lg || 20
        : width >= 768 ? (gap as any).md || 16
        : (gap as any).sm || 12;

      const numericMinWidth =
        typeof minColumnWidth === 'number' ? minColumnWidth
        : width >= 1280 ? (minColumnWidth as any).xl || 300
        : width >= 1024 ? (minColumnWidth as any).lg || 280
        : width >= 768 ? (minColumnWidth as any).md || 250
        : (minColumnWidth as any).sm || 200;

      const availableWidth = padding ? width - 2 * numericGap : width;
      const columnCount = Math.max(
        1,
        Math.floor(
          (availableWidth + numericGap) / (numericMinWidth + numericGap),
        ),
      );
      const columnWidth =
        (availableWidth - (columnCount - 1) * numericGap) / columnCount;

      return { columnCount, numericGap, columnWidth };
    },
    [gap, minColumnWidth, padding],
  );

  const positionItems = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const { columnCount, numericGap, columnWidth } =
      getColumnConfig(containerWidth);

    const columnHeights = new Array(columnCount).fill(0);

    itemRefs.current.forEach((item) => {
      if (!item) return;

      item.style.width = `${columnWidth / itemScale}px`;

      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);

      const x =
        (padding ? numericGap : 0) + columnIndex * (columnWidth + numericGap);
      const y =
        minHeight +
        (minHeight > 0 ? numericGap
        : padding ? numericGap
        : 0);

      item.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${itemScale})`;
      item.style.transformOrigin = '0 0';
      item.style.position = 'absolute';
      item.style.top = '0';
      item.style.left = '0';

      if (!disableAnimation) {
        item.style.transition =
          'transform 1.2s cubic-bezier(0.22, 1.1, 0.36, 1), width 1.2s cubic-bezier(0.22, 1.1, 0.36, 1)';
      } else {
        item.style.transition = 'none';
      }

      const currentItemHeight = item.offsetHeight * itemScale;

      if (item.offsetHeight > 0) {
        item.style.height = `${item.offsetHeight}px`;
      }

      columnHeights[columnIndex] = y + currentItemHeight;
    });

    const maxContentHeight =
      Math.max(...columnHeights) + (padding ? numericGap : 0);
    setContainerHeight(maxContentHeight);
  }, [getColumnConfig, padding, itemScale, disableAnimation]);

  useEffect(() => {
    const initFrame = requestAnimationFrame(() => {
      positionItems();
    });

    const handleResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        positionItems();
      }, 100);
    };

    const ro = new ResizeObserver(handleResize);

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    itemRefs.current.forEach((item) => {
      if (item) ro.observe(item);
    });

    const images = containerRef.current?.getElementsByTagName('img');
    if (images) {
      Array.from(images).forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', handleResize);
        }
      });
    }

    return () => {
      cancelAnimationFrame(initFrame);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      ro.disconnect();
      if (images) {
        Array.from(images).forEach((img) =>
          img.removeEventListener('load', handleResize),
        );
      }
    };
  }, [children, positionItems]);

  useEffect(() => {
    setVisibleIndices((prev) => {
      const next = [...prev];
      for (let i = 0; i < React.Children.count(children); i++) {
        if (next[i] === undefined) next[i] = true;
      }
      return next;
    });

    const io = new IntersectionObserver(
      (entries) => {
        setVisibleIndices((prev) => {
          const next = [...prev];
          let changed = false;
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'));
            const isVisible = entry.isIntersecting;

            // 【新增】：一旦元素进入视口，就将其标记为“已动画过”
            if (isVisible) {
              animatedIndices.current.add(index);
            }

            if (next[index] !== isVisible) {
              next[index] = isVisible;
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      },
      { rootMargin: '150% 0%' },
    );

    itemRefs.current.forEach((item, index) => {
      if (item) {
        item.setAttribute('data-index', String(index));
        io.observe(item);
      }
    });

    return () => io.disconnect();
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full relative', className)}
      style={{
        height: containerHeight,
        transition:
          disableAnimation ? 'none' : (
            'height 1.2s cubic-bezier(0.22, 1.05, 0.36, 1)'
          ),
      }}
    >
      {React.Children.map(children, (child, index) => {
        const isVisible = visibleIndices[index] ?? true;
        // 【新增】：检查该索引是否已经播放过动画
        const hasAnimated = animatedIndices.current.has(index);

        if (disableAnimation) {
          return (
            <div
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn('absolute left-0 top-0', itemClassName)}
            >
              {isVisible && child}
            </div>
          );
        }

        return (
          <div
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={cn('absolute left-0 top-0', itemClassName)}
          >
            {isVisible && (
              <>
                <motion.div
                  // 【核心】：如果已经动画过，设为 false 直接跳过初始状态，处于 animate 最终状态
                  initial={hasAnimated ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1.2,
                    // 首次加载保留你原本优雅的交错延迟，后续重新渲染直接无延迟出现
                    delay: hasAnimated ? 0 : 0.44 + 0.04 * (index % 30),
                    ease: [0.22, 1.1, 0.36, 1],
                  }}
                  className='z-10'
                >
                  {child}
                </motion.div>
                <motion.div
                  initial={hasAnimated ? false : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 3,
                    delay: hasAnimated ? 0 : 0.44 + 0.04 * (index % 30),
                    ease: [0.22, 1.1, 0.36, 1],
                  }}
                  className='absolute top-0 left-0 w-full h-full rounded-card bg-panel -z-10'
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
// invisible plan
/** @format */

// import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion';
// import React, {
//   ReactNode,
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
// } from 'react';

// export interface WaterfallLayoutProps {
//   children: ReactNode[];
//   gap?: number | { sm?: number; md?: number; lg?: number; xl?: number };
//   className?: string;
//   itemClassName?: string;
//   minColumnWidth?:
//     | number
//     | { sm?: number; md?: number; lg?: number; xl?: number };
//   padding?: boolean;
//   itemScale?: number;
//   disableAnimation?: boolean;
// }

// export const WaterfallLayout: React.FC<WaterfallLayoutProps> = ({
//   children,
//   gap = { sm: 12, md: 16, lg: 20, xl: 24 },
//   className = '',
//   itemClassName = '',
//   minColumnWidth = { sm: 250, md: 250, lg: 280, xl: 300 },
//   padding = false,
//   itemScale = 1,
//   disableAnimation = false,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const [containerHeight, setContainerHeight] = useState(0);
//   const [visibleIndices, setVisibleIndices] = useState<boolean[]>([]);

//   // 记录已经触发过入场动画的索引
//   const animatedIndices = useRef<Set<number>>(new Set());
//   const resizeTimer = useRef<NodeJS.Timeout | null>(null);

//   const getColumnConfig = useCallback(
//     (width: number) => {
//       const numericGap =
//         typeof gap === 'number' ? gap
//         : width >= 1280 ? (gap as any).xl || 24
//         : width >= 1024 ? (gap as any).lg || 20
//         : width >= 768 ? (gap as any).md || 16
//         : (gap as any).sm || 12;

//       const numericMinWidth =
//         typeof minColumnWidth === 'number' ? minColumnWidth
//         : width >= 1280 ? (minColumnWidth as any).xl || 300
//         : width >= 1024 ? (minColumnWidth as any).lg || 280
//         : width >= 768 ? (minColumnWidth as any).md || 250
//         : (minColumnWidth as any).sm || 200;

//       const availableWidth = padding ? width - 2 * numericGap : width;
//       const columnCount = Math.max(
//         1,
//         Math.floor(
//           (availableWidth + numericGap) / (numericMinWidth + numericGap),
//         ),
//       );
//       const columnWidth =
//         (availableWidth - (columnCount - 1) * numericGap) / columnCount;

//       return { columnCount, numericGap, columnWidth };
//     },
//     [gap, minColumnWidth, padding],
//   );

//   const positionItems = useCallback(() => {
//     if (!containerRef.current) return;

//     const containerWidth = containerRef.current.offsetWidth;
//     const { columnCount, numericGap, columnWidth } =
//       getColumnConfig(containerWidth);

//     const columnHeights = new Array(columnCount).fill(0);

//     itemRefs.current.forEach((item) => {
//       if (!item) return;

//       item.style.width = `${columnWidth / itemScale}px`;

//       const minHeight = Math.min(...columnHeights);
//       const columnIndex = columnHeights.indexOf(minHeight);

//       const x =
//         (padding ? numericGap : 0) + columnIndex * (columnWidth + numericGap);
//       const y =
//         minHeight +
//         (minHeight > 0 ? numericGap
//         : padding ? numericGap
//         : 0);

//       item.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${itemScale})`;
//       item.style.transformOrigin = '0 0';
//       item.style.position = 'absolute';
//       item.style.top = '0';
//       item.style.left = '0';

//       if (!disableAnimation) {
//         item.style.transition =
//           'transform 1.2s cubic-bezier(0.22, 1.1, 0.36, 1), width 1.2s cubic-bezier(0.22, 1.1, 0.36, 1)';
//       } else {
//         item.style.transition = 'none';
//       }

//       const currentItemHeight = item.offsetHeight * itemScale;

//       // 锁定测量后的高度
//       if (item.offsetHeight > 0) {
//         item.style.height = `${item.offsetHeight}px`;
//       }

//       columnHeights[columnIndex] = y + currentItemHeight;
//     });

//     const maxContentHeight =
//       Math.max(...columnHeights) + (padding ? numericGap : 0);
//     setContainerHeight(maxContentHeight);
//   }, [getColumnConfig, padding, itemScale, disableAnimation]);

//   useEffect(() => {
//     const initFrame = requestAnimationFrame(() => {
//       positionItems();
//     });

//     const handleResize = () => {
//       if (resizeTimer.current) clearTimeout(resizeTimer.current);
//       resizeTimer.current = setTimeout(() => {
//         positionItems();
//       }, 100);
//     };

//     const ro = new ResizeObserver(handleResize);

//     if (containerRef.current) {
//       ro.observe(containerRef.current);
//     }

//     itemRefs.current.forEach((item) => {
//       if (item) ro.observe(item);
//     });

//     const images = containerRef.current?.getElementsByTagName('img');
//     if (images) {
//       Array.from(images).forEach((img) => {
//         if (!img.complete) {
//           img.addEventListener('load', handleResize);
//         }
//       });
//     }

//     return () => {
//       cancelAnimationFrame(initFrame);
//       if (resizeTimer.current) clearTimeout(resizeTimer.current);
//       ro.disconnect();
//       if (images) {
//         Array.from(images).forEach((img) =>
//           img.removeEventListener('load', handleResize),
//         );
//       }
//     };
//   }, [children, positionItems]);

//   // 虚拟化视窗监听 (CSS 级剔除)
//   useEffect(() => {
//     setVisibleIndices((prev) => {
//       const next = [...prev];
//       for (let i = 0; i < React.Children.count(children); i++) {
//         if (next[i] === undefined) next[i] = true;
//       }
//       return next;
//     });

//     const io = new IntersectionObserver(
//       (entries) => {
//         setVisibleIndices((prev) => {
//           const next = [...prev];
//           let changed = false;
//           entries.forEach((entry) => {
//             const index = Number(entry.target.getAttribute('data-index'));
//             const isVisible = entry.isIntersecting;

//             // 只要进入过视窗及其缓冲区，就永久标记为已触发动画
//             if (isVisible) {
//               animatedIndices.current.add(index);
//             }

//             if (next[index] !== isVisible) {
//               next[index] = isVisible;
//               changed = true;
//             }
//           });
//           return changed ? next : prev;
//         });
//       },
//       // 使用 100% 相对值，向上向下各预加载一屏的高度，保证滑动的绝对丝滑
//       { rootMargin: '200% 0px' },
//     );

//     itemRefs.current.forEach((item, index) => {
//       if (item) {
//         item.setAttribute('data-index', String(index));
//         io.observe(item);
//       }
//     });

//     return () => io.disconnect();
//   }, [children]);

//   return (
//     <div
//       ref={containerRef}
//       className={cn('w-full relative', className)}
//       style={{
//         height: containerHeight,
//         transition:
//           disableAnimation ? 'none' : (
//             'height 1.2s cubic-bezier(0.22, 1.05, 0.36, 1)'
//           ),
//       }}
//     >
//       {React.Children.map(children, (child, index) => {
//         const isVisible = visibleIndices[index] ?? true;
//         const hasAnimated = animatedIndices.current.has(index);

//         // 核心改动：不再卸载节点，而是利用 CSS 控制渲染层
//         const containerStyle: React.CSSProperties = {
//           visibility: isVisible ? 'visible' : 'hidden',
//           // 现代浏览器专属优化：直接跳过不可见元素的布局和绘制计算
//           contentVisibility: isVisible ? 'visible' : 'hidden',
//         };

//         if (disableAnimation) {
//           return (
//             <div
//               ref={(el) => {
//                 itemRefs.current[index] = el;
//               }}
//               className={cn('absolute left-0 top-0', itemClassName)}
//               style={containerStyle}
//             >
//               {child}
//             </div>
//           );
//         }

//         return (
//           <div
//             ref={(el) => {
//               itemRefs.current[index] = el;
//             }}
//             className={cn('absolute left-0 top-0', itemClassName)}
//             style={containerStyle}
//           >
//             <motion.div
//               initial={hasAnimated ? false : { opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{
//                 duration: 1.2,
//                 delay: hasAnimated ? 0 : 0.44 + 0.04 * (index % 30),
//                 ease: [0.22, 1.1, 0.36, 1],
//               }}
//               className='z-10'
//             >
//               {child}
//             </motion.div>
//             <motion.div
//               initial={hasAnimated ? false : { opacity: 1, scale: 1 }}
//               animate={{ opacity: 0, scale: 0.95 }}
//               transition={{
//                 duration: 3,
//                 delay: hasAnimated ? 0 : 0.44 + 0.04 * (index % 30),
//                 ease: [0.22, 1.1, 0.36, 1],
//               }}
//               className='absolute top-0 left-0 w-full h-full rounded-card bg-panel -z-10'
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// };
