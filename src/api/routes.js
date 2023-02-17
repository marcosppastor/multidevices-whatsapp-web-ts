const cors = require('cors')
const express = require("express");
const auth = require('../middleware/auth');
const clients = new (require("../controllers/clients"));

/* It's creating a new express app and using the cors middleware. */
const app = express();
app.use(cors())

/* It's initializing the clients. */
clients.init();

/**
 * It sends a message to a given number
 * @param [number=null] - The number you want to send the message to.
 * @param [text=null] - The text you want to send
 * @param client - The client object
 */
const sendMessage = (number = null, text = null, client) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`
    const message = text || '';
    client.sendMessage(number, message);
}

/* It's a route that returns a JSON with the success status. */
app.get("/", (req, res) => {
    return res.status(200).json({ success: true });
});

/* It's a route that returns a JSON with the success status. */
app.get("/test/:name", auth, (req, res) => {
    const { name } = req.params;
    return res.status(200).json({ success: true, name: name });
});

/* It's a route that sends a message to a given number. */
app.get("/send/:name", async (req, res) => {
    const { name } = req.params;
    const { phone, text } = req.query;
    if (!name || !phone || !text) return res.json({ message: 'Client, phone or text not found' });

    const client = await clients.getClientByName(name);
    if (!client) return res.status(422).json({ success: false, message: 'Awaiting authentication' });

    try {
        sendMessage(phone, text, client.client);
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        return res.status(404).json({ success: false, message: 'Error sending message', error: error });
    }
});

/* A route that returns a QR code to be authenticated. */
app.get("/auth/:name", async (req, res) => {
    const { name } = req.params;
    if (!name) return res.status(422).json({ success: false, message: 'Name is required' });

    const client = await clients.getClientByName(name);
    if (!client) return res.status(422).json({ success: false, message: 'Client not found' });

    if (!client.status) {
        if (!client.qr_code) {
            res.status(200).json({ success: true, message: 'Authenticating... Try again in 5 seconds' });
        } else {
            res.status(200).json({ success: true, message: 'Scan the QR code', qr_code: client.qr_code });
            // res.send('<img src="' + client.qr_code + '" />');
        }
    } else {
        res.status(200).json({ success: true, status: client.status, message: client.message });
    }
});

module.exports = app;