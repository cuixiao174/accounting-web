import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
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
        path: 'register',
        element: <Register />,
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
