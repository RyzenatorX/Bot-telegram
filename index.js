// ==============================
// AUTO INSTALL DEPENDENCY
// ==============================
const { execSync } = require("child_process");
const fs = require("fs");

if (!fs.existsSync("node_modules/telegraf")) {
  console.log("📦 Installing telegraf...");
  execSync("npm install telegraf", { stdio: "inherit" });
}

// ==============================
// REQUIRE SETELAH INSTALL
// ==============================
const { Telegraf } = require("telegraf");
const config = require("./config");
const { getAIResponse } = require("./ai");

// ==============================
// INIT BOT
// ==============================
const bot = new Telegraf(config.BOT_TOKEN);

// ==============================
// MEMORY SPAM
// ==============================
const messageMemory = new Map();

/**
 * Cek spam pesan sama berulang
 */
function isSpam(userId, text) {
  if (!text) return false;

  if (!messageMemory.has(userId)) {
    messageMemory.set(userId, []);
  }

  const history = messageMemory.get(userId);
  history.push(text);

  if (history.length > config.SPAM_THRESHOLD) {
    history.shift();
  }

  return history.every(msg => msg === text);
}

/**
 * Normalisasi kata (samaran)
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1!]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[5$]/g, "s")
    .replace(/[^a-z\s]/g, "");
}

/**
 * Cek kata kasar
 */
function containsBadWord(text) {
  const clean = normalize(text);
  return config.BAD_WORDS.some(word =>
    clean.includes(normalize(word))
  );
}

/**
 * Cek admin
 */
function isAdmin(ctx) {
  if (!ctx.from || !ctx.from.username) return false;
  return config.ADMIN_USERNAMES.includes(ctx.from.username);
}

// ==============================
// COMMAND /start
// ==============================
bot.start((ctx) => {
  ctx.reply(
`👋 Halo!

🤖 *Bot Moderation Aktif*
Bot ini menjaga grup agar tetap:
• Family Friendly
• Bebas spam
• Bebas kata kasar
• Bebas link ilegal

Ketik /help untuk info.`,
{ parse_mode: "Markdown" }
  );
});

// ==============================
// COMMAND /help
// ==============================
bot.command("help", (ctx) => {
  ctx.reply(
`📖 *BOT COMMANDS*

🛡️ Moderation (Auto)
• Anti spam pesan
• Filter kata kasar
• Filter stiker jomok
• Anti share link grup

⚙️ Info
• Bot berjalan otomatis
• Tidak perlu command khusus`,
{ parse_mode: "Markdown" }
  );
});

// ==============================
// HANDLER PESAN
// ==============================
bot.on("message", async (ctx) => {
  const msg = ctx.message;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;

  try {

    // Skip command
    if (msg.text && msg.text.startsWith("/")) return;

    // Link terlarang
    if (msg.text && config.BAD_LINKS.some(rx => rx.test(msg.text))) {
      await ctx.deleteMessage();
      console.log(`🗑️ Link deleted from ${username}`);
      return;
    }

    // Kata kasar
    if (msg.text && containsBadWord(msg.text)) {
      await ctx.deleteMessage();
      console.log(`🗑️ Bad word deleted from ${username}`);
      return;
    }

    // Stiker terlarang
    if (msg.sticker && config.BAD_STICKERS.includes(msg.sticker.file_id)) {
      await ctx.deleteMessage();
      console.log(`🗑️ Sticker deleted from ${username}`);
      return;
    }

    // Spam
    if (msg.text && isSpam(userId, msg.text)) {
      await ctx.deleteMessage();
      console.log(`🗑️ Spam deleted from ${username}`);
      return;
    }

  } catch (err) {
    console.error("⚠️ Error:", err.message);
  }

  // ==============================
// AI AUTO RESPONSE
// ==============================
if (msg.text) {
  const aiReply = getAIResponse(msg.text);
  if (aiReply) {
    await ctx.reply(aiReply, { parse_mode: "Markdown" });
    return;
  }
} 
});

// ==============================
// START BOT
// ==============================
bot.launch();
console.log("✅ Telegram Bot Aktif!");
