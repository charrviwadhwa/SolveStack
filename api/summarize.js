import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { question, languages = ["Python"] } = req.body;
  const langList = languages.join(", ");

  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a valid question" });
  }

  const prompt = `
You are a DSA tutor. Given the problem below, explain it in a beginner-friendly, well-structured way.


---

### Output Format:

## 1. Problem Summary
Briefly explain the problem in simple terms.

## 2. Input/Output and Constraints
- Input: ...
- Output: ...
- Constraints: ...

## 3. Brute-Force Solution

### Logic  
Explain the brute-force logic briefly.

### Code  
\`\`\`${langList.toLowerCase()}
# Add your code with 1-line comment describing the logic
\`\`\`

### Time and Space Complexity
- Time: ...
- Space: ...

## 4. Optimal Solution

### Logic  
Explain the optimal logic briefly.

### Code  
\`\`\`${langList.toLowerCase()}
# Add your optimal code with 1-line comment
\`\`\`

### Time and Space Complexity
- Time: ...
- Space: ...

## 5. Edge Cases
List any tricky edge cases that should be handled.

## 6. Similar Questions  
Give at least 3 relevant problems — from LeetCode, GeeksForGeeks, Codeforces, CodeChef, etc.
Format them as:
- [LeetCode: Problem Name](https://leetcode.com/problems/...)
- [GeeksForGeeks: Problem Name](https://www.geeksforgeeks.org/...)

---

Problem:
${question}
Language: ${langList}
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
