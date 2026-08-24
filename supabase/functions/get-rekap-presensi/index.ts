// supabase/functions/get-rekap-presensi/index.ts
// Fungsi ini jalan di project Aplikasi TU.
// Tugasnya: jembatan antara frontend TU (browser) dan function di project Guru.
// Frontend TU manggil function ini, function ini yang manggil ke project Guru
// pake shared secret (yang disimpen di server, ga pernah kekirim ke browser).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ✅ 1. Ambil parameter dari frontend TU
    const { class_id, academic_year_id, semester } = await req.json();

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

    // ✅ 2. Forward request ke function di project Guru, pake shared secret
    const guruFunctionUrl = Deno.env.get("GURU_FUNCTION_URL")!;
    const internalSecret = Deno.env.get("INTERNAL_SECRET")!;

    const response = await fetch(guruFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": internalSecret,
      },
      body: JSON.stringify({ class_id, academic_year_id, semester }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error dari Guru function:", result);
      return new Response(
        JSON.stringify({
          error: result.error || "Gagal mengambil data dari Aplikasi Guru",
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ✅ 3. Balikin hasilnya ke frontend TU
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan server" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
