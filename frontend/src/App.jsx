import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';

// Lazy load pages
import { lazy, Suspense } from 'react';

const Assets = lazy(() => import('./pages/assets/Assets'));
const Users = lazy(() => import('./pages/users/Users'));
const Locations = lazy(() => import('./pages/locations/Locations'));
const Categories = lazy(() => import('./pages/categories/Categories'));
const Suppliers = lazy(() => import('./pages/suppliers/Suppliers'));
const Assignments = lazy(() => import('./pages/assignments/Assignments'));
const Maintenance = lazy(() => import('./pages/maintenance/Maintenance'));
const Licenses = lazy(() => import('./pages/licenses/Licenses'));
const Consumables = lazy(() => import('./pages/consumables/Consumables'));
const Documents = lazy(() => import('./pages/documents/Documents'));
const Moves = lazy(() => import('./pages/moves/Moves'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/assets" element={<Assets />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/licenses" element={<Licenses />} />
                      <Route path="/consumables" element={<Consumables />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/moves" element={<Moves />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
