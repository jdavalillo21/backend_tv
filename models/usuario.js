const { Schema, model } = require("mongoose");

//Definición del Schema
const UsuarioSchema = Schema({
    //Definición de cada uno de los registros que estará dentro de una colección

    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    imagen:{
        type: String
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    dni:{
        type: String,
        required: false
    },
    direccion:{
        type: String,
        required: false
    },
    telefono:{
        type: String,
        required: false
    },
    ciudad:{
        type: String,
        required: false
    },
    pais:{
        type: String,
        required: false
    },
    bio:{
        type: String,
        required: false
    },
    estado:{
        type: Boolean,
        required: false
    },
    google:{
        type: Boolean,
        default: false
    },
    empresa:{
        type: Schema.Types.ObjectId,
        ref:"Empresa"
    }
});

//Configuración para redefinir el id por defecto de mongo (Si es que pasa por un JSON)
UsuarioSchema.method("toJSON", function(){
    //Se agrega el password como parámetro para extraerlo del objeto y, en consecuencia, no mostrarlo
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

//Implementar el modelo
module.exports = model( 'Usuario', UsuarioSchema );