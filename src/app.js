const express = require("express");
const routeRoutes = require("./routes/routeRoutes");


const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());


// Usar las rutas
app.use("/api/rutas", routeRoutes);

module.exports = app;
