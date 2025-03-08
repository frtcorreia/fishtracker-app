import { useEffect, PropsWithChildren, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componentes
import { Layout } from "./components/Layout";

// Páginas de Autenticação
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ResetPassword } from "./pages/auth/ResetPassword";

// Páginas da Aplicação
import { Dashboard } from "./pages/Dashboard";
import { CatchesList } from "./pages/catches/CatchesList";
import { CatchForm } from "./pages/catches/CatchForm";
import { CatchView } from "./pages/catches/CatchView";
import { Profile } from "./pages/Profile";
import { Roadmap } from "./pages/Roadmap";

// Serviços e Stores
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/authStore";
import { useProfileStore } from "./store/profileStore";

// Tipos
interface ProtectedRouteBaseProps {
  isAuthenticated: boolean;
  isApproved: boolean;
}

interface AuthRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

interface RoadmapRouteProps {
  isAuthenticated: boolean;
  isApproved: boolean;
  children: React.ReactNode;
}

// Componente para rotas de autenticação
const AuthRoute = ({ isAuthenticated, children }: AuthRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

// Componente para a rota do Roadmap
const RoadmapRoute = ({
  isAuthenticated,
  isApproved,
  children,
}: RoadmapRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  if (isApproved) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({
  isAuthenticated,
  isApproved,
  children,
}: PropsWithChildren<ProtectedRouteBaseProps>) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  if (!isApproved) {
    return <Navigate to="/roadmap" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { user, setUser } = useAuthStore();
  const { profile, loadProfile } = useProfileStore();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.uid);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, [setUser, loadProfile]);

  const isAuthenticated = !!user;
  const isApproved = profile?.status === "approved";

  // Mostra um loading enquanto verifica a autenticação
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route
          path="/auth/signin"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <ResetPassword />
            </AuthRoute>
          }
        />

        {/* Rota do Roadmap */}
        <Route
          path="/roadmap"
          element={
            <RoadmapRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <Roadmap />
            </RoadmapRoute>
          }
        />

        {/* Rotas Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catches"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <CatchesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catches/new"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <CatchForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catches/edit/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <CatchForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catches/view/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <CatchView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isApproved={isApproved}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Rota para páginas não encontradas */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/auth/signin"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
