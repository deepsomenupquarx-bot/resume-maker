import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

const MODEL_NAME = "gemini-3-flash-preview";

export async function enhanceDescription(text: string) {
  if (!text) return "";
  
  const prompt = `Act as a professional resume writer. Rewrite the following resume experience description to be more impactful, action-oriented, and quantified. Keep it concise in bullet points if possible.
  
  Original: ${text}
  
  Enhanced:`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    return result.text || text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return text;
  }
}

export async function suggestSkills(experience: string) {
  if (!experience) return [];
  
  const prompt = `Based on this work experience description, suggest 5-8 relevant technical and soft skills. Return ONLY the skills as a comma-separated list.
  
  Experience: ${experience}
  
  Skills:`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });
    const text = result.text;
    if (!text) return [];
    return text.split(",").map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return [];
  }
}
