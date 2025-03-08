import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Home, Fish, User, Settings } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", icon: Home, label: t("layout.menu.dashboard") },
    { path: "/catches", icon: Fish, label: t("layout.menu.catches") },
    { path: "/profile", icon: User, label: t("layout.menu.profile") },
  ];

  // Check if we're on an auth page
  const isAuthPage = [
    "/auth/signin",
    "/auth/signup",
    "/auth/reset-password",
  ].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center">
                <Fish className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  {t("layout.appName")}
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar - Hidden on mobile by default */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 bg-white dark:bg-gray-800 border-r border-gray-200  dark:border-gray-700`}
        >
          <div className="p-4 flex items-center gap-1">
            <Fish className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="font-bold text-xl dark:text-white">
              {t("layout.appName")}
            </h1>
          </div>

          <nav className="mt-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-4 ${
                  location.pathname === item.path
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span className="ml-4">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                >
                  <Menu size={24} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">
                  {
                    navItems.find((item) => item.path === location.pathname)
                      ?.label
                  }
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <ThemeSwitcher />
                {user && (
                  <button
                    onClick={signOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {t("common.logout")}
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
