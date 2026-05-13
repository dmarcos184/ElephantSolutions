const IVA = 0.16;

const preciosServicios = {
  "Creación de sistema de ventas": 25000,
  "Implementación de seguridad digital": 18000,
  "Implementación de CRM": 22000,
  "Implementación de automatización para procesos": 20000,
  "Mantenimiento y soporte": 12000
};

let carrito = [];

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

  btn.textContent = "✓ Agregado";
  btn.classList.add("agregado");
  btn.disabled = true;

  actualizarCarritoUI();
}

function eliminarDelCarrito(index) {
  const nombreEliminado = carrito[index].nombre;
  carrito.splice(index, 1);

  document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
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

  badge.textContent = carrito.length;

  if (carrito.length === 0) {
    body.innerHTML = '<p class="carrito-vacio">Tu cotización está vacía.<br>Agrega los servicios que necesitas.</p>';
    document.getElementById("carrito-footer").style.display = "none";
    return;
  }

  document.getElementById("carrito-footer").style.display = "block";

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
  document.getElementById("resumen-subtotal").textContent = formatearPeso(subtotalGeneral);
  document.getElementById("resumen-iva").textContent = formatearPeso(ivaGeneral);
  document.getElementById("resumen-total").textContent = formatearPeso(totalGeneral);
}

function abrirCarrito() {
  document.getElementById("carrito-panel").classList.add("abierto");
  document.getElementById("carrito-overlay").classList.add("visible");
}

function cerrarCarrito() {
  document.getElementById("carrito-panel").classList.remove("abierto");
  document.getElementById("carrito-overlay").classList.remove("visible");
}

function solicitarCotizacion() {
  if (carrito.length === 0) return;
  mostrarModal(
    "🎉",
    "¡Cotización enviada!",
    "Hemos recibido tu solicitud de cotización. Un asesor de ElephantSolutions se pondrá en contacto contigo pronto."
  );
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

document.addEventListener("DOMContentLoaded", function () {
  actualizarCarritoUI();
});
