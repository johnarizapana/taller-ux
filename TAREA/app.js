const pantalla = document.getElementById("pantalla");
const mensaje = document.getElementById("mensaje");
const btnIgual = document.getElementById("igual");
const lista = document.getElementById("historial");
const vacio = document.getElementById("historial-vacio");
const btnBorrarHistorial = document.getElementById("borrar-historial");
const btnDeshacer = document.getElementById("deshacer");

const MAX_HISTORIAL = 7; // Ley de Miller: ~7 elementos a la vez
const MAX_DIGITOS = 12;
const CLAVE = "calculadora-historial";

let a = "";
let op = "";
let b = "";
let historial = cargarHistorial();
let respaldo = null;

/* ---------- Mensajes (visibilidad del estado) ---------- */
function decir(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + (tipo || "info");
}

/* ---------- Historial guardado en el navegador ---------- */
function cargarHistorial() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos.slice(0, MAX_HISTORIAL) : [];
  } catch (e) {
    return [];
  }
}

function guardarHistorial() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(historial));
  } catch (e) {
    /* si no hay almacenamiento, la calculadora sigue funcionando */
  }
}

function dibujarHistorial() {
  lista.innerHTML = "";
  historial.forEach(function (linea) {
    const li = document.createElement("li");
    li.textContent = linea;
    lista.appendChild(li);
  });
  vacio.hidden = historial.length > 0;
}

/* ---------- Estado de la pantalla ---------- */
function actualizar() {
  const texto = [a, op, b].filter(Boolean).join(" ");
  pantalla.textContent = texto || "0";

  const divideEntreCero = op === "÷" && b !== "" && Number(b) === 0;
  // Prevención de errores: "Calcular" solo se activa si la operación es válida
  btnIgual.disabled = !(a && op && b) || divideEntreCero;

  document.querySelectorAll(".tecla.op[data-op]").forEach(function (t) {
    t.classList.toggle("activa", t.dataset.op === op && b === "");
  });

  if (divideEntreCero) {
    decir("No se puede dividir entre 0. Cambia el segundo número.", "error");
  }
}

/* ---------- Acciones ---------- */
function agregarDigito(d) {
  const campo = op ? b : a;
  if (d === "." && campo.includes(".")) {
    decir("Ese número ya tiene punto decimal.", "error");
    return;
  }
  if (campo.replace(".", "").length >= MAX_DIGITOS) {
    decir("Máximo " + MAX_DIGITOS + " dígitos.", "error");
    return;
  }
  let nuevo = campo;
  if (d === "." && campo === "") nuevo = "0.";
  else if (campo === "0" && d !== ".") nuevo = d;
  else nuevo = campo + d;

  if (op) b = nuevo; else a = nuevo;
  decir("", "info");
  actualizar();
}

function elegirOperacion(simbolo) {
  if (a === "") {
    decir("Primero escribe un número.", "error");
    return;
  }
  if (b !== "") {
    calcular();
    if (a === "") return;
  }
  op = simbolo;
  decir("Operación elegida: " + simbolo + ". Ahora escribe el segundo número.", "info");
  actualizar();
}

function operar(x, y, simbolo) {
  if (simbolo === "+") return x + y;
  if (simbolo === "−") return x - y;
  if (simbolo === "×") return x * y;
  return x / y;
}

function calcular() {
  if (btnIgual.disabled) return;
  const resultado = Number(operar(Number(a), Number(b), op).toFixed(10));
  const linea = a + " " + op + " " + b + " = " + resultado;

  historial.unshift(linea);
  historial = historial.slice(0, MAX_HISTORIAL);
  guardarHistorial();
  dibujarHistorial();

  a = String(resultado);
  op = "";
  b = "";
  decir("Resultado: " + resultado + ". Guardado en el historial.", "exito");
  actualizar();
}

function limpiar() {
  a = ""; op = ""; b = "";
  decir("Calculadora limpia. Puedes empezar de nuevo.", "info");
  actualizar();
}

function borrarUltimo() {
  if (b !== "") b = b.slice(0, -1);
  else if (op) op = "";
  else a = a.slice(0, -1);
  decir("Último dato borrado.", "info");
  actualizar();
}

/* ---------- Borrar historial con opción de deshacer ---------- */
btnBorrarHistorial.addEventListener("click", function () {
  if (historial.length === 0) {
    decir("No hay nada que borrar: el historial está vacío.", "info");
    return;
  }
  respaldo = historial;
  historial = [];
  guardarHistorial();
  dibujarHistorial();
  btnDeshacer.hidden = false;
  decir("Historial borrado. Pulsa «Deshacer» si fue un error.", "info");
});

btnDeshacer.addEventListener("click", function () {
  if (!respaldo) return;
  historial = respaldo;
  respaldo = null;
  guardarHistorial();
  dibujarHistorial();
  btnDeshacer.hidden = true;
  decir("Historial recuperado.", "exito");
});

/* ---------- Eventos de los botones ---------- */
document.querySelector(".teclado").addEventListener("click", function (e) {
  const boton = e.target.closest("button");
  if (!boton) return;
  if (boton.dataset.num !== undefined) agregarDigito(boton.dataset.num);
  else if (boton.dataset.op) elegirOperacion(boton.dataset.op);
  else if (boton.dataset.accion === "limpiar") limpiar();
  else if (boton.dataset.accion === "borrar") borrarUltimo();
  else if (boton.id === "igual") calcular();
});

/* ---------- Teclado físico ---------- */
const MAPA_OP = { "+": "+", "-": "−", "*": "×", "/": "÷" };

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const enBoton = e.target.tagName === "BUTTON";

  if (/^[0-9.]$/.test(e.key)) {
    agregarDigito(e.key);
  } else if (MAPA_OP[e.key]) {
    e.preventDefault();
    elegirOperacion(MAPA_OP[e.key]);
  } else if ((e.key === "Enter" || e.key === "=") && !enBoton) {
    e.preventDefault();
    if (btnIgual.disabled) decir("Escribe dos números y una operación para calcular.", "error");
    else calcular();
  } else if (e.key === "Backspace") {
    borrarUltimo();
  } else if (e.key === "Escape") {
    limpiar();
  }
});

/* ---------- Inicio ---------- */
dibujarHistorial();
actualizar();
