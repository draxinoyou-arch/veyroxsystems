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
cotizaciones:document.getElementById("cotizacionesSection"),
servicios:document.getElementById("serviciosSection"),
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

/* Cerrar menú en celular */
if(window.innerWidth <= 768){

    sidebar.classList.remove("show");

}

};

});

/*=========================================
=            ESTADÍSTICAS                 =
=========================================*/
async function cargarEstadisticas(){

    const cotizaciones = await getDocs(collection(db,"cotizaciones"));
    const servicios = await getDocs(collection(db,"servicios"));

    const clientesTotal = document.getElementById("clientesTotal");
    const cotizacionesTotal = document.getElementById("cotizacionesTotal");
    const serviciosTotal = document.getElementById("serviciosTotal");
    const mensajesTotal = document.getElementById("mensajesTotal");

    if(clientesTotal) clientesTotal.textContent = "—";
    if(cotizacionesTotal) cotizacionesTotal.textContent = cotizaciones.size;
    if(serviciosTotal) serviciosTotal.textContent = servicios.size;
    if(mensajesTotal) mensajesTotal.textContent = "—";

}
cargarEstadisticas();
/*=========================================
=            INICIALIZACIÓN               =
=========================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await cargarEstadisticas();

        console.log("✅ Dashboard cargado correctamente.");

    } catch (error) {

        console.error("Error al iniciar el dashboard:", error);

    }

});