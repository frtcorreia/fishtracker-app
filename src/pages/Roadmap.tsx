import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  GitPullRequest,
  Rocket,
  Fish,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useProfileStore } from "../store/profileStore";
import { useEffect } from "react";

export function Roadmap() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const { profile } = useProfileStore();

  const isAuthenticated = !!user;
  const isApproved = profile?.status === "approved";

  useEffect(() => {
    if (!isAuthenticated && !!isApproved) {
      navigate("/");
    }
  }, [isAuthenticated, isApproved, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const features = [
    {
      title: t("roadmap.sections.current"),
      status: "current",
      items: [
        { name: t("roadmap.features.catchTracking"), done: true },
        { name: t("roadmap.features.weatherIntegration"), done: true },
        { name: t("roadmap.features.locationMapping"), done: true },
        { name: t("roadmap.features.basicAnalytics"), done: true },
      ],
    },
    {
      title: t("roadmap.sections.upcoming"),
      status: "upcoming",
      items: [
        { name: t("roadmap.features.socialFeatures"), done: false },
        { name: t("roadmap.features.advancedAnalytics"), done: false },
        { name: t("roadmap.features.mobileApp"), done: false },
      ],
    },
    {
      title: t("roadmap.sections.planned"),
      status: "planned",
      items: [
        { name: t("roadmap.features.aiRecognition"), done: false },
        { name: t("roadmap.features.tournament"), done: false },
        { name: t("roadmap.features.tackleBox"), done: false },
      ],
    },
  ];

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
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary hover:text-primary-light transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Status de Aprovação Pendente */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-center text-primary dark:text-white mb-4">
              {t("roadmap.approvalStatus.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              {t("roadmap.approvalStatus.description")}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-center italic">
              {t("roadmap.approvalStatus.whatToDo")}
            </p>
          </div>

          {/* Roadmap Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-12">
              <Rocket className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-primary dark:text-white mb-4">
                {t("roadmap.welcome")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("roadmap.description")}
              </p>
            </div>

            <div className="space-y-12">
              {features.map((section) => (
                <div key={section.status} className="relative">
                  <div className="flex items-center mb-4">
                    {section.status === "current" ? (
                      <Clock className="w-6 h-6 text-primary-light mr-2" />
                    ) : section.status === "upcoming" ? (
                      <GitPullRequest className="w-6 h-6 text-primary-light mr-2" />
                    ) : (
                      <Rocket className="w-6 h-6 text-primary-light mr-2" />
                    )}
                    <h2 className="text-xl font-semibold text-primary dark:text-white">
                      {section.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-3" />
                        )}
                        <span
                          className={`${
                            item.done
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
              <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                {t("roadmap.whatNext.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("roadmap.whatNext.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
