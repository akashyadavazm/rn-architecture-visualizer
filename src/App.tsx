import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TopicDetail } from './pages/TopicDetail';
import { DeveloperDocs } from './pages/DeveloperDocs';
import { SqlSchemaViewer } from './pages/SqlSchemaViewer';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DeveloperDocs />} />
          <Route path="/topic/:slug" element={<TopicDetail />} />
          {/* Backwards compatibility for any legacy /post/ paths */}
          <Route path="/post/:slug" element={<TopicDetail />} />
          <Route path="/sql-schema" element={<SqlSchemaViewer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
