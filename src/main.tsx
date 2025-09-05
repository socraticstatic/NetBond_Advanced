import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/fonts.css';
import { initializePerformanceOptimizations } from './utils/performanceOptimizations';
import { initializePreloader } from './utils/preloadStrategies';

// Initialize performance optimizations
initializePerformanceOptimizations();

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Initialize intelligent preloading after initial render
    document.addEventListener('DOMContentLoaded', () => {
      if (import.meta.env.PROD) {
        setTimeout(() => {
          initializePreloader();
        }, 1000);
      }
    });
  } catch (error) {
    console.error('Failed to render app:', error);
    
    // Minimal fallback
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding:20px;margin:40px auto;max-width:600px;text-align:center;background:white;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
    errorDiv.innerHTML = `
      <h1 style="color:#e11d48;margin-bottom:16px;">Application Error</h1>
      <p style="margin-bottom:24px;color:#4b5563;">Please refresh the page.</p>
      <button onclick="window.location.reload()" style="background:#003184;color:white;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">Refresh</button>
    `;
    rootElement.appendChild(errorDiv);
  }
}

// Minimal polyfills
if (!window.requestIdleCallback) {
  window.requestIdleCallback = (callback) => setTimeout(callback, 1);
  window.cancelIdleCallback = clearTimeout;
}

// Optimized toast fallback
if (!window.addToast) {
  window.addToast = () => {};
}