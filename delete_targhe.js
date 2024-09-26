const InitConnection = require('./db')
const log_err = require('./log_err')

let connection;
async function delete_targhe(req,res){
    try{
    connection = await InitConnection();
    let { plate } = req.body;
    const insertQuery = `DELETE FROM veicoli WHERE Targa='${plate}'`;
    const result2 = await connection.execute(insertQuery);
    if(result2[0].affectedRows > 0){
        console.log('Targa cancellata con successo.');
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
            console.log('DB connection closed')
        }
    }

}
module.exports = { delete_targhe };




























