const response = require("express");
const Empresa = require("../models/empresa");

const getEmpresas = async (req, res=response) => {

    //El método populate sirve para obtener los datos, en este caso del usuario de referencia
    const [Empresas, total_Empresas] = await Promise.all([
        Empresa.find(),
        Empresa.countDocuments()
    ]);
    

    res.status(200).json({
        ok: true,
        Empresas,
        total_Empresas
    });
};

const crearEmpresas = async (req, res=response) => {

    //Se extrae el id del usuario que viene desde el token
    //IMPORTANTE: Solo se obtiene al pasarlo por el middleware de validación de token
    const empresa = new Empresa( { 
        ...req.body 
    } );

    try {
        
        const empresaDB = await empresa.save();

        res.status(200).json({
            ok: true,
            empresa: empresaDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: "Ocurrió un error al crear el Empresa"
        });
    }


    
};

const actualizarEmpresas = async (req, res=response) => {

    const hid = req.params.id;
    try {
        //Verificar que exista empresa
        const empresaDB = await Empresa.findById(hid);
        if( !empresaDB ){
            return res.status(404).json({
                ok: false,
                msj: 'Empresa no existe en la base de datos'
            });    
        }

        const cambiosEmpresa = {
            ...req.body,
        }

        const empresaUpdated = await Empresa.findByIdAndUpdate( hid, cambiosEmpresa, { new: true });
        
        res.status(200).json({
            ok: true,
            empresaDB: empresaUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: 'Ha ocurrido un error al guardar lo datos'
        });
    }


};

const borrarEmpresas = async (req, res=response) => {
    
    const hid = req.params.id;

    try {
        //Verificar que exista empresa
        const empresaDB = await Empresa.findById(hid);
        if( !empresaDB ){
            return res.status(404).json({
                ok: false,
                msj: 'Empresa no existe en la base de datos'
            });    
        }

        await Empresa.findByIdAndDelete( hid );
        res.status(200).json({
            ok: true,
            msj: 'Empresa Eliminado existosamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: 'Ha ocurrido un error al guardar lo datos'
        });
    }

};


module.exports = {
    getEmpresas,
    crearEmpresas,
    actualizarEmpresas,
    borrarEmpresas
}