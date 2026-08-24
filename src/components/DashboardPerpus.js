//[file name]: DashboardPerpus.js
import React from "react";

/**
 * Dashboard khusus role petugas_perpus.
 * DUMMY — data statistik di bawah masih hardcoded karena tabel Supabase
 * untuk modul Perpustakaan (books, members, transactions) belum dibuat.
 * Begitu backend-nya jadi, ganti bagian "TODO: fetch" dengan query asli.
 *
 * Dipanggil dari Dashboard.js utama saat user.role === "petugas_perpus",
 * bukan lewat route/menu sendiri — sidebar tetap pakai satu link "Dashboard".
 */
const DashboardPerpus = ({ user, onShowToast, darkMode = false }) => {
  const fullName = user?.full_name || "Petugas Perpustakaan";

  // TODO: fetch dari Supabase begitu tabel books/members/transactions sudah ada
  const stats = [
    { label: "Total Buku", value: "—", note: "Belum ada data" },
    { label: "Sedang Dipinjam", value: "—", note: "Belum ada data" },
    { label: "Jatuh Tempo", value: "—", note: "Belum ada data" },
    { label: "Anggota Aktif", value: "—", note: "Belum ada data" },
  ];

  const quickLinks = [
    { key: "katalog-buku", label: "Katalog Buku", desc: "Kelola daftar buku" },
    { key: "peminjaman", label: "Peminjaman", desc: "Catat buku keluar" },
    { key: "pengembalian", label: "Pengembalian", desc: "Catat buku kembali" },
  ];

  return (
    <div className="space-y-6">
      {/* Header sambutan */}
      <div
        className={`rounded-2xl p-5 sm:p-6 transition-colors ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-blue-100 shadow-sm"
        }`}>
        <h1
          className={`text-lg sm:text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
          Halo, {fullName}
        </h1>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          Ringkasan Perpustakaan — data di bawah masih dummy, menunggu backend
          selesai.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-4 transition-colors ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-blue-100 shadow-sm"
            }`}>
            <div
              className={`text-xs font-semibold uppercase tracking-wide ${
                darkMode ? "text-gray-400" : "text-blue-600"
              }`}>
              {stat.label}
            </div>
            <div
              className={`text-2xl font-bold mt-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
              {stat.value}
            </div>
            <div
              className={`text-xs mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}>
              {stat.note}
            </div>
          </div>
        ))}
      </div>

      {/* Quick links ke halaman Perpustakaan */}
      <div>
        <h2
          className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          Akses Cepat
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <a
              key={link.key}
              href={`#${link.key}`}
              className={`rounded-xl p-4 transition-colors cursor-pointer ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-750 hover:border-blue-500"
                  : "bg-white border border-blue-100 shadow-sm hover:border-blue-400 hover:shadow-md"
              }`}>
              <div
                className={`font-semibold text-sm ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                {link.label}
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                {link.desc}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Placeholder notice */}
      <div
        className={`rounded-xl p-4 text-sm ${
          darkMode
            ? "bg-yellow-900/20 text-yellow-300 border border-yellow-800"
            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
        }`}>
        ⚠️ Dashboard ini masih dummy. Statistik akan otomatis terisi setelah
        tabel <code>books</code>, <code>members</code>, dan{" "}
        <code>transactions</code> dibuat di Supabase.
      </div>
    </div>
  );
};

export default DashboardPerpus;
