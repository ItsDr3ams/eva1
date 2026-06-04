document.addEventListener('DOMContentLoaded', () => {
    iniciarTema();
    iniciarNavegacion();
    mostrarEquipo('todos');
    iniciarFiltros();
    iniciarValidacionFormulario();
    iniciarReservas();
});

/* MODO OSCURO / CLARO */
function iniciarTema() {
    const botonTema = document.getElementById('btn-tema');
    const elementoHtml = document.documentElement;

    let temaGuardado = 'claro';
    
    try {
        temaGuardado = localStorage.getItem('iglesia_tema') || 'claro';
    } catch (error) {
        console.warn("localStorage desactivado.");
    }

    elementoHtml.setAttribute('data-tema', temaGuardado);
    botonTema.textContent = temaGuardado === 'claro' ? '🌙' : '☀️';

    botonTema.addEventListener('click', () => {
        const temaActual = elementoHtml.getAttribute('data-tema');
        const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';
        
        elementoHtml.setAttribute('data-tema', nuevoTema);
        botonTema.textContent = nuevoTema === 'claro' ? '🌙' : '☀️';
        
        try {
            localStorage.setItem('iglesia_tema', nuevoTema);
        } catch (error) {}
    });
}

/* MENÚ HAMBURGUESA */
function iniciarNavegacion() {
    const botonMenu = document.getElementById('btn-menu');
    const menuNavegacion = document.getElementById('menu-principal');

    botonMenu.addEventListener('click', () => {
        menuNavegacion.classList.toggle('esta-activa');
        
        const estaExpandido = menuNavegacion.classList.contains('esta-activa');
        botonMenu.setAttribute('aria-expanded', estaExpandido);
        menuNavegacion.setAttribute('aria-hidden', !estaExpandido);
        
        if (estaExpandido) {
            menuNavegacion.querySelector('.navegacion__enlace').focus();
        }
    });
}

/* RENDERIZADO DINÁMICO DEL EQUIPO */
const datosEquipo = [
    { id: 1, nombre: "Elias Nuñez", rol: "Pastor Principal", categoria: "pastor", imagen: "assets/img/pastor_elias.png" },
    { id: 2, nombre: "Miguel Dinamarca", rol: "Encargado Jóvenes", categoria: "encargado", imagen: "assets/img/Miguel_dinamarca.png" },
    { id: 3, nombre: "Miguel Dinamarca", rol: "Encargado Sonido", categoria: "encargado", imagen: "assets/img/Miguel_dinamarca.png" },
    { id: 4, nombre: "Jonathan Hermosilla", rol: "Encargado Tesorería", categoria: "encargado", imagen: "assets/img/jonathan.png" }
];

function mostrarEquipo(categoriaFiltro) {
    const contenedor = document.getElementById('contenedor-equipo');
    contenedor.innerHTML = ''; 

    const equipoFiltrado = categoriaFiltro === 'todos' 
        ? datosEquipo 
        : datosEquipo.filter(miembro => miembro.categoria === categoriaFiltro);

    equipoFiltrado.forEach(miembro => {
        const articulo = document.createElement('article');
        articulo.classList.add('tarjeta-equipo');

        const img = document.createElement('img');
        img.src = miembro.imagen;
        img.alt = `Fotografía de ${miembro.nombre}`;
        img.classList.add('tarjeta-equipo__imagen');

        const rol = document.createElement('h3');
        rol.classList.add('tarjeta-equipo__rol');
        rol.textContent = miembro.rol;

        const nombre = document.createElement('p');
        nombre.classList.add('tarjeta-equipo__nombre');
        nombre.textContent = miembro.nombre;

        articulo.appendChild(img);
        articulo.appendChild(rol);
        articulo.appendChild(nombre);

        contenedor.appendChild(articulo);
    });
}

/* FILTROS INTERACTIVOS */
function iniciarFiltros() {
    const botonesFiltro = document.querySelectorAll('.boton-filtro');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            
            const categoria = e.target.getAttribute('data-filtro');
            mostrarEquipo(categoria);
        });
    });
}

/* VALIDACIÓN DE FORMULARIO */
function iniciarValidacionFormulario() {
    const formulario = document.getElementById('form-contacto');
    const mensajeExito = document.getElementById('mensaje-exito');

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        let esValido = true;

// Validación de Nombre
        if (nombre.length < 3) {
            mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres.');
            esValido = false;
        } else {
            limpiarError('nombre');
        }

        // Validación de Correo (Simulada)
        if (correo.length === 0) {
            mostrarError('correo', 'El correo no puede estar vacío.');
            esValido = false;
        } else if (correo.length > 20) {
            mostrarError('correo', 'El correo no puede superar los 20 caracteres.');
            esValido = false;
        } else if (!correo.includes('@')) {
            mostrarError('correo', 'El correo debe contener obligatoriamente un "@".');
            esValido = false;
        } else {
            limpiarError('correo');
        }

        // Validación de Mensaje
        if (mensaje.length < 10) {
            mostrarError('mensaje', 'El mensaje es muy corto (mínimo 10 caracteres).');
            esValido = false;
        } else {
            limpiarError('mensaje');
        }
    });
}

function mostrarError(idInput, mensaje) {
    const inputElemento = document.getElementById(idInput);
    const spanError = document.getElementById(`error-${idInput}`);
    inputElemento.classList.add('error-input');
    spanError.textContent = mensaje;
}

function limpiarError(idInput) {
    const inputElemento = document.getElementById(idInput);
    const spanError = document.getElementById(`error-${idInput}`);
    inputElemento.classList.remove('error-input');
    spanError.textContent = '';
}

/* SISTEMA DE RESERVAS */
function iniciarReservas() {
    const botonesReserva = document.querySelectorAll('.boton-reserva');
    const listaReservas = document.getElementById('lista-reservas');
    const botonLimpiar = document.getElementById('btn-limpiar-reservas');

    let reservas = [];
    
    try {
        reservas = JSON.parse(localStorage.getItem('asistencias_iglesia')) || [];
    } catch (error) {
        console.warn("localStorage desactivado.");
    }

    const renderizarListaReservas = () => {
        listaReservas.innerHTML = ''; 
        
        if (reservas.length === 0) {
            listaReservas.innerHTML = '<li>Aún no te has anotado a ninguna actividad.</li>';
            return;
        }

        reservas.forEach(reserva => {
            const li = document.createElement('li');
            li.textContent = `Confirmado para: ${reserva.dia}`;
            listaReservas.appendChild(li);
        });
    };

    botonesReserva.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const diaSeleccionado = e.target.getAttribute('data-dia');
            const yaInscrito = reservas.some(reserva => reserva.dia === diaSeleccionado);
            
            if (!yaInscrito) {
                reservas.push({ dia: diaSeleccionado });
                
                try {
                    localStorage.setItem('asistencias_iglesia', JSON.stringify(reservas));
                } catch (error) {}
                
                renderizarListaReservas();
                alert(`¡Te has anotado exitosamente para el ${diaSeleccionado}!`);
            } else {
                alert(`Ya estás anotado para el ${diaSeleccionado}.`);
            }
        });
    });

    botonLimpiar.addEventListener('click', () => {
        reservas = [];
        try {
            localStorage.removeItem('asistencias_iglesia');
        } catch(error) {}
        renderizarListaReservas();
    });

    renderizarListaReservas();
}