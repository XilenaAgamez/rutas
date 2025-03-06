const { obtenerCoordenadas } = require("../services/geolocationService");
const { encontrarRutaMasCercana } = require("../services/routeService");



async function obtenerRuta(req, res) {
    const { direccion } = req.query;

    if (!direccion) {
        return res.status(400).json({ error: "Debe proporcionar una dirección en el formato correcto." });
    }

    try {
        const coordenadas = await obtenerCoordenadas(direccion);

        if (!coordenadas || typeof coordenadas.lat !== "number" || typeof coordenadas.lng !== "number") {
            return res.status(404).json({ error: `No se encontraron coordenadas válidas para: ${direccion}` });
        }

        const resultadoRuta = encontrarRutaMasCercana(coordenadas);

        if (!resultadoRuta || resultadoRuta.error) {
            return res.status(404).json({ error: "No se encontró una ruta cercana." });
        }

        res.json({
            direccion,
            coordenadas_busqueda: coordenadas,
            ruta: resultadoRuta.ruta,
            coordenada_cercana: resultadoRuta.coordenadaCercana,
            distancia: resultadoRuta.distancia ? resultadoRuta.distancia.toFixed(4) : null,
            coordenadas_ruta: resultadoRuta.coordenadasRuta || []
        });
    } catch (error) {
        console.error("❌ Error en obtenerRuta:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

module.exports = { obtenerRuta };
