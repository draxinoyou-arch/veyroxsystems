import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const formulario = document.getElementById("formCotizacion");

formulario.addEventListener("submit", guardarCotizacion);

async function guardarCotizacion(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const servicio = document.getElementById("servicio").value;
    const proyecto = document.getElementById("proyecto").value.trim();

    try {

        await addDoc(collection(db, "cotizaciones"), {

            nombre,
            whatsapp,
            correo,
            servicio,
            proyecto,
            estado: "Pendiente",
            fecha: serverTimestamp()

        });

        alert("✅ Cotización enviada correctamente.");

        formulario.reset();

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al enviar la cotización.");

    }

}