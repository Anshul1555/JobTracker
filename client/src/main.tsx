import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Homepage';
import AddJob from './pages/Addjob';

import App from './App.jsx';

// Wrapper component to pass profileId dynamically
const AddJobWrapper = () => {
  const profileId = localStorage.getItem('profileId');
  if (!profileId) {
    return <Navigate to="/login" replace />;
  }
  return <AddJob profileId={profileId} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'add-job',
        element: <AddJobWrapper />
      }
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
