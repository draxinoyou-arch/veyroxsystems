import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tabla = document.getElementById("tablaCotizaciones");

async function cargarCotizaciones() {

    tabla.innerHTML = "";

    const consulta = await getDocs(collection(db, "cotizaciones"));

    if (consulta.empty) {

        tabla.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No hay cotizaciones registradas.
            </td>
        </tr>`;

        return;
    }

    consulta.forEach((documento) => {

        const datos = documento.data();

        let fecha = "";

        if (datos.fecha?.toDate) {
            fecha = datos.fecha.toDate().toLocaleDateString("es-PE");
        }

        tabla.innerHTML += `
        <tr>

            <td>${datos.nombre ?? "-"}</td>

            <td>${datos.whatsapp ?? "-"}</td>

            <td>${datos.correo ?? "-"}</td>

            <td>${datos.servicio ?? "-"}</td>

<td>

    <button
        class="btn btn-info btn-sm"
        onclick="verProyecto(\`${datos.proyecto ?? ""}\`)">

        <i class="fa-solid fa-eye"></i>
        Ver

    </button>

</td>

<td>

    <span class="badge bg-${datos.estado === "Pendiente" ? "warning" : "success"}">

        ${datos.estado}

    </span>

</td>

            <td>${fecha}</td>

            <td>

                <a
href="https://wa.me/51${datos.whatsapp}?text=${encodeURIComponent(
`Hola ${datos.nombre} 👋

Soy de VEYROX Systems.

Hemos recibido tu solicitud de cotización para:

${datos.servicio}

En unos momentos te ayudaremos con toda la información.

Muchas gracias por contactarnos.`)}"

target="_blank"

class="btn btn-success btn-sm"

title="Responder por WhatsApp">

<i class="fa-brands fa-whatsapp"></i>

</a>

                <button
                    class="btn btn-primary btn-sm ms-1"
                    onclick="atenderCotizacion('${documento.id}')">

                    Atendida

                </button>

                <button
                    class="btn btn-danger btn-sm ms-1"
                    onclick="eliminarCotizacion('${documento.id}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>`;
    });

}

window.atenderCotizacion = async function(id){

    await updateDoc(doc(db,"cotizaciones",id),{

        estado:"Atendida"

    });

    cargarCotizaciones();

}

window.eliminarCotizacion = async function(id){

    if(!confirm("¿Eliminar esta cotización?")) return;

    await deleteDoc(doc(db,"cotizaciones",id));

    cargarCotizaciones();

}
window.verProyecto = function(proyecto){

    document.getElementById("textoProyecto").textContent = proyecto;

    const modal = new bootstrap.Modal(
        document.getElementById("modalProyecto")
    );

    modal.show();

}

document.addEventListener("DOMContentLoaded", cargarCotizaciones);