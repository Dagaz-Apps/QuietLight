(function () {
  var ENDPOINT = "https://dagazapps.com/api/support";
  var TOKEN = "stillness";
  var form = document.getElementById("support-form");
  if (!form) return;

  var status = document.getElementById("support-status");
  var submit = form.querySelector('button[type="submit"]');
  var started = form.querySelector('[name="form_started"]');
  var token = form.querySelector('[name="form_token"]');

  if (started) started.value = String(Date.now());
  window.setTimeout(function () {
    if (token) token.value = TOKEN;
  }, 400);

  function setStatus(message, kind) {
    if (!status) return;
    status.hidden = !message;
    status.textContent = message || "";
    status.className =
      "support-status" + (kind ? " support-status--" + kind : "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus("", "");

    var name = String(document.getElementById("support-name").value || "").trim();
    var email = String(document.getElementById("support-email").value || "").trim();
    var message = String(document.getElementById("support-message").value || "").trim();

    if (name.length < 2) {
      setStatus("Please enter your name.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }
    if (message.length < 10) {
      setStatus("Please share a bit more detail.", "error");
      return;
    }

    if (submit) submit.disabled = true;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        hp_company_url: form.querySelector('[name="hp_company_url"]').value,
        hp_fax: form.querySelector('[name="hp_fax"]').value,
        form_started: started ? started.value : "",
        form_token: token ? token.value : "",
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok && data.ok, error: data.error };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.hidden = true;
          setStatus(
            "Message received. We'll reply at the email you shared.",
            "ok",
          );
          return;
        }
        setStatus(
          result.error ||
            "We could not send your message. Please try again or email support@quietlight.app.",
          "error",
        );
      })
      .catch(function () {
        setStatus(
          "We could not send your message. Please try again or email support@quietlight.app.",
          "error",
        );
      })
      .finally(function () {
        if (submit) submit.disabled = false;
      });
  });
})();
