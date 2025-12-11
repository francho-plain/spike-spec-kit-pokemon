import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { performanceMonitor } from './utils/performance'
import Home from './pages/Home'
import PokemonDetail from './pages/PokemonDetail'
import Favorites from './pages/Favorites'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.observeWebVitals()

    // Log initial memory usage
    performanceMonitor.logMemoryUsage()

    // Log memory usage every 30 seconds
    const memoryInterval = setInterval(() => {
      performanceMonitor.logMemoryUsage()
    }, 30000)

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope)
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error)
          })
      })
    }

    return () => clearInterval(memoryInterval)
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App