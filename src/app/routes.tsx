import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Layout
import PulseLayout from '../components/pulse/PulseLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import PulseFeedPage from '../pages/Pulse/PulseFeedPage';
import MasteryPage from '../pages/Pulse/MasteryPage';
import ProfilePage from '../pages/Profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/pulse',
    element: <PulseLayout><Outlet /></PulseLayout>,
    children: [
      {
        index: true,
        element: <PulseFeedPage />,
      },
      {
        path: 'mastery',
        element: <MasteryPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
