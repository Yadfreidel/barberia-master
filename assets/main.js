import { serviciosBarberia } from '../models/serviceModel.js';
import { staffBarberia } from '../models/barberModel.js';
import { procesarCita } from '../controllers/appointmentController.js';
import { verificarAccesoAdmin, cerrarDashboard, resetearEstadisticas } from '../controllers/adminController.js';

const gridServicios = document.getElementById('grid-dinamico-servicios');
const gridStaff = document.getElementById('grid-dinamico-staff');
const selectServicios = document.getElementById('servicio-select');
const inputBarbero = document.getElementById('barbero-seleccionado');
const inputHora = document.getElementById('hora-seleccionada');
const inputFecha = document.getElementById('fecha');
const contenedorHoras = document.getElementById('contenedor-horas');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// Elementos del Dashboard
const btnFlotanteAdmin = document.getElementById('btn-flotante-admin');
const btnCerrarDash = document.getElementById('btn-cerrar-dashboard');
const btnResetDatos = document.getElementById('btn-reset-datos');

const HORARIOS_DISPONIBLES = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

function inicializarPagina() {
    if(inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
        inputFecha.addEventListener('change', generarPildorasDeTiempo);
    }

    // 1. Renderizar Servicios del Catálogo
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

    // 2. Renderizar Staff de Barberos
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
    configurarAccesosAccesoAdmin();

    const botonesElegir = document.querySelectorAll('.btn-card-reserva');
    botonesElegir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            selectServicios.value = e.target.getAttribute('data-nombre');
            document.getElementById('staff-seccion').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function generarPildorasDeTiempo() {
    if(!contenedorHoras || !inputFecha.value) return;
    contenedorHoras.innerHTML = ''; 
    inputHora.value = ''; 

    const fechaSeleccionada = inputFecha.value;
    const fechaActualStr = new Date().toISOString().split('T')[0];
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();

    HORARIOS_DISPONIBLES.forEach(horaTexto => {
        const pildora = document.createElement('div');
        pildora.classList.add('pildora-hora');
        pildora.textContent = horaTexto;
        const [horaBloque] = horaTexto.split(':').map(Number);

        if (fechaSeleccionada === fechaActualStr) {
            if (horaBloque < horaActual || (horaBloque === horaActual && minutosActuales > 0)) {
                pildora.classList.add('deshabilitada');
            }
        }

        if (!pildora.classList.contains('deshabilitada')) {
            pildora.addEventListener('click', () => {
                document.querySelectorAll('.pildora-hora').forEach(p => p.classList.remove('pildora-activa'));
                pildora.classList.add('pildora-activa');
                inputHora.value = horaTexto; 
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

function configurarAccesosAccesoAdmin() {
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            verificarAccesoAdmin();
        }
    });

    if (btnFlotanteAdmin) {
        btnFlotanteAdmin.addEventListener('click', verificarAccesoAdmin);
    }

    if (btnCerrarDash) btnCerrarDash.addEventListener('click', cerrarDashboard);
    if (btnResetDatos) btnResetDatos.addEventListener('click', resetearEstadisticas);
}

if (formulario) formulario.addEventListener('submit', procesarCita);
document.addEventListener('DOMContentLoaded', inicializarPagina);