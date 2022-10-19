const mongoose = require("mongoose");

const dbConnection = async() => {
    main().catch(err => console.log(err));
    async function main() {
        await mongoose.connect(process.env.DB_CNN);
    }
}

module.exports = {
    dbConnection
}