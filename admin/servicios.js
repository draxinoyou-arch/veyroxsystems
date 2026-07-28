import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const CLOUD_NAME = "fhkugeoo";
const UPLOAD_PRESET = "veyrox";

async function subirImagen(inputId){

    const archivo = document.getElementById(inputId).files[0];

    if(!archivo) return "";

    const datos = new FormData();

    datos.append("file", archivo);
    datos.append("upload_preset", UPLOAD_PRESET);

    const respuesta = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method:"POST",
            body:datos
        }
    );

    const resultado = await respuesta.json();

    return resultado.secure_url || "";

}


const servicios = [

    {
        id: "desarrollo-web",
        boton: "guardarDesarrollo",
        descripcion: "descDesarrollo",
        precio: "precioDesarrollo",
        imagen: "imgDesarrollo"
    },

    {
        id: "tienda-virtual",
        boton: "guardarTienda",
        descripcion: "descTienda",
        precio: "precioTienda",
        imagen: "imgTienda"
    },

    {
        id: "sistema-web",
        boton: "guardarSistema",
        descripcion: "descSistema",
        precio: "precioSistema",
        imagen: "imgSistema"
    },

    {
        id: "diseno-grafico",
        boton: "guardarGrafico",
        descripcion: "descGrafico",
        precio: "precioGrafico",
        imagen: "imgGrafico"
    }

];

servicios.forEach(cargarServicio);

async function cargarServicio(servicio){

    const snap = await getDoc(doc(db,"servicios",servicio.id));

    if(snap.exists()){

        const data = snap.data();

        document.getElementById(servicio.descripcion).value = data.descripcion || "";
        document.getElementById(servicio.precio).value = data.precio || "";

    }

    document.getElementById(servicio.boton).onclick = () => guardar(servicio);

}

async function guardar(servicio){

    let imagenURL = "";

    const archivo = document.getElementById(servicio.imagen).files[0];

    if(archivo){

        imagenURL = await subirImagen(servicio.imagen);

    }else{

        const actual = await getDoc(doc(db,"servicios",servicio.id));

        if(actual.exists()){

            imagenURL = actual.data().imagen || "";

        }

    }

    await setDoc(doc(db,"servicios",servicio.id),{

        nombre: servicio.id,
        descripcion: document.getElementById(servicio.descripcion).value,
        precio: document.getElementById(servicio.precio).value,
        imagen: imagenURL

    });

    alert("Servicio actualizado correctamente.");

}