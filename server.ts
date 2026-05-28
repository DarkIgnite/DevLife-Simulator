import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getLocalFirstPhase, getLocalNextPhase } from "./server-fallback";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Google Gen AI to prevent start-up failure in environments without keys
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not set. High-fidelity local simulation fallbacks will be used.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// JSON API Route: Generate First Career Phase
app.post("/api/generate-first-phase", async (req, res) => {
  const profile = req.body.profile;
  try {
    if (!profile) {
      return res.status(400).json({ error: "Profile details are required." });
    }

    const ai = getAiClient();
    if (!ai) {
      console.log("No Gemini API key detected. Running high-fidelity local fallback generator for Year 1.");
      const fallbackData = getLocalFirstPhase(profile);
      return res.json(fallbackData);
    }

    const systemPrompt = `Kamu adalah mesin narasi inti dari 'DevLife Simulator', sebuah simulator perjalanan karier RPG teks beresolusi tinggi, sinematik, dan imersif.
Nada bicaramu realistis, menyenangkan, imersif, sedikit sarkastik, dan terinspirasi oleh tulisan editorial teknologi berkualitas tinggi (seperti estetika desain Notion, Linear, Vercel).
Selalu tulis narasi dalam sudut pandang orang kedua: 'Kamu...'.
Teks harus sepenuhnya ditulis dalam Bahasa Indonesia yang mengalir kasual, santai tapi cerdas, modern, dan sangat relevan dengan keseharian anak IT / developer di Indonesia. Hindari bahasa yang terlalu kaku, formal, atau akademis seperti buku pelajaran sekolah atau situs pemerintah. Gabungkan istilah teknis bahasa Inggris secara natural (seperti refactoring, codebase, deploy, meeting, tech stack, dll.) tanpa dipaksakan.
Analisis profil awal pengguna dan hasilkan fase karier PERTAMA mereka (Tahun 1: Perjuangan Awal / The Entry Grind).
Pastikan Kamu mematuhi batasan. Narasi harus terasa spesifik, dramatis, dan taktil. Jangan berikan format markdown apa pun di luar JSON; kembalikan JSON murni.`;

    const userPrompt = `Hasilkan Fase Karier Tahun 1 untuk seorang lulusan dengan profil:
- Jurusan/Spesialisasi: ${profile.major}
- Kebiasaan: ${profile.habits}
- Gaya Kerja / Koping: ${profile.coping}
- Filosofi / Visi Karier: ${profile.philosophy}

Pilihlah situasi perusahaan yang menarik dan sesuai dengan pilihan mereka (misalnya, jika startup kecil yang kacau, tempatkan mereka dalam skenario kode warisan yang rusak dan intensitas tinggi; jika raksasa korporat, tempatkan mereka dalam rapat tanpa akhir dan konfigurasi sistem warisan lama), disesuaikan dengan lanskap teknologi lokal/global yang relevan bagi developer Indonesia.

Hitung penyesuaian dampak statistik awal yang akan diterapkan (antara -25 dan +25 masing-masing) untuk:
- Money (Uang)
- Stress (Tingkat Stress)
- Coding Skill (Skill Coding)
- Reputation (Reputasi)
- Motivation (Motivasi)

Berikan tepat 3 pilihan percabangan yang menarik dan dramatis (A, B, dan C) yang menunjukkan bagaimana mereka bereaksi terhadap situasi Tahun 1 ini. Setiap pilihan harus memiliki teks opsi yang jelas dan teks vibe emosional singkat (flavorText dalam bahasa Indonesia).`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: systemPrompt },
          { text: userPrompt }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["year", "title", "narrative", "statChanges", "choices"],
            properties: {
              year: { type: Type.STRING, description: "Should be 'Year 1'" },
              title: { type: Type.STRING, description: "Compelling and poetic subtitle for Year 1 (e.g. 'The Legacy Crucible')" },
              narrative: { type: Type.STRING, description: "Detailed narrative in the 2nd person (120-180 words)" },
              statChanges: {
                type: Type.OBJECT,
                required: ["money", "stress", "codingSkill", "reputation", "motivation"],
                properties: {
                  money: { type: Type.INTEGER, description: "Adjustment to Money stat" },
                  stress: { type: Type.INTEGER, description: "Adjustment to Stress stat" },
                  codingSkill: { type: Type.INTEGER, description: "Adjustment to Coding Skill stat" },
                  reputation: { type: Type.INTEGER, description: "Adjustment to Reputation stat" },
                  motivation: { type: Type.INTEGER, description: "Adjustment to Motivation stat" }
                }
              },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["id", "text", "flavorText"],
                  properties: {
                    id: { type: Type.STRING, description: "Either 'A', 'B', or 'C'" },
                    text: { type: Type.STRING, description: "The literal choice text" },
                    flavorText: { type: Type.STRING, description: "1-sentence context/consequence expectation" }
                  }
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text?.trim() || "{}");
      if (!data.year || !data.title || !data.narrative) {
        throw new Error("Invalid response schema generated by Gemini.");
      }
      return res.json(data);
    } catch (apiError: any) {
      console.warn("Gemini API generation failed. Engaging local high-fidelity fallback generator.", apiError);
      const fallbackData = getLocalFirstPhase(profile);
      return res.json(fallbackData);
    }
  } catch (error: any) {
    console.error("Critical error in /api/generate-first-phase:", error);
    try {
      const fallbackData = getLocalFirstPhase(profile || {});
      return res.json(fallbackData);
    } catch (fatalExc) {
      res.status(500).json({ error: error.message || "Failed to generate first career phase." });
    }
  }
});

// JSON API Route: Generate Next Career Phase or Ending
app.post("/api/generate-next-phase", async (req, res) => {
  const { profile, currentStats, history, nextPhaseIndex } = req.body;
  try {
    // nextPhaseIndex mapping:
    // 1 -> Year 3: Seniority & The Mid-Career Crossroads
    // 2 -> Year 5: Side Projects & Viral Hustles, or Startup Pivots
    // 3 -> Year 10: Elite Status / Layoff and Reinvention
    // 4 -> Year 15: The Ultimate Legacy (Ending Phase)

    const isEnding = nextPhaseIndex >= 4;
    const yearMapping = ["Year 1", "Year 3", "Year 5", "Year 10", "Year 15 (Ending)"];
    const targetYear = yearMapping[nextPhaseIndex] || `Year ${nextPhaseIndex * 3}`;

    const ai = getAiClient();
    if (!ai) {
      console.log(`No Gemini API key detected. Running high-fidelity local next-phase generator for Index ${nextPhaseIndex}.`);
      const fallbackData = getLocalNextPhase(profile || {}, currentStats || {}, history || [], nextPhaseIndex);
      return res.json(fallbackData);
    }

    const systemPrompt = `Kamu adalah mesin narasi dari 'DevLife Simulator', sebuah RPG karier sinematik.
Semua teks yang dihasilkan (nama tahun, judul, narasi, teks pilihan, tipe akhir, dan pelajaran berharga) WAJIB ditulis dalam Bahasa Indonesia yang sangat natural, kasual-cerdas, mengalir santai tapi tetap premium, serta sangat relevan bagi anak IT/developer di Indonesia. Hindari penggunaan bahasa yang kaku seperti dokumen resmi pemerintah atau textbook akademis.
Analisis riwayat karier mereka, pilihan sebelumnya, dan statistik saat ini.
Terapkan dinamika korporat, startup, dan kehidupan developer yang realistis untuk ${targetYear}.
${isEnding 
  ? `Ini adalah WARISAN TERAKHIR (The Ultimate Legacy). Kamu harus menghasilkan laporan warisan seumur hidup mereka yang merangkum bagaimana akhir perjalanan mereka. Hasilkan:
Ending Archetype: Judul klasifikasi akhir yang keren, kasual-puitis, atau sedikit humoris dalam Bahasa Indonesia (misalnya: 'Solopreneur Zen', 'Developer Legendaris', 'VC Partner Ambisius', 'Penyintas Burnout', 'Nomad Digital Bebas').
Narrative: Tulis ulasan epik dan mendalam sepanjang 220-280 kata tentang dampak jangka panjang mereka dalam Bahasa Indonesia yang mengalir santai dan hidup, menceritakan di mana mereka sekarang berada, benda fisik apa saja yang ada di atas meja kerja kayu mereka, berapa banyak sisa rambut di kepala mereka, bahasa pemrograman apa yang akhirnya mereka cintai, dan gaya hidup digital mereka yang tenang atau gila.
3 pelajaran utama (lessons learned) yang ditarik dari keputusan karier mereka selama ini dalam bahasa Indonesia yang inspiratif namun santai.`
  : `Hasilkan narasi fase tahun karier yang normal dalam Bahasa Indonesia. Buat bercabang berdasarkan pilihan sebelumnya, statistik saat ini, dan karakteristik profil.
Tulis dalam sudut pandang orang kedua 'Kamu...' (120-180 kata). Berikan penyesuaian untuk nilai statistik dan 3 pilihan baru untuk Tahun ${targetYear === "Year 3" ? "3" : targetYear === "Year 5" ? "5" : "10"}.`
}
Jangan berikan format markdown apa pun di luar JSON; kembalikan JSON murni.`;

    const userPrompt = `
Profil Awal Pemain:
- Jurusan/Spesialisasi: ${profile.major}
- Kebiasaan: ${profile.habits}
- Gaya Kerja/Koping: ${profile.coping}
- Filosofi / Visi Karier: ${profile.philosophy}

Stats Saat Ini:
- Money (Uang/Gaji): ${currentStats.money}
- Stress (Tingkat Stress): ${currentStats.stress}
- Coding Skill (Skill Coding): ${currentStats.codingSkill}
- Reputation (Reputasi): ${currentStats.reputation}
- Motivation (Motivasi): ${currentStats.motivation}

Riwayat Perjalanan Karier Sejauh Ini:
${JSON.stringify(history, null, 2)}

Harap hasilkan ${isEnding ? "AKHIR KARIER YANG EPIK (The Ultimate Legacy)" : `fase narasi berikutnya yang menarik untuk ${targetYear}`}. Semua nilai teks harus dalam Bahasa Indonesia yang segar dan modern.`;

    const responseSchema = isEnding 
      ? {
          type: Type.OBJECT,
          required: ["year", "title", "narrative", "endingArchetype", "lessonsLearned"],
          properties: {
            year: { type: Type.STRING, description: "Should be 'The Ultimate Legacy'" },
            title: { type: Type.STRING, description: "The Final Legacy Title" },
            narrative: { type: Type.STRING, description: "The Epic long-term career narrative review (220-280 words)" },
            endingArchetype: { type: Type.STRING, description: "Archetype Name (e.g., 'The Zen Solopreneur')" },
            lessonsLearned: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 major career lessons learned"
            }
          }
        }
      : {
          type: Type.OBJECT,
          required: ["year", "title", "narrative", "statChanges", "choices"],
          properties: {
            year: { type: Type.STRING },
            title: { type: Type.STRING },
            narrative: { type: Type.STRING, description: "Highly engaging storytelling written in 2nd person (120-180 words)." },
            statChanges: {
              type: Type.OBJECT,
              required: ["money", "stress", "codingSkill", "reputation", "motivation"],
              properties: {
                money: { type: Type.INTEGER },
                stress: { type: Type.INTEGER },
                codingSkill: { type: Type.INTEGER },
                reputation: { type: Type.INTEGER },
                motivation: { type: Type.INTEGER }
              }
            },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "text", "flavorText"],
                properties: {
                  id: { type: Type.STRING, description: "Should be either 'A', 'B', or 'C'" },
                  text: { type: Type.STRING },
                  flavorText: { type: Type.STRING }
                }
              }
            }
          }
        };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: systemPrompt },
          { text: userPrompt }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const data = JSON.parse(response.text?.trim() || "{}");
      if (!data.year || !data.title || !data.narrative) {
        throw new Error("Invalid response schema generated by Gemini.");
      }
      if (isEnding) {
        data.isEnding = true;
      }
      return res.json(data);
    } catch (apiError: any) {
      console.warn("Gemini API generation failed. Engaging local high-fidelity fallback generator.", apiError);
      const fallbackData = getLocalNextPhase(profile || {}, currentStats || {}, history || [], nextPhaseIndex);
      return res.json(fallbackData);
    }
  } catch (error: any) {
    console.error("Critical error in /api/generate-next-phase:", error);
    try {
      const fallbackData = getLocalNextPhase(profile || {}, currentStats || {}, history || [], nextPhaseIndex);
      return res.json(fallbackData);
    } catch (fatalExc) {
      res.status(500).json({ error: error.message || "Failed to generate next career phase." });
    }
  }
});


// Dev vs Production static asset serving + Vite integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevLife SimulatorServer] Live and running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start custom Express server:", err);
});
