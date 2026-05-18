import { serviciosBarberia } from '../models/serviceModel.js';
import { procesarCita } from '../controllers/appointmentController.js';

const gridServicios = document.getElementById('grid-dinamico-servicios');
const selectServicios = document.getElementById('servicio-select');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// 1. Renderizado inicial de las tarjetas y el selector de formulario
function inicializarPagina() {
    if(!gridServicios) return;
    gridServicios.innerHTML = '';
    
    serviciosBarberia.forEach(servicio => {
        // Creamos la tarjeta física con un atributo de datos (data-cat) para rastrear su categoría
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

        // Llenamos el select del formulario
        const opcion = document.createElement('option');
        opcion.value = servicio.nombre;
        opcion.textContent = `${servicio.nombre} (${servicio.precio})`;
        selectServicios.appendChild(opcion);
    });

    // Configurar la lógica del menú de filtrado interactivo
    configurarFiltros();

    // Lógica de redirección de los botones internos
    const botonesElegir = document.querySelectorAll('.btn-card-reserva');
    botonesElegir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreServicio = e.target.getAttribute('data-nombre');
            selectServicios.value = nombreServicio;
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// 2. Lógica encargada de clasificar y alternar las vistas del catálogo
function configurarFiltros() {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Quitamos el estado activo a todos los botones y se lo damos al actual
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            const botonActual = e.currentTarget;
            botonActual.classList.add('activo');

            const categoriaSeleccionada = botonActual.getAttribute('data-categoria');
            const tarjetas = document.querySelectorAll('.card-servicio');

            tarjetas.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-cat');

                // Si seleccionó todos o coincide la categoría, la muestra. Si no, la oculta.
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