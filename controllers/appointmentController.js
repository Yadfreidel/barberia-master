export function procesarCita(evento) {
    evento.preventDefault(); 

    // 1. CONFIGURA TU NÚMERO DE WHATSAPP REAL AQUÍ (Solo números con código de área)
    const TU_TELEFONO = "18090000000"; // <-- Reemplázalo con tu número real

    // 2. Capturar valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefonoCliente = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio-select').value;
    const barbero = document.getElementById('barbero-seleccionado').value; // Capturamos el barbero
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // 3. Validaciones profesionales previas al envío
    if (!servicio) {
        alert("Por favor, selecciona un servicio del catálogo primero.");
        return;
    }

    if (!barbero) {
        alert("Por favor, sube un poco y selecciona el barbero de tu preferencia haciendo clic en 'Seleccionar'.");
        document.getElementById('staff-seccion').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const fechaFormateada = fecha.split('-').reverse().join('/');

    // 4. Agregar el barbero al mensaje final estructurado
    const mensajeWhatsApp = 
        `🔥 *NUEVA RESERVA PREMIUM* 🔥%0A%0A` +
        `👤 *Cliente:* ${nombre}%0A` +
        `📞 *Teléfono:* ${telefonoCliente}%0A` +
        `📧 *Correo:* ${email}%0A%0A` +
        `💈 *Servicio:* ${servicio}%0A` +
        `💈 *Atendido por:* 💈 _${barbero}_ 💈%0A%0A` +
        `📅 *Fecha:* ${fechaFormateada}%0A` +
        `⏰ *Hora:* ${hora} hrs%0A%0A` +
        `⚡ _Turno agendado desde la plataforma web._`;

    const urlWhatsApp = `https://wa.me/${TU_TELEFONO}?text=${mensajeWhatsApp}`;

    window.open(urlWhatsApp, '_blank');

    // Limpiar formulario y reiniciar selección visual
    evento.target.reset();
    document.getElementById('barbero-seleccionado').value = "";
    document.querySelectorAll('.card-barbero').forEach(t => t.classList.remove('barbero-activo'));
}