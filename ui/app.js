const $ = (id) => document.getElementById(id);

const inputText = $("inputText");
const minNew = $("minNew");
const maxNew = $("maxNew");
const temp = $("temp");
const tempVal = $("tempVal");
const btn = $("summarizeBtn");
const status = $("status");
const out = $("output");
const copyBtn = $("copyBtn");
const latencyEl = $("latency");
const tokensEl = $("tokens");

temp.addEventListener("input", () => (tempVal.textContent = temp.value));

copyBtn.addEventListener("click", async () => {
  if (!out.textContent.trim()) return;
  try {
    await navigator.clipboard.writeText(out.textContent);
    flash("Copied summary to clipboard.");
  } catch {
    flash("Copy failed.");
  }
});

btn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    flash("Please paste some text first.");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch("/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        max_new_tokens: Number(maxNew.value),
        min_new_tokens: Number(minNew.value),
        temperature: Number(temp.value),
      }),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`${res.status} ${msg}`);
    }
    const data = await res.json();
    out.textContent = data.summary || "";
    latencyEl.textContent = `Latency: ${data.latency_ms} ms`;
    tokensEl.textContent = `Tokens: ${data.tokens}`;
    flash("Done.");
  } catch (err) {
    out.textContent = "";
    latencyEl.textContent = "Latency: —";
    tokensEl.textContent = "Tokens: —";
    flash(`Error: ${err.message}`);
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Summarizing..." : "Summarize";
  status.textContent = isLoading ? "Working..." : "";
}

function flash(msg) {
  status.textContent = msg;
  status.classList.add("show");
  setTimeout(() => status.classList.remove("show"), 1200);
}
