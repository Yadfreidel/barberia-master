// Base de datos profesional dividida por categorías (Estilo Barbalogía)
const serviciosBarberia = [
    // --- CATEGORÍA: CORTES ---
    { 
        id: 1, 
        categoria: "cortes",
        nombre: "Corte Clásico Ejecutivo", 
        precio: "$20", 
        descripcion: "Corte tradicional a tijera y máquina con acabado impecable y personalizado.", 
        imagen: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 2, 
        categoria: "cortes",
        nombre: "Mid Fade / Degradado Medio", 
        precio: "$25", 
        descripcion: "Degradado moderno a los costados con una transición suave y pulida.", 
        imagen: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 3, 
        categoria: "cortes",
        nombre: "Low Fade + Texturizado", 
        precio: "$25", 
        descripcion: "Degradado bajo ideal para dar textura, movimiento y volumen superior.", 
        imagen: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 4, 
        categoria: "cortes",
        nombre: "High Fade / Corte Alto", 
        precio: "$25", 
        descripcion: "Degradado alto de gran contraste, ideal para un estilo fresco y audaz.", 
        imagen: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 5, 
        categoria: "cortes",
        nombre: "Buzz Cut / Rapado de Diseño", 
        precio: "$18", 
        descripcion: "Corte militar uniforme con perfilado de líneas láser al milímetro.", 
        imagen: "https://images.unsplash.com/photo-1605497746444-ac9da5848ba7?q=80&w=500&auto=format&fit=crop" 
    },
    // --- CATEGORÍA: BARBA Y SPA ---
    { 
        id: 6, 
        categoria: "barba",
        nombre: "Ritual de Barba Completa", 
        precio: "$15", 
        descripcion: "Diseño de barba, tratamiento con toalla caliente, aceites esenciales y navaja.", 
        imagen: "https://images.unsplash.com/photo-1621605816047-5a7df4a9a995?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 7, 
        categoria: "barba",
        nombre: "Exfoliación & Limpieza Facial", 
        precio: "$15", 
        descripcion: "Remoción profunda de impurezas, puntos negros y mascarilla hidratante.", 
        imagen: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 8, 
        categoria: "barba",
        nombre: "Tinte / Camuflaje de Canas", 
        precio: "$30", 
        descripcion: "Coloración natural premium de alta duración para cabello o barba.", 
        imagen: "https://images.unsplash.com/photo-1593702295094-aea22597af65?q=80&w=500&auto=format&fit=crop" 
    },
    // --- CATEGORÍA: COMBOS EXPERIENCIA ---
    { 
        id: 9, 
        categoria: "combos",
        nombre: "Combo Experiencia Master", 
        precio: "$35", 
        descripcion: "Nuestro servicio estrella: Corte de cabello libre + ritual completo de barba.", 
        imagen: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=500&auto=format&fit=crop" 
    },
    { 
        id: 10, 
        categoria: "combos",
        nombre: "Servicio Completo VIP", 
        precio: "$50", 
        descripcion: "Corte premium, ritual de barba, exfoliación facial y bebida de cortesía.", 
        imagen: "https://images.unsplash.com/photo-1517832606589-7a59890bab71?q=80&w=500&auto=format&fit=crop" 
    }
];

export { serviciosBarberia };