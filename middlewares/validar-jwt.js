const { response } = require("express");
const jwt = require("jsonwebtoken");


const validarJWT = (req, res = response, next) => {
    //Leer el token
    //Se lee de los headers
    const token = req.header('x-token');

    //validar token
    if(!token){
        return res.status(401).json({
            ok: false,
            msj: "No existe token"
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        next();
    } catch (error) {
        const respuesta_error = "token inválido";
        console.log(respuesta_error);
        return res.status(400).json({
            ok: false,
            msj: respuesta_error
        });
    }
}

module.exports = {
    validarJWT
}