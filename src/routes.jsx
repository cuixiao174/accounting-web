import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Records from './pages/Records';
import Statistics from './pages/Statistics';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'records',
        element: <Records />,
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
    ],
  },
]);

export default router;
