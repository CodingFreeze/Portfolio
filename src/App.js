import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';

// Lazily load components for better performance
const Portfolio = lazy(() => import('./Portfolio'));
const Notes = lazy(() => import('./Notes'));
const Thoughts = lazy(() => import('./Thoughts'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-[var(--bg)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
  </div>
);

function App() {
  const location = useLocation();
  
  // Determine which component to render based on path
  const getCurrentComponent = () => {
    const path = location.pathname;
    
    if (path === "/notes") return <Notes />;
    if (path === "/thoughts") return <Thoughts />;
    return <Portfolio />;
  };
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        {getCurrentComponent()}
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
