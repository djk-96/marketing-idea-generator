export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { business, audience, goal } = req.body;

    const prompt = `
Generate marketing ideas for:

Business: ${business}
Audience: ${audience}
Goal: ${goal}

Return structured, actionable marketing ideas.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();

    console.log("FULL GROQ RESPONSE:", JSON.stringify(data, null, 2));
    
    const result =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.message?.content ||
      data?.error?.message ||
      JSON.stringify(data);

    return res.status(200).json({ result });

  } catch (error) {
    console.error("Backend error:", error);

    return res.status(500).json({
      result: "Server error",
      error: error.message
    });
  }
}
