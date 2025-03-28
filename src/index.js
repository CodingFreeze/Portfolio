import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';

// Optimize performance by measuring and reporting web vitals
import reportWebVitals from './reportWebVitals';

// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_SHOW_PERFORMANCE__ = true;
}

// Create router with future flags for React Router v7
const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <App />,
    },
  ],
  {
    basename: process.env.PUBLIC_URL,
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Create root with concurrency features enabled
const root = ReactDOM.createRoot(document.getElementById('root'));

// Disable StrictMode in production for better performance
root.render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  ) : (
    <RouterProvider router={router} />
  )
);

// Report web vitals
reportWebVitals(console.log);
