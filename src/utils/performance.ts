// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRenderTime: (componentName: string, startTime: number) => {
    const endTime = performance.now()
    const renderTime = endTime - startTime
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)

    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
    }
  },

  // Measure API call performance
  measureApiCall: (endpoint: string, startTime: number) => {
    const endTime = performance.now()
    const callTime = endTime - startTime
    console.log(`API call to ${endpoint}: ${callTime.toFixed(2)}ms`)

    // Log slow API calls (>1000ms)
    if (callTime > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${callTime.toFixed(2)}ms`)
    }
  },

  // Monitor memory usage
  logMemoryUsage: () => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      console.log('Memory usage:', {
        used: `${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      })
    }
  },

  // Monitor Core Web Vitals
  observeWebVitals: () => {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            console.log(`FID: ${entry.processingStart - entry.startTime}ms`)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          console.log(`CLS: ${clsValue}`)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('Performance monitoring not fully supported')
      }
    }
  },

  // Track user interactions
  trackInteraction: (interactionName: string, duration?: number) => {
    console.log(`User interaction: ${interactionName}${duration ? ` (${duration}ms)` : ''}`)
  },
}