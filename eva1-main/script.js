/* cambiar modo claro y oscuro*/
function cambiarTema() {
    document.body.classList.toggle("light-mode");

    const modoClaro = document.body.classList.contains("light-mode");

    localStorage.setItem("tema", modoClaro ? "claro" : "oscuro");

    actualizarBoton();
}

/* actualizar el texto del boton*/
function actualizarBoton() {
    const boton = document.getElementById("theme-toggle");

    if (document.body.classList.contains("light-mode")) {
        boton.textContent = "☀️ Modo Claro";
    } else {
        boton.textContent = "🌙 Modo Oscuro";
    }
}

/*carga el tema guardado*/
function cargarTema() {
    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "claro") {
        document.body.classList.add("light-mode");
    }

    actualizarBoton();
}

document.addEventListener("DOMContentLoaded", () => {
    cargarTema();

    const boton = document.getElementById("theme-toggle");

    boton.addEventListener("click", cambiarTema);
    function actualizarBoton() {
    const boton = document.getElementById("theme-toggle");

    if (document.body.classList.contains("light-mode")) {
        boton.textContent = "☀️";
    } else {
        boton.textContent = "🌙";
    }
}
});