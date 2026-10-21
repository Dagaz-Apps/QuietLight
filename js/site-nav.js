(function () {
  var STORE_URL =
    "https://apps.apple.com/us/app/quiet-light-illuminations/id6759539902";
  var SUPPORT_EMAIL = "support@quietlight.app";

  var mainNav = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "changelog.html", label: "Updates" },
  ];

  // Pause is intentionally not listed — a quiet easter egg at pause.html
  // (noindex; discoverable via direct URL, README, and the 404 invitation).
  var subNav = [
    { href: "privacy.html", label: "Privacy" },
    { href: "terms.html", label: "Terms" },
    { href: "disclaimer.html", label: "Disclaimer" },
    { href: "safety.html", label: "Safety" },
    { href: "support.html", label: "Support" },
    { href: "delete-account.html", label: "Delete account" },
  ];

  var socialSvg = {
    x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25l-7.451 8.502L4.5 2.25H1.5l7.13 8.13L1.5 21.75h3l7.13-8.13L18.75 21.75h3l-7.13-8.13L21.75 2.25h-3.506z"/></svg>',
    instagram:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.23-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.07 3.118.346.676 2.79.4 6.735.345 8.015.333 8.423.333 12c0 3.577.012 3.985.067 5.265.276 3.945 2.718 6.389 6.653 6.665 1.28.057 1.688.069 4.948.069 3.259 0 3.668-.013 4.948-.069 3.935-.276 6.377-2.72 6.653-6.665.054-1.28.066-1.688.066-5.265 0-3.577-.012-3.985-.066-5.265-.276-3.945-2.718-6.389-6.653-6.665C15.667.014 15.259 0 12 0z"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>',
    tiktok:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z"/></svg>',
  };

  function currentPage() {
    var p = window.location.pathname.split("/").pop();
    return !p ? "index.html" : p;
  }

  function isActive(href) {
    return currentPage() === href;
  }

  function buildNav(links, linkClass) {
    return links
      .map(function (link) {
        var cls = linkClass + (isActive(link.href) ? " is-active" : "");
        return (
          '<a href="' +
          link.href +
          '" class="' +
          cls +
          '">' +
          link.label +
          "</a>"
        );
      })
      .join("");
  }

  function buildSubNav(links) {
    return links
      .map(function (link) {
        if (link.action === "support") {
          return (
            '<div class="site-support">' +
            '<button type="button" class="site-subnav-link site-support-trigger" ' +
            'aria-expanded="false" aria-controls="site-support-popover" ' +
            'aria-haspopup="dialog">' +
            link.label +
            "</button>" +
            '<div id="site-support-popover" class="site-support-popover" role="dialog" ' +
            'aria-label="Support email" hidden>' +
            '<p class="site-support-hint">Copy our address and paste it into whichever email app you use.</p>' +
            '<div class="site-support-email-row">' +
            '<code class="site-support-email">' +
            SUPPORT_EMAIL +
            "</code>" +
            '<button type="button" class="site-support-copy">Copy address</button>' +
            "</div>" +
            '<p class="site-support-status" aria-live="polite"></p>' +
            "</div></div>"
          );
        }
        var cls =
          "site-subnav-link" + (isActive(link.href) ? " is-active" : "");
        return (
          '<a href="' + link.href + '" class="' + cls + '">' + link.label + "</a>"
        );
      })
      .join("");
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) resolve();
        else reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function initSupportPopover(header) {
    var wrap = header.querySelector(".site-support");
    if (!wrap) return;

    var trigger = wrap.querySelector(".site-support-trigger");
    var popover = wrap.querySelector(".site-support-popover");
    var copyBtn = wrap.querySelector(".site-support-copy");
    var status = wrap.querySelector(".site-support-status");
    var copiedTimer;

    function setOpen(open) {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      popover.hidden = !open;
      if (!open) {
        status.textContent = "";
        clearTimeout(copiedTimer);
      }
    }

    function isOpen() {
      return trigger.getAttribute("aria-expanded") === "true";
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!isOpen());
    });

    copyBtn.addEventListener("click", function () {
      copyText(SUPPORT_EMAIL)
        .then(function () {
          status.textContent = "Copied! Paste it into your email app.";
          clearTimeout(copiedTimer);
          copiedTimer = setTimeout(function () {
            status.textContent = "";
          }, 3000);
        })
        .catch(function () {
          status.textContent =
            "Could not copy automatically — select the address above.";
        });
    });

    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (!wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        trigger.focus();
      }
    });
  }

  var skip = document.createElement("a");
  skip.href = "#main-content";
  skip.className = "skip-link";
  skip.textContent = "Skip to content";
  document.body.prepend(skip);

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<div class="site-header-main">' +
    '<div class="site-header-inner">' +
    '<a href="index.html" class="site-brand" aria-label="Quiet Light home">' +
    '<img src="images/icon-256.png" alt="" width="32" height="32" class="site-brand-icon" />' +
    "<span>Quiet Light</span></a>" +
    '<nav class="site-nav" aria-label="Main">' +
    buildNav(mainNav, "site-nav-link") +
    "</nav>" +
    '<div class="site-header-actions">' +
    '<div class="site-social" aria-label="Follow Quiet Light">' +
    '<span class="site-social-label">Follow</span>' +
    '<a href="https://x.com/QuietLightApp" class="site-social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow on X">' +
    socialSvg.x +
    "</a>" +
    '<a href="https://www.instagram.com/quietlightapp/" class="site-social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">' +
    socialSvg.instagram +
    "</a>" +
    '<a href="https://www.tiktok.com/@quietlightapp" class="site-social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow on TikTok">' +
    socialSvg.tiktok +
    "</a>" +
    "</div>" +
    '<a href="' +
    STORE_URL +
    '" class="site-cta" target="_blank" rel="noopener noreferrer">Get the app</a>' +
    "</div></div></div>" +
    '<div class="site-header-sub">' +
    '<nav class="site-subnav" aria-label="Site pages">' +
    buildSubNav(subNav) +
    "</nav></div>";
  document.body.prepend(header);
  document.body.classList.add("has-site-header");
  initSupportPopover(header);

  /* Keep body offset in sync with the real fixed header height (mobile stacks rows). */
  var headerResizeTimer;
  function syncHeaderOffset() {
    var h = Math.ceil(header.getBoundingClientRect().height);
    if (h > 0) {
      document.documentElement.style.setProperty("--site-header-h", h + "px");
    }
  }
  syncHeaderOffset();
  window.addEventListener("resize", function () {
    clearTimeout(headerResizeTimer);
    headerResizeTimer = setTimeout(syncHeaderOffset, 50);
  });
  if (window.ResizeObserver) {
    new ResizeObserver(syncHeaderOffset).observe(header);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderOffset);
  }
  window.addEventListener("load", syncHeaderOffset);

  var main =
    document.querySelector("main") || document.querySelector("#root main");
  if (main && !main.id) {
    main.id = "main-content";
  }

  var footer = document.querySelector("footer");
  if (!footer) {
    footer = document.createElement("footer");
    document.body.appendChild(footer);
  }
  footer.className = "site-footer";
  var year = new Date().getFullYear();
  footer.innerHTML =
    '<p class="site-footer-tagline ql-breath">Stillness is already complete.</p>' +
    '<nav class="site-footer-legal" aria-label="Legal">' +
    '<a href="privacy.html">Privacy</a>' +
    '<span aria-hidden="true">·</span>' +
    '<a href="terms.html">Terms</a>' +
    '<span aria-hidden="true">·</span>' +
    '<a href="disclaimer.html">Disclaimer</a>' +
    '<span aria-hidden="true">·</span>' +
    '<span class="site-footer-copy">© ' +
    year +
    " Dagaz Apps LLC</span>" +
    "</nav>";
})();