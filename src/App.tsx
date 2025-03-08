import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/authStore";
import { Layout } from "./components/Layout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { CatchesList } from "./pages/catches/CatchesList";
import { CatchForm } from "./pages/catches/CatchForm";
import { CatchView } from "./pages/catches/CatchView";
import { Profile } from "./pages/Profile";
import { Roadmap } from "./pages/Roadmap";
import { useProfileStore } from "./store/profileStore";

function App() {
  const { user, setUser } = useAuthStore();
  const { profile, loadProfile } = useProfileStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const isApproved = profile?.status === "approved";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/signin"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/auth/signup"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/" /> : <ResetPassword />}
        />
        <Route
          path="/roadmap"
          element={user && !isApproved ? <Roadmap /> : <Navigate to="/" />}
        />

        {/* Protected routes */}
        <Route
          element={
            !user ? (
              <Navigate to="/auth/signin" />
            ) : !isApproved ? (
              <Navigate to="/roadmap" />
            ) : (
              <Layout />
            )
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/catches" element={<CatchesList />} />
          <Route path="/catches/new" element={<CatchForm />} />
          <Route path="/catches/edit/:id" element={<CatchForm />} />
          <Route path="/catches/view/:id" element={<CatchView />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
