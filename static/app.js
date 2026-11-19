// Captura el formulario, llama a POST /predict y pinta la tarjeta de resultado.
const form = document.getElementById("form-cliente");
const btn = document.getElementById("btn-predecir");
const caja = document.getElementById("resultado");

function datosFormulario() {
  const fd = new FormData(form);
  const num = (k) => Number(fd.get(k));
  return {
    id_cliente: String(fd.get("id_cliente")).trim(),
    edad: Math.round(num("edad")),
    ingresos_anuales: num("ingresos_anuales"),
    antiguedad_meses: Math.round(num("antiguedad_meses")),
    saldo_cuenta: num("saldo_cuenta"),
    num_productos: Math.round(num("num_productos")),
    tiene_tarjeta: form.elements["tiene_tarjeta"].checked,
    nivel_estudios: fd.get("nivel_estudios"),
    tipo_cuenta: fd.get("tipo_cuenta"),
    nivel_satisfaccion: fd.get("nivel_satisfaccion"),
    canal_preferido: fd.get("canal_preferido"),
  };
}

function el(tag, clase, texto) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function pintarResultado(r) {
  const pct = (r.probabilidad_abandono * 100).toFixed(1);
  const barra = el("div", "barra");
  const relleno = el("span");
  relleno.style.width = pct + "%";
  relleno.className = "nivel-" + r.nivel_riesgo;
  barra.appendChild(relleno);

  caja.className = "tarjeta resultado";
  caja.replaceChildren(
    el("div", "riesgo", r.id_cliente + " · Probabilidad de abandono"),
    el("div", "riesgo", "Probabilidad de abandono"),
    el("div", "prob", pct + " %"),
    barra,
    el("span", "badge nivel-" + r.nivel_riesgo, "Riesgo " + r.nivel_riesgo),
    el("p", "sub", r.abandono === 1 ? "El modelo predice que el cliente abandonará."
                              : "El modelo predice que el cliente permanecerá."),
  );
}

function pintarError(msg) {
  caja.className = "tarjeta resultado vacio";
  caja.replaceChildren(el("p", "error", msg));
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (!form.reportValidity()) return;
  btn.disabled = true;
  try {
    const resp = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosFormulario()),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const detalle = Array.isArray(err.detail)
        ? err.detail.map((d) => d.loc.slice(-1) + ": " + d.msg).join(" · ")
        : "Error " + resp.status;
      return pintarError(detalle);
    }
    pintarResultado(await resp.json());
  } catch (e) {
    pintarError("No se pudo contactar con el servidor.");
  } finally {
    btn.disabled = false;
  }
});
