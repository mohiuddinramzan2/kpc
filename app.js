(() => {
  "use strict";

  const CONST = 16936517;
  const RING_CIRCUMFERENCE = 552.9; // 2 * π * 88, matches the SVG dial radius
  const TEX_FROM_NE = 590.5; // Tex = 590.5 / Ne, standard cotton-count conversion

  /* ============================================================
     i18n
     ============================================================ */
  const translations = {
    bn: {
      eyebrow: "সার্কুলার নিটিং মেশিন",
      title: "কাউন্টার হিসাব",
      subtitle: "প্রোডাকশন, নিডেল ও ফিটার — একসাথে হিসাব করুন",
      settings: "সেটিংস",
      language: "ভাষা",
      theme: "থিম",
      dark: "ডার্ক",
      light: "লাইট",
      fontsize: "ফন্ট সাইজ",
      small: "ছোট",
      medium: "মাঝারি",
      large: "বড়",
      "mode-forward": "কেজি → কাউন্টার",
      "mode-reverse": "কাউন্টার → কেজি",
      "setup-title": "মেশিন সেটআপ",
      nameplate: "নেমপ্লেট",
      dia: "ডায়া",
      "unit-inch": "(ইঞ্চি)",
      gauge: "গেজ",
      mtype: "মেশিন টাইপ",
      "mtype-unit": "(ফিটার সূত্রের জন্য)",
      standard: "স্ট্যান্ডার্ড",
      "dia-x3": "ডায়া × ৩",
      "dia-x3-6": "ডায়া × ৩ + ৬",
      yarn: "ইয়ার্ন কাউন্ট",
      sl: "এস.এল",
      "sl-unit": "(স্টিচ লেংথ)",
      missfeed: "মিস ফিটার",
      "missfeed-unit": "(যতগুলো ফিটার বাদ দিয়ে মেশিন চলছে)",
      "needle-count": "নিডেল সংখ্যা",
      "needle-formula": "ডায়া × গেজ × ৩.১৪",
      "feeder-eff": "ফিটার (কার্যকর)",
      "tf-title": "ফেব্রিক টাইটনেস",
      technical: "টেকনিক্যাল",
      "loop-length": "লুপ লেংথ",
      "loop-formula": "S.L ÷ ১০ (মিমি)",
      "tf-label": "টাইটনেস ফ্যাক্টর K",
      "tf-formula": "√Tex ÷ লুপ লেংথ(cm)",
      "input-title": "উৎপাদন তথ্য",
      "kg-label": "কাপড়ের ওজন",
      "unit-kg": "(কেজি)",
      "counter-label": "কাউন্টার রিডিং",
      "unit-round": "রাউন্ড",
      "time-toggle": "উৎপাদনের সময় হিসাব করুন",
      optional: "(ঐচ্ছিক)",
      "rpm-label": "মেশিন গতি",
      "meter-toggle": "মিটার হিসাব করুন",
      "cpc-label": "কোর্স পার সেমি",
      "cpc-unit": "(স্পেক বা মাপা মান)",
      "dial-total-counter": "মোট কাউন্টার",
      "dial-total-production": "মোট উৎপাদন",
      "unit-kg-plain": "কেজি",
      "formula-counter": "সূত্র: কাউন্টার = কেজি × ১৬,৯৩৬,৫১৭ × ইয়ার্ন কাউন্ট ÷ এস.এল ÷ নিডেল ÷ কার্যকর ফিটার",
      "formula-meter": "মিটার = কাউন্টার ÷ (কোর্স পার সেমি × ১০০)",
      // dynamic strings
      feederWarning: "মিস ফিটার মোট ফিটারের সমান বা বেশি — মান ঠিক করুন।",
      fillAll: "উপরের সব মান পূরণ করুন।",
      forwardNotePrefix: "সঠিক মান:",
      forwardNoteSuffix: "রাউন্ড — মেশিনের কাউন্টারে অন্তত এই সংখ্যক রাউন্ড সেট করুন।",
      reverseNoteSuffix: "রাউন্ড ঘুরলে আনুমানিক এই পরিমাণ কাপড় তৈরি হবে।",
      tfNoteText:
        "রেফারেন্স হিসেবে ব্যবহার করুন — একই মেশিন/আর্টিকেলের আগের ব্যাচের K মানের সাথে তুলনা করলে সবচেয়ে বেশি কাজে দেয়। সূত্রের রেফারেন্স ভেদে সংখ্যাগত রেঞ্জ ভিন্ন হতে পারে, তাই এটিকে পরম মান হিসেবে না ধরে তুলনামূলক (relative) নির্দেশক হিসেবে দেখুন।",
      timePrefix: "আনুমানিক সময় লাগবে:",
      hourWord: "ঘণ্টা",
      minuteWord: "মিনিট",
      meterPrefix: "আনুমানিক দৈর্ঘ্য:",
      meterWord: "মিটার",
    },
    en: {
      eyebrow: "Circular Knitting Machine",
      title: "Counter Calculator",
      subtitle: "Production, needle & feeder — all in one place",
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      dark: "Dark",
      light: "Light",
      fontsize: "Font size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      "mode-forward": "KG → Counter",
      "mode-reverse": "Counter → KG",
      "setup-title": "Machine setup",
      nameplate: "Nameplate",
      dia: "Dia",
      "unit-inch": "(inch)",
      gauge: "Gauge",
      mtype: "Machine type",
      "mtype-unit": "(for feeder formula)",
      standard: "Standard",
      "dia-x3": "Dia × 3",
      "dia-x3-6": "Dia × 3 + 6",
      yarn: "Yarn count",
      sl: "S.L",
      "sl-unit": "(stitch length)",
      missfeed: "Missed feeders",
      "missfeed-unit": "(how many feeders are skipped)",
      "needle-count": "Needle count",
      "needle-formula": "Dia × Gauge × 3.14",
      "feeder-eff": "Feeder (effective)",
      "tf-title": "Fabric tightness",
      technical: "Technical",
      "loop-length": "Loop length",
      "loop-formula": "S.L ÷ 10 (mm)",
      "tf-label": "Tightness factor K",
      "tf-formula": "√Tex ÷ loop length(cm)",
      "input-title": "Production info",
      "kg-label": "Fabric weight",
      "unit-kg": "(kg)",
      "counter-label": "Counter reading",
      "unit-round": "rounds",
      "time-toggle": "Calculate production time",
      optional: "(optional)",
      "rpm-label": "Machine speed",
      "meter-toggle": "Calculate length",
      "cpc-label": "Course per cm",
      "cpc-unit": "(spec or measured value)",
      "dial-total-counter": "Total counter",
      "dial-total-production": "Total production",
      "unit-kg-plain": "kg",
      "formula-counter": "Formula: Counter = KG × 16,936,517 × Yarn count ÷ S.L ÷ Needle ÷ Effective feeder",
      "formula-meter": "Meter = Counter ÷ (Course per cm × 100)",
      // dynamic strings
      feederWarning: "Missed feeders equal or exceed total feeders — please fix the value.",
      fillAll: "Fill in all the fields above.",
      forwardNotePrefix: "Exact value:",
      forwardNoteSuffix: "rounds — set the machine counter to at least this many rounds.",
      reverseNoteSuffix: "rounds will produce approximately this much fabric.",
      tfNoteText:
        "Use this as a reference — it's most useful compared against K values from earlier batches on the same machine/article. Numeric ranges vary by textbook convention, so treat it as a relative indicator rather than an absolute value.",
      timePrefix: "Estimated time needed:",
      hourWord: "hr",
      minuteWord: "min",
      meterPrefix: "Estimated length:",
      meterWord: "meters",
    },
  };

  let currentLang = "bn";
  const t = (key) => translations[currentLang][key] ?? key;

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach((elm) => {
      const key = elm.getAttribute("data-i18n");
      elm.textContent = t(key);
    });
    recalc();
  }

  /* ============================================================
     Helpers
     ============================================================ */
  const bnDigits = "০১২৩৪৫৬৭৮৯";

  /** Accepts Bengali or English digits and returns a float (NaN if empty/invalid). */
  function parseNum(raw) {
    if (raw == null) return NaN;
    const normalized = raw
      .trim()
      .split("")
      .map((ch) => {
        const i = bnDigits.indexOf(ch);
        return i > -1 ? String(i) : ch;
      })
      .join("")
      .replace(/,/g, "");
    if (normalized === "") return NaN;
    return parseFloat(normalized);
  }

  /** Formats a number with English thousand separators, fixed decimals. */
  function fmt(n, decimals = 0) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const el = (id) => document.getElementById(id);

  const inputs = {
    dia: el("dia"),
    gauge: el("gauge"),
    yarn: el("yarn"),
    sl: el("sl"),
    missfeed: el("missfeed"),
    kg: el("kg"),
    counter: el("counter"),
    rpm: el("rpm"),
    cpc: el("cpc"),
  };

  const outs = {
    needle: el("out-needle"),
    feeder: el("out-feeder"),
    feederFormula: el("out-feeder-formula"),
    result: el("out-result"),
    note: el("out-note"),
    time: el("out-time"),
    loop: el("out-loop"),
    tf: el("out-tf"),
    tfNote: el("out-tf-note"),
    meter: el("out-meter"),
  };

  const dialRing = document.querySelector(".dial-ring-spin");
  const modeReverseRadio = el("mode-reverse");

  function currentMode() {
    return modeReverseRadio.checked ? "reverse" : "forward";
  }

  function machineType() {
    return el("mtype-mayer").checked ? "mayer" : "standard";
  }

  function setRing(fraction) {
    const clamped = Math.max(0, Math.min(1, isFinite(fraction) ? fraction : 0));
    const offset = RING_CIRCUMFERENCE * (1 - clamped);
    dialRing.style.strokeDashoffset = String(offset);
  }

  /* ============================================================
     Core calculations
     ============================================================ */
  function recalc() {
    document.body.classList.toggle("mode-reverse", currentMode() === "reverse");

    const dia = parseNum(inputs.dia.value);
    const gauge = parseNum(inputs.gauge.value);
    const yarn = parseNum(inputs.yarn.value);
    const sl = parseNum(inputs.sl.value);
    const missfeed = parseNum(inputs.missfeed.value) || 0;

    // --- Needle count: dia × gauge × 3.14 ---
    const needle = dia > 0 && gauge > 0 ? dia * gauge * 3.14 : NaN;
    outs.needle.textContent = isFinite(needle) ? fmt(needle, 1) : "—";

    // --- Feeder count: dia × 3 (+6 for Mayer & Cie), minus missed feeders ---
    const totalFeeder = dia > 0 ? dia * 3 + (machineType() === "mayer" ? 6 : 0) : NaN;
    outs.feederFormula.textContent = machineType() === "mayer" ? t("dia-x3-6") : t("dia-x3");

    let effectiveFeeder = isFinite(totalFeeder) ? totalFeeder - missfeed : NaN;
    let feederWarning = "";
    if (isFinite(effectiveFeeder) && effectiveFeeder <= 0) {
      feederWarning = t("feederWarning");
      effectiveFeeder = NaN;
    }

    outs.feeder.textContent = isFinite(effectiveFeeder)
      ? fmt(effectiveFeeder, 0) + (missfeed > 0 ? ` / ${fmt(totalFeeder, 0)}` : "")
      : "—";

    // ring shows how much of the machine's full feeder capacity is active
    setRing(isFinite(totalFeeder) && totalFeeder > 0 ? effectiveFeeder / totalFeeder : 0);

    // --- Tightness factor: K = √Tex ÷ loop length(cm) ---
    // Assumes "yarn count" is English cotton count (Ne) and S.L is stored in
    // 1/10 mm units (e.g. 28.5 = 2.85 mm loop length) — the loop length is
    // shown explicitly below so it can be sanity-checked against a measured sample.
    if (yarn > 0 && sl > 0) {
      const loopMm = sl / 10;
      const loopCm = sl / 100;
      const tex = TEX_FROM_NE / yarn;
      const tf = Math.sqrt(tex) / loopCm;
      outs.loop.textContent = fmt(loopMm, 2);
      outs.tf.textContent = fmt(tf, 1);
      outs.tfNote.textContent = t("tfNoteText");
    } else {
      outs.loop.textContent = "—";
      outs.tf.textContent = "—";
      outs.tfNote.textContent = "";
    }

    const readyBase = isFinite(needle) && isFinite(effectiveFeeder) && sl > 0 && yarn > 0;

    if (currentMode() === "forward") {
      const kg = parseNum(inputs.kg.value);
      if (readyBase && kg > 0) {
        const counter = (kg * CONST * yarn) / sl / needle / effectiveFeeder;
        outs.result.textContent = fmt(Math.floor(counter), 0);
        outs.note.textContent = feederWarning
          ? feederWarning
          : `${t("forwardNotePrefix")} ${fmt(counter, 3)} ${t("forwardNoteSuffix")}`;
        updateTime(counter);
        updateMeter(counter);
      } else {
        outs.result.textContent = "—";
        outs.note.textContent = feederWarning || t("fillAll");
        updateTime(NaN);
        updateMeter(NaN);
      }
    } else {
      const counter = parseNum(inputs.counter.value);
      if (readyBase && counter > 0) {
        const kg = (counter * sl * needle * effectiveFeeder) / (CONST * yarn);
        outs.result.textContent = fmt(kg, 2);
        outs.note.textContent = feederWarning
          ? feederWarning
          : `${fmt(counter, 0)} ${t("reverseNoteSuffix")}`;
        updateTime(counter);
        updateMeter(counter);
      } else {
        outs.result.textContent = "—";
        outs.note.textContent = feederWarning || t("fillAll");
        updateTime(NaN);
        updateMeter(NaN);
      }
    }
  }

  function updateTime(counterValue) {
    const rpm = parseNum(inputs.rpm.value);
    if (!isFinite(counterValue) || counterValue <= 0 || !(rpm > 0)) {
      outs.time.textContent = "";
      return;
    }
    const minutes = counterValue / rpm;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    const parts = [];
    if (h > 0) parts.push(`${h} ${t("hourWord")}`);
    parts.push(`${m} ${t("minuteWord")}`);
    outs.time.textContent = `${t("timePrefix")} ${parts.join(" ")}`;
  }

  // Meter = counter ÷ (course per cm × 100). Each machine rotation knits one course.
  function updateMeter(counterValue) {
    const cpc = parseNum(inputs.cpc.value);
    if (!isFinite(counterValue) || counterValue <= 0 || !(cpc > 0)) {
      outs.meter.textContent = "";
      return;
    }
    const meters = counterValue / (cpc * 100);
    outs.meter.textContent = `${t("meterPrefix")} ${fmt(meters, 2)} ${t("meterWord")}`;
  }

  /* ============================================================
     Settings: drawer, theme, font size, language — persisted
     ============================================================ */
  const STORAGE_KEY = "kpc-settings";

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveSettings(partial) {
    try {
      const current = loadSettings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
    } catch (e) {
      /* ignore storage errors (e.g. private mode) */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function applyFontSize(size) {
    document.documentElement.setAttribute("data-fontsize", size);
  }

  function initSettings() {
    const saved = loadSettings();

    currentLang = saved.lang === "en" ? "en" : "bn";
    el(currentLang === "en" ? "lang-en" : "lang-bn").checked = true;

    const theme = saved.theme === "light" ? "light" : "dark";
    el(theme === "light" ? "theme-light" : "theme-dark").checked = true;
    applyTheme(theme);

    const fontsize = ["small", "medium", "large"].includes(saved.fontsize) ? saved.fontsize : "medium";
    el(`font-${fontsize}`).checked = true;
    applyFontSize(fontsize);

    applyLanguage();
  }

  function wireSettingsDrawer() {
    const overlay = el("settings-overlay");
    const drawer = el("settings-drawer");
    const openBtn = el("settings-open");
    const closeBtn = el("settings-close");

    function open() {
      overlay.classList.add("open");
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
    }
    function close() {
      overlay.classList.remove("open");
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);

    document.querySelectorAll('input[name="lang"]').forEach((r) => {
      r.addEventListener("change", () => {
        currentLang = el("lang-en").checked ? "en" : "bn";
        saveSettings({ lang: currentLang });
        applyLanguage();
      });
    });

    document.querySelectorAll('input[name="theme"]').forEach((r) => {
      r.addEventListener("change", () => {
        const theme = el("theme-light").checked ? "light" : "dark";
        applyTheme(theme);
        saveSettings({ theme });
      });
    });

    document.querySelectorAll('input[name="font"]').forEach((r) => {
      r.addEventListener("change", () => {
        const size = el("font-small").checked ? "small" : el("font-large").checked ? "large" : "medium";
        applyFontSize(size);
        saveSettings({ fontsize: size });
      });
    });
  }

  /* ============================================================
     Wire up + init
     ============================================================ */
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", recalc);
  });
  document.querySelectorAll('input[name="mode"], input[name="mtype"]').forEach((r) => {
    r.addEventListener("change", recalc);
  });

  wireSettingsDrawer();
  initSettings();
})();
