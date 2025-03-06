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
