// Performance comparison utility for Waterfall layouts
// Usage: Add this to your component to measure performance

export const measureLayoutPerformance = (layoutName: string) => {
  const startTime = performance.now();
  let frameCount = 0;
  let lastFrameTime = startTime;
  const frameTimes: number[] = [];

  const measureFrame = () => {
    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTime;
    frameTimes.push(frameTime);
    lastFrameTime = currentTime;
    frameCount++;

    if (currentTime - startTime < 5000) {
      requestAnimationFrame(measureFrame);
    } else {
      // Calculate metrics
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const fps = 1000 / avgFrameTime;
      const maxFrameTime = Math.max(...frameTimes);
      const minFrameTime = Math.min(...frameTimes);

      console.log(`📊 Performance Report: ${layoutName}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`⏱️  Total Time: ${(currentTime - startTime).toFixed(2)}ms`);
      console.log(`🎬 Total Frames: ${frameCount}`);
      console.log(`📈 Average FPS: ${fps.toFixed(2)}`);
      console.log(`⚡ Avg Frame Time: ${avgFrameTime.toFixed(2)}ms`);
      console.log(`🔺 Max Frame Time: ${maxFrameTime.toFixed(2)}ms`);
      console.log(`🔻 Min Frame Time: ${minFrameTime.toFixed(2)}ms`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }
  };

  requestAnimationFrame(measureFrame);

  return () => {
    console.log(`🛑 Performance measurement stopped for ${layoutName}`);
  };
};

// Memory usage tracker
export const trackMemoryUsage = (componentName: string) => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`💾 Memory Usage: ${componentName}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

// DOM node counter
export const countDOMNodes = (containerRef: React.RefObject<HTMLElement>) => {
  if (!containerRef.current) return 0;
  
  const count = containerRef.current.querySelectorAll('*').length;
  console.log(`🌳 DOM Nodes: ${count}`);
  return count;
};

// Example usage in component:
/*
useEffect(() => {
  const cleanup = measureLayoutPerformance('VirtualWaterfallLayout');
  trackMemoryUsage('VirtualWaterfallLayout');
  
  return cleanup;
}, []);

useEffect(() => {
  const nodeCount = countDOMNodes(containerRef);
  console.log(`Rendering ${nodeCount} DOM nodes`);
}, [items]);
*/
