const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

// Initialize the Gemini client using the environment variable GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'Missing or invalid chat history.' });
    }

    // Define Aria's empathetic system persona
    const systemInstruction = `You are Aria, an empathetic AI companion on a mental health platform called SomeTalk.
Your goal is to provide a non-judgmental, soothing, and supportive safe space for users.
You are NOT a licensed therapist and cannot provide medical advice, but you can listen, validate feelings, suggest grounding exercises, and offer a comfortable presence.
Always keep your answers relatively concise, warm, and highly conversational. Avoid sounding like a transactional robot or reciting long bulleted lists unless explicitly asked for a list. Be extremely human-like, gentle, and reflective. If a user expresses immediate danger or severe self-harm, gently encourage them to reach out to the crisis resources on the page.`;

    // The SDK requires history format to be an array of objects with `role` and `parts` (e.g. { role: 'user', parts: [{ text: '...' }] })
    // We will convert our frontend format into the format Gemini expects.
    let contents = history.map(msg => ({
      role: msg.role === 'aria' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Make the call to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Slightly creative but grounded
      }
    });

    // Send the response back to the client
    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process request with AI.' });
  }
};
