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
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("Groq response error:", data);
      return res.status(500).json({ error: "Invalid AI response", raw: data });
    }

    return res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
