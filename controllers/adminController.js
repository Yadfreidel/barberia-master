const CONTRASENA_MAESTRA = "admin123";

export function verificarAccesoAdmin() {
    const passwordInput = prompt("🔑 Ingrese la clave de administrador para ver el Dashboard:");
    
    if (passwordInput === null) return; // Si cancela el prompt
    
    if (passwordInput === CONTRASENA_MAESTRA) {
        abrirDashboard();
    } else {
        alert("❌ Clave incorrecta. Acceso denegado.");
    }
}

function abrirDashboard() {
    const modal = document.getElementById('dashboard-admin');
    if (!modal) return;

    // Cargar y calcular estadísticas en tiempo real
    const citasGuardadas = JSON.parse(localStorage.getItem('barber_analytics_citas')) || [];
    
    // 1. Mostrar total de citas
    document.getElementById('dash-total-citas').textContent = citasGuardadas.length;

    // 2. Calcular ingresos aproximados, servicio estrella y barbero estrella
    let ingresosTotales = 0;
    let mapeoServicios = {};
    let mapeoBarberos = {};

    citasGuardadas.forEach(cita => {
        // Extraer número flotante o entero del precio (ej: "$25.00" -> 25)
        const precioNumerico = parseFloat(cita.precio.replace(/[^0-9.]/g, '')) || 0;
        ingresosTotales += precioNumerico;

        // Contadores para servicio estrella
        mapeoServicios[cita.servicio] = (mapeoServicios[cita.servicio] || 0) + 1;
        // Contadores para barbero estrella
        mapeoBarberos[cita.barbero] = (mapeoBarberos[cita.barbero] || 0) + 1;
    });

    // Renderizar ingresos formateados
    document.getElementById('dash-total-ingresos').textContent = `$${ingresosTotales.toFixed(2)}`;

    // Buscar el elemento máximo en los mapeos
    const topServicio = obtenerMaximoMapeo(mapeoServicios);
    const topBarbero = obtenerMaximoMapeo(mapeoBarberos);

    // Renderizar bloques informativos
    document.getElementById('dash-servicio-top').textContent = topServicio.nombre;
    document.getElementById('dash-servicio-cant').textContent = `${topServicio.cantidad} ventas`;

    document.getElementById('dash-barbero-top').textContent = topBarbero.nombre;
    document.getElementById('dash-barbero-cant').textContent = `${topBarbero.cantidad} turnos`;

    // Mostrar el modal quitando la clase de ocultamiento
    modal.classList.remove('ocultar-dashboard');
}

export function cerrarDashboard() {
    const modal = document.getElementById('dashboard-admin');
    if (modal) modal.classList.add('ocultar-dashboard');
}

export function resetearEstadisticas() {
    if (confirm("⚠️ ¿Está seguro de borrar todas las estadísticas recopiladas? Esta acción no se puede deshacer.")) {
        localStorage.removeItem('barber_analytics_citas');
        alert("📊 Datos reseteados correctamente.");
        abrirDashboard(); // Recargar visualmente a cero
    }
}

// Función utilitaria interna para calcular tops analíticos
function obtenerMaximoMapeo(mapeo) {
    let nombreMax = "Ninguno aún";
    let cantMax = 0;

    for (const clave in mapeo) {
        if (mapeo[clave] > cantMax) {
            cantMax = mapeo[clave];
            nombreMax = clave;
        }
    }
    return { nombre: nombreMax, cantidad: cantMax };
}