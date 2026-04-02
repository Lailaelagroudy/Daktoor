export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم أستطع الإجابة.';
    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
```

4. Scroll down → click **"Commit changes"**

---

## Step 3 — Update `index.html` on GitHub

1. Click `index.html` → click ✏️ to edit
2. Press **Ctrl+F** (or Cmd+F on Mac) and search for this exact line:
```
const reply = data.content?.[0]?.text || 'لم أستطع الإجابة. حاول مرة أخرى.';
```

3. Replace it with:
```
const reply = data.text || 'لم أستطع الإجابة. حاول مرة أخرى.';
```

4. Now search for this line:
```
body: JSON.stringify({
