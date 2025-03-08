import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { User, Lock, Fish } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(t("auth.login.errors.invalidCredentials"));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(t("auth.login.errors.googleSignInFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary ">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Fish className="w-8 h-8 text-primary dark:text-white" />
              <span className="ml-2 text-xl font-bold text-primary dark:text-white">
                FishTracker
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-8">
              {t("auth.login.title")}
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">
                  {t("auth.login.username")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-primary-light dark:text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border-0 border-b-2 border-secondary dark:border-gray-600 text-primary dark:text-white placeholder-primary/50 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:border-primary-light dark:focus:border-gray-400 transition-colors"
                    placeholder={t("auth.login.usernamePlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-2">
                  {t("auth.login.password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-primary-light dark:text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border-0 border-b-2 border-secondary dark:border-gray-600 text-primary dark:text-white placeholder-primary/50 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:border-primary-light dark:focus:border-gray-400 transition-colors"
                    placeholder={t("auth.login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/reset-password"
                  className="text-sm text-primary-light hover:text-primary dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-white text-sm font-semibold rounded-lg bg-gradient-to-r from-primary via-primary-light to-secondary hover:from-primary-light hover:to-secondary dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02]"
              >
                {t("auth.login.loginButton")}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-light dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-primary/60 dark:text-gray-400">
                    {t("auth.login.orSignUp")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-secondary dark:border-gray-600 rounded-lg text-primary dark:text-white hover:bg-secondary-light/20 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                {t("auth.login.signInWithGoogle")}
              </button>

              <div className="text-center mt-8">
                <span className="text-primary/60 dark:text-gray-400">
                  {t("auth.login.noAccount")}{" "}
                </span>
                <Link
                  to="/auth/signup"
                  className="text-primary-light hover:text-primary dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {t("auth.login.signUpLink")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
