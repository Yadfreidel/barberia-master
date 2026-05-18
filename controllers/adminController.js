const CONTRASENA_MAESTRA = "yafre15";

export function verificarAccesoAdmin() {
    const passwordInput = prompt("🔑 Ingrese la clave de administrador para ver el Dashboard:");
    
    if (passwordInput === null) return; 
    
    if (passwordInput === CONTRASENA_MAESTRA) {
        abrirDashboard();
    } else {
        alert("❌ Clave incorrecta. Acceso denegado.");
    }
}

function abrirDashboard() {
    const modal = document.getElementById('dashboard-admin');
    if (!modal) return;

    const citasGuardadas = JSON.parse(localStorage.getItem('barber_analytics_citas')) || [];
    
    document.getElementById('dash-total-citas').textContent = citasGuardadas.length;

    let ingresosTotales = 0;
    let mapeoServicios = {};
    let mapeoBarberos = {};

    citasGuardadas.forEach(cita => {
        const precioNumerico = parseFloat(cita.precio.replace(/[^0-9.]/g, '')) || 0;
        ingresosTotales += precioNumerico;

        mapeoServicios[cita.servicio] = (mapeoServicios[cita.servicio] || 0) + 1;
        mapeoBarberos[cita.barbero] = (mapeoBarberos[cita.barbero] || 0) + 1;
    });

    document.getElementById('dash-total-ingresos').textContent = `$${ingresosTotales.toFixed(2)}`;

    const topServicio = obtenerMaximoMapeo(mapeoServicios);
    const topBarbero = obtenerMaximoMapeo(mapeoBarberos);

    document.getElementById('dash-servicio-top').textContent = topServicio.nombre;
    document.getElementById('dash-servicio-cant').textContent = `${topServicio.cantidad} ventas`;

    document.getElementById('dash-barbero-top').textContent = topBarbero.nombre;
    document.getElementById('dash-barbero-cant').textContent = `${topBarbero.cantidad} turnos`;

    modal.classList.remove('ocultar-dashboard');
}

export function cerrarDashboard() {
    const modal = document.getElementById('dashboard-admin');
    if (modal) modal.classList.add('ocultar-dashboard');
}

export function resetearEstadisticas() {
    if (confirm("⚠️ ¿Está seguro de borrar todas las estadísticas? Esta acción es irreversible.")) {
        localStorage.removeItem('barber_analytics_citas');
        alert("📊 Datos reseteados.");
        abrirDashboard(); 
    }
}

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