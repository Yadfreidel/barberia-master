import { serviciosBarberia } from '../models/serviceModel.js';

export function procesarCita(evento) {
    evento.preventDefault(); 

    const TU_TELEFONO = "8292466177"; 

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefonoCliente = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio-select').value;
    const barbero = document.getElementById('barbero-seleccionado').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora-seleccionada').value;

    if (!servicio) { alert("Por favor, selecciona un servicio del catálogo."); return; }
    if (!barbero) { alert("Por favor, selecciona tu barbero en la sección de arriba."); return; }
    if (!hora) { alert("Por favor, toca una de las horas disponibles."); return; }

    const fechaFormateada = fecha.split('-').reverse().join('/');

    // Buscar el objeto servicio para capturar su precio real
    const objetoServicio = serviciosBarberia.find(s => s.nombre === servicio) || { precio: "$0.00" };

    // GUARDAR EN MEMORIA PARA LAS ESTADÍSTICAS DEL DUEÑO
    guardarMetricasAnaliticas({
        servicio: servicio,
        precio: objetoServicio.precio,
        barbero: barbero,
        fecha: fechaFormateada
    });

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
    
    // Iniciar el tracking en la web
    activarPantallaSeguimiento({ nombre, servicio, barbero, hora, fecha: fechaFormateada, precio: objetoServicio.precio });

    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
    }, 100);

    evento.target.reset();
}

function guardarMetricasAnaliticas(nuevaCita) {
    let historial = JSON.parse(localStorage.getItem('barber_analytics_citas')) || [];
    historial.push(nuevaCita);
    localStorage.setItem('barber_analytics_citas', JSON.stringify(historial));
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

            <div class="linea-tiempo" id="linea-tiempo-uber">
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

            <div id="contenedor-ticket-wallet" style="display: none;"></div>

            <button id="btn-regresar-formulario" class="btn-reserva" style="margin-top: 25px; width: 100%; font-size: 0.9rem; padding: 12px; animation: none;">
                <i class="fas fa-arrow-left"></i> Volver / Nueva Cita
            </button>

            <p class="nota-footer" style="margin-top: 15px;">No cierres esta pestaña para mantener el monitoreo en vivo.</p>
        `;

        contenedorTracking.classList.remove('ocultar-tracking');
        document.getElementById('btn-regresar-formulario').addEventListener('click', restaurarFormulario);
        
        // Ejecutamos el avance simulado pasándole todos los datos para armar el QR al final
        simularAvanceUber(datos);
    }, 400);
}

function simularAvanceUber(datosCita) {
    const barra = document.getElementById('barra-progreso');
    const paso2 = document.getElementById('paso-2');
    const paso3 = document.getElementById('paso-3');

    setTimeout(() => {
        if(barra && paso2) {
            barra.style.height = '50%';
            paso2.classList.add('activo-nodo');
        }
    }, 4500);

    setTimeout(() => {
        if(barra && paso3) {
            barra.style.height = '100%';
            paso3.classList.add('activo-nodo');
            
            const textoHeader = document.querySelector('.tracking-header p');
            if (textoHeader) textoHeader.innerHTML = "✨ ¡Turno Verificado con Éxito! Te esperamos.";
            
            const radar = document.querySelector('.radar-ping');
            if (radar) {
                radar.style.animation = "none";
                radar.style.backgroundColor = "#c5a059";
            }

            // MAGIA PREMIUM: Ocultar barra Uber y pintar el Pase Digital VIP
            setTimeout(() => {
                const lineaTiempo = document.getElementById('linea-tiempo-uber');
                const contenedorTicket = document.getElementById('contenedor-ticket-wallet');
                
                if (lineaTiempo && contenedorTicket) {
                    lineaTiempo.style.display = 'none';
                    
                    // Inyectamos la estructura visual del ticket estilo Wallet de Aerolínea
                    contenedorTicket.innerHTML = `
                        <div class="ticket-wallet-card">
                            <div class="ticket-wallet-header">
                                <span>BARBER PASS</span>
                                <span class="ticket-premium-tag">PREMIUM ACCESS</span>
                            </div>
                            
                            <div class="ticket-wallet-body">
                                <div class="ticket-row">
                                    <div><label>CLIENTE</label><p>${datosCita.nombre}</p></div>
                                    <div><label>SERVICIO</label><p>${datosCita.servicio}</p></div>
                                </div>
                                <div class="ticket-row">
                                    <div><label>FECHA / HORA</label><p>${datosCita.fecha} - ${datosCita.hora} HRS</p></div>
                                    <div><label>BARBERO</label><p>${datosCita.barbero}</p></div>
                                </div>
                                <div class="ticket-row">
                                    <div><label>TOTAL ESTIMADO</label><p style="color: var(--dorado-brillante); font-weight: bold;">${datosCita.precio}</p></div>
                                    <div><label>STATUS</label><p style="color: #2ecc71; font-weight: bold;"><i class="fas fa-check-circle"></i> CONFIRMADO</p></div>
                                </div>
                            </div>
                            
                            <div class="ticket-wallet-qrcode-zone">
                                <div id="qrcode-canvas"></div>
                                <p class="ticket-qr-instruction">Muestra este código al llegar a la recepción</p>
                            </div>
                        </div>
                    `;
                    
                    contenedorTicket.style.display = 'block';

                    // CREACIÓN DEL CÓDIGO QR EN TIEMPO REAL CON LOS DATOS DE LA RESERVA
                    // Este string es el que leerá el celular del barbero cuando lo escanee
                    const stringDatosQR = `CITA CONFIRMADA\nCliente: ${datosCita.nombre}\nServicio: ${datosCita.servicio}\nBarbero: ${datosCita.barbero}\nFecha: ${datosCita.fecha} a las ${datosCita.hora} hrs.\nPrecio: ${datosCita.precio}`;
                    
                    new QRCode(document.getElementById("qrcode-canvas"), {
                        text: stringDatosQR,
                        width: 140,
                        height: 140,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                }
            }, 1500);
        }
    }, 9000);
}

function restaurarFormulario() {
    const formulario = document.getElementById('form-reservas');
    const contenedorTracking = document.getElementById('pantalla-seguimiento');
    
    document.getElementById('barbero-seleccionado').value = "";
    document.getElementById('hora-seleccionada').value = "";
    document.getElementById('contenedor-horas').innerHTML = `<p style="color: var(--gris-texto); font-size: 0.9rem; font-style: italic;">Por favor, selecciona una fecha primero...</p>`;
    
    document.querySelectorAll('.card-barbero').forEach(t => t.classList.remove('barbero-activo'));

    contenedorTracking.classList.add('ocultar-tracking');
    formulario.style.display = 'flex';
    setTimeout(() => {
        formulario.style.opacity = '1';
    }, 50);
}