import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Fish, MapPin, Trophy, Plus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCatchesStore } from "../store/catchesStore";
import { getWeatherForecast } from "../lib/weather";
import { WeatherForecast } from "../components/WeatherForecast";
import {
  StatsCard,
  ActivityChart,
  CatchesMap,
  RecentCatches,
} from "../components/dashboard";
import { parseISO, isThisMonth, isThisYear } from "date-fns";

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { catches, loadCatches } = useCatchesStore();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    if (user) {
      loadCatches(user.uid);
    }
  }, [user, loadCatches]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPosition(pos);
          setLoadingLocation(false);

          // Fetch weather data
          getWeatherForecast(pos.lat, pos.lng)
            .then((data) => {
              setWeather(data);
              setLoadingWeather(false);
            })
            .catch((error) => {
              console.error("Error fetching weather:", error);
              setLoadingWeather(false);
            });
        },
        () => {
          setPosition({ lat: 40.7128, lng: -74.006 });
          setLoadingLocation(false);
        }
      );
    } else {
      setPosition({ lat: 40.7128, lng: -74.006 });
      setLoadingLocation(false);
    }
  }, []);

  const thisYearCatches = useMemo(() => {
    return catches.filter((catch_) => isThisYear(parseISO(catch_.date)));
  }, [catches]);

  const thisMonthCatches = useMemo(() => {
    return catches.filter((catch_) => isThisMonth(parseISO(catch_.date)));
  }, [catches]);

  const heavyCatches = useMemo(() => {
    return catches.filter((catch_) => catch_.catch.weight > 2000);
  }, [catches]);

  const stats = useMemo(
    () => [
      {
        title: t("dashboard.stats.totalCatches.title"),
        value: catches.length,
        icon: Fish,
        up: true,
        change: t("dashboard.stats.totalCatches.thisMonth", {
          count: thisMonthCatches.length,
        }),
      },
      {
        title: t("dashboard.stats.biggestCatch.title"),
        value:
          catches.length > 0
            ? `${Math.max(...catches.map((c) => c.catch.weight || 0))}g`
            : "0",
        icon: Trophy,
        up: true,
        change: t("dashboard.stats.biggestCatch.personalBest"),
      },
      {
        title: t("dashboard.stats.thisYear.title"),
        value: thisYearCatches.length,
        icon: Fish,
        up: true,
        change: t("dashboard.stats.thisYear.thisMonth", {
          count: thisMonthCatches.length,
        }),
      },
      {
        title: t("dashboard.stats.locations.title"),
        value: new Set(
          catches.map(
            (c) => `${c.location.coordinates.lat},${c.location.coordinates.lng}`
          )
        ).size,
        icon: MapPin,
        up: true,
        change: t("dashboard.stats.locations.heavyCatches", {
          count: heavyCatches.length,
        }),
      },
    ],
    [catches, thisYearCatches, thisMonthCatches, heavyCatches, t]
  );

  const monthlyData = useMemo(() => {
    const months = [
      t("common.months.jan"),
      t("common.months.feb"),
      t("common.months.mar"),
      t("common.months.apr"),
      t("common.months.may"),
      t("common.months.jun"),
      t("common.months.jul"),
      t("common.months.aug"),
      t("common.months.sep"),
      t("common.months.oct"),
      t("common.months.nov"),
      t("common.months.dec"),
    ];
    const currentYear = new Date().getFullYear();

    const monthlyCounts = months.map((month, index) => {
      const count = catches.filter((catch_) => {
        const date = parseISO(catch_.date);
        return date.getFullYear() === currentYear && date.getMonth() === index;
      }).length;
      return { month, count };
    });

    const maxCount = Math.max(...monthlyCounts.map((m) => m.count));

    return monthlyCounts.map((m) => ({
      ...m,
      height: maxCount > 0 ? (m.count / maxCount) * 100 : 0,
    }));
  }, [catches]);

  const mapCenter = useMemo(() => {
    if (position) {
      return [position.lat, position.lng] as [number, number];
    }

    if (thisYearCatches.length === 0) {
      return [40.7128, -74.006] as [number, number];
    }

    const lats = thisYearCatches.map((c) => c.location.coordinates.lat);
    const lngs = thisYearCatches.map((c) => c.location.coordinates.lng);

    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ] as [number, number];
  }, [thisYearCatches, position]);

  const recentCatches = useMemo(() => {
    return catches.slice(0, 5).map((catch_) => ({
      id: catch_.id,
      species: catch_.catch.species,
      weight: catch_.catch.weight,
      length: catch_.catch.length ? catch_.catch.length : null,
      date: catch_.date,
      time: catch_.time,
      imageUrl: catch_.catch.imageUrl,
    }));
  }, [catches]);

  return (
    <div className="space-y-6 relative pb-20">
      {/* Weather Forecast */}
      <WeatherForecast weather={weather} loading={loadingWeather} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Activity Overview and Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityChart monthlyData={monthlyData} />
        <CatchesMap
          catches={thisYearCatches}
          center={mapCenter}
          loading={loadingLocation}
          onViewDetails={(id) => navigate(`/catches/view/${id}`)}
        />
      </div>

      {/* Recent Catches */}
      <RecentCatches catches={recentCatches} />

      {/* Floating Action Button */}
      <Link
        to="/catches/new"
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        title={t("catches.list.addNew")}
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}
