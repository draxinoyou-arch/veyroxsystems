import { app, db } from "../firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

const CLOUD_NAME = "fhkugeoo";
const UPLOAD_PRESET = "veyrox";

let servicioEditando = null;
let proyectoEditando = null;

/*=========================================
=            SUBIR IMAGEN CLOUDINARY       =
=========================================*/

async function subirImagen(inputId){

    const archivo = document.getElementById(inputId).files[0];

    if(!archivo) return "";

    const datos = new FormData();

    datos.append("file", archivo);
    datos.append("upload_preset", UPLOAD_PRESET);

    try{

        const respuesta = await fetch(

            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

            {
                method:"POST",
                body:datos
            }

        );

        const resultado = await respuesta.json();

        return resultado.secure_url || "";

    }catch(error){

        console.error(error);

        alert("Error al subir la imagen.");

        return "";

    }

}

/*=========================================
=            CERRAR SESIÓN                =
=========================================*/

document.getElementById("logout").addEventListener("click", async ()=>{

    await signOut(auth);

    location.href="index.html";

});

/*=========================================
=            SIDEBAR RESPONSIVE           =
=========================================*/

const sidebar=document.querySelector(".sidebar");

document.getElementById("menuBtn").addEventListener("click",()=>{

    sidebar.classList.toggle("show");

});

/*=========================================
=            CAMBIO DE SECCIONES          =
=========================================*/

const secciones={

dashboard:document.getElementById("dashboardSection"),
clientes:document.getElementById("clientesSection"),
cotizaciones:document.getElementById("cotizacionesSection"),
servicios:document.getElementById("serviciosSection"),
portafolio:document.getElementById("portafolioSection"),
mensajes:document.getElementById("mensajesSection"),
configuracion:document.getElementById("configuracionSection")

};

document.querySelectorAll(".sidebar li").forEach(item=>{

item.onclick=()=>{

document.querySelectorAll(".sidebar li").forEach(x=>x.classList.remove("active"));

item.classList.add("active");

Object.values(secciones).forEach(sec=>{

if(sec) sec.classList.add("d-none");

});

const nombre=item.dataset.section;

if(secciones[nombre]){

secciones[nombre].classList.remove("d-none");

}

};

});

/*=========================================
=            ESTADÍSTICAS                 =
=========================================*/

async function cargarEstadisticas(){

document.getElementById("clientesTotal").textContent=
(await getDocs(collection(db,"clientes"))).size;

document.getElementById("cotizacionesTotal").textContent=
(await getDocs(collection(db,"cotizaciones"))).size;

document.getElementById("serviciosTotal").textContent=
(await getDocs(collection(db,"servicios"))).size;

document.getElementById("mensajesTotal").textContent=
(await getDocs(collection(db,"mensajes"))).size;

}

cargarEstadisticas();
/*=========================================
=            MODAL SERVICIOS              =
=========================================*/

const btnNuevoServicio = document.getElementById("nuevoServicio");
const btnNuevoServicio2 = document.getElementById("nuevoServicio2");

function abrirModalServicio() {

    servicioEditando = null;

    document.getElementById("guardarServicio").textContent = "Guardar Servicio";

    document.getElementById("nombreServicio").value = "";
    document.getElementById("precioServicio").value = "";
    document.getElementById("descripcionServicio").value = "";
    document.getElementById("imagenServicio").value = "";

    new bootstrap.Modal(
        document.getElementById("modalServicio")
    ).show();

}

if (btnNuevoServicio) btnNuevoServicio.onclick = abrirModalServicio;
if (btnNuevoServicio2) btnNuevoServicio2.onclick = abrirModalServicio;


/*=========================================
=            GUARDAR SERVICIO             =
=========================================*/

document.getElementById("guardarServicio").addEventListener("click", async () => {

    const nombre = document.getElementById("nombreServicio").value.trim();
    const precio = document.getElementById("precioServicio").value;
    const descripcion = document.getElementById("descripcionServicio").value.trim();

    if (!nombre || !precio) {

        alert("Completa todos los datos.");

        return;

    }

    let imagen = "";

    if (document.getElementById("imagenServicio").files.length) {

        imagen = await subirImagen("imagenServicio");

    }

    if (servicioEditando) {

        const datos = {

            nombre,
            precio: Number(precio),
            descripcion,
            fecha: new Date()

        };

        if (imagen) {

            datos.imagen = imagen;

        }

        await updateDoc(
            doc(db, "servicios", servicioEditando),
            datos
        );

    } else {

        await addDoc(collection(db, "servicios"), {

            nombre,
            precio: Number(precio),
            descripcion,
            imagen,
            fecha: new Date()

        });

    }

    bootstrap.Modal.getInstance(
        document.getElementById("modalServicio")
    ).hide();

    servicioEditando = null;

    await cargarServicios();
    await cargarEstadisticas();

});


/*=========================================
=            TABLA SERVICIOS              =
=========================================*/

async function cargarServicios() {

    const tabla = document.getElementById("tablaServicios");
    const tabla2 = document.getElementById("tablaServicios2");

    if (tabla) tabla.innerHTML = "";
    if (tabla2) tabla2.innerHTML = "";

    const consulta = await getDocs(collection(db, "servicios"));

    if (consulta.empty) {

        const fila = `
        <tr>
            <td colspan="4" class="text-center">
                No hay servicios registrados.
            </td>
        </tr>`;

        if (tabla) tabla.innerHTML = fila;
        if (tabla2) tabla2.innerHTML = fila;

        return;

    }

    consulta.forEach((documento) => {

        const servicio = documento.data();

        const fila = `
        <tr>

            <td>
                <img src="${servicio.imagen}" width="70" style="border-radius:10px">
            </td>

            <td>${servicio.nombre}</td>

            <td>S/ ${servicio.precio}</td>

            <td>

                <button class="btn btn-warning btn-sm me-2"
                    onclick="editarServicio('${documento.id}')">

                    ✏️

                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="eliminarServicio('${documento.id}')">

                    🗑

                </button>

            </td>

        </tr>`;

        if (tabla) tabla.innerHTML += fila;
        if (tabla2) tabla2.innerHTML += fila;

    });

}

window.eliminarServicio = async (id) => {

    if (!confirm("¿Eliminar servicio?")) return;

    await deleteDoc(doc(db, "servicios", id));

    await cargarServicios();
    await cargarEstadisticas();

};

window.editarServicio = async (id) => {

    servicioEditando = id;

    const documento = await getDoc(doc(db, "servicios", id));

    const servicio = documento.data();

    document.getElementById("nombreServicio").value = servicio.nombre;
    document.getElementById("precioServicio").value = servicio.precio;
    document.getElementById("descripcionServicio").value = servicio.descripcion;

    document.getElementById("guardarServicio").textContent = "Actualizar Servicio";

    new bootstrap.Modal(
        document.getElementById("modalServicio")
    ).show();

};

cargarServicios();
/*=========================================
=            MODAL PORTAFOLIO             =
=========================================*/

const btnNuevoProyecto = document.getElementById("nuevoProyecto");

function abrirModalProyecto() {

    proyectoEditando = null;

    document.getElementById("guardarProyecto").textContent = "Guardar Proyecto";

    document.getElementById("nombreProyecto").value = "";
    document.getElementById("categoriaProyecto").value = "";
    document.getElementById("descripcionProyecto").value = "";
    document.getElementById("linkProyecto").value = "";
    document.getElementById("imagenProyecto").value = "";

    new bootstrap.Modal(
        document.getElementById("modalPortafolio")
    ).show();

}

if (btnNuevoProyecto) {
    btnNuevoProyecto.onclick = abrirModalProyecto;
}


/*=========================================
=            GUARDAR PROYECTO             =
=========================================*/

document.getElementById("guardarProyecto").addEventListener("click", async () => {

    const nombre = document.getElementById("nombreProyecto").value.trim();
    const categoria = document.getElementById("categoriaProyecto").value.trim();
    const descripcion = document.getElementById("descripcionProyecto").value.trim();
    const link = document.getElementById("linkProyecto").value.trim();

    if (!nombre || !categoria) {
        alert("Completa el nombre y la categoría.");
        return;
    }

    let imagen = "";

    if (document.getElementById("imagenProyecto").files.length) {
        imagen = await subirImagen("imagenProyecto");
    }

    if (proyectoEditando) {

        const datos = {
            nombre,
            categoria,
            descripcion,
            link,
            fecha: new Date()
        };

        if (imagen) {
            datos.imagen = imagen;
        }

        await updateDoc(
            doc(db, "portafolio", proyectoEditando),
            datos
        );

    } else {

        await addDoc(collection(db, "portafolio"), {
            nombre,
            categoria,
            descripcion,
            link,
            imagen,
            fecha: new Date()
        });

    }

    bootstrap.Modal.getInstance(
        document.getElementById("modalPortafolio")
    ).hide();

    proyectoEditando = null;

    await cargarPortafolio();

});


/*=========================================
=            TABLA PORTAFOLIO             =
=========================================*/

async function cargarPortafolio() {

    const tabla = document.getElementById("tablaPortafolio");

    if (!tabla) return;

    tabla.innerHTML = "";

    const consulta = await getDocs(collection(db, "portafolio"));

    if (consulta.empty) {

        tabla.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                No hay proyectos registrados.
            </td>
        </tr>`;

        return;
    }

    consulta.forEach((documento) => {

        const proyecto = documento.data();

        tabla.innerHTML += `
        <tr>

            <td>
                <img src="${proyecto.imagen}" width="70" style="border-radius:10px">
            </td>

            <td>${proyecto.nombre}</td>

            <td>${proyecto.categoria}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editarProyecto('${documento.id}')">

                    ✏️

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarProyecto('${documento.id}')">

                    🗑

                </button>

            </td>

        </tr>`;
    });

}

window.eliminarProyecto = async (id) => {

    if (!confirm("¿Eliminar proyecto?")) return;

    await deleteDoc(doc(db, "portafolio", id));

    await cargarPortafolio();

};

window.editarProyecto = async (id) => {

    proyectoEditando = id;

    const documento = await getDoc(doc(db, "portafolio", id));

    const proyecto = documento.data();

    document.getElementById("nombreProyecto").value = proyecto.nombre;
    document.getElementById("categoriaProyecto").value = proyecto.categoria;
    document.getElementById("descripcionProyecto").value = proyecto.descripcion;
    document.getElementById("linkProyecto").value = proyecto.link || "";

    document.getElementById("guardarProyecto").textContent = "Actualizar Proyecto";

    new bootstrap.Modal(
        document.getElementById("modalPortafolio")
    ).show();

};

cargarPortafolio();
/*=========================================
=            INICIALIZACIÓN               =
=========================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await cargarServicios();
        await cargarPortafolio();
        await cargarEstadisticas();

        console.log("✅ Dashboard cargado correctamente.");

    } catch (error) {

        console.error("Error al iniciar el dashboard:", error);

    }

});