  const { Telegraf } = require("telegraf");
  const config = require("./config");

  const bot = new Telegraf(config.BOT_TOKEN); // inisialisasi bot

  const { execSync } = require("child_process");
  const fs = require("fs");

if (!fs.existsSync("node_modules/telegraf")) {
  console.log("📦 Installing telegraf...");
  execSync("npm install telegraf", { stdio: "inherit" });
}


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
   * Normalisasi kata
   * k0nt0l → kontol
   * k*n*t*l → knttl
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
   * Cek kata kasar + samaran
   */
  function containsBadWord(text) {
    const clean = normalize(text);
    return config.BAD_WORDS.some(word => clean.includes(normalize(word)));
  }

  // ==============================
  // CEK ADMIN
  // ==============================
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

      🤖 Bot Moderation Aktif
      Bot ini menjaga grup agar tetap:
      • Family Friendly
      • Bebas spam
      • Bebas kata kasar
      • Bebas link ilegal

      Ketik /help untuk melihat fitur.`
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
      • Tidak perlu command khusus

      👮 Admin
      • Admin bisa mengatur config langsung

      Bot ini dibuat untuk menjaga komunitas tetap nyaman.`,
      { parse_mode: "Markdown" }
        );
      });



      // ==============================
      // CALLBACK BUTTON
      // ==============================
      bot.on("callback_query", async (ctx) => {
        const data = ctx.callbackQuery.data;

        if (data === "help") {
          await ctx.answerCbQuery();
          await ctx.reply(
      `📖 *BANTUAN BOT*

      • Otomatis hapus kata kasar
      • Deteksi kata disamarkan
      • Anti spam pesan sama
      • Blok link terlarang

      Command:
      • /start - Tampilkan menu
      • /help - Bantuan`,
            { parse_mode: "Markdown" }
          );
        }

        if (data === "admin") {
          await ctx.answerCbQuery();
          await ctx.reply(
      `👮‍♂️ *ADMIN BOT*

      Admin hanya untuk pengawasan & maintenance.
      Jika pesanmu terhapus:
      👉 berarti melanggar aturan.`,
            { parse_mode: "Markdown" }
          );
        }
      });


  // ==============================
  // HANDLER PESAN
  // ==============================
  bot.on("message", async (ctx) => {

    const msg = ctx.message;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name;

    try {

      // ==============================
      // Skip command Telegram (/start, dll)
      // ==============================
      if (msg.text && msg.text.startsWith("/")) {
        return;
      }

      // ==============================
      // LINK TERLARANG
      // ==============================
      if (msg.text && config.BAD_LINKS.some(rx => rx.test(msg.text))) {
        await ctx.deleteMessage();
        console.log(`🗑️ Link deleted from ${username}`);
        return;
      }

      // ==============================
      // KATA KASAR
      // ==============================
      if (msg.text && containsBadWord(msg.text)) {
        await ctx.deleteMessage();
        console.log(`🗑️ Bad word deleted from ${username}`);
        return;
      }

      // ==============================
      // STICKER TERLARANG
      // ==============================
      if (msg.sticker && config.BAD_STICKERS.includes(msg.sticker.file_id)) {
        await ctx.deleteMessage();
        console.log(`🗑️ Sticker deleted from ${username}`);
        return;
      }

      // ==============================
      // SPAM PESAN SAMA
      // ==============================
      if (msg.text && isSpam(userId, msg.text)) {
        await ctx.deleteMessage();
        console.log(`🗑️ Spam deleted from ${username}`);
        return;
      }

    } catch (error) {
      console.error("⚠️ Error processing message:", error.message);
    }
  });

  // ==============================
  // START BOT (WAJIB DI LUAR HANDLER)
  // ==============================
  bot.launch();
  console.log("✅ Telegram Bot Aktif!");
