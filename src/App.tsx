import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Pricing from './pages/Pricing/Pricing'
import Gallery from './pages/Gallery/Gallery'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import Booking from './pages/Booking/Booking'
import BookingSuccess from './pages/Booking/BookingSuccess'
import Dashboard from './pages/Dashboard/Dashboard'
import Terms from './pages/Legal/Terms'
import Privacy from './pages/Legal/Privacy'
import Refund from './pages/Legal/Refund'
import Cookie from './pages/Legal/Cookie'
import Auth from './pages/Auth/Auth'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'booking',
        element: <Booking />,
      },
      {
        path: 'booking/success',
        element: <BookingSuccess />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'refund',
        element: <Refund />,
      },
      {
        path: 'cookie',
        element: <Cookie />,
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'booking',
        element: <Booking />,
      }
    ]
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      }
    ]
  }
]);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        containerClassName="studio-toast-container"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            maxWidth: '380px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: {
              primary: '#ffcc00',
              secondary: '#111',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4b2b',
              secondary: '#111',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
