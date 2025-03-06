const rutas = require("../../data/rutas.json");

function calcularDistancia(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function encontrarRutaMasCercana(coord) {

    let rutaMasCercana = null;
    let menorDistancia = Infinity;
    let coordenadaCercana = null;
    let coordenadasRuta = [];

    Object.entries(rutas).forEach(([nombreRuta, coordenadas]) => {
        coordenadas.forEach(({ lat, lng }, index) => {
            const distancia = calcularDistancia(coord, { lat, lng });

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                rutaMasCercana = nombreRuta;
                coordenadaCercana = { lat, lng };

                // Recortar un tramo de la ruta (por ejemplo, 10 puntos antes y después)
                let inicio = Math.max(0, index - 10);
                let fin = Math.min(coordenadas.length, index + 10);
                coordenadasRuta = coordenadas.slice(inicio, fin);
            }
        });
    });

    return rutaMasCercana
        ? { 
            ruta: rutaMasCercana, 
            coordenadaCercana, 
            distancia: menorDistancia, 
            coordenadasRuta  // ← Ahora solo devuelve un tramo cercano
          }
        : null;
}

module.exports = { encontrarRutaMasCercana };