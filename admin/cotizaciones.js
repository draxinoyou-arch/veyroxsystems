import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// =====================================
// VARIABLES
// =====================================

const tabla = document.getElementById("tablaCotizaciones");

const cliente = document.getElementById("cotizacionCliente");
const servicio = document.getElementById("cotizacionServicio");
const total = document.getElementById("cotizacionTotal");
const estado = document.getElementById("cotizacionEstado");

const btnNueva = document.getElementById("nuevaCotizacion");
const btnGuardar = document.getElementById("guardarCotizacion");

const modal = new bootstrap.Modal(
    document.getElementById("modalCotizacion")
);

let editando = null;

// =====================================
// ABRIR MODAL
// =====================================

btnNueva.addEventListener("click", async () => {

    editando = null;

    cliente.innerHTML =
        '<option value="">Seleccione un cliente</option>';

    servicio.innerHTML =
        '<option value="">Seleccione un servicio</option>';

    total.value = "";
    estado.value = "Pendiente";

    await cargarClientes();
    await cargarServicios();

    modal.show();

});
// =====================================
// CARGAR CLIENTES
// =====================================

async function cargarClientes() {

    const consulta = await getDocs(collection(db, "clientes"));

    consulta.forEach((documento) => {

        const datos = documento.data();

        cliente.innerHTML += `
            <option value="${documento.id}">
                ${datos.nombre}
            </option>
        `;

    });

}

// =====================================
// CARGAR SERVICIOS
// =====================================

async function cargarServicios() {

    const consulta = await getDocs(collection(db, "servicios"));

    consulta.forEach((documento) => {

        const datos = documento.data();

        servicio.innerHTML += `
            <option
                value="${documento.id}"
                data-precio="${datos.precio}">
                ${datos.nombre}
            </option>
        `;

    });

}

// =====================================
// CALCULAR TOTAL
// =====================================

servicio.addEventListener("change", () => {

    const opcion = servicio.options[servicio.selectedIndex];

    if (!opcion) return;

    total.value = opcion.dataset.precio || "";

});
// =====================================
// GUARDAR COTIZACIÓN
// =====================================

btnGuardar.addEventListener("click", guardarCotizacion);

async function guardarCotizacion() {

    if (!cliente.value || !servicio.value) {
        alert("Seleccione un cliente y un servicio.");
        return;
    }

    const opcion = servicio.options[servicio.selectedIndex];

    const datos = {
        cliente: cliente.value,
        servicio: servicio.value,
        total: Number(opcion.dataset.precio),
        estado: estado.value,
        fecha: serverTimestamp()
    };

    try {

        if (editando) {

            await updateDoc(
                doc(db, "cotizaciones", editando),
                datos
            );

            alert("Cotización actualizada.");

        } else {

            await addDoc(
                collection(db, "cotizaciones"),
                datos
            );

            alert("Cotización registrada.");

        }

        modal.hide();

        editando = null;

        await cargarCotizaciones();

    } catch (error) {

        console.error(error);
        alert("Error al guardar la cotización.");

    }

}
// =====================================
// LISTAR COTIZACIONES
// =====================================

async function cargarCotizaciones() {

    tabla.innerHTML = "";

    const consulta = await getDocs(collection(db, "cotizaciones"));

    if (consulta.empty) {

        tabla.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No hay cotizaciones registradas.
            </td>
        </tr>`;

        return;
    }

    let numero = 1;

    for (const documento of consulta.docs) {

        const datos = documento.data();

        let nombreCliente = "-";
        let nombreServicio = "-";

        try {

            const cli = await getDoc(doc(db, "clientes", datos.cliente));

            if (cli.exists()) {
                nombreCliente = cli.data().nombre;
            }

        } catch {}

        try {

            const ser = await getDoc(doc(db, "servicios", datos.servicio));

            if (ser.exists()) {
                nombreServicio = ser.data().nombre;
            }

        } catch {}

        let fecha = "";

        if (datos.fecha?.toDate) {
            fecha = datos.fecha.toDate().toLocaleDateString("es-PE");
        }

        tabla.innerHTML += `
        <tr>

            <td>${numero++}</td>

            <td>${nombreCliente}</td>

            <td>${nombreServicio}</td>

            <td>S/ ${Number(datos.total).toFixed(2)}</td>

            <td>${datos.estado}</td>

            <td>${fecha}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarCotizacion('${documento.id}')">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm ms-2"
                    onclick="eliminarCotizacion('${documento.id}')">

                    Eliminar

                </button>

            </td>

        </tr>`;

    }

}

// =====================================
// EDITAR
// =====================================

window.editarCotizacion = async function(id){

    editando = id;

    const referencia = doc(db, "cotizaciones", id);

    const documento = await getDoc(referencia);

    if(!documento.exists()) return;

    const datos = documento.data();

    await cargarClientes();
    await cargarServicios();

    cliente.value = datos.cliente;
    servicio.value = datos.servicio;
    total.value = datos.total;
    estado.value = datos.estado;

    modal.show();

};

// =====================================
// ELIMINAR
// =====================================

window.eliminarCotizacion = async function(id){

    if(!confirm("¿Eliminar esta cotización?")) return;

    await deleteDoc(doc(db, "cotizaciones", id));

    await cargarCotizaciones();

};

// =====================================
// INICIAR
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    cargarCotizaciones();

});

console.log("Cotizaciones cargadas correctamente.");