/*
    Ruta: /api/uploads/:tipo/:id
*/
const { Router } = require("express");
const expressFileUpload = require('express-fileupload');
const { body } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");

const { fileUpload, retornaImagen } = require("../controllers/uploads");



const router = Router();
router.use( expressFileUpload() );


router.put("/:tipo/:id", validarJWT, fileUpload);
router.get("/:tipo/:imagen", retornaImagen);

module.exports = router;