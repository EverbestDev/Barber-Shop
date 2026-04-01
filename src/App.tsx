import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Pricing from './pages/Pricing/Pricing'
import Gallery from './pages/Gallery/Gallery'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import Booking from './pages/Booking/Booking'
import Dashboard from './pages/Dashboard/Dashboard'
import { AuthProvider } from './context/AuthContext'

// Define the router structure
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
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'booking',
        element: <Booking />,
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
