(() => {
  "use strict";

  const CONST = 16936517;
  const RING_CIRCUMFERENCE = 552.9; // 2 * π * 88, matches the SVG dial radius
  const TEX_FROM_NE = 590.5; // Tex = 590.5 / Ne, standard cotton-count conversion

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
    dialLabelSuffix: el("dial-label-suffix"),
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
    outs.feederFormula.textContent =
      machineType() === "mayer" ? "ডায়া × ৩ + ৬" : "ডায়া × ৩";

    let effectiveFeeder = isFinite(totalFeeder) ? totalFeeder - missfeed : NaN;
    let feederWarning = "";
    if (isFinite(effectiveFeeder) && effectiveFeeder <= 0) {
      feederWarning = "মিস ফিটার মোট ফিটারের সমান বা বেশি — মান ঠিক করুন।";
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
      outs.tfNote.textContent =
        "রেফারেন্স হিসেবে ব্যবহার করুন — একই মেশিন/আর্টিকেলের আগের ব্যাচের K মানের সাথে তুলনা করলে সবচেয়ে বেশি কাজে দেয়। সূত্রের রেফারেন্স ভেদে সংখ্যাগত রেঞ্জ ভিন্ন হতে পারে, তাই এটিকে পরম মান হিসেবে না ধরে তুলনামূলক (relative) নির্দেশক হিসেবে দেখুন।";
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
          : `সঠিক মান: ${fmt(counter, 3)} রাউন্ড — মেশিনের কাউন্টারে অন্তত এই সংখ্যক রাউন্ড সেট করুন।`;
        updateTime(counter);
        updateMeter(counter);
      } else {
        outs.result.textContent = "—";
        outs.note.textContent = feederWarning || "উপরের সব মান পূরণ করুন।";
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
          : `${fmt(counter, 0)} রাউন্ড ঘুরলে আনুমানিক এই পরিমাণ কাপড় তৈরি হবে।`;
        updateTime(counter);
        updateMeter(counter);
      } else {
        outs.result.textContent = "—";
        outs.note.textContent = feederWarning || "উপরের সব মান পূরণ করুন।";
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
    if (h > 0) parts.push(`${h} ঘণ্টা`);
    parts.push(`${m} মিনিট`);
    outs.time.textContent = `আনুমানিক সময় লাগবে: ${parts.join(" ")}`;
  }

  // Meter = counter ÷ (course per cm × 100). Each machine rotation knits one course.
  function updateMeter(counterValue) {
    const cpc = parseNum(inputs.cpc.value);
    if (!isFinite(counterValue) || counterValue <= 0 || !(cpc > 0)) {
      outs.meter.textContent = "";
      return;
    }
    const meters = counterValue / (cpc * 100);
    outs.meter.textContent = `আনুমানিক দৈর্ঘ্য: ${fmt(meters, 2)} মিটার`;
  }

  // wire up listeners
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", recalc);
  });
  document.querySelectorAll('input[name="mode"], input[name="mtype"]').forEach((r) => {
    r.addEventListener("change", recalc);
  });

  recalc();
})();
