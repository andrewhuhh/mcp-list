import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Directory } from './pages/Directory';
import { MCPDetail } from './pages/MCPDetail';
import { Documentation } from './pages/Documentation';
import { Submit } from './pages/Submit';
import { RootLayout } from './layouts/RootLayout';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Directory />} />
        <Route path="/mcps/:platform/:id" element={<MCPDetail />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/submit" element={<Submit />} />
      </Route>
    </Routes>
  );
}; 