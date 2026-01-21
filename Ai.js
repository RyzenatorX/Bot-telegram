// ai.js

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const materials = [
  {
    intent: "rename_apk",
    patterns: [
      "rename apk",
      "ubah nama apk",
      "ganti nama aplikasi",
      "rename aplikasi android",
      "ubah nama aplikasi"
    ],
    response: `📦 *Cara Rename APK*

🔗 Materi: 
Isi sendiri

🔧 Tools:
• APK Editor
• MT Manager

📌 Bisa tanpa PC & root`
  },
  {
    intent: "decompile_apk",
    patterns: [
      "decompile apk",
      "extract apk",
      "bongkar apk",
      "edit apk"
    ],
    response: `🛠️ *Decompile APK*

🔗 Tutorial:
Isi sendiri

Tools:
• JADX
• APKTool
• MT Manager`
  }
];

function getAIResponse(text) {
  const clean = normalize(text);

  for (const mat of materials) {
    for (const p of mat.patterns) {
      if (clean.includes(normalize(p))) {
        return mat.response;
      }
    }
  }

  return null;
}

module.exports = { getAIResponse };
