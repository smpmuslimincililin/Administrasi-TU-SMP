//[file name]: pengembalian.js
import React from "react";

const Pengembalian = ({ darkMode = false }) => {
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
                d="M13 8l4 4m0 0l-4 4m4-4H3m10-4v1a3 3 0 003 3h5a3 3 0 003-3V7a3 3 0 00-3-3h-5a3 3 0 00-3 3v1"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Pengembalian</h1>
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
            Fitur Pengembalian buku (catat pengembalian, denda keterlambatan)
            akan ditambahkan di sini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pengembalian;
