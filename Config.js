module.exports = {

  // ==============================
  // TOKEN BOT (dari BotFather)
  // ==============================
  BOT_TOKEN: "ISI_TOKEN_BOT_DI_SINI",

  // ==============================
  // ADMIN BOT
  // isi USERNAME TANPA "@"
  // ==============================
  ADMIN_USERNAMES: [
    "kenziewhangsaff",
    "Mmarccrash",
    "HMEI81"
  ],

  // ==============================
  // SPAM CONFIG
  // ==============================
  SPAM_THRESHOLD: 3, // pesan sama berturut-turut

  // ==============================
  // KATA KASAR / JOROK
  // (lowercase semua)
  // ==============================
  BAD_WORDS: [

    // ===== KASAR UMUM =====
    "anjing","anjir","asu","babi","bacot","bangke","bangsat","bajingan","bego","bitch",
    "bodoh","busuk","cacat","dumb","edan","fuck","gila","goblok","iblis","idiot",
    "kampang","kampret","keparat","kontol","kurang ajar","laknat","lonte","memek",
    "monyet","moron","motherfucker","najis","ngentot","njir","pelacur","perek",
    "retard","sampah","saraf","setan","shit","sialan","stupid","sundal","tai","tolol",
    "brengsek",

    // ===== SINGKATAN / SAMARAN =====
    "anj","anjg","njg","asw","asu","bgst","bngst","gblk","glbk","tlol","bdh",
    "mmk","kntl","ktl","ngnt","pcn","prk","sdal","lont","setn","ibl",
    "fk","fck","sht","dmn","mfk","bstd",

    // ===== ANGKA / VARIASI =====
    "anj69","kntl69","mmk69","gblk69","tlol69","ngnt69","pcn69",
    "anj_","kntl_","mmk_","gblk_","tlol_","ngnt_",

    // ===== DISAMARKAN =====
    "k0nt0l","kntl","kntol","k0ntl","knt0l",
    "m3m3k","m3mek","mmek","mmk",
    "aNj1Ng","4nj1ng","anj1ng",
    "g0bl0k","gblk","glbk",
    "t0l0l","tl0l","tll"
  ],

  // ==============================
  // STICKER TERLARANG
  // (isi FILE_ID stiker jomok)
  // ==============================
  BAD_STICKERS: [
    // "CAACAgUAAxkBAAE..."
  ],

  // ==============================
  // LINK TERLARANG
  // ==============================
  BAD_LINKS: [
    /t\.me\/joinchat/i,
    /t\.me\/\+/i,
    /t\.me\/\w+/i
  ]

};
