//[file name]: Sidebar.js
import React, { useState, useEffect } from "react";
import sekolahLogo from "../assets/logo_sekolah.png";

const Sidebar = ({
  currentPage,
  onNavigate,
  isOpen,
  isCollapsed = false,
  userRole,
  isWaliKelas,
  userData = {},
  darkMode = false,
  onClose = null,
  onToggleCollapse = null,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(darkMode);

  useEffect(() => {
    setIsDarkMode(darkMode);
  }, [darkMode]);

  const isGuruBK = userRole === "guru_bk";
  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";
  const isTU = userRole === "tu";
  const isPetugasPerpus = userRole === "petugas_perpus";
  const isKasek = userRole === "kasek";
  const isWakaKurikulum = userRole === "waka_kurikulum";

  // Role dengan akses penuh setara admin: Kepala TU, Staff TU, Kasek, Waka Kurikulum
  const hasFullAccess = isAdmin || isTU || isKasek || isWakaKurikulum;

  const fullName = userData.full_name || "User";
  const roleName =
    userRole === "admin"
      ? "Administrator"
      : userRole === "kasek"
        ? "Kepala Sekolah"
        : userRole === "waka_kurikulum"
          ? "Waka Kurikulum"
          : userRole === "guru_bk"
            ? "Guru BK"
            : isWaliKelas
              ? `Wali Kelas ${userData.homeroom_class_name || ""}`
              : userRole === "teacher"
                ? "Guru"
                : userRole === "tu"
                  ? "Staff TU"
                  : userRole === "petugas_perpus"
                    ? "Petugas Perpustakaan"
                    : "Pengguna";

  const getInitials = (name) => {
    const words = name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);
    if (words.length === 0) return "U";
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);

  const handleMenuClick = (page) => {
    onNavigate(page);
    if (onClose) onClose();
  };

  return (
    <div
      className={`h-screen transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      <div
        className={`
        h-full transition-all duration-300 flex flex-col
        ${isCollapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:relative
        bg-blue-900 dark:bg-gray-900 text-white border-r border-blue-800 dark:border-gray-800
        overflow-y-auto
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-blue-700 dark:border-gray-800">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden absolute top-4 right-4 p-2 text-blue-400 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {onToggleCollapse && isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-2 text-blue-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
              title="Expand sidebar">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div
              className={`${
                isCollapsed ? "w-10 h-10" : "w-10 h-10 sm:w-12 sm:h-12"
              } bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-lg`}>
              <img
                src={sekolahLogo}
                alt="Logo SMP Muslimin Cililin"
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <div>
                <div className="text-base sm:text-lg font-bold text-white dark:text-gray-100 leading-tight">
                  SMP MUSLIMIN
                </div>
                <div className="text-base sm:text-lg font-bold text-white dark:text-gray-100 leading-tight">
                  CILILIN
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== NAVIGATION ========== */}
        <nav className="py-4 flex-1">
          {/* ========== 🏠 DASHBOARD ========== */}
          <div className="mb-4 sm:mb-5">
            <a
              href="#dashboard"
              className={`
                flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                touch-manipulation min-h-[44px]
                ${isCollapsed ? "justify-center" : ""}
                ${
                  currentPage === "dashboard"
                    ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                    : "hover:text-blue-100 dark:hover:text-gray-100"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("dashboard");
              }}
              title={isCollapsed ? "Dashboard" : ""}>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7 7 5-5 5 5"
                />
              </svg>
              {!isCollapsed && (
                <span className="flex-1 text-sm">Dashboard</span>
              )}
            </a>
          </div>

          {/* ========== MASTER DATA ========== */}
          <div className="mb-4 sm:mb-5">
            {!isCollapsed && (
              <div className="px-4 sm:px-6 pb-2 text-xs uppercase font-semibold text-blue-300 dark:text-gray-400 tracking-wider">
                MASTER DATA
              </div>
            )}

            {/* 👨‍🏫 Data Guru */}
            <a
              href="#teachers"
              className={`
                flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                touch-manipulation min-h-[44px]
                ${isCollapsed ? "justify-center" : ""}
                ${
                  currentPage === "teachers"
                    ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                    : "hover:text-blue-100 dark:hover:text-gray-100"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("teachers");
              }}
              title={isCollapsed ? "Data Guru dan Staf" : ""}>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {!isCollapsed && (
                <span className="flex-1 text-sm">Data Guru dan Staf</span>
              )}
            </a>

            {/* 🏢 Data Kelas */}
            <a
              href="#classes"
              className={`
                flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                touch-manipulation min-h-[44px]
                ${isCollapsed ? "justify-center" : ""}
                ${
                  currentPage === "classes"
                    ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                    : "hover:text-blue-100 dark:hover:text-gray-100"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("classes");
              }}
              title={isCollapsed ? "Data Kelas" : ""}>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {!isCollapsed && (
                <span className="flex-1 text-sm">Data Kelas</span>
              )}
            </a>

            {/* 👨‍🎓 Data Siswa */}
            <a
              href="#students"
              className={`
                flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                touch-manipulation min-h-[44px]
                ${isCollapsed ? "justify-center" : ""}
                ${
                  currentPage === "students"
                    ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                    : "hover:text-blue-100 dark:hover:text-gray-100"
                }
              `}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("students");
              }}
              title={isCollapsed ? "Data Siswa" : ""}>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              {!isCollapsed && (
                <span className="flex-1 text-sm">Data Siswa</span>
              )}
            </a>

            {/* ✓ Presensi Guru & Staf — khusus ditampilkan di sini buat Petugas Perpus biar gak membingungkan */}
            {isPetugasPerpus && (
              <a
                href="#attendance-teacher"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "attendance-teacher"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("attendance-teacher");
                }}
                title={isCollapsed ? "Presensi Guru & Staf" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Presensi Guru & Staf</span>
                )}
              </a>
            )}
          </div>

          {/* ========== AKADEMIK (khusus FULL_ACCESS_ROLES) ========== */}
          {/* Petugas Perpus dikecualikan total — Presensi Guru & Staf-nya udah dipindah ke Master Data */}
          {hasFullAccess && (
            <div className="mb-4 sm:mb-5">
              {!isCollapsed && (
                <div className="px-4 sm:px-6 pb-2 text-xs uppercase font-semibold text-blue-300 dark:text-gray-400 tracking-wider">
                  AKADEMIK
                </div>
              )}
              {/* ✓ Presensi Guru & Staf — Petugas Perpus dipindah ke Master Data, jadi di sini cuma FULL_ACCESS_ROLES */}
              {hasFullAccess && (
                <a
                  href="#attendance-teacher"
                  className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "attendance-teacher"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("attendance-teacher");
                  }}
                  title={isCollapsed ? "Presensi Guru & Staf" : ""}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span className="flex-1 text-sm">Presensi Guru & Staf</span>
                  )}
                </a>
              )}
              {/* ✓ Presensi Siswa */}
              {hasFullAccess && (
                <a
                  href="#attendance"
                  className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "attendance"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("attendance");
                  }}
                  title={isCollapsed ? "Presensi Siswa" : ""}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span className="flex-1 text-sm">Presensi Siswa</span>
                  )}
                </a>
              )}

              {/* ✓ Nilai Siswa */}
              {hasFullAccess && (
                <a
                  href="#nilai-siswa"
                  className={`
      flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
      touch-manipulation min-h-[44px]
      ${isCollapsed ? "justify-center" : ""}
      ${
        currentPage === "nilai-siswa"
          ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
          : "hover:text-blue-100 dark:hover:text-gray-100"
      }
    `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("nilai-siswa");
                  }}
                  title={isCollapsed ? "Nilai Siswa" : ""}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span className="flex-1 text-sm">Nilai Siswa</span>
                  )}
                </a>
              )}
              {/* 📊 Laporan */}
              {hasFullAccess && (
                <a
                  href="#reports"
                  className={`
      flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
      touch-manipulation min-h-[44px]
      ${isCollapsed ? "justify-center" : ""}
      ${
        currentPage === "reports"
          ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
          : "hover:text-blue-100 dark:hover:text-gray-100"
      }
    `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("reports");
                  }}
                  title={isCollapsed ? "Laporan" : ""}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span className="flex-1 text-sm">Laporan</span>
                  )}
                </a>
              )}
            </div>
          )}

          {/* ========== PERPUSTAKAAN ========== */}
          {(hasFullAccess || isPetugasPerpus) && (
            <div className="mb-4 sm:mb-5">
              {!isCollapsed && (
                <div className="px-4 sm:px-6 pb-2 text-xs uppercase font-semibold text-blue-300 dark:text-gray-400 tracking-wider">
                  PERPUSTAKAAN
                </div>
              )}

              {/* 📚 Katalog Buku */}
              <a
                href="#katalog-buku"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "katalog-buku"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("katalog-buku");
                }}
                title={isCollapsed ? "Katalog Buku" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Katalog Buku</span>
                )}
              </a>

              {/* 📖 Peminjaman */}
              <a
                href="#peminjaman"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "peminjaman"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("peminjaman");
                }}
                title={isCollapsed ? "Peminjaman" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Peminjaman</span>
                )}
              </a>

              {/* 📥 Pengembalian */}
              <a
                href="#pengembalian"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "pengembalian"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("pengembalian");
                }}
                title={isCollapsed ? "Pengembalian" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 8l4 4m0 0l-4 4m4-4H3m10-4v1a3 3 0 003 3h5a3 3 0 003-3V7a3 3 0 00-3-3h-5a3 3 0 00-3 3v1"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Pengembalian</span>
                )}
              </a>
            </div>
          )}

          {/* ========== SISTEM (FULL ACCESS ROLES) ========== */}
          {hasFullAccess && (
            <div className="mb-4">
              {!isCollapsed && (
                <div className="px-4 sm:px-6 pb-2 text-xs uppercase font-semibold text-blue-300 dark:text-gray-400 tracking-wider">
                  SISTEM
                </div>
              )}

              {/* 📄 SPMB */}
              <a
                href="#spmb"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "spmb"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("spmb");
                }}
                title={isCollapsed ? "SPMB" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {!isCollapsed && <span className="flex-1 text-sm">SPMB</span>}
              </a>

              {/* ⚙️ Pengaturan */}
              <a
                href="#settings"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "settings"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("settings");
                }}
                title={isCollapsed ? "Pengaturan" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Pengaturan</span>
                )}
              </a>

              {/* 📺 Monitor Sistem */}
              <a
                href="#monitor-sistem"
                className={`
                  flex items-center gap-3 px-4 sm:px-6 py-2.5 text-white dark:text-gray-200 font-medium transition-all duration-200 cursor-pointer hover:bg-blue-800 dark:hover:bg-gray-800 rounded-r-full mr-4
                  touch-manipulation min-h-[44px]
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    currentPage === "monitor-sistem"
                      ? "bg-blue-800 dark:bg-gray-800 border-r-4 border-blue-400 dark:border-blue-500 font-semibold text-blue-100 dark:text-gray-100"
                      : "hover:text-blue-100 dark:hover:text-gray-100"
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick("monitor-sistem");
                }}
                title={isCollapsed ? "Monitor Sistem" : ""}>
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                {!isCollapsed && (
                  <span className="flex-1 text-sm">Monitor Sistem</span>
                )}
              </a>
            </div>
          )}
        </nav>

        {/* User Profile Section */}
        <div
          className={`mt-auto border-t ${
            isDarkMode
              ? "border-gray-800 bg-gray-800"
              : "border-blue-700 bg-blue-800"
          } p-4`}>
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div
              className={`w-10 h-10 ${
                isDarkMode ? "bg-blue-700" : "bg-blue-600"
              } rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-bold truncate ${
                    isDarkMode ? "text-gray-100" : "text-white"
                  }`}>
                  {fullName}
                </div>
                <div
                  className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-blue-200"}`}>
                  {roleName}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
