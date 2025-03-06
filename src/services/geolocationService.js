const axios = require("axios");

async function obtenerCoordenadas(direccion) {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: direccion, format: "json" },
        });

        if (response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon),
            };
        } else {
            throw new Error(`No se encontraron coordenadas para la dirección: ${direccion}`);
        }
    } catch (error) {
        console.error("Error obteniendo coordenadas:", error.message);
        throw new Error("Hubo un problema al obtener las coordenadas. Inténtalo de nuevo más tarde.");
    }
}

module.exports = { obtenerCoordenadas };
