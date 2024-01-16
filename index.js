import { getPosition } from "./utils/ubicacion.js";
let socket = new WebSocket('ws://localhost:4000');
let mapa;
socket.onopen = () => {
    console.log("Conectado al servidor WebSocket");

};


socket.onmessage = (event) => {
    console.log("Mensaje recibido:", event.data);
    const data = JSON.parse(event.data);
    //Aca agregaremos el pokemon al mapa
    let latitud = data.posicion.Latitud;
    let longitud = data.posicion.Longitud;
    console.log(data.posicion)
    let pokemon = L.icon({
        iconUrl: data.pokemon[0],
        iconSize:     [48, 48], 
        shadowSize:   [50, 64], 
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],  
        popupAnchor:  [-3, -76] 
    })

    L.marker([latitud, longitud], {icon: pokemon}).addTo(mapa);//lo ubicamos en el mapa
};



async function MiUbicacion() {
    try {
        let { latitud, longitud } = await getPosition();
        console.log(latitud, longitud);
         socket.send(JSON.stringify({"latitud": latitud, "longitud":longitud}))

        // Inicializar el mapa solo si aún no se ha creado
        if (!mapa) {
            mapa = L.map('map').setView([latitud, longitud], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapa);

        
        }

        // Verificar que el objeto de mapa esté definido
        if (mapa) {
            // Agregar o actualizar el marcador en el mapa
            L.marker([latitud, longitud]).addTo(mapa)
                .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        } else {
            console.error("El objeto de mapa no está definido correctamente.");
        }
    } catch (error) {
        console.error("Error al obtener la ubicación:", error.message);
    }

    // Llamar a MiUbicacion después de un intervalo de tiempo
    setTimeout(MiUbicacion, 1000);
}

// Llamar a MiUbicacion por primera vez
MiUbicacion();







