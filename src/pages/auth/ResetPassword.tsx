import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Fish, Mail } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useAuthStore } from "../../store/authStore";

export function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-light to-secondary">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Fish className="w-8 h-8 text-primary" />
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
              {t("auth.resetPassword.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {t("auth.resetPassword.description")}
            </p>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 dark:text-green-400">
                  {t("auth.resetPassword.success")}
                </p>
                <div className="mt-4 text-center">
                  <Link
                    to="/auth/signin"
                    className="text-primary-light dark:text-primary font-medium transition-colors"
                  >
                    {t("auth.resetPassword.backToLogin")}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-primary mb-2 dark:text-gray-200">
                    {t("auth.resetPassword.email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-primary-light dark:text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-2 border-0 border-b-2 border-secondary text-primary dark:text-white placeholder-primary/50 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:border-primary-light transition-colors"
                      placeholder={t("auth.resetPassword.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-white text-sm font-semibold rounded-lg bg-gradient-to-r from-primary via-primary-light to-secondary hover:from-primary-light hover:to-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
                >
                  {t("auth.resetPassword.submitButton")}
                </button>

                <div className="text-center mt-6">
                  <Link
                    to="/auth/signin"
                    className="text-primary-light dark:text-white font-medium transition-colors"
                  >
                    {t("auth.resetPassword.backToLogin")}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
