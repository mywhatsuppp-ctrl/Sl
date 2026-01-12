import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In production, this key should be proxied or handled securely.
// For this environment, we rely on the injected process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPedagogyAdvice = async (query: string, language: string): Promise<string> => {
  try {
    const systemPrompt = `
      You are a Senior Educationist and Master Trainer for the Elementary & Secondary Education Department, 
      Government of Khyber Pakhtunkhwa (Pakistan). 
      Your role is to assist 'School Leaders' (mentors) in improving teaching quality.
      
      Context:
      - The user is a School Leader in a rural or urban school in KP.
      - They need practical, low-resource teaching strategies.
      - They might ask about classroom management, multigrade teaching, or Student Learning Outcomes (SLOs).
      - If the user asks in Urdu, reply in Urdu. If English, reply in English.
      - Keep answers concise, actionable, and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'ur' 
      ? "معاف کیجئے، ابھی رابطہ ممکن نہیں ہے۔ برائے مہربانی اپنا انٹرنیٹ چیک کریں۔"
      : "Sorry, I cannot connect to the knowledge base right now. Please check your internet.";
  }
};