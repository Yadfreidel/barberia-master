import { serviciosBarberia } from '../models/serviceModel.js';
import { staffBarberia } from '../models/barberModel.js';
import { procesarCita } from '../controllers/appointmentController.js';

const gridServicios = document.getElementById('grid-dinamico-servicios');
const gridStaff = document.getElementById('grid-dinamico-staff');
const selectServicios = document.getElementById('servicio-select');
const inputBarbero = document.getElementById('barbero-seleccionado');
const inputHora = document.getElementById('hora-seleccionada');
const inputFecha = document.getElementById('fecha');
const contenedorHoras = document.getElementById('contenedor-horas');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// Configuración del listado maestro de horas comerciales de la barbería
const HORARIOS_DISPONIBLES = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

function inicializarPagina() {
    // Bloquear fechas pasadas en el calendario nativo
    if(inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
        inputFecha.addEventListener('change', generarPildorasDeTiempo);
    }

    // 1. Renderizar Catálogo
    if(gridServicios) {
        gridServicios.innerHTML = '';
        serviciosBarberia.forEach(servicio => {
            const card = document.createElement('div');
            card.classList.add('card-servicio');
            card.setAttribute('data-cat', servicio.categoria);
            card.innerHTML = `
                <div class="card-imagen-contenedor">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img">
                </div>
                <div class="card-info">
                    <h3>${servicio.nombre}</h3>
                    <p>${servicio.descripcion}</p>
                    <span class="precio-tag">${servicio.precio}</span>
                    <button class="btn-card-reserva" data-nombre="${servicio.nombre}">Elegir Este</button>
                </div>
            `;
            gridServicios.appendChild(card);

            const opcion = document.createElement('option');
            opcion.value = servicio.nombre;
            opcion.textContent = `${servicio.nombre} (${servicio.precio})`;
            selectServicios.appendChild(opcion);
        });
    }

    // 2. Renderizar Staff
    if(gridStaff) {
        gridStaff.innerHTML = '';
        staffBarberia.forEach(barbero => {
            const cardBarbero = document.createElement('div');
            cardBarbero.classList.add('card-barbero');
            cardBarbero.innerHTML = `
                <div class="barbero-img-contenedor">
                    <img src="${barbero.imagen}" alt="${barbero.nombre}">
                </div>
                <div class="barbero-info">
                    <h4>${barbero.nombre}</h4>
                    <p>${barbero.especialidad}</p>
                    <button class="btn-seleccionar-barbero" data-nombre="${barbero.nombre}">Seleccionar</button>
                </div>
            `;
            gridStaff.appendChild(cardBarbero);
        });
        configurarSeleccionBarberos();
    }

    configurarFiltros();

    // Redirecciones fluidas
    const botonesElegir = document.querySelectorAll('.btn-card-reserva');
    botonesElegir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            selectServicios.value = e.target.getAttribute('data-nombre');
            document.getElementById('staff-seccion').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// NUEVA FUNCIÓN: Generador inteligente de bloques de horas
function generarPildorasDeTiempo() {
    if(!contenedorHoras || !inputFecha.value) return;
    
    contenedorHoras.innerHTML = ''; // Limpiar estado anterior
    inputHora.value = ''; // Resetear hora previamente oculta

    const fechaSeleccionada = inputFecha.value;
    const fechaActualStr = new Date().toISOString().split('T')[0];
    
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();

    HORARIOS_DISPONIBLES.forEach(horaTexto => {
        const pildora = document.createElement('div');
        pildora.classList.add('pildora-hora');
        pildora.textContent = horaTexto;

        // Descomponer horas para validaciones matemáticas
        const [horaBloque, minutosBloque] = horaTexto.split(':').map(Number);

        // Si es el día de hoy, deshabilitar horas pasadas
        if (fechaSeleccionada === fechaActualStr) {
            if (horaBloque < horaActual || (horaBloque === horaActual && minutosActuales > 0)) {
                pildora.classList.add('deshabilitada');
            }
        }

        // Lógica de click únicamente si el horario es válido
        if (!pildora.classList.contains('deshabilitada')) {
            pildora.addEventListener('click', () => {
                document.querySelectorAll('.pildora-hora').forEach(p => p.classList.remove('pildora-activa'));
                pildora.classList.add('pildora-activa');
                inputHora.value = horaTexto; // Guardar valor final
            });
        }

        contenedorHoras.appendChild(pildora);
    });
}

function configurarSeleccionBarberos() {
    const tarjetasBarberos = document.querySelectorAll('.card-barbero');
    tarjetasBarberos.forEach(tarjeta => {
        const boton = tarjeta.querySelector('.btn-seleccionar-barbero');
        boton.addEventListener('click', (e) => {
            tarjetasBarberos.forEach(t => t.classList.remove('barbero-activo'));
            tarjeta.classList.add('barbero-activo');
            inputBarbero.value = e.target.getAttribute('data-nombre');
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function configurarFiltros() {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.currentTarget.classList.add('activo');
            const cat = e.currentTarget.getAttribute('data-categoria');
            document.querySelectorAll('.card-servicio').forEach(tarjeta => {
                const catTarjeta = tarjeta.getAttribute('data-cat');
                if (cat === 'todos' || cat === catTarjeta) {
                    tarjeta.classList.remove('ocultar-card');
                } else {
                    tarjeta.classList.add('ocultar-card');
                }
            });
        });
    });
}

if (formulario) formulario.addEventListener('submit', procesarCita);
document.addEventListener('DOMContentLoaded', inicializarPagina);