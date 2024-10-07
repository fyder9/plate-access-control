
const InitConnection = require('./db')
const log_err = require('./log_err')
const config = require('./config.json');
const on_rm = require('./camera_functions');



let connection;
async function change_targhe(req,res){
    try{
    const tableName = config.tableName;
    connection = await InitConnection();
    console.log(req.body);
    const { name, plate, data_arrivo, data_partenza, selectedCar } = req.body;
    console.log(plate);
    console.log(data_arrivo);
    const insertQuery = `UPDATE ${tableName} SET Nome='${name}',Inizio='${data_arrivo}',Fine='${data_partenza}',
    Colonnine='${selectedCar}' WHERE Targa='${plate}';`
    const result2 = await connection.execute(insertQuery);''
    if(result2[0].affectedRows > 0){
        console.log('Targa aggiornata con successo.');
    }
    else{
        console.log('Errore di comunicazione col DB');
        res.status(500).json({ error: 'Errore nel database. Riprovare più tardi.' });
    }

    }
    catch(err){
        console.log(err);
        log_err(err);
        throw err;
    }
    finally {
        if (connection) {

            await connection.end();  // close connection
            console.log('DB connection closed');
            await on_rm();
            await on_add();
        }
    }

}
module.exports = { change_targhe};




























