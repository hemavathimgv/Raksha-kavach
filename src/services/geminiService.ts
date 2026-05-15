import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSafetyQuiz(taskName: string): Promise<QuizQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 multiple-choice safety quiz questions for a worker performing: ${taskName}. 
      The questions should focus on safety protocols, hazard identification, and proper PPE usage for this specific job.
      Each question must have exactly 4 options.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of exactly 4 possible answers"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "The index (0-3) of the correct answer in the options array"
              }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(response.text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback static questions if AI fails
    return [
      {
        id: "fallback-1",
        question: `What is the most important rule for ${taskName}?`,
        options: ["Work fast", "Wear your PPE", "Ignore signs", "Work alone"],
        correctAnswer: 1
      }
    ];
  }
}
