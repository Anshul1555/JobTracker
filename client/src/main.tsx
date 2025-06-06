import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Homepage';
import AddJob from './pages/Addjob';
import Signup from './pages/Signup';
import EditProfile from './components/EditProfile';

import App from './App.jsx';


// Wrapper component to pass profileId dynamically
const AddJobWrapper = () => {
  const profileId = localStorage.getItem('profileId');
  if (!profileId) {
    return <Navigate to="/login" replace />;
  }
  return <AddJob profileId={profileId} />;
};
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('id_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
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
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: 'add-job',
        element:
          (
            <ProtectedRoute>
              <AddJobWrapper />
            </ProtectedRoute>
          )
      },
      {
        path: 'edit-profile',
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        )
      }
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
