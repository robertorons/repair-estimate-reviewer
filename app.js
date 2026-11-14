// Lógica de la aplicación — Etapa 1 (cálculos provisionales).
// Los datos del catálogo vienen de catalog.js (variable CATALOG).

const partidas = [];

const form = document.getElementById("item-form");
const selReferencia = document.getElementById("referencia");
const detalleRef = document.getElementById("detalle-referencia");
const errorBox = document.getElementById("error");
const tablaBody = document.getElementById("tabla-body");

// ---------- Formato ----------
function formatoDolares(n) {
  const signo = n < 0 ? "-" : "";
  return signo + "$" + Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatoDiferencia(n) {
  return (n >= 0 ? "+" : "−") + formatoDolares(Math.abs(n));
}

function formatoPorcentaje(n) {
  return (n >= 0 ? "+" : "−") + Math.abs(n).toFixed(1) + " %";
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ---------- Catálogo ----------
function cargarCatalogo() {
  CATALOG.forEach(ref => {
    const opt = document.createElement("option");
    opt.value = ref.id;
    opt.textContent = ref.nombre + " (" + ref.unidad + ")";
    selReferencia.appendChild(opt);
  });
}

function buscarReferencia(id) {
  return CATALOG.find(r => r.id === id);
}

function si_no(valor) { return valor ? "Sí" : "No"; }

function mostrarDetalle() {
  const ref = buscarReferencia(selReferencia.value);
  if (!ref) {
    detalleRef.hidden = true;
    detalleRef.innerHTML = "";
    return;
  }
  const b = ref.basePrecio;
  detalleRef.innerHTML =
    "<p><strong>Definición:</strong> " + escapar(ref.descripcion) + "</p>" +
    "<p><strong>Incluye:</strong> " + escapar(ref.incluye) + "</p>" +
    "<p><strong>Excluye:</strong> " + escapar(ref.excluye) + "</p>" +
    "<p><strong>Unidad:</strong> " + escapar(ref.unidad) +
    " · <strong>Método de medición:</strong> " + escapar(ref.metodoMedicion) + "</p>" +
    "<p><strong>Base de precio:</strong> mano de obra: " + si_no(b.manoObra) +
    ", materiales: " + si_no(b.materiales) +
    ", equipos: " + si_no(b.equipos) +
    ", impuestos: " + si_no(b.impuestos) +
    ", O&amp;P: " + si_no(b.oyp) + "</p>" +
    "<p><strong>Precio de referencia:</strong> " + formatoDolares(ref.precioReferencia) + "/" + escapar(ref.unidad) +
    " (rango " + formatoDolares(ref.limiteInferior) + " – " + formatoDolares(ref.limiteSuperior) + ")</p>" +
    "<p><strong>Ubicación:</strong> " + escapar(ref.ubicacion) +
    " · <strong>Fecha:</strong> " + escapar(ref.fechaPrecio) +
    " · <strong>Fuente:</strong> " + escapar(ref.fuente) + "</p>";
  detalleRef.hidden = false;
}

// ---------- Errores ----------
function mostrarError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

function limpiarError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

// ---------- Tabla ----------
function dibujarTabla() {
  if (partidas.length === 0) {
    tablaBody.innerHTML = '<tr class="vacia"><td colspan="10">Aún no hay partidas.</td></tr>';
    return;
  }
  tablaBody.innerHTML = partidas.map(p =>
    "<tr>" +
    "<td>" + escapar(p.descripcion) + "</td>" +
    '<td class="num">' + p.cantidad.toLocaleString("en-US") + "</td>" +
    "<td>" + escapar(p.unidad) + "</td>" +
    '<td class="num">' + formatoDolares(p.precio) + "</td>" +
    "<td>" + escapar(p.referenciaNombre) + "</td>" +
    "<td>" + escapar(p.confirmacion) + "</td>" +
    '<td class="num">' + formatoDolares(p.totalCotizado) + "</td>" +
    '<td class="num">' + formatoDolares(p.totalReferencia) + "</td>" +
    '<td class="num">' + formatoDiferencia(p.diferenciaUnitaria) + "</td>" +
    '<td class="num">' + formatoPorcentaje(p.desviacion) + "</td>" +
    "</tr>"
  ).join("");
}

// ---------- Agregar partida ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  limpiarError();

  const descripcion = document.getElementById("descripcion").value.trim();
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const unidad = document.getElementById("unidad").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const ref = buscarReferencia(selReferencia.value);
  const confirmacion = document.getElementById("confirmacion").value;

  if (!descripcion) return mostrarError("Escribe la descripción del trabajo.");
  if (!(cantidad > 0)) return mostrarError("La cantidad debe ser un número mayor que cero.");
  if (!(precio > 0)) return mostrarError("El precio cotizado debe ser un número mayor que cero.");
  if (!ref) return mostrarError("Elige una partida de referencia del catálogo.");
  if (!confirmacion) return mostrarError("Responde si coinciden el alcance y la base de precio.");

  // Cálculos provisionales (sección 7 de CLAUDE.md)
  const diferenciaUnitaria = precio - ref.precioReferencia;
  partidas.push({
    descripcion,
    cantidad,
    unidad,
    precio,
    referenciaNombre: ref.nombre,
    confirmacion,
    totalCotizado: cantidad * precio,
    totalReferencia: cantidad * ref.precioReferencia,
    diferenciaUnitaria,
    desviacion: (diferenciaUnitaria / ref.precioReferencia) * 100
  });

  dibujarTabla();
  form.reset();
  mostrarDetalle();
});

selReferencia.addEventListener("change", mostrarDetalle);

cargarCatalogo();
