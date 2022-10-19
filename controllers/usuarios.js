const response = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

//Se importa el modelo
const Usuario = require("../models/usuario");

const getUsuarios = async(req, res) => {
    //recibir parameros por url
    const d = Number(req.query.d) || 0;
    const por_pagina = 5;
    const tipo = req.query.tipo || 'usuarios';

    //TODO: Validar que los tipos que se pasan por url son los correctos

    switch(tipo){
        case 'usuarios':
            //Con el Promise.all puedo ejecutar varias promesas de forma simultánea en lugar de hacer el await de una por una
            const [usuarios, total_usuarios] = await Promise.all([
                //Obtener todos los usuarios del modelo 
                // Skip es para la paginacion y limit para el numero de registros por pagina

                //usuarios
                //{ 'role': { '$nin': ['CLIENT_ROLE'] } aplica como un where not in de sql
                Usuario
                    .find(
                        {'role': { '$nin': ['CLIENT_ROLE'] } }, 
                        'nombre apellido email google imagen direccion telefono ciudad pais estado bio role empresa'
                    )
                    .populate('empresa', 'nombre')
                    .skip( d )
                    .limit( por_pagina ),

                //total_usuarios
                Usuario.find(
                    {'role': { '$nin': ['CLIENT_ROLE'] } }, 
                    'nombre apellido email google imagen direccion telefono ciudad pais estado bio role empresa'
                ).countDocuments()
            ]);


            return res.json({
                ok:true,
                usuarios,
                total_usuarios
            });
        break;
        case 'clientes':
            const [clientes, total_clientes] = await Promise.all([
                //Obtener todos los usuarios del modelo 
                // Skip es para la paginacion y limit para el numero de registros por pagina

                //usuarios
                //{ 'role': { '$nin': ['CLIENT_ROLE'] } aplica como un where not in de sql
                Usuario
                    .find(
                        {'role': { '$in': ['CLIENT_ROLE'] } }, 
                        'nombre apellido email google imagen direccion telefono ciudad pais estado bio role empresa'
                    )
                    .populate('empresa', 'nombre')
                    .skip( d )
                    .limit( por_pagina ),

                //total_usuarios
                Usuario.find(
                    {'role': { '$in': ['CLIENT_ROLE'] } }, 
                    'nombre apellido email google imagen direccion telefono ciudad pais estado bio role empresa'
                ).countDocuments()
            ]);


            return res.json({
                ok:true,
                clientes,
                total_clientes
            });
        break;
    }
}//fin del get usuarios

const crearUsuario = async(req, res=response) => {
    //Lectura del body
    const { nombre, apellido, password, email } = req.body;

    //Es importante encerrar estos códigos en un try - catch para porder atrapar los errores
    //y reportarlos al usuario
    try {
        const existeMail = await Usuario.findOne({ email });

        if(existeMail){
            //Es importante hacer el return
            return res.status(400).json({
                ok: false,
                msj: 'Este correo ya se encuentra registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //guardar Usuario
        await usuario.save();

        const token = await generarJWT( usuario.id );

        res.json({
            ok:true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: "Ocurrió un error inesperado. Ver logs"
        });
    }
}

const actualizarUsuario = async (req, res=response) => {
    //Se obteiene el id como parte del segmento del url
    const uid = req.params.id;

    try {
        //validaciones
        const usuarioDB = await Usuario.findById(uid);
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msj: "Usuario no está registrado en la base de datos"
            });
        }

        //TODO: Validar Token y comprobar que sea el usuario correcto

        //Usuario si existe en este punto
        //Actualizaciones

        
        //Quito todos los campos que no quiero guardar en BBDD (password, email) (Deben existir en el modelo)
        const { password, google, email, ...campos } = req.body;
        if( usuarioDB.email !== email ){
            //Se verifica que no exista usuario con ese correo electrónico
            const existeMail = await Usuario.findOne({ email });
            if( existeMail ){
                return res.status(400).json({
                    ok: false,
                    msj: "Ya existe un usuario con ese email"
                });
            }
        }

        if(!usuarioDB.google){
            campos.email = email; //Se agrega nuevamente, ya que se había sacado en la desestructuración por optimización de código
        }else if(email && usuarioDB.email !== email){
            return res.status(400).json({
                ok:false,
                msj:"Usuarios de google no pueden editar su email"
            })
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
        //new: true, para que envíe el usuario con lo nuevos datos en la respuesta

        res.json({
            ok: true,
            uid: usuarioActualizado

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msj: "Ocurrió un error inesperado. Ver Logs"
        });
    }
}

const cambioPassword = async ( req, res=response ) => {
    //Verificar que el usuario exista
    
    const { email, password, password2 } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msj: "Usuario no encontrado"
            });
        }

        if( password !== password2 ){
            return res.status(400).json({
                ok: false,
                msj: "Contraseñas deben ser iguales"
            });
        }

        idUsuario = usuarioDB.id;
        const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( password, salt );


        const passActualizado = await Usuario.findByIdAndUpdate(idUsuario, {password: pass}, { new: true });

        return res.status(200).json({
            ok: true,
            passActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msj: "Ha ocurrido un error. Debe comunicarse con el administrador."
        });
        
    }
}

const borrarUsuario = async ( req, res=response ) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        //Valido que el usuario exista
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msj: "Usuario no está registrado en la base de datos"
            });
        }

        //Si existe lo borro
        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msj: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: "Ha ocurrido un error inesperado"
        });
        
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    cambioPassword
}