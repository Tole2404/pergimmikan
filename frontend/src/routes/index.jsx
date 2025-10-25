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

// Simulated delay for loading state
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withDelay = (Component) => async () => {
  await delay(1500); // Longer loading for better UX
  return { Component }; 
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        index: true,
        element: <Landing />,
        loader: withDelay(Landing),
      },
      {
        path: 'journey',
        element: <Journey />,
        loader: withDelay(Journey),
      },
      {
        path: 'journey/:id',
        element: <JourneyDetail />,
        loader: withDelay(JourneyDetail),
      },
      {
        path: 'map',
        element: <MapPage />,
        loader: withDelay(MapPage),
      },
      {
        path: 'activities',
        element: <Activities />,
        loader: withDelay(Activities),
      },
      {
        path: 'team',
        element: <Team />,
        loader: withDelay(Team),
      },
      {
        path: 'events',
        element: <Events />,
        loader: withDelay(Events),
      },
      {
        path: 'next',
        element: <NextPage />,
        loader: withDelay(NextPage),
      },
      {
        path: 'settings',
        element: (
          <AuthMiddleware>
            <Settings />
          </AuthMiddleware>
        ),
        loader: withDelay(Settings),
      },
      {
        path: 'profile',
        element: (
          <AuthMiddleware>
            <Profile />
          </AuthMiddleware>
        ),
        loader: withDelay(Profile),
      },
      {
        path: 'savings',
        element: (
          <AuthMiddleware>
            <Savings />
          </AuthMiddleware>
        ),
        loader: withDelay(Savings),
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
        loader: withDelay(Login),
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
        loader: withDelay(SimpleLogin),
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
    loader: withDelay(SimpleSavings),
  },
  {
    path: '/adminpages',
    element: <AdminLogin />,
    loader: withDelay(AdminLogin),
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
        loader: withDelay(Dashboard),
      },
      {
        path: 'users',
        element: <UserManagement />,
        loader: withDelay(UserManagement),
      },
      {
        path: 'team',
        element: <TeamManagement />,
        loader: withDelay(TeamManagement),
      },
      {
        path: 'team/add',
        element: <AddTeam />,
        loader: withDelay(AddTeam),
      },
      {
        path: 'team/edit/:id',
        element: <EditTeam />,
        loader: withDelay(EditTeam),
      },
      {
        path: 'content',
        element: <ContentManagement />,
        loader: withDelay(ContentManagement),
      },
      {
        path: 'gallery',
        element: <GalleryManagement />,
        loader: withDelay(GalleryManagement),
      },
      {
        path: 'journey',
        element: <JourneyManagement />,
        loader: withDelay(JourneyManagement),
      },
      {
        path: 'featured-journey',
        element: <FeaturedJourneyManagement />,
        loader: withDelay(FeaturedJourneyManagement),
      },
      {
        path: 'journey/add',
        element: <AddJourney />,
        loader: withDelay(AddJourney),
      },
      {
        path: 'journey/edit/:id',
        element: <EditJourney />,
        loader: withDelay(EditJourney),
      },
      {
        path: 'events',
        element: <EventManagement />,
        loader: withDelay(EventManagement),
      },
      {
        path: 'legacy',
        element: <LegacyManagement />,
        loader: withDelay(LegacyManagement),
      },
      {
        path: 'quotes',
        element: <QuotesManagement />,
        loader: withDelay(QuotesManagement),
      },
      {
        path: 'next',
        element: <NextAdmin />,
        loader: withDelay(NextAdmin),
      },
      {
        path: 'activities',
        element: <ActivitiesManagement />,
        loader: withDelay(ActivitiesManagement),
      },
      {
        path: 'activities/add',
        element: <ActivityForm />,
        loader: withDelay(ActivityForm),
      },
      {
        path: 'activities/edit/:id',
        element: <ActivityForm />,
        loader: withDelay(ActivityForm),
      },
      {
        path: 'activities/categories/add',
        element: <CategoryForm />,
        loader: withDelay(CategoryForm),
      },
      {
        path: 'activities/categories/edit/:id',
        element: <CategoryForm />,
        loader: withDelay(CategoryForm),
      },
      {
        path: 'savings',
        element: <SavingsManagement />,
        loader: withDelay(SavingsManagement),
      },
      {
        path: 'seo',
        element: <SEOManagement />,
        loader: withDelay(SEOManagement),
      },
      {
        path: 'trip-calculator/mountains',
        element: <MountainsManagement />,
        loader: withDelay(MountainsManagement),
      },
      {
        path: 'trip-calculator/tracks',
        element: <TracksManagement />,
        loader: withDelay(TracksManagement),
      },
      {
        path: 'trip-calculator/transportation',
        element: <TransportationManagement />,
        loader: withDelay(TransportationManagement),
      },
      {
        path: 'trip-calculator/equipment',
        element: <EquipmentManagement />,
        loader: withDelay(EquipmentManagement),
      },
    ],
  },
]);
