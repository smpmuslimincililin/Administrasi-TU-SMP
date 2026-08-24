// supabase/functions/rekap-presensi/index.ts
// Fungsi GABUNGAN (Guru-side) — satu pintu buat semua kebutuhan presensi TU:
//   action: "rekap_semester"    -> rekap total hadir/sakit/izin/alpha per siswa, 1 semester
//   action: "monitoring_harian" -> status semua kelas + detail siswa absen, 1 tanggal
// HANYA baca data (SELECT), tidak pernah insert/update/delete.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ✅ 1. Cek shared secret
    const internalSecret = req.headers.get("x-internal-secret");
    const expectedSecret = Deno.env.get("INTERNAL_SECRET");

    if (!expectedSecret || internalSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const payload = await req.json();
    const action = payload.action || "rekap_semester"; // default: backward-compatible

    // ========================================================
    // ACTION 1: REKAP SEMESTER (per kelas, per semester)
    // ========================================================
    if (action === "rekap_semester") {
      const { class_id, academic_year_id, semester } = payload;

      if (!class_id || !academic_year_id || !semester) {
        return new Response(
          JSON.stringify({
            error: "class_id, academic_year_id, dan semester wajib diisi",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const { data, error } = await supabase
        .from("attendances")
        .select("student_id, status, students(full_name, nis)")
        .eq("class_id", class_id)
        .eq("academic_year_id", academic_year_id)
        .eq("semester", semester)
        .eq("type", "harian");

      if (error) throw error;

      const rekapMap = new Map();
      for (const row of data) {
        const studentId = row.student_id;
        const studentInfo = row.students;

        if (!rekapMap.has(studentId)) {
          rekapMap.set(studentId, {
            student_id: studentId,
            full_name: studentInfo?.full_name || "Tidak diketahui",
            nis: studentInfo?.nis || "-",
            hadir: 0,
            sakit: 0,
            izin: 0,
            alpha: 0,
          });
        }

        const entry = rekapMap.get(studentId);
        const status = (row.status || "").toLowerCase();
        if (status === "hadir") entry.hadir += 1;
        else if (status === "sakit") entry.sakit += 1;
        else if (status === "izin") entry.izin += 1;
        else if (status === "alpha" || status === "alpa") entry.alpha += 1;
      }

      const rekap = Array.from(rekapMap.values()).sort((a, b) =>
        a.full_name.localeCompare(b.full_name),
      );

      return new Response(JSON.stringify({ data: rekap }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ========================================================
    // ACTION 2: MONITORING HARIAN (semua kelas, 1 tanggal)
    // ========================================================
    if (action === "monitoring_harian") {
      const { date } = payload;

      if (!date) {
        return new Response(
          JSON.stringify({ error: "date wajib diisi (format YYYY-MM-DD)" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("id, grade")
        .eq("is_active", true)
        .order("id", { ascending: true });
      if (classesError) throw classesError;

      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("id, class_id, full_name")
        .eq("is_active", true);
      if (studentsError) throw studentsError;

      const totalSiswaPerKelas = new Map();
      for (const s of studentsData) {
        totalSiswaPerKelas.set(
          s.class_id,
          (totalSiswaPerKelas.get(s.class_id) || 0) + 1,
        );
      }

      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendances")
        .select("student_id, class_id, status, notes, students(full_name)")
        .eq("date", date)
        .eq("type", "harian");
      if (attendanceError) throw attendanceError;

      const attendanceByClass = new Map();
      for (const row of attendanceData) {
        if (!attendanceByClass.has(row.class_id)) {
          attendanceByClass.set(row.class_id, []);
        }
        attendanceByClass.get(row.class_id).push(row);
      }

      const result = classesData.map((kelas) => {
        const totalSiswa = totalSiswaPerKelas.get(kelas.id) || 0;
        const records = attendanceByClass.get(kelas.id) || [];
        const totalTercatat = records.length;

        let hadir = 0,
          sakit = 0,
          izin = 0,
          alpha = 0;
        const belumHadir = [];

        for (const r of records) {
          const status = (r.status || "").toLowerCase();
          if (status === "hadir") hadir += 1;
          else if (status === "sakit") {
            sakit += 1;
            belumHadir.push({
              full_name: r.students?.full_name || "-",
              status: "sakit",
              notes: r.notes || null,
            });
          } else if (status === "izin") {
            izin += 1;
            belumHadir.push({
              full_name: r.students?.full_name || "-",
              status: "izin",
              notes: r.notes || null,
            });
          } else if (status === "alpha" || status === "alpa") {
            alpha += 1;
            belumHadir.push({
              full_name: r.students?.full_name || "-",
              status: "alpha",
              notes: r.notes || null,
            });
          }
        }

        let statusKelas = "belum";
        if (totalTercatat > 0 && totalTercatat < totalSiswa)
          statusKelas = "sebagian";
        else if (totalTercatat > 0 && totalTercatat >= totalSiswa)
          statusKelas = "selesai";

        return {
          class_id: kelas.id,
          grade: kelas.grade,
          total_siswa: totalSiswa,
          total_tercatat: totalTercatat,
          status: statusKelas,
          hadir,
          sakit,
          izin,
          alpha,
          belum_hadir: belumHadir,
        };
      });

      return new Response(JSON.stringify({ date, data: result }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ========================================================
    // ACTION TIDAK DIKENALI
    // ========================================================
    return new Response(
      JSON.stringify({ error: `Action '${action}' tidak dikenali` }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan server" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
