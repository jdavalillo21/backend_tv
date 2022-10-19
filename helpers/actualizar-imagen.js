const fs = require('fs');

const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');
const Producto = require('../models/producto');


const borrarImagen = ( path ) => {
    if( fs.existsSync( path ) ){
        fs.unlinkSync( path );//Borra la imagen anterior
    }
}


const actualizarImagen = async( tipo, id, nombreArchivo ) => {
    let pathAnterior = '';
    switch( tipo ){
        case 'productos':
            const producto = await Producto.findById( id );
            if( !producto ){
                console.log('Producto no encontrado');
                return false;
            }

            pathAnterior = `./uploads/productos/${ producto.imagen }`;
            borrarImagen( pathAnterior );

            producto.imagen = nombreArchivo;
            await producto.save();
            return true;

        break;
        case 'empresas':
            const empresa = await Empresa.findById( id );
            if( !empresa ){
                console.log('Empresa no encontrado');
                return false;
            }

            pathAnterior = `./uploads/empresas/${ empresa.imagen }`;
            borrarImagen( pathAnterior );

            empresa.imagen = nombreArchivo;
            await empresa.save();
            return true;
        break;
        case 'usuarios':
            const usuario = await Usuario.findById( id );
            if( !usuario ){
                console.log('Usuario no encontrado');
                return false;
            }

            pathAnterior = `./uploads/usuarios/${ usuario.imagen }`;
            borrarImagen( pathAnterior );

            usuario.imagen = nombreArchivo;
            await usuario.save();
            return true;
        break;
    }
}

module.exports = {
    actualizarImagen
}