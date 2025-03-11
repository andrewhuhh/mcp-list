import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Directory } from './pages/Directory';
import { MCPDetail } from './pages/MCPDetail';
import { AuthCallback } from './pages/AuthCallback';
import { Documentation } from './pages/Documentation';
import { Submit } from './pages/Submit';
import ErrorPage from './components/error/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Directory />,
      },
      {
        path: 'mcps/:platform/:id',
        element: <MCPDetail />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'docs',
        element: <Documentation />,
      },
      {
        path: 'submit',
        element: <Submit />,
      },
      // Redirect /mcps to home
      {
        path: 'mcps',
        element: <Directory />,
      },
      // Catch all unmatched routes
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
} 