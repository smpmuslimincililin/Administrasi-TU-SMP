// AttendanceMain.js (TU MONITORING VERSION - Read Only, No Tabs)
// ✅ Versi TU: langsung nampilin rekap presensi, TIDAK ada tab Input/Preview/Export.
// Data ditarik dari Aplikasi Guru lewat Edge Function proxy (get-rekap-presensi).
// Dropdown filter (kelas, tahun ajaran) query langsung ke database TU sendiri.
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";

// URL Edge Function proxy di project TU
const REKAP_PRESENSI_URL =
  "https://oavfjrvbvmmpcmsqcycz.supabase.co/functions/v1/get-rekap-presensi";

const AttendanceMain = ({ user, onShowToast, darkMode }) => {
  // ========== STATE ==========
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedJenjang, setSelectedJenjang] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");

  const [rekapData, setRekapData] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingRekap, setLoadingRekap] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ========== LOAD DROPDOWN OPTIONS (lokal, dari DB TU) ==========
  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const [classesRes, yearsRes] = await Promise.all([
          supabase
            .from("classes")
            .select("id, grade, academic_year")
            .eq("is_active", true)
            .order("id", { ascending: true }),
          supabase
            .from("academic_years")
            .select("id, year, semester, is_active")
            .order("year", { ascending: false })
            .order("semester", { ascending: false }),
        ]);

        if (classesRes.error) throw classesRes.error;
        if (yearsRes.error) throw yearsRes.error;

        setClasses(classesRes.data || []);
        setAcademicYears(yearsRes.data || []);

        const activeYear = (yearsRes.data || []).find((y) => y.is_active);
        if (activeYear) {
          setSelectedAcademicYearId(activeYear.id);
        }
      } catch (error) {
        console.error("❌ Gagal load filter:", error);
        if (onShowToast) {
          onShowToast("Gagal memuat daftar kelas / tahun ajaran", "error");
        }
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, [onShowToast]);

  // ========== FETCH REKAP DARI APLIKASI GURU (via proxy) ==========
  const fetchRekap = useCallback(async () => {
    if (!selectedClass || !selectedAcademicYearId) {
      setRekapData([]);
      return;
    }

    const selectedYear = academicYears.find(
      (y) => y.id === selectedAcademicYearId,
    );
    if (!selectedYear) return;

    setLoadingRekap(true);
    setErrorMessage("");

    try {
      const response = await fetch(REKAP_PRESENSI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: selectedClass,
          academic_year_id: selectedAcademicYearId,
          semester: selectedYear.semester,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal mengambil data dari Aplikasi Guru",
        );
      }

      setRekapData(result.data || []);
    } catch (error) {
      console.error("❌ Gagal fetch rekap presensi:", error);
      setErrorMessage(error.message || "Terjadi kesalahan saat mengambil data");
      setRekapData([]);
      if (onShowToast) {
        onShowToast(
          "Gagal mengambil data presensi dari Aplikasi Guru",
          "error",
        );
      }
    } finally {
      setLoadingRekap(false);
    }
  }, [selectedClass, selectedAcademicYearId, academicYears, onShowToast]);

  useEffect(() => {
    fetchRekap();
  }, [fetchRekap]);

  // ========== JENJANG (7/8/9) & FILTERED CLASS LIST ==========
  const jenjangList = [...new Set(classes.map((c) => c.grade))].sort(
    (a, b) => a - b,
  );
  const filteredClasses = classes.filter(
    (c) => String(c.grade) === String(selectedJenjang),
  );

  const handleJenjangChange = (value) => {
    setSelectedJenjang(value);
    setSelectedClass(""); // reset kelas tiap ganti jenjang
  };

  // ========== SUMMARY STATS ==========
  const totalSiswa = rekapData.length;
  const totalHadir = rekapData.reduce((sum, r) => sum + r.hadir, 0);
  const totalSakit = rekapData.reduce((sum, r) => sum + r.sakit, 0);
  const totalIzin = rekapData.reduce((sum, r) => sum + r.izin, 0);
  const totalAlpha = rekapData.reduce((sum, r) => sum + r.alpha, 0);

  const getPersentaseKehadiran = (row) => {
    const total = row.hadir + row.sakit + row.izin + row.alpha;
    if (total === 0) return 0;
    return Math.round((row.hadir / total) * 100);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          📊 Monitoring Presensi Siswa
        </h1>
        <p
          className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Data ditarik langsung dari Aplikasi Guru — khusus pemantauan, tidak
          dapat diedit dari sini.
        </p>
      </div>

      {/* Filters */}
      <div
        className={`rounded-2xl shadow-sm border p-4 sm:p-6 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Jenjang
            </label>
            <select
              value={selectedJenjang}
              onChange={(e) => handleJenjangChange(e.target.value)}
              disabled={loadingFilters}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 ${
                darkMode
                  ? "bg-gray-900 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}>
              <option value="">-- Pilih Jenjang --</option>
              {jenjangList.map((g) => (
                <option key={g} value={g}>
                  Kelas {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={loadingFilters || !selectedJenjang}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 ${
                darkMode
                  ? "bg-gray-900 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}>
              <option value="">
                {selectedJenjang ? "-- Pilih Kelas --" : "Pilih jenjang dulu"}
              </option>
              {filteredClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Tahun Ajaran & Semester
            </label>
            <select
              value={selectedAcademicYearId}
              onChange={(e) => setSelectedAcademicYearId(e.target.value)}
              disabled={loadingFilters}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 ${
                darkMode
                  ? "bg-gray-900 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}>
              <option value="">-- Pilih Tahun Ajaran --</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year} - Semester {y.semester}{" "}
                  {y.is_active ? "(Aktif)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div
          className={`rounded-xl p-4 text-sm border ${
            darkMode
              ? "bg-red-900/20 border-red-800 text-red-400"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Loading */}
      {loadingRekap && (
        <div
          className={`rounded-2xl shadow-sm border p-8 text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
          <div
            className={`animate-spin rounded-full h-10 w-10 border-b-4 mx-auto mb-3 ${
              darkMode ? "border-blue-400" : "border-blue-600"
            }`}></div>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Mengambil data dari Aplikasi Guru...
          </p>
        </div>
      )}

      {/* Empty state - belum pilih filter */}
      {!loadingRekap && (!selectedClass || !selectedAcademicYearId) && (
        <div
          className={`rounded-2xl shadow-sm border p-8 text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
          <div
            className={`text-5xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
            📋
          </div>
          <p
            className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Pilih kelas dan tahun ajaran untuk melihat rekap presensi
          </p>
        </div>
      )}

      {/* Empty state - filter dipilih tapi data kosong */}
      {!loadingRekap &&
        selectedClass &&
        selectedAcademicYearId &&
        rekapData.length === 0 &&
        !errorMessage && (
          <div
            className={`rounded-2xl shadow-sm border p-8 text-center ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}>
            <div
              className={`text-5xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
              📭
            </div>
            <p
              className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Belum ada data presensi untuk kelas dan periode ini
            </p>
          </div>
        )}

      {/* Summary Stats */}
      {!loadingRekap && rekapData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            className={`rounded-2xl shadow-sm border p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}>
            <p
              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Total Siswa
            </p>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {totalSiswa}
            </p>
          </div>
          <div
            className={`rounded-2xl shadow-sm border p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}>
            <p
              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Total Hadir
            </p>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
              {totalHadir}
            </p>
          </div>
          <div
            className={`rounded-2xl shadow-sm border p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}>
            <p
              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Sakit / Izin
            </p>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
              {totalSakit} / {totalIzin}
            </p>
          </div>
          <div
            className={`rounded-2xl shadow-sm border p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}>
            <p
              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Total Alpha
            </p>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}>
              {totalAlpha}
            </p>
          </div>
        </div>
      )}

      {/* Table Rekap Per Siswa */}
      {!loadingRekap && rekapData.length > 0 && (
        <div
          className={`rounded-2xl shadow-sm border overflow-hidden ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={darkMode ? "bg-gray-900/50" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`text-left px-4 py-3 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    NIS
                  </th>
                  <th
                    className={`text-left px-4 py-3 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    Nama Siswa
                  </th>
                  <th
                    className={`text-center px-4 py-3 font-semibold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}>
                    Hadir
                  </th>
                  <th
                    className={`text-center px-4 py-3 font-semibold ${
                      darkMode ? "text-amber-400" : "text-amber-600"
                    }`}>
                    Sakit
                  </th>
                  <th
                    className={`text-center px-4 py-3 font-semibold ${
                      darkMode ? "text-amber-400" : "text-amber-600"
                    }`}>
                    Izin
                  </th>
                  <th
                    className={`text-center px-4 py-3 font-semibold ${
                      darkMode ? "text-red-400" : "text-red-600"
                    }`}>
                    Alpha
                  </th>
                  <th
                    className={`text-center px-4 py-3 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    % Hadir
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {rekapData.map((row) => {
                  const persentase = getPersentaseKehadiran(row);
                  return (
                    <tr
                      key={row.student_id}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-gray-900/30" : "hover:bg-gray-50"
                      }`}>
                      <td
                        className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {row.nis}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                        {row.full_name}
                      </td>
                      <td
                        className={`px-4 py-3 text-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        {row.hadir}
                      </td>
                      <td
                        className={`px-4 py-3 text-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        {row.sakit}
                      </td>
                      <td
                        className={`px-4 py-3 text-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        {row.izin}
                      </td>
                      <td
                        className={`px-4 py-3 text-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        {row.alpha}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            persentase < 70
                              ? darkMode
                                ? "bg-red-900/30 text-red-400"
                                : "bg-red-100 text-red-700"
                              : darkMode
                                ? "bg-green-900/30 text-green-400"
                                : "bg-green-100 text-green-700"
                          }`}>
                          {persentase}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceMain;
