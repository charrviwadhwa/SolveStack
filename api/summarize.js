
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { question } = req.body;
  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a valid DSA question." });
  }

  const prompt = `
You're a helpful DSA assistant.

A user has asked the following coding/data structures question:

"${question}"

Please explain:
1. The brute-force approach
2. The optimal approach
3. Time and space complexity
4. Suggest a similar problem AND provide a clickable Markdown link to it, like:
   [Problem Name](https://leetcode.com/problems/xyz)

Respond using Markdown formatting.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);
    const response = result.response.text();

    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "Failed to generate explanation." });
  }
}
