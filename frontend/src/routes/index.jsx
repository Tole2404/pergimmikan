import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AuthLayout from '../components/layout/AuthLayout';
import Landing from '../pages/Landing';
import Journey from '../pages/Journey';
import JourneyDetail from '../pages/JourneyDetail';
import MapPage from '../pages/MapPage';
import Team from '../pages/Team';
import NextPage from '../pages/Next';
import Activities from '../pages/Activities';
import Events from '../components/sections/Events';
import Login from '../pages/Login';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Savings from '../pages/Savings';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminLayout from '../pages/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/crud/UserManagement';
import TeamManagement from '../pages/admin/UserManagement';
import ContentManagement from '../pages/admin/ContentManagement';
import JourneyManagement from '../pages/admin/JourneyManagement';
import AddTeam from '../pages/admin/crud/AddTeam';
import EditTeam from '../pages/admin/crud/EditTeam';
import AddJourney from '../pages/admin/crud/AddJourney';
import EditJourney from '../pages/admin/crud/EditJourney';
import GalleryManagement from '../pages/admin/crud/GalleryManagement';
import EventManagement from '../pages/admin/crud/EventManagement';
import LegacyManagement from '../pages/admin/LegacyManagement';
import QuotesManagement from '../pages/admin/crud/QuotesManagement';
import ActivitiesManagement from '../pages/admin/crud/ActivitiesManagement';
import ActivityForm from '../pages/admin/crud/ActivityForm';
import CategoryForm from '../pages/admin/crud/CategoryForm';
import SavingsManagement from '../pages/admin/crud/SavingsManagement';
import NextAdmin from '../pages/admin/NextAdmin';
import FeaturedJourneyManagement from '../pages/admin/FeaturedJourneyManagement';
import SEOManagement from '../pages/admin/SEOManagement';
import AdminAuthMiddleware from '../middleware/AdminAuthMiddleware';
import AuthMiddleware from '../middleware/AuthMiddleware';
import SimpleLogin from '../pages/SimpleLogin';
import SimpleSavings from '../pages/SimpleSavings';
import MountainsManagement from '../pages/admin/crud/MountainsManagement';
import TracksManagement from '../pages/admin/crud/TracksManagement';
import TransportationManagement from '../pages/admin/crud/TransportationManagement';
import EquipmentManagement from '../pages/admin/crud/EquipmentManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        index: true,
        element: <Landing />,
      },
      {
        path: 'journey',
        element: <Journey />,
      },
      {
        path: 'journey/:id',
        element: <JourneyDetail />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'activities',
        element: <Activities />,
      },
      {
        path: 'team',
        element: <Team />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'next',
        element: <NextPage />,
      },
      {
        path: 'settings',
        element: (
          <AuthMiddleware>
            <Settings />
          </AuthMiddleware>
        ),
      },
      {
        path: 'profile',
        element: (
          <AuthMiddleware>
            <Profile />
          </AuthMiddleware>
        ),
      },
      {
        path: 'savings',
        element: (
          <AuthMiddleware>
            <Savings />
          </AuthMiddleware>
        ),
      }
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '/login-tabungan',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SimpleLogin redirectTo="/tabungan" />,
      },
    ],
  },
  {
    path: '/tabungan',
    element: (
      <AuthMiddleware>
        <SimpleSavings />
      </AuthMiddleware>
    ),
  },
  {
    path: '/adminpages',
    element: <AdminLogin />,
  },
  {
    path: '/dashboard',
    element: (
      <AdminAuthMiddleware>
        <AdminLayout />
      </AdminAuthMiddleware>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'team',
        element: <TeamManagement />,
      },
      {
        path: 'team/add',
        element: <AddTeam />,
      },
      {
        path: 'team/edit/:id',
        element: <EditTeam />,
      },
      {
        path: 'content',
        element: <ContentManagement />,
      },
      {
        path: 'gallery',
        element: <GalleryManagement />,
      },
      {
        path: 'journey',
        element: <JourneyManagement />,
      },
      {
        path: 'featured-journey',
        element: <FeaturedJourneyManagement />,
      },
      {
        path: 'journey/add',
        element: <AddJourney />,
      },
      {
        path: 'journey/edit/:id',
        element: <EditJourney />,
      },
      {
        path: 'events',
        element: <EventManagement />,
      },
      {
        path: 'legacy',
        element: <LegacyManagement />,
      },
      {
        path: 'quotes',
        element: <QuotesManagement />,
      },
      {
        path: 'next',
        element: <NextAdmin />,
      },
      {
        path: 'activities',
        element: <ActivitiesManagement />,
      },
      {
        path: 'activities/add',
        element: <ActivityForm />,
      },
      {
        path: 'activities/edit/:id',
        element: <ActivityForm />,
      },
      {
        path: 'activities/categories/add',
        element: <CategoryForm />,
      },
      {
        path: 'activities/categories/edit/:id',
        element: <CategoryForm />,
      },
      {
        path: 'savings',
        element: <SavingsManagement />,
      },
      {
        path: 'seo',
        element: <SEOManagement />,
      },
      {
        path: 'trip-calculator/mountains',
        element: <MountainsManagement />,
      },
      {
        path: 'trip-calculator/tracks',
        element: <TracksManagement />,
      },
      {
        path: 'trip-calculator/transportation',
        element: <TransportationManagement />,
      },
      {
        path: 'trip-calculator/equipment',
        element: <EquipmentManagement />,
      },
    ],
  },
]);
