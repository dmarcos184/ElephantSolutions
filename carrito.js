const IVA = 0.16;

const preciosServicios = {
  "Creación de sistema de ventas": 25000,
  "Implementación de seguridad digital": 18000,
  "Implementación de CRM": 22000,
  "Implementación de automatización para procesos": 20000,
  "Mantenimiento y soporte": 12000
};

function guardarCarrito(carrito) {
  localStorage.setItem("carrito_elephant", JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito_elephant");
  return data ? JSON.parse(data) : [];
}

let carrito = cargarCarrito();

function formatearPeso(cantidad) {
  return "$" + cantidad.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function agregarAlCarrito(nombreServicio, btn) {
  const yaExiste = carrito.find(item => item.nombre === nombreServicio);
  if (yaExiste) return;

  const precio = preciosServicios[nombreServicio] || 15000;
  const iva = precio * IVA;
  const total = precio + iva;

  carrito.push({ nombre: nombreServicio, precio, iva, total });
  guardarCarrito(carrito);

  btn.textContent = "✓ Agregado";
  btn.classList.add("agregado");
  btn.disabled = true;

  actualizarCarritoUI();
}

function eliminarDelCarrito(index) {
  const nombreEliminado = carrito[index].nombre;
  carrito.splice(index, 1);
  guardarCarrito(carrito);

  const btns = document.querySelectorAll(".btn-agregar-carrito");
  btns.forEach(btn => {
    if (btn.dataset.servicio === nombreEliminado) {
      btn.textContent = "Agregar a cotización";
      btn.classList.remove("agregado");
      btn.disabled = false;
    }
  });

  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const badge = document.getElementById("carrito-badge");
  const body = document.getElementById("carrito-body");

  if (badge) badge.textContent = carrito.length;

  if (!body) return;

  if (carrito.length === 0) {
    body.innerHTML = '<p class="carrito-vacio">Tu cotización está vacía.<br>Agrega los servicios que necesitas.</p>';
    const footer = document.getElementById("carrito-footer");
    if (footer) footer.style.display = "none";
    return;
  }

  const footer = document.getElementById("carrito-footer");
  if (footer) footer.style.display = "block";

  let html = "";
  let subtotalGeneral = 0;
  let ivaGeneral = 0;

  carrito.forEach((item, i) => {
    subtotalGeneral += item.precio;
    ivaGeneral += item.iva;
    html += `
      <div class="carrito-item">
        <div style="flex:1">
          <div class="carrito-item-nombre">${item.nombre}</div>
          <div class="carrito-item-precio">Precio: ${formatearPeso(item.precio)}</div>
          <div class="carrito-item-precio">IVA (16%): ${formatearPeso(item.iva)}</div>
          <div class="carrito-item-precio" style="font-weight:bold;color:#222">Total: ${formatearPeso(item.total)}</div>
        </div>
        <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${i})" title="Eliminar">✕</button>
      </div>`;
  });

  body.innerHTML = html;

  const totalGeneral = subtotalGeneral + ivaGeneral;
  const elSub = document.getElementById("resumen-subtotal");
  const elIva = document.getElementById("resumen-iva");
  const elTot = document.getElementById("resumen-total");
  if (elSub) elSub.textContent = formatearPeso(subtotalGeneral);
  if (elIva) elIva.textContent = formatearPeso(ivaGeneral);
  if (elTot) elTot.textContent = formatearPeso(totalGeneral);
}

function marcarBotonesAgregados() {
  const btns = document.querySelectorAll(".btn-agregar-carrito");
  btns.forEach(btn => {
    const nombre = btn.dataset.servicio;
    const estaEnCarrito = carrito.find(item => item.nombre === nombre);
    if (estaEnCarrito) {
      btn.textContent = "✓ Agregado";
      btn.classList.add("agregado");
      btn.disabled = true;
    }
  });
}

function abrirCarrito() {
  const panel = document.getElementById("carrito-panel");
  const overlay = document.getElementById("carrito-overlay");
  if (panel) panel.classList.add("abierto");
  if (overlay) overlay.classList.add("visible");
}

function cerrarCarrito() {
  const panel = document.getElementById("carrito-panel");
  const overlay = document.getElementById("carrito-overlay");
  if (panel) panel.classList.remove("abierto");
  if (overlay) overlay.classList.remove("visible");
}

function solicitarCotizacion() {
  if (carrito.length === 0) return;
  cerrarCarrito();
  window.location.href = "contacto.html?desde=cotizacion";
}

function solicitarFactura() {
  if (carrito.length === 0) return;
  mostrarModal(
    "🧾",
    "¡Solicitud de factura recibida!",
    "Hemos registrado tu solicitud de factura. Por favor envíanos tus datos fiscales a Elephantsolutions@contact.com para procesarla."
  );
}

function mostrarModal(icono, titulo, mensaje) {
  document.getElementById("modal-icono").textContent = icono;
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-mensaje").textContent = mensaje;
  document.getElementById("modal-confirmacion").classList.add("visible");
  document.getElementById("modal-overlay").classList.add("visible");
  cerrarCarrito();
}

function cerrarModal() {
  document.getElementById("modal-confirmacion").classList.remove("visible");
  document.getElementById("modal-overlay").classList.remove("visible");
}

function llenarFormularioContacto() {
  const urlParams = new URLSearchParams(window.location.search);
  const desdeCotizacion = urlParams.get("desde") === "cotizacion";
  if (!desdeCotizacion) return;

  const carritoCargado = cargarCarrito();
  if (carritoCargado.length === 0) return;

  const campoServicio = document.getElementById("servicio");
  if (!campoServicio) return;

  let subtotal = 0;
  let ivaTotal = 0;

  let texto = "Servicios solicitados:\n";
  carritoCargado.forEach((item, i) => {
    subtotal += item.precio;
    ivaTotal += item.iva;
    texto += `\n${i + 1}. ${item.nombre}`;
    texto += `\n   Precio: ${formatearPeso(item.precio)}`;
    texto += `\n   IVA (16%): ${formatearPeso(item.iva)}`;
    texto += `\n   Total: ${formatearPeso(item.total)}\n`;
  });

  const totalGeneral = subtotal + ivaTotal;
  texto += `\n────────────────────────`;
  texto += `\nSubtotal: ${formatearPeso(subtotal)}`;
  texto += `\nIVA total (16%): ${formatearPeso(ivaTotal)}`;
  texto += `\nTotal general: ${formatearPeso(totalGeneral)}`;

  campoServicio.value = texto;
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarCarritoUI();
  marcarBotonesAgregados();
  llenarFormularioContacto();
});
