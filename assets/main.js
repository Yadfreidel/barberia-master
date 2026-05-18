import { serviciosBarberia } from '../models/serviceModel.js';
import { procesarCita } from '../controllers/appointmentController.js';

const gridServicios = document.getElementById('grid-dinamico-servicios');
const selectServicios = document.getElementById('servicio-select');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

function inicializarPagina() {
    if(!gridServicios) return;
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

    configurarFiltros();

    const botonesElegir = document.querySelectorAll('.btn-card-reserva');
    botonesElegir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreServicio = e.target.getAttribute('data-nombre');
            selectServicios.value = nombreServicio;
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