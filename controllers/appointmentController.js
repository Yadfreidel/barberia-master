export function procesarCita(evento) {
    evento.preventDefault(); 

    // CONFIGURA TU WHATSAPP REAL AQUÍ
    const TU_TELEFONO = "8292466177"; 

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefonoCliente = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio-select').value;
    const barbero = document.getElementById('barbero-seleccionado').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora-seleccionada').value;

    // Validaciones de seguridad
    if (!servicio) { alert("Por favor, selecciona un servicio del catálogo."); return; }
    if (!barbero) { alert("Por favor, selecciona tu barbero en la sección de arriba."); return; }
    if (!hora) { alert("Por favor, toca una de las horas disponibles."); return; }

    const fechaFormateada = fecha.split('-').reverse().join('/');

    // Formatear mensaje premium para WhatsApp
    const mensajeWhatsApp = 
        `🔥 *NUEVA RESERVA PREMIUM* 🔥%0A%0A` +
        `👤 *Cliente:* ${nombre}%0A` +
        `📞 *Teléfono:* ${telefonoCliente}%0A%0A` +
        `💈 *Servicio:* ${servicio}%0A` +
        `💈 *Barbero:* _${barbero}_%0A` +
        `📅 *Fecha:* ${fechaFormateada}%0A` +
        `⏰ *Hora:* *${hora} hrs*%0A%0A` +
        `⚡ _Turno enviado. Abriendo panel de seguimiento en la web..._`;

    const urlWhatsApp = `https://wa.me/${TU_TELEFONO}?text=${mensajeWhatsApp}`;
    
    // Abrir la API de WhatsApp
    window.open(urlWhatsApp, '_blank');

    // Iniciar el sistema de rastreo en tiempo real
    activarPantallaSeguimiento({ nombre, servicio, barbero, hora, fecha: fechaFormateada });

    evento.target.reset();
}

function activarPantallaSeguimiento(datos) {
    const formulario = document.getElementById('form-reservas');
    const contenedorTracking = document.getElementById('pantalla-seguimiento');

    formulario.style.opacity = '0';
    
    setTimeout(() => {
        formulario.style.display = 'none';
        
        contenedorTracking.innerHTML = `
            <div class="tracking-header">
                <div class="radar-ping"></div>
                <h3>Cita en Tiempo Real</h3>
                <p>¡Hola <span>${datos.nombre}</span>! Tu solicitud está siendo procesada.</p>
            </div>

            <div class="resumen-ticket">
                <div><i class="fas fa-cut"></i> ${datos.servicio}</div>
                <div><i class="fas fa-user-tie"></i> Staff: ${datos.barbero}</div>
                <div><i class="fas fa-clock"></i> ${datos.fecha} a las ${datos.hora} hrs</div>
            </div>

            <div class="linea-tiempo">
                <div class="barra-progreso-fondo">
                    <div class="barra-progreso-llena" id="barra-progreso"></div>
                </div>
                
                <div class="paso-tracking activo-nodo" id="paso-1">
                    <div class="icono-nodo"><i class="fas fa-paper-plane"></i></div>
                    <div class="texto-nodo"><h4>Solicitada</h4><p>Enviado a WhatsApp</p></div>
                </div>

                <div class="paso-tracking" id="paso-2">
                    <div class="icono-nodo"><i class="fas fa-check-circle"></i></div>
                    <div class="texto-nodo"><h4>Confirmada</h4><p>Validando tu horario</p></div>
                </div>

                <div class="paso-tracking" id="paso-3">
                    <div class="icono-nodo"><i class="fas fa-chair"></i></div>
                    <div class="texto-nodo"><h4>Listo</h4><p>¡Te vemos en el sillón!</p></div>
                </div>
            </div>

            <p class="nota-footer">No cierres esta pestaña para mantener el monitoreo en vivo.</p>
        `;

        contenedorTracking.classList.remove('ocultar-tracking');
        simularAvanceUber();
    }, 400);
}

function simularAvanceUber() {
    const barra = document.getElementById('barra-progreso');
    const paso2 = document.getElementById('paso-2');
    const paso3 = document.getElementById('paso-3');

    setTimeout(() => {
        if(barra && paso2) {
            barra.style.height = '50%';
            paso2.classList.add('activo-nodo');
        }
    }, 4000);

    setTimeout(() => {
        if(barra && paso3) {
            barra.style.height = '100%';
            paso3.classList.add('activo-nodo');
            document.querySelector('.tracking-header p').innerHTML = "✨ ¡Turno Verificado con Éxito! Te esperamos.";
            document.querySelector('.radar-ping').style.animation = "none";
            document.querySelector('.radar-ping').style.backgroundColor = "#c5a059";
        }
    }, 9000);
}