const AdmZip = require("adm-zip");
const { XMLParser } = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");

function extractCoordinates(kmzPath) {
    try {
        const zip = new AdmZip(kmzPath);
        const kmlFile = zip.getEntries().find(entry => entry.entryName.endsWith(".kml"));

        if (!kmlFile) {
            console.error(`No se encontró un archivo KML en ${kmzPath}`);
            return null;
        }

        const kmlData = kmlFile.getData().toString("utf-8");
        const parser = new XMLParser({ ignoreAttributes: false });
        const parsedKml = parser.parse(kmlData);

        // Extraer coordenadas
        const coordinatesTag = parsedKml?.kml?.Document?.Placemark?.LineString?.coordinates;
        if (!coordinatesTag) {
            console.error(`No se encontraron coordenadas en ${kmzPath}`);
            return null;
        }

        // Convertir en formato JSON
        const coordinates = coordinatesTag.trim().split(" ").map(coord => {
            const [lng, lat] = coord.split(",");
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });

        return coordinates;
    } catch (error) {
        console.error(`Error procesando ${kmzPath}:`, error);
        return null;
    }
}

// Procesar todos los archivos KMZ en la carpeta "rutas"
const rutasFolder = "./rutas";
const archivos = fs.readdirSync(rutasFolder).filter(file => file.endsWith(".kmz"));

const todasLasRutas = {};

archivos.forEach(archivo => {
    const rutaCompleta = path.join(rutasFolder, archivo);
    const nombreRuta = path.basename(archivo, ".kmz");

    const coords = extractCoordinates(rutaCompleta);
    if (coords) {
        todasLasRutas[nombreRuta] = coords;
    }
});

fs.writeFileSync("rutas.json", JSON.stringify(todasLasRutas, null, 2));
console.log("Todas las rutas han sido procesadas y guardadas en rutas.json");
