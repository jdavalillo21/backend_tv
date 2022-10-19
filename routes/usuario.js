/*
    Ruta: /api/usuario
*/
const { Router } = require("express");
const { body } = require("express-validator");

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, cambioPassword } = require('../controllers/usuarios');

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getUsuarios);


//El segundo argumento de esta ruta es un arreglo de middlewares que necesito para hacer 
//validaciones y otras tareas en esta ruta
//IMPORTANTE: cuando la ruta solo tiene 2 argumentos, el segundo argumento es el controlador
router.post("/", 
    [
        body('nombre', "el nombre es un campo obligatorio").not().isEmpty(),
        body('apellido', "el apellido es un campo obligatorio").not().isEmpty(),
        body('password', "el password es un campo obligatorio").not().isEmpty(),
        body('email', "el email es un campo obligatorio").isEmail(),
        validarCampos,
    ], 
    crearUsuario
);

router.put("/recovery",
    [
        body("email", "El correo electrónico es obligatorio").isEmail(),
        body("password","La contraseña es requerida").not().isEmpty(),
        body("password2","La confirmación de contraseña es requerida").not().isEmpty(),
        validarCampos
    ],
    cambioPassword
);

router.put("/:id", 
    [
        validarJWT
    ], 
    actualizarUsuario,
);


router.delete("/:id",
    validarJWT,
    borrarUsuario,
);

module.exports = router;