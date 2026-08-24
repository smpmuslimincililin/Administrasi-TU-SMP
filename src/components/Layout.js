import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout = ({ user, onLogout, children, darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const timerRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const hasAccessToCurrentPage = useCallback(() => {
    if (!user) return false;
    if (location.pathname === "/attendance-management") {
      return user.role === "admin";
    }
    return true;
  }, [user, location.pathname]);

  // 🔥 FIX: Handle resize dengan 3 state preservation
  useEffect(() => {
    const handleResize = () => {
      const isLaptopSize = window.innerWidth >= 1024;
      setIsLaptop(isLaptopSize);

      if (isLaptopSize) {
        setIsSidebarOpen(true);
        setMobileMenuOpen(false);
      } else {
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(updateTime, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
    setMobileMenuOpen(false);
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, [location.pathname]);

  // 🔥 FIX: Handle sidebar toggle dengan 3 state
  const handleSidebarToggle = () => {
    if (isLaptop) {
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);
        setIsSidebarCollapsed(false);
      } else if (isSidebarOpen && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      } else if (isSidebarOpen && isSidebarCollapsed) {
        setIsSidebarCollapsed(false);
      }
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // 🔥 FIX: Get icon berdasarkan state
  const getSidebarToggleIcon = () => {
    if (isLaptop) {
      if (!isSidebarOpen) {
        return (
          <Menu
            size={20}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
        );
      } else if (isSidebarOpen && !isSidebarCollapsed) {
        return (
          <ChevronLeft
            size={20}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
        );
      } else if (isSidebarOpen && isSidebarCollapsed) {
        return (
          <ChevronRight
            size={20}
            className={darkMode ? "text-blue-400" : "text-blue-600"}
          />
        );
      }
    }
    return (
      <Menu
        size={20}
        className={darkMode ? "text-blue-400" : "text-blue-600"}
      />
    );
  };

  // 🔥 FIX: Get tooltip text
  const getSidebarToggleTooltip = () => {
    if (isLaptop) {
      if (!isSidebarOpen) {
        return "Buka sidebar";
      } else if (isSidebarOpen && !isSidebarCollapsed) {
        return "Collapse sidebar (icon only)";
      } else if (isSidebarOpen && isSidebarCollapsed) {
        return "Expand sidebar (full)";
      }
    }
    return "Buka menu";
  };

  // 🔥 FIX: Get sidebar width untuk content shifting
  const getSidebarWidthClass = () => {
    if (isLaptop && isSidebarOpen) {
      return isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64";
    }
    return "lg:ml-0";
  };

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔥 UPDATE: Menambahkan halaman E-RAPORT - SESUAI DOKUMENTASI
  const getCurrentPage = () => {
    const path = location.pathname;

    // Menu Utama & Akademik
    if (path === "/dashboard") return "dashboard";
    if (path === "/teachers") return "teachers";
    if (path === "/students") return "students";
    if (path === "/classes") return "classes";
    if (path === "/attendance") return "attendance";
    if (path === "/attendance-management") return "attendance-management";
    if (path === "/attendance-teacher") return "attendance-teacher";
    if (path === "/nilai-siswa") return "nilai-siswa"; // 🚨 PERUBAHAN: dari "/grades" dan "/grades-katrol"
    if (path === "/reports") return "reports";

    // Perpustakaan
    if (path === "/katalog-buku") return "katalog-buku";
    if (path === "/peminjaman") return "peminjaman";
    if (path === "/pengembalian") return "pengembalian";

    // Sistem (Admin only)
    if (path === "/spmb") return "spmb";
    if (path === "/settings") return "settings";
    if (path === "/monitor-sistem") return "monitor-sistem";

    return "dashboard";
  };

  // 🔥 UPDATE: Menambahkan nama halaman untuk E-RAPORT sesuai dokumentasi
  const getCurrentPageName = () => {
    const pathMap = {
      // Menu Utama & Akademik
      "/dashboard": "Dashboard",
      "/students": "Data Siswa",
      "/teachers": "Data Guru",
      "/classes": "Data Kelas",
      "/attendance": "Kehadiran",
      "/attendance-management": "Management Presensi",
      "/attendance-teacher": "Presensi Guru & Staf",
      "/nilai-siswa": "Nilai Siswa", // 🚨 PERUBAHAN: dari "Nilai Asli" & "Nilai Katrol"
      "/reports": "Laporan",

      // Perpustakaan
      "/katalog-buku": "Katalog Buku",
      "/peminjaman": "Peminjaman",
      "/pengembalian": "Pengembalian",

      // Sistem (Admin only)
      "/spmb": "SPMB",
      "/settings": "Pengaturan",
      "/monitor-sistem": "Monitor Sistem",
    };
    return pathMap[location.pathname] || "Dashboard";
  };

  // 🔥 UPDATE: Menambahkan subtitle untuk halaman E-RAPORT sesuai dokumentasi
  const getPageSubtitle = () => {
    if (!user) return "SMP Muslimin";

    const { role, homeroom_class_id } = user;
    const currentPage = getCurrentPageName();

    const subtitles = {
      admin: {
        // Menu Utama & Akademik
        Dashboard: "Kelola Semua Data Sekolah",
        "Data Siswa": "Kelola Data Siswa Sekolah",
        "Data Guru": "Kelola Data Guru Sekolah",
        "Data Kelas": "Kelola Data Kelas Sekolah",
        Kehadiran: "Kelola Kehadiran Siswa",
        "Management Presensi": "Edit, Ubah Tanggal, atau Hapus Data Presensi",
        "Presensi Guru & Staf": "Kelola Presensi dan Absensi Guru",
        "Nilai Siswa":
          "Kelola Nilai Akademik Siswa (Input Nilai & Nilai Katrol)", // 🚨 PERUBAHAN
        Laporan: "Generate dan Kelola Laporan",

        // Perpustakaan
        "Katalog Buku": "Kelola Katalog Buku Perpustakaan",
        Peminjaman: "Kelola Peminjaman Buku",
        Pengembalian: "Kelola Pengembalian Buku",

        // Sistem (Admin only)
        SPMB: "Seleksi Penerimaan Murid Baru",
        Pengaturan: "Pengaturan Sistem Sekolah",
        "Monitor Sistem": "Pemeriksaan Kesehatan Sistem dan Integritas Data",
      },
      // Kasek & Waka Kurikulum: akses penuh setara admin
      kasek: {
        Dashboard: "Kelola Semua Data Sekolah",
        "Data Siswa": "Kelola Data Siswa Sekolah",
        "Data Guru": "Kelola Data Guru Sekolah",
        "Data Kelas": "Kelola Data Kelas Sekolah",
        Kehadiran: "Kelola Kehadiran Siswa",
        "Management Presensi": "Edit, Ubah Tanggal, atau Hapus Data Presensi",
        "Presensi Guru & Staf": "Monitoring Presensi dan Absensi Guru",
        "Nilai Siswa":
          "Kelola Nilai Akademik Siswa (Input Nilai & Nilai Katrol)",
        Laporan: "Generate dan Kelola Laporan",
        "Katalog Buku": "Kelola Katalog Buku Perpustakaan",
        Peminjaman: "Kelola Peminjaman Buku",
        Pengembalian: "Kelola Pengembalian Buku",
        SPMB: "Seleksi Penerimaan Murid Baru",
        Pengaturan: "Pengaturan Sistem Sekolah",
        "Monitor Sistem": "Pemeriksaan Kesehatan Sistem dan Integritas Data",
      },
      waka_kurikulum: {
        Dashboard: "Kelola Semua Data Sekolah",
        "Data Siswa": "Kelola Data Siswa Sekolah",
        "Data Guru": "Kelola Data Guru Sekolah",
        "Data Kelas": "Kelola Data Kelas Sekolah",
        Kehadiran: "Kelola Kehadiran Siswa",
        "Management Presensi": "Edit, Ubah Tanggal, atau Hapus Data Presensi",
        "Presensi Guru & Staf": "Monitoring Presensi dan Absensi Guru",
        "Nilai Siswa":
          "Kelola Nilai Akademik Siswa (Input Nilai & Nilai Katrol)",
        Laporan: "Generate dan Kelola Laporan",
        "Katalog Buku": "Kelola Katalog Buku Perpustakaan",
        Peminjaman: "Kelola Peminjaman Buku",
        Pengembalian: "Kelola Pengembalian Buku",
        SPMB: "Seleksi Penerimaan Murid Baru",
        Pengaturan: "Pengaturan Sistem Sekolah",
        "Monitor Sistem": "Pemeriksaan Kesehatan Sistem dan Integritas Data",
      },
      guru_bk: {
        // Menu Utama & Akademik untuk Guru BK
        Dashboard: "Dashboard Bimbingan Konseling",
        "Data Siswa": "Lihat Data Siswa Sekolah",
        "Data Guru": "Lihat Data Guru Sekolah",
        "Presensi Guru & Staf": "Lihat Presensi Guru Sekolah",
        Laporan: "Laporan BK/BP",
      },
      tu: {
        // Menu Utama & Akademik untuk Staff TU
        Dashboard: "Dashboard Administrasi TU",
        "Data Siswa": "Kelola Data Siswa Sekolah",
        "Data Guru": "Kelola Data Guru dan Staf Sekolah",
        "Data Kelas": "Kelola Data Kelas Sekolah",
        "Presensi Guru & Staf": "Kelola Presensi dan Absensi Guru",
        Kehadiran: "Kelola Kehadiran Siswa",
        "Nilai Siswa": "Kelola Nilai Akademik Siswa",
        Laporan: "Generate dan Kelola Laporan",
        SPMB: "Seleksi Penerimaan Murid Baru",
      },
      petugas_perpus: {
        // Menu untuk Petugas Perpustakaan
        Dashboard: "Dashboard Perpustakaan",
        "Data Siswa": "Lihat Data Siswa Sekolah",
        "Data Guru": "Lihat Data Guru dan Staf Sekolah",
        "Data Kelas": "Lihat Data Kelas Sekolah",
        "Presensi Guru & Staf": "Input Kehadiran Guru dan Staf",
        "Katalog Buku": "Kelola Katalog Buku Perpustakaan",
        Peminjaman: "Catat dan Kelola Peminjaman Buku",
        Pengembalian: "Catat dan Kelola Pengembalian Buku",
      },
      teacher: homeroom_class_id
        ? {
            // Menu untuk Wali Kelas (teacher dengan homeroom_class_id)
            Dashboard: `Kelola Data Kelas ${homeroom_class_id}`,
            "Data Siswa": `Kelola Data Siswa Kelas`,
            "Data Guru": "Kelola Data Guru Sekolah",
            "Data Kelas": `Informasi Kelas`,
            Kehadiran: `Input Kehadiran Siswa`,
            "Management Presensi": "Kelola Data Presensi yang Sudah Diinput",
            "Presensi Guru & Staf": "Input Kehadiran Guru",
            "Nilai Siswa": `Input Nilai Akademik (Asli & Katrol) Kelas ${homeroom_class_id}`, // 🚨 PERUBAHAN
            Laporan: `Laporan Kelas`,
            Pengaturan: "Pengaturan Akun",
          }
        : {
            // Menu untuk Guru Mapel (teacher tanpa homeroom_class_id)
            Dashboard: "Monitor semua kelas yang diampu",
            "Data Siswa": "Lihat data siswa semua kelas",
            "Data Guru": "Lihat data guru sekolah",
            "Data Kelas": "Lihat informasi kelas",
            Kehadiran: "Input kehadiran mata pelajaran",
            "Management Presensi": "Kelola Data Presensi Mata Pelajaran",
            "Presensi Guru & Staf": "Input Presensi dan Absensi Guru",
            "Nilai Siswa":
              "Input nilai akademik (asli & katrol) mata pelajaran", // 🚨 PERUBAHAN
            Laporan: "Laporan mata pelajaran",
            Pengaturan: "Pengaturan akun",
          },
    };

    return subtitles[role]?.[currentPage] || "SMP Muslimin";
  };

  const handleNavigate = useCallback(
    (page) => {
      if (isNavigating) return;

      const routes = {
        // Menu Utama & Akademik
        dashboard: "/dashboard",
        teachers: "/teachers",
        students: "/students",
        classes: "/classes",
        attendance: "/attendance",
        "attendance-management": "/attendance-management",
        "attendance-teacher": "/attendance-teacher",
        "nilai-siswa": "/nilai-siswa", // 🚨 PERUBAHAN: dari "nilai-asli": "/grades" dan "nilai-katrol": "/grades-katrol"
        reports: "/reports",

        // Perpustakaan
        "katalog-buku": "/katalog-buku",
        peminjaman: "/peminjaman",
        pengembalian: "/pengembalian",

        // Sistem (Admin only)
        spmb: "/spmb",
        settings: "/settings",
        "monitor-sistem": "/monitor-sistem",
      };

      let path = routes[page];

      if (!path) return;

      if (
        path === "/attendance-management" &&
        !["admin", "tu", "kasek", "waka_kurikulum"].includes(user?.role)
      ) {
        navigate("/dashboard");
        return;
      }

      if (location.pathname === path) return;

      setIsNavigating(true);

      try {
        navigate(path);

        navigationTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
        }, 2000);
      } catch (error) {
        console.error("Navigation error:", error);
        setIsNavigating(false);
      }
    },
    [isNavigating, location.pathname, navigate, user],
  );

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const renderContent = () => {
    if (!hasAccessToCurrentPage()) {
      return (
        <div
          className={`flex flex-col items-center justify-center h-64 rounded-xl shadow-sm border p-6 transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-blue-100"
          }`}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
              darkMode ? "bg-red-900/30" : "bg-red-100"
            }`}>
            <svg
              className={`w-8 h-8 ${darkMode ? "text-red-400" : "text-red-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2
            className={`text-xl font-bold mb-2 transition-colors ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
            Akses Ditolak
          </h2>
          <p
            className={`text-center mb-4 transition-colors ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Dashboard
          </button>
        </div>
      );
    }

    return isNavigating ? (
      <div className="flex items-center justify-center h-32 sm:h-48">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-blue-600 font-medium text-sm">Loading...</p>
        </div>
      </div>
    ) : (
      children
    );
  };

  return (
    <div
      className={`flex min-h-screen overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 to-white"
      }`}>
      {/* Custom animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 🔥 FIX: Sidebar Desktop dengan 3 state */}
      <div
        className={`fixed inset-y-0 left-0 z-50 hidden lg:block transition-all duration-300 ease-in-out ${
          isSidebarOpen ? (isSidebarCollapsed ? "w-20" : "w-64") : "w-0"
        }`}>
        {isSidebarOpen && (
          <Sidebar
            currentPage={getCurrentPage()}
            onNavigate={handleNavigate}
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            userRole={user?.role}
            isWaliKelas={!!user?.homeroom_class_id}
            userData={{
              full_name: user?.full_name || user?.username || "User",
              homeroom_class_name: user?.homeroom_class_id || "",
            }}
            darkMode={darkMode}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}>
        <Sidebar
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          isOpen={true}
          isCollapsed={false}
          userRole={user?.role}
          isWaliKelas={!!user?.homeroom_class_id}
          userData={{
            full_name: user?.full_name || user?.username || "User",
            homeroom_class_name: user?.homeroom_class_id || "",
          }}
          onClose={() => setMobileMenuOpen(false)}
          darkMode={darkMode}
        />
      </div>

      {/* 🔥 FIX: Main content dengan dynamic margin */}
      <main
        className={`flex-1 min-w-0 min-h-screen transition-all duration-300 ease-in-out ${getSidebarWidthClass()}`}>
        <header
          className={`shadow-md border-b sticky top-0 z-30 transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
              : "bg-white border-blue-100 shadow-blue-100/50"
          }`}>
          <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* 🔥 FIX: Button toggle dengan icon dinamis */}
                <button
                  onClick={handleSidebarToggle}
                  className={`p-2 rounded-lg transition-colors touch-manipulation ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                  }`}
                  style={{ minWidth: "44px", minHeight: "44px" }}
                  title={getSidebarToggleTooltip()}
                  aria-label={getSidebarToggleTooltip()}>
                  {getSidebarToggleIcon()}
                </button>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1
                      className={`text-base sm:text-lg lg:text-xl font-bold truncate transition-colors ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                      {getCurrentPageName()}
                    </h1>
                    {isNavigating && (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium truncate transition-colors ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}>
                    {getPageSubtitle()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                {/* Clock - Mobile */}
                <div className="lg:hidden flex flex-col items-center min-w-[100px] rounded-lg px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-1">
                    <Clock
                      size={12}
                      className="flex-shrink-0 text-blue-500 dark:text-blue-400"
                    />
                    <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      {formatTime(currentTime)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-blue-500 dark:text-blue-400 whitespace-nowrap">
                    {formatDate(currentTime)}
                  </span>
                </div>

                {/* Clock - Desktop */}
                <div className="hidden lg:flex rounded-xl px-4 py-3 min-w-[280px] shadow-sm border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1 text-blue-500 dark:text-blue-400">
                      <Calendar
                        size={16}
                        className="flex-shrink-0 text-blue-500 dark:text-blue-400"
                      />
                      <span>
                        {currentTime.toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className="flex-shrink-0 text-blue-600 dark:text-blue-300"
                      />
                      <span className="font-mono font-semibold text-base tracking-wide text-blue-700 dark:text-blue-200">
                        {currentTime.toLocaleTimeString("id-ID")}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded ml-1">
                        WIB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown - desktop only, karena mobile sudah ada tombol "Akun" di BottomNav */}
                <div
                  className="hidden lg:block relative"
                  ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 bg-blue-600 flex items-center gap-1 sm:gap-2 touch-manipulation"
                    style={{ minWidth: "44px", minHeight: "44px" }}>
                    <User size={16} className="text-white flex-shrink-0" />
                    <span className="hidden sm:block text-sm font-medium text-white">
                      Profile
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-xl shadow-xl z-50 border transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-blue-100"
                      }`}>
                      <div
                        className={`px-4 py-3 border-b rounded-t-xl transition-colors ${
                          darkMode
                            ? "border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800"
                            : "border-blue-50 bg-gradient-to-r from-blue-50 to-white"
                        }`}>
                        <p
                          className={`font-semibold text-sm truncate transition-colors ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                          {user?.full_name || user?.username || "User"}
                        </p>
                        <p
                          className={`text-xs capitalize font-medium transition-colors ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}>
                          {user?.role === "admin"
                            ? "Administrator"
                            : user?.role === "kasek"
                              ? "Kepala Sekolah"
                              : user?.role === "waka_kurikulum"
                                ? "Waka Kurikulum"
                                : user?.role === "guru_bk"
                                  ? "Guru BK/BP"
                                  : user?.role === "teacher" &&
                                      user?.homeroom_class_id
                                    ? `Wali Kelas ${user.homeroom_class_id}`
                                    : user?.role === "teacher"
                                      ? "Guru Mata Pelajaran"
                                      : user?.role === "tu"
                                        ? "Staff TU"
                                        : user?.role === "petugas_perpus"
                                          ? "Petugas Perpustakaan"
                                          : "User"}
                        </p>
                        {user?.teacher_id && (
                          <p
                            className={`text-xs font-medium transition-colors ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                            ID: {user.teacher_id}
                          </p>
                        )}
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate("/settings?tab=profile");
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 touch-manipulation ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}>
                          <User size={16} className="flex-shrink-0" />
                          <span className="font-medium">Profile</span>
                        </button>

                        {["admin", "tu", "kasek", "waka_kurikulum"].includes(
                          user?.role,
                        ) && (
                          <button
                            onClick={() => {
                              handleNavigate("settings");
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 touch-manipulation ${
                              darkMode
                                ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            }`}>
                            <Settings size={16} className="flex-shrink-0" />
                            <span className="font-medium">Pengaturan</span>
                          </button>
                        )}

                        <button
                          onClick={onToggleDarkMode}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors duration-150 touch-manipulation ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}>
                          <span className="flex items-center gap-3">
                            {darkMode ? (
                              <Moon
                                size={16}
                                className="flex-shrink-0"
                                fill="currentColor"
                              />
                            ) : (
                              <Sun size={16} className="flex-shrink-0" />
                            )}
                            <span className="font-medium">Mode Gelap</span>
                          </span>
                          <span
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${
                              darkMode ? "bg-blue-600" : "bg-gray-300"
                            }`}>
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                darkMode ? "translate-x-4" : "translate-x-1"
                              }`}
                            />
                          </span>
                        </button>

                        <button
                          onClick={handleLogoutClick}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 touch-manipulation ${
                            darkMode
                              ? "text-red-400 hover:bg-red-900/20"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                          }`}>
                          <LogOut size={16} className="flex-shrink-0" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div
          className={`min-h-screen p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6 transition-colors duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-blue-50 to-white"
          }`}>
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navbar - mobile only, pakai handleNavigate yang sama dengan Sidebar */}
      <BottomNav
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        onLogout={handleLogoutClick}
        darkMode={darkMode}
        userRole={user?.role}
        user={user}
        onToggleDarkMode={onToggleDarkMode}
        onProfileClick={() => navigate("/settings?tab=profile")}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 transition-colors ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}>
                <LogOut
                  className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>

              <h3
                className={`text-xl font-bold mb-2 transition-colors ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                Keluar dari Sistem?
              </h3>
              <p
                className={`text-sm mb-6 transition-colors ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Anda harus login kembali untuk mengakses sistem
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancelLogout}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  }`}>
                  Batal
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/30">
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
