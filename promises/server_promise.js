const mysql = require('mysql');
const connection = require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const { check_posti } = require('./check_posti_promise');
const app = express();
const port = 3000; //server listening on this port
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parsing delle richieste con JSON payload
app.use(express.urlencoded({ extended: true })); // Parsing delle richieste URL-encoded
app.use(express.static('public')); //definisci la cartella statica //middleware
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ENDPOINT check_posti /////////////////////////////////////////////////////////////////////////////////////////////
app.post('/check_posti', check_posti )
//ENDPOINT input targhe/////////////////////////////////////////////////////////////////////////////////////////////
app.post('/input_targhe', (req,res) => {
    // Gestisce la richiesta POST per l'inserimento delle targhe
    // Recupera i dati dal corpo della richiesta
    const { name, plate, data_arrivo, data_partenza, selectedCar } = req.body;
    // Controlla se la targa esiste già nel database
    const checkQuery = `SELECT Targa FROM veicoli WHERE Targa = '${plate}'`;
    connection.query(checkQuery, (err, result) => {
      if (err) {
        console.error('Errore nel controllo della targa nel database:', err);
        res.status(500).send('Errore nel controllo della targa nel database.');
        return;
      }
      // Se esiste già una targa con lo stesso valore
      if (result.length > 0) {
        res.redirect('/loading_existing_plate.html');
        return;
      }
      // Altrimenti, esegui l'inserimento nel database
      const insertQuery = `INSERT INTO veicoli (Nome, Targa, Inizio, Fine, Colonnine) VALUES (?, ?, ?, ?, ?)`;
      connection.query(insertQuery, [name, plate, data_arrivo, data_partenza, selectedCar], (err, result) => {
        if (err) {
          console.error('Errore nell\'inserimento dei dati nel database:', err);
          res.status(500).send('Errore nell\'inserimento dei dati nel database.');
          return;
        }
        console.log('Dati inseriti con successo nel database.');
        res.redirect('/loading_success_plate.html');
      });
    });
});

// Avvia il server su una specifica porta//////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
///////////////////////////////////////////////////////////////////////////////////////////////