//[file name]: katalog.js
import React from "react";

const KatalogBuku = ({ darkMode = false }) => {
  return (
    <div
      className={`min-h-full p-6 sm:p-8 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? "bg-blue-900" : "bg-blue-100"
            }`}>
            <svg
              className={`w-5 h-5 ${darkMode ? "text-blue-300" : "text-blue-700"}`}
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
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Katalog Buku</h1>
        </div>

        <p
          className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Halaman ini masih dalam pengembangan.
        </p>

        <div
          className={`rounded-xl border-2 border-dashed p-10 text-center ${
            darkMode
              ? "border-gray-700 bg-gray-800/50"
              : "border-gray-300 bg-white"
          }`}>
          <p className="font-semibold mb-1">🚧 Segera Hadir</p>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Fitur Katalog Buku (daftar, tambah, edit, hapus buku) akan
            ditambahkan di sini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KatalogBuku;
