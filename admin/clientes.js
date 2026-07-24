import { db } from "../firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tablaClientes = document.getElementById("tablaClientes");
const clientesTotal = document.getElementById("clientesTotal");

async function cargarClientes() {

    if (!tablaClientes) return;

    tablaClientes.innerHTML = "";

    const consulta = await getDocs(collection(db, "clientes"));

    clientesTotal.textContent = consulta.size;

    if (consulta.empty) {

        tablaClientes.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No hay clientes registrados.
                </td>
            </tr>
        `;

        return;

    }

    consulta.forEach((doc) => {

        const cliente = doc.data();

        tablaClientes.innerHTML += `
            <tr>

                <td>${cliente.nombre || "-"}</td>

                <td>${cliente.empresa || "-"}</td>

                <td>${cliente.telefono || "-"}</td>

                <td>${cliente.correo || "-"}</td>

                <td>${cliente.estado || "Pendiente"}</td>

                <td>

                    <button
    class="btn btn-warning btn-sm"
    onclick="editarCliente('${doc.id}')">

    Editar

</button>

<button
    class="btn btn-danger btn-sm"
    onclick="eliminarCliente('${doc.id}')">

    Eliminar

</button>

                </td>

            </tr>
        `;

    });

}

cargarClientes();
const btnNuevo = document.getElementById("nuevoCliente");
const btnGuardar = document.getElementById("guardarCliente");

const clienteNombre = document.getElementById("clienteNombre");
const clienteEmpresa = document.getElementById("clienteEmpresa");
const clienteTelefono = document.getElementById("clienteTelefono");
const clienteCorreo = document.getElementById("clienteCorreo");

let clienteEditando = null;

btnNuevo.addEventListener("click", () => {

    clienteEditando = null;

    btnGuardar.textContent = "Guardar";

    clienteNombre.value = "";
    clienteEmpresa.value = "";
    clienteTelefono.value = "";
    clienteCorreo.value = "";

    new bootstrap.Modal(
        document.getElementById("modalCliente")
    ).show();

});

btnGuardar.addEventListener("click", async () => {

    const datos = {

        nombre: clienteNombre.value,

        empresa: clienteEmpresa.value,

        telefono: clienteTelefono.value,

        correo: clienteCorreo.value,

        estado: "Pendiente"

    };

    if (clienteEditando) {

        await updateDoc(
            doc(db, "clientes", clienteEditando),
            datos
        );

    } else {

        await addDoc(
            collection(db, "clientes"),
            datos
        );

    }

    bootstrap.Modal
        .getInstance(document.getElementById("modalCliente"))
        .hide();

    clienteEditando = null;

    btnGuardar.textContent = "Guardar";

    clienteNombre.value = "";
    clienteEmpresa.value = "";
    clienteTelefono.value = "";
    clienteCorreo.value = "";

    cargarClientes();

});

window.editarCliente = async (id) => {

    clienteEditando = id;

    const documento = await getDoc(doc(db, "clientes", id));

    const cliente = documento.data();

    clienteNombre.value = cliente.nombre;

    clienteEmpresa.value = cliente.empresa;

    clienteTelefono.value = cliente.telefono;

    clienteCorreo.value = cliente.correo;

    btnGuardar.textContent = "Actualizar Cliente";

    new bootstrap.Modal(
        document.getElementById("modalCliente")
    ).show();

};
window.eliminarCliente = async (id) => {

    const confirmar = confirm(
        "¿Deseas eliminar este cliente?"
    );

    if (!confirmar) return;

    await deleteDoc(
        doc(db, "clientes", id)
    );

    cargarClientes();

};