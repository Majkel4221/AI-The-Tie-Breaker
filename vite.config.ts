import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    try {
      const { decision, type, lang = 'pl' } = req.body;

      if (!decision) {
        return res.status(400).json({ error: "Decision prompt is required" });
      }

      const isEn = lang === 'en';
      let systemInstruction = "";

      if (isEn) {
        systemInstruction = `You are 'The Tie Breaker', a master decision analyst of legendary status. Help the user evaluate their decision carefully and objectively. You MUST respond entirely in ENGLISH. Use highly structured, aesthetically pleasing markdown, containing:
- Clean bullet lists or tables.
- Use emoji highlights for section headers or important keys (e.g. ✅/❌, 📈/📉).
- An executive style suitable for key stakeholders or personal clarity.
- IMPORTANT: At the very end, include the ultimate section: "### ⚖️ Final Verdict", where you deliver a definitive, logical recommendation to break the tie, based on the weighed factors. Make a firm choice or clear recommendation. Wrap this verdict in a markdown blockquote.`;

        if (type === 'pros-cons') {
          systemInstruction += " Provide a comprehensive pros and cons layout (Pros & Cons) with brief explanations of the weight of each factor.";
        } else if (type === 'comparison') {
          systemInstruction += " Show a beautiful comparison table evaluating multiple options against key criteria (e.g., cost, time, risk, impact). Ensure column headers are clear.";
        } else if (type === 'swot') {
          systemInstruction += " Formulate a comprehensive SWOT analysis in structured quadrants (Strengths, Weaknesses, Opportunities, Threats). Provide clear strategic takeaways.";
        }
      } else {
        systemInstruction = `You are 'The Tie Breaker', a master decision analyst of legendary status. Help the user evaluate their decision carefully and objectively. You MUST respond entirely in POLISH (Język polski). Use highly structured, aesthetically pleasing markdown, containing:
- Clean bullet lists or tables.
- Use emoji highlights for section headers or important keys (e.g. ✅/❌, 📈/📉).
- An executive style suitable for key stakeholders or personal clarity.
- IMPORTANT: At the very end, include the ultimate section: "### ⚖️ Werdykt (The Tie Breaker Verdict)", where you deliver a definitive, logical recommendation to break the tie, based on the weighed factors. Make a firm choice or clear recommendation. Wrap this verdict in a markdown blockquote.`;

        if (type === 'pros-cons') {
          systemInstruction += " Provide a comprehensive pros and cons layout (Zalety i Wady) with brief explanations of the weight of each factor.";
        } else if (type === 'comparison') {
          systemInstruction += " Show a beautiful comparison table evaluating multiple options against key criteria (e.g., koszt, czas, ryzyko, wpływ). Ensure column headers are clear.";
        } else if (type === 'swot') {
          systemInstruction += " Formulate a comprehensive SWOT analysis in structured quadrants (Mocne i Słabe strony, Szanse i Zagrożenia). Provide clear strategic takeaways.";
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: `Decision to analyze: ${decision}` }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
