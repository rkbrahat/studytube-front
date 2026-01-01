import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/templates/Navbar';
import LoadingCallback from './components/atoms/LoadingCallback';
import { ROUTES } from './routes';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CreateCoursePage = lazy(() => import('./pages/CreateCoursePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CoursePlayerPage = lazy(() => import('./pages/CoursePlayerPage'));

// Simple PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingCallback />;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="bg-background min-h-screen text-text-main font-sans selection:bg-primary/30 transition-colors duration-300">
          <BrowserRouter>
            <Navbar /> {/* Global Navbar */}
            <Suspense fallback={<LoadingCallback />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.SIGNUP} element={<LoginPage />} />

                <Route path={ROUTES.DASHBOARD} element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.COURSES} element={
                  <PrivateRoute>
                    <CoursesPage />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.CREATE_COURSE} element={
                  <PrivateRoute>
                    <CreateCoursePage />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.COURSE} element={
                  <PrivateRoute>
                    <CoursePlayerPage />
                  </PrivateRoute>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
