import { Routes, Route, useLocation } from 'react-router-dom';
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
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Portfolio />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/thoughts" element={<Thoughts />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
