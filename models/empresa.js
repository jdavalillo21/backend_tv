const { Schema, model } = require("mongoose");

//Definición del Schema
const EmpresaSchema = Schema({
    //Definición de cada uno de los registros que estará dentro de una colección

    dni:{
        type: String,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    demo: {
        type: Boolean,
        default: 1
    },
    imagen:{
        type: String
    }
}, { collection: 'empresas' });

//Configuración para redefinir el id por defecto de mongo (Si es que pasa por un JSON)
EmpresaSchema.method("toJSON", function(){
    //Se agrega el password como parámetro para extraerlo del objeto y, en consecuencia, no mostrarlo
    const { __v, ...object } = this.toObject();
    return object;
});

//Implementar el modelo
module.exports = model( 'Empresa', EmpresaSchema );