const { obtenerCoordenadas } = require("../services/geolocationService");
const { encontrarRutaMasCercana } = require("../services/routeService");

async function obtenerRuta(req, res) {
    const { direccion } = req.query;

    if (!direccion) {
        return res.status(400).json({ error: "Debe proporcionar una dirección en el formato correcto." });
    }

    try {
        const coordenadas = await obtenerCoordenadas(direccion);

        if (!coordenadas) {
            return res.status(404).json({ error: `No se encontraron coordenadas para: ${direccion}` });
        }

        const resultadoRuta = encontrarRutaMasCercana(coordenadas);

        if (!resultadoRuta) {
            return res.status(404).json({ error: "No se encontró una ruta cercana." });
        }

        res.json({
            direccion,
            coordenadas_busqueda: coordenadas,
            ruta: resultadoRuta.ruta,
            coordenada_cercana: resultadoRuta.coordenadaCercana,
            distancia: resultadoRuta.distancia.toFixed(4),
            coordenadas_ruta: resultadoRuta.coordenadasRuta // ← AGREGAMOS ESTO
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { obtenerRuta };
