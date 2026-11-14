// Lógica de la aplicación — Etapa 2.
// Los datos del catálogo vienen de catalog.js (variable CATALOG).

const partidas = [];
let siguienteId = 1;

const form = document.getElementById("item-form");
const selReferencia = document.getElementById("referencia");
const detalleRef = document.getElementById("detalle-referencia");
const errorBox = document.getElementById("error");
const tablaBody = document.getElementById("tabla-body");

// Comentarios predefinidos (sección 8 de CLAUDE.md). No se usa IA.
const COMENTARIOS = {
  "Por debajo del rango":
    "El precio está por debajo del rango de referencia. Un precio bajo puede indicar alcance incompleto, cantidades distintas o partidas omitidas. Verificar antes de aceptarlo.",
  "Dentro del rango":
    "El precio está dentro del rango de referencia. Esto no confirma por sí solo que sea razonable; verificar alcance y cantidades.",
  "Por encima del rango":
    "El precio supera el rango de referencia. Verificar preparación de superficies, condiciones de acceso, cantidades y alcance antes de concluir.",
  "No comparable":
    "La partida no se compara porque la unidad, el alcance o la base de precio no coinciden o no están confirmados."
};

const CLASES = {
  "Por debajo del rango": "res-ambar",
  "Dentro del rango": "res-azul",
  "Por encima del rango": "res-rojo",
  "No comparable": "res-gris"
};

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

// ---------- Evaluación de una partida (secciones 7 y 8) ----------
function evaluar(p) {
  const ref = buscarReferencia(p.referenciaId);
  const resultado = { ref: ref, comparable: false, clasificacion: "No comparable" };

  const datosCompletos = ref && p.cantidad > 0 && p.precio > 0 && p.confirmacion;
  const comparable = datosCompletos && p.unidad === ref.unidad && p.confirmacion === "Sí";
  if (!comparable) return resultado;

  resultado.comparable = true;
  resultado.totalCotizado = p.cantidad * p.precio;
  resultado.totalReferencia = p.cantidad * ref.precioReferencia;
  resultado.diferenciaUnitaria = p.precio - ref.precioReferencia;
  resultado.desviacion = (resultado.diferenciaUnitaria / ref.precioReferencia) * 100;

  // Límites inclusivos
  if (p.precio < ref.limiteInferior) {
    resultado.clasificacion = "Por debajo del rango";
  } else if (p.precio > ref.limiteSuperior) {
    resultado.clasificacion = "Por encima del rango";
  } else {
    resultado.clasificacion = "Dentro del rango";
  }
  return resultado;
}

// ---------- Tabla y totales ----------
function dibujar() {
  if (partidas.length === 0) {
    tablaBody.innerHTML = '<tr class="vacia"><td colspan="7">Aún no hay partidas.</td></tr>';
  } else {
    tablaBody.innerHTML = partidas.map(p => {
      const r = evaluar(p);
      const guion = '<span class="guion">—</span>';
      const totales = r.comparable
        ? "Cotizado: " + formatoDolares(r.totalCotizado) + "<br>Ref.: " + formatoDolares(r.totalReferencia)
        : guion;
      const desviacion = r.comparable
        ? formatoDiferencia(r.diferenciaUnitaria) + "/" + escapar(p.unidad) + "<br>" + formatoPorcentaje(r.desviacion)
        : guion;
      const refTexto = "ref. " + formatoDolares(r.ref.precioReferencia) + " (" +
        r.ref.limiteInferior.toFixed(2) + "–" + r.ref.limiteSuperior.toFixed(2) + ")";

      return (
        '<tr class="fila-principal">' +
        '<td class="col-desc"><strong>' + escapar(p.descripcion) + "</strong>" +
          '<div class="sub">' + escapar(r.ref.nombre) + " · Alcance y base de precio: " + escapar(p.confirmacion) + "</div></td>" +
        "<td>" + p.cantidad.toLocaleString("en-US") + " " + escapar(p.unidad) + "</td>" +
        "<td>" + formatoDolares(p.precio) + '<div class="sub">' + refTexto + "</div></td>" +
        "<td>" + totales + "</td>" +
        "<td>" + desviacion + "</td>" +
        '<td><span class="etiqueta ' + CLASES[r.clasificacion] + '">' + r.clasificacion + "</span></td>" +
        '<td><button type="button" class="eliminar" data-id="' + p.id + '">Eliminar</button></td>' +
        "</tr>" +
        '<tr class="fila-comentario"><td colspan="7"><strong>Comentario:</strong> ' +
          escapar(COMENTARIOS[r.clasificacion]) + "</td></tr>"
      );
    }).join("");
  }
  dibujarTotales();
}

function dibujarTotales() {
  let totalCotizado = 0;
  let totalReferencia = 0;
  let comparables = 0;
  let noComparables = 0;

  partidas.forEach(p => {
    const r = evaluar(p);
    if (r.comparable) {
      comparables++;
      totalCotizado += r.totalCotizado;
      totalReferencia += r.totalReferencia;
    } else {
      noComparables++;
    }
  });

  document.getElementById("tot-cotizado").textContent = formatoDolares(totalCotizado);
  document.getElementById("tot-referencia").textContent = formatoDolares(totalReferencia);
  document.getElementById("tot-diferencia").textContent = formatoDiferencia(totalCotizado - totalReferencia);
  document.getElementById("tot-comparables").textContent = comparables;
  document.getElementById("tot-no-comparables").textContent = noComparables;
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

  partidas.push({
    id: siguienteId++,
    descripcion,
    cantidad,
    unidad,
    precio,
    referenciaId: ref.id,
    confirmacion
  });

  dibujar();
  form.reset();
  mostrarDetalle();
});

// ---------- Eliminar partida ----------
tablaBody.addEventListener("click", function (e) {
  const boton = e.target.closest("button.eliminar");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const indice = partidas.findIndex(p => p.id === id);
  if (indice !== -1) {
    partidas.splice(indice, 1);
    dibujar();
  }
});

selReferencia.addEventListener("change", mostrarDetalle);

cargarCatalogo();
dibujar();
