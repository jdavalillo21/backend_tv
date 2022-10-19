require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

/*=================================================================================*/
const app = express();
//Configurar cors
app.use( cors() );
// Lectura y parseo del body
app.use( express.json() );//Siempre debe ir antes de las rutas

dbConnection();

//Directorio público
app.use( express.static('public') )

app.listen( process.env.PORT, () => {
    console.log("Servidor corriendo en puerto " + process.env.PORT)
});
