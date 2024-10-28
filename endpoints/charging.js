const { log_err } = require('../log_err')
const http = require('http');
const config = require('../config.json')
const DigestClient = require('digest-fetch');
/*
async function checkactive(req,res) {
    try{
        //let ip_address = config.ip_relay;
        //http.get(`http://${ip_address}/axis-cgi/io/port.cgi?checkactive=1,9,10,11,12,13,14,15,16`)
        http.get(`http://localhost:3001`, (resp) => {
            let data = '';
            resp.on('data',(chunk) => {
                data += chunk; //metti insieme i dati ricevuti
                console.log('relay data retrieved..');
            });
            resp.on('end', () => {
                const result = parseResponse(data); //Parsing
                res.json(result); 
            });
        }).on('error', (err) => {
                console.error('Failed to retrieve charging ports info:', err);
                res.status(500).send('Internal Server Error');})}
        catch(err){console.error('Failed to retrieve charging ports info.')
                    console.log(err); log_err(err);}
}; */

async function checkactive(req, res) {
    try {
        const ip_address = config.ip_relay;
        const username = config.relayuser;
        const password = config.relaypassword;
        const client = new DigestClient(username, password);

        const url = `http://${ip_address}/axis-cgi/io/port.cgi?checkactive=1,9,10,11,12,13,14,15,16`;

        // Esegui la richiesta GET
        const response = await client.fetch(url, {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.text();
            const result = parseResponse(data);
            console.log('Risposta:', result);
            res.json(result);
        } else {
            console.error('Errore nella richiesta:', response.statusText);
            throw new Error(`HTTP ERROR: status: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Errore durante l\'esecuzione della richiesta:', error.message);
        res.status(500).json({ error: 'Errore durante l\'esecuzione della richiesta.' });
    }
}

function parseResponse(data) {
    let lines = data.split('\n');
    let result = {};
    lines.forEach(line => {
        let [port, status] = line.split('=');
        result[port] = status;
    });
    return result;

};

module.exports = { checkactive };
