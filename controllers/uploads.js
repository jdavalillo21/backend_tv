const path  = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = ( req, res = response ) => {

    const tipo      = req.params.tipo;
    const id        = req.params.id;
    
    //Validar que sea una tabla valida para archivos
    const tiposValidos = ['empresas', 'productos', 'usuarios'];

    if( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msj: 'Tipo inválido'
        });
    }
    //En este punto, ya somos capaces de recibir el archivo

    //Se valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msj: 'No se seleccionó archivo.'
        });
    }

    //Procesar la imagen

    // 1.- Extraer
    const file = req.files.archivo;//Donde archivo es el nombre de la variable que se pasa en la solicitud

    // 2. Extensión del archivo
    const nombreCorto = file.name.split('.');
    const extensionArchivo = nombreCorto[ nombreCorto.length - 1 ];

    // 3. validar Extensión
    const extensioneValidas = [ 'gif', 'png', 'jpg', 'jpeg', 'JPG' ];
    if( !extensioneValidas.includes( extensionArchivo ) ){
        return res.status(400).json({
            ok: false,
            msj: 'La extensión es inválida'
        });
    }

    // 4. Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // 5. Path de almacenamiento de la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    
    //Mover la imagen (.mv)
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msj: 'Error al mover la imagen'
            });
        }

        //Actualizar la BBDD
        actualizarImagen( tipo, id, nombreArchivo );

        res.status(200).json({

            ok:true,
            nombreArchivo
    
        });    
    });


    
}


const retornaImagen = ( req, res = response ) => {
    const tipo      = req.params.tipo;
    const foto      = req.params.imagen;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}` );

    //imagen por defecto
    if( fs.existsSync( pathImg ) ){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-img.png` );
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}