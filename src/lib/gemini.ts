import { GoogleGenerativeAI } from '@google/generative-ai';


// Ensure API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function getGeminiResponse(prompt: string, subject: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const enhancedPrompt = `As an educational AI tutor, provide a detailed explanation for the following ${subject}-related question: ${prompt}. 
    Focus on clarity and accuracy, and if applicable, include step-by-step explanations.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw error; // Propagate the error to handle it in the component
  }
}