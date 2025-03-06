const express = require("express");
const { obtenerRuta } = require("../controllers/routeController");

const router = express.Router();

router.get("/", obtenerRuta);

module.exports = router;
