import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function cargarServicios() {

    const lista = document.getElementById("listaServicios");

    if (!lista) return;

    lista.innerHTML = "";

    const consulta = await getDocs(collection(db, "servicios"));

    if (consulta.empty) {
    return;
}

    const servicios = consulta.docs.slice(0, 3);

servicios.forEach(doc => {

        const servicio = doc.data();

        lista.innerHTML += `

        <div class="col-lg-4 col-md-6">

            <div class="card servicio-card bg-dark h-100 shadow">

                <div class="servicio-icono">
    <i class="fas fa-code"></i>
</div>

                <div class="card-body d-flex flex-column">

                    <h4 class="text-success">
                        ${servicio.nombre}
                    </h4>

                    <p class="text-light flex-grow-1">
                        ${servicio.descripcion}
                    </p>

                    <h5 class="text-white mb-3">
                        S/ ${servicio.precio}
                    </h5>

                    <a
                        href="#contacto"
                        class="btn btn-success rounded-pill">

                        Solicitar Cotización

                    </a>

                </div>

            </div>

        </div>

        `;

    });

}

cargarServicios();
async function cargarPortafolio() {

    const lista = document.getElementById("listaPortafolio");

    if (!lista) return;

    lista.innerHTML = "";

    const consulta = await getDocs(collection(db, "portafolio"));

    if (consulta.empty) {

        lista.innerHTML = `
            <div class="col-12 text-center text-light">
                <h4>Aún no hay proyectos publicados.</h4>
            </div>
        `;

        return;
    }

    const servicios = consulta.docs.slice(0, 3);

servicios.forEach(doc => {

        const proyecto = doc.data();

        lista.innerHTML += `
        <div class="col-lg-4 col-md-6">

            <div class="card servicio-card h-100">

    <div class="card-body d-flex flex-column">

        <div class="servicio-icono">
            <i class="fas fa-code"></i>
        </div>

        <h4 class="mt-4">
            ${servicio.nombre}
        </h4>

        <p class="text-secondary flex-grow-1">
            ${servicio.descripcion}
        </p>

        <h5 class="precio">
            Desde S/ ${servicio.precio}
        </h5>

        <button
            class="btn btn-success rounded-pill mt-3 ver-detalles"
            data-bs-toggle="modal"
            data-bs-target="#modalServicio">

            Ver detalles

        </button>

    </div>

</div>

            </div>

        </div>
        `;
    });

}

cargarPortafolio();
async function animarNumero(id, destino){

    const elemento = document.getElementById(id);

    if(!elemento) return;

    let numero = 0;

    const velocidad = Math.max(1, Math.floor(destino / 50));

    const intervalo = setInterval(()=>{

        numero += velocidad;

        if(numero >= destino){

            numero = destino;

            clearInterval(intervalo);

        }

        elemento.textContent = numero + "+";

    },30);

}

async function cargarEstadisticasWeb(){

    const servicios = await getDocs(collection(db,"servicios"));
    const proyectos = await getDocs(collection(db,"portafolio"));

    animarNumero("statClientes", servicios.size * 5 || 10);
    animarNumero("statProyectos", proyectos.size);

}

cargarEstadisticasWeb();