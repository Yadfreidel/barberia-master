import { obtenerServicios } from '../models/serviceModel.js';
import { obtenerBarberos } from '../models/barberModel.js';
import { procesarCita } from '../controllers/appointmentController.js';
import { verificarAccesoAdmin, cerrarDashboard } from '../controllers/adminController.js';

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const gridServicios = document.getElementById('grid-dinamico-servicios');
const gridStaff = document.getElementById('grid-dinamico-staff');
const selectServicios = document.getElementById('servicio-select');
const inputBarbero = document.getElementById('barbero-seleccionado');
const inputHora = document.getElementById('hora-seleccionada');
const inputFecha = document.getElementById('fecha');
const contenedorHoras = document.getElementById('contenedor-horas');
const formulario = document.getElementById('form-reservas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

const btnFlotanteAdmin = document.getElementById('btn-flotante-admin');
const btnCerrarDash = document.getElementById('btn-cerrar-dashboard');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

const HORARIOS_DISPONIBLES = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

// ==========================================
// INICIALIZACIÓN PRINCIPAL
// ==========================================
function inicializarPagina() {
    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
        inputFecha.addEventListener('change', generarPildorasDeTiempo);
    }

    renderizarServicios();
    renderizarStaff();
    configurarFiltros();
    configurarAccesoAdmin();
    configurarMenuMobile();
    configurarScrollAnimations();
    configurarEfectos3D();
}

// Exponer función global para que el admin panel recargue la página
window.recargarPaginaPrincipal = function () {
    renderizarServicios();
    renderizarStaff();
};

// ==========================================
// RENDERIZADO DE SERVICIOS
// ==========================================
function renderizarServicios() {
    if (!gridServicios) return;

    const servicios = obtenerServicios();
    gridServicios.innerHTML = '';
    if (selectServicios) {
        selectServicios.innerHTML = '<option value="" disabled selected>-- Elige un corte del catálogo --</option>';
    }

    servicios.forEach(servicio => {
        const card = document.createElement('div');
        card.classList.add('card-servicio', 'animate-on-scroll');
        card.setAttribute('data-cat', servicio.categoria);
        card.innerHTML = `
            <div class="card-imagen-contenedor">
                <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <h3>${servicio.nombre}</h3>
                <p>${servicio.descripcion}</p>
                <span class="precio-tag">${servicio.precio}</span>
                <button class="btn-card-reserva" data-nombre="${servicio.nombre}">Elegir Este</button>
            </div>
        `;
        gridServicios.appendChild(card);

        if (selectServicios) {
            const opcion = document.createElement('option');
            opcion.value = servicio.nombre;
            opcion.textContent = `${servicio.nombre} (${servicio.precio})`;
            selectServicios.appendChild(opcion);
        }
    });

    // Event listeners para botones "Elegir Este"
    document.querySelectorAll('.btn-card-reserva').forEach(boton => {
        boton.addEventListener('click', (e) => {
            if (selectServicios) selectServicios.value = e.target.getAttribute('data-nombre');
            const staffSection = document.getElementById('staff-seccion');
            if (staffSection) staffSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Reaplicar filtro activo
    const filtroActivo = document.querySelector('.btn-filtro.activo');
    if (filtroActivo) {
        const cat = filtroActivo.getAttribute('data-categoria');
        aplicarFiltro(cat);
    }

    // Re-observar elementos para animaciones
    configurarScrollAnimations();
}

// ==========================================
// RENDERIZADO DE STAFF
// ==========================================
function renderizarStaff() {
    if (!gridStaff) return;

    const barberos = obtenerBarberos();
    gridStaff.innerHTML = '';

    barberos.forEach(barbero => {
        const cardBarbero = document.createElement('div');
        cardBarbero.classList.add('card-barbero', 'animate-on-scroll');
        cardBarbero.innerHTML = `
            <div class="barbero-img-contenedor">
                <img src="${barbero.imagen}" alt="${barbero.nombre}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop'">
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
    configurarTouchBarberos();
}

// ==========================================
// PÍLDORAS DE HORA
// ==========================================
function generarPildorasDeTiempo() {
    if (!contenedorHoras || !inputFecha.value) return;
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

// ==========================================
// SELECCIÓN DE BARBERO
// ==========================================
function configurarSeleccionBarberos() {
    const tarjetasBarberos = document.querySelectorAll('.card-barbero');
    tarjetasBarberos.forEach(tarjeta => {
        const boton = tarjeta.querySelector('.btn-seleccionar-barbero');
        if (boton) {
            boton.addEventListener('click', (e) => {
                tarjetasBarberos.forEach(t => t.classList.remove('barbero-activo'));
                tarjeta.classList.add('barbero-activo');
                inputBarbero.value = e.target.getAttribute('data-nombre');
                const contacto = document.getElementById('contacto');
                if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
}

function configurarTouchBarberos() {
    const tarjetasBarberos = document.querySelectorAll('.card-barbero');
    tarjetasBarberos.forEach(tarjeta => {
        tarjeta.addEventListener('touchstart', () => {
            tarjetasBarberos.forEach(t => t.classList.remove('touch-active'));
            tarjeta.classList.add('touch-active');
        }, { passive: true });
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.card-barbero')) {
            tarjetasBarberos.forEach(t => t.classList.remove('touch-active'));
        }
    }, { passive: true });
}

// ==========================================
// FILTROS DE CATEGORÍA
// ==========================================
function configurarFiltros() {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => {
                b.classList.remove('activo');
            });
            e.currentTarget.classList.add('activo');
            const cat = e.currentTarget.getAttribute('data-categoria');
            aplicarFiltro(cat);
        });
    });
}

function aplicarFiltro(cat) {
    document.querySelectorAll('.card-servicio').forEach(tarjeta => {
        const catTarjeta = tarjeta.getAttribute('data-cat');
        if (cat === 'todos' || cat === catTarjeta) {
            tarjeta.classList.remove('ocultar-card');
        } else {
            tarjeta.classList.add('ocultar-card');
        }
    });
}

// ==========================================
// MENÚ HAMBURGUESA MÓVIL
// ==========================================
function configurarMenuMobile() {
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-abierto');
            menuToggle.classList.toggle('menu-activo');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-abierto');
                menuToggle.classList.remove('menu-activo');
            });
        });
    }
}

// ==========================================
// ACCESO ADMIN
// ==========================================
function configurarAccesoAdmin() {
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
}

// ==========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ==========================================
function configurarScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}

// ==========================================
// EFECTOS 3D (solo escritorio)
// ==========================================
function configurarEfectos3D() {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.addEventListener('mousemove', (e) => {
        const tarjetas = document.querySelectorAll('.card-servicio');
        tarjetas.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                card.style.transform = `translateY(-8px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;

                const tagPrecio = card.querySelector('.precio-tag');
                if (tagPrecio) tagPrecio.style.transform = 'translateZ(20px)';
            }
        });
    });

    // Reset al salir
    gridServicios.addEventListener('mouseleave', () => {
        document.querySelectorAll('.card-servicio').forEach(card => {
            card.style.transform = '';
            const tagPrecio = card.querySelector('.precio-tag');
            if (tagPrecio) tagPrecio.style.transform = '';
        });
    });
}

// ==========================================
// INIT
// ==========================================
if (formulario) formulario.addEventListener('submit', procesarCita);
document.addEventListener('DOMContentLoaded', inicializarPagina);