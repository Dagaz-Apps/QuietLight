/* Quiet Light — motion pass (Oct 29 2026). Vanilla, no libraries. */
(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "ql-motion-paused";
  function stored() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function store(v) { try { v ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); } catch (e) {} }
  var userPaused = stored();

  /* 1 · Icon glow + ambient lantern: one Pause control (remembered), and holds when
     off screen, when the tab is hidden, and after 3 min with no input. */
  var aura = doc.querySelector(".icon-aura[data-ql-glow]");
  var amb = doc.querySelector(".ql-ambient");
  var btn = doc.querySelector(".ql-motion-toggle");
  if ((aura || amb) && btn && !reduce) {
    var auraOff = false, ambOff = false, idle = false, it;
    var sync = function () {
      var hold = doc.hidden || idle;
      root.classList.toggle("motion-paused", userPaused);
      if (aura) aura.classList.toggle("is-paused", userPaused || auraOff || hold);
      if (amb) amb.classList.toggle("is-held", ambOff || hold);
      btn.setAttribute("aria-pressed", userPaused ? "true" : "false");
      btn.textContent = userPaused ? "Play motion" : "Pause motion";
    };
    var wake = function () {
      if (idle) { idle = false; sync(); }
      clearTimeout(it); it = setTimeout(function () { idle = true; sync(); }, 180000);
    };
    btn.addEventListener("click", function () { userPaused = !userPaused; store(userPaused); sync(); });
    doc.addEventListener("visibilitychange", sync);
    ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"].forEach(function (n) {
      addEventListener(n, wake, { passive: true });
    });
    if ("IntersectionObserver" in window) {
      if (aura) new IntersectionObserver(function (es) { auraOff = !es[0].isIntersecting; sync(); }).observe(aura);
      if (amb) new IntersectionObserver(function (es) { ambOff = !es[0].isIntersecting; sync(); }).observe(amb);
    }
    /* The glow settles after 60 s; the button stays while the ambient still loops. */
    if (aura) aura.addEventListener("animationend", function () { if (!amb) btn.hidden = true; });
    wake(); sync();
  } else if (btn) { btn.hidden = true; }

  /* 2 · Section headings rise once at 20% visible */
  var heads = doc.querySelectorAll(".ql-rise");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    heads.forEach(function (h) { io.observe(h); });
  } else { heads.forEach(function (h) { h.classList.add("is-in"); }); }

  /* 5 · Typing preview */
  var live = doc.querySelector(".typing-live");
  if (!live) return;
  var entryEl = live.querySelector(".typing-entry-text");
  var ctrl = doc.querySelector(".typing-control");
  var FULL = entryEl.textContent;
  var timer = null, state = "idle"; /* idle | typing | ended */
  function clear() { if (timer) { clearTimeout(timer); timer = null; } }
  function finish() {
    clear(); state = "ended";
    entryEl.textContent = FULL;
    live.classList.add("is-started", "is-reply-in", "is-instant");
    live.classList.remove("is-typing", "is-pre-reply");
    if (ctrl) ctrl.textContent = "Play again";
  }
  if (reduce || userPaused || !("IntersectionObserver" in window)) { finish(); if (ctrl && reduce) ctrl.hidden = true; return; }
  function delay(ch) { return ch === "," ? 320 : ch === "." ? 650 : ch === " " ? 60 : 48; }
  function play() {
    clear(); state = "typing";
    entryEl.textContent = "";
    live.classList.remove("is-reply-in", "is-instant");
    live.classList.add("is-started", "is-typing", "is-pre-reply");
    if (ctrl) ctrl.textContent = "Show full text";
    var i = 0;
    (function step() {
      if (i < FULL.length) {
        var ch = FULL.charAt(i++);
        entryEl.textContent = FULL.slice(0, i);
        timer = setTimeout(step, delay(ch));
      } else {
        live.classList.remove("is-typing");
        timer = setTimeout(function () {
          live.classList.add("is-reply-in"); live.classList.remove("is-pre-reply");
          state = "ended"; timer = null;
          if (ctrl) ctrl.textContent = "Play again";
        }, 700);
      }
    })();
  }
  if (ctrl) ctrl.addEventListener("click", function () { state === "ended" ? play() : finish(); });
  doc.addEventListener("visibilitychange", function () { if (doc.hidden && state !== "ended") finish(); });
  var seen = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting || state !== "idle") return;
    seen.disconnect();
    timer = setTimeout(play, 500);
  }, { threshold: 0.5 });
  seen.observe(live.closest(".typing-card") || live);
})();
