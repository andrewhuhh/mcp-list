import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Directory } from './pages/Directory';
import { MCPDetail } from './pages/MCPDetail';
import { AuthCallback } from './pages/AuthCallback';
import { Documentation } from './pages/Documentation';
import { Submit } from './pages/Submit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
} 