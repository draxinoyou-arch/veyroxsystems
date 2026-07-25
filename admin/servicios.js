import {
    db,
    storage
} from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

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

        const ruta = ref(storage,"servicios/"+servicio.id);

        await uploadBytes(ruta,archivo);

        imagenURL = await getDownloadURL(ruta);

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