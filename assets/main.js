import { serviciosBarberia } from '../models/serviceModel.js';
import { staffBarberia } from '../models/barberModel.js'; // Nuevo modelo importado
import { procesarCita } from '../controllers/appointmentController.js';

const gridServicios = document.getElementById('grid-dinamico-servicios');
const gridStaff = document.getElementById('grid-dinamico-staff');
const selectServicios = document.getElementById('servicio-select');
const inputBarbero = document.getElementById('barbero-seleccionado');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

function inicializarPagina() {
    // 1. Renderizar Servicios (Catálogo)
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

    // 2. Renderizar Staff (Barberos) de manera dinámica
    if(gridStaff) {
        gridStaff.innerHTML = '';
        staffBarberia.forEach(barbero => {
            const cardBarbero = document.createElement('div');
            cardBarbero.classList.add('card-barbero');
            cardBarbero.setAttribute('data-id', barbero.id);
            
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

    // Redirección suave desde los servicios hacia el Staff
    const botonesElegir = document.querySelectorAll('.btn-card-reserva');
    botonesElegir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreServicio = e.target.getAttribute('data-nombre');
            selectServicios.value = nombreServicio;
            document.getElementById('staff-seccion').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Lógica interactiva para seleccionar un barbero visualmente
function configurarSeleccionBarberos() {
    const tarjetasBarberos = document.querySelectorAll('.card-barbero');
    
    tarjetasBarberos.forEach(tarjeta => {
        const boton = tarjeta.querySelector('.btn-seleccionar-barbero');
        
        boton.addEventListener('click', (e) => {
            // Remover selección previa de todos los barberos
            tarjetasBarberos.forEach(t => t.classList.remove('barbero-activo'));
            
            // Activar la tarjeta cliqueada
            tarjeta.classList.add('barbero-activo');
            
            // Guardar el nombre en el campo oculto del formulario
            const nombreBarbero = e.target.getAttribute('data-nombre');
            inputBarbero.value = nombreBarbero;
            
            // Bajar suavemente al formulario de confirmación
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function configurarFiltros() {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            const botonActual = e.currentTarget;
            botonActual.classList.add('activo');

            const categoriaSeleccionada = botonActual.getAttribute('data-categoria');
            const tarjetas = document.querySelectorAll('.card-servicio');

            tarjetas.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-cat');
                if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaTarjeta) {
                    tarjeta.classList.remove('ocultar-card');
                } else {
                    tarjeta.classList.add('ocultar-card');
                }
            });
        });
    });
}

if (formulario) {
    formulario.addEventListener('submit', procesarCita);
}

document.addEventListener('DOMContentLoaded', inicializarPagina);