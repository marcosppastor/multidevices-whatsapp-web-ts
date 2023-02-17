// const fs = require('fs');
const qrcode = require('qrcode');
const { data } = require('../config/clients.json');
const { Client, LocalAuth } = require('whatsapp-web.js');

/* Defining constants for the status of the client. */
const STATUS_AWAITING_QR_CODE = Number(0);
const STATUS_AUTHENTICATED = Number(1);
const STATUS_READY = Number(2);

/* It creates a new client for each account in the data array, and then it sets the status of the
account to 0 (waiting for QR code), 1 (authenticated) or 2 (ready) */
class Clients {
    /**
     * The constructor function is called when a new instance of the class is created
     */
    constructor() {
        this.sessions = [];
    }

    async getClientByName(name) {
        return this.sessions.find(f => f.name === name);
    }

    /**
     * It returns the sessions array
     * @returns The sessions array.
     */
    getSessions() {
        return this.sessions;
    }

    /**
     * The function setSessions() takes an array of sessions as an argument and assigns it to the
     * sessions property of the class
     * @param sessions - An array of objects that contain the following properties:
     */
    setSessions(sessions) {
        this.sessions = sessions;
    }

    /**
     * It creates a new client for each account in the data array, and then it sets the status of the
     * account to 0 (waiting for QR code), 1 (authenticated) or 2 (ready)
     * @returns An array of objects with the client's name, status, QR code and message.
     */
    init() {
        /* It checks if the data variable is an array. If it is not, it returns. */
        if (!Array.isArray(data)) return;

        /* Creating a new client for each account in the data array, and then it sets the status of the
        account to 0 (waiting for QR code), 1 (authenticated) or 2 (ready) */
        Array.from(data).forEach((c, index) => {
            // A counter that is used to check if the sessions array is empty.
            let i = 0;

            // Creating a new client for each account in the data array.
            const client = new Client({
                authStrategy: new LocalAuth({ clientId: 'client-' + c.name })
            });

            // It checks if the sessions array is empty. If it is, it adds a new object to the array.
            if (!i || i <= 0) {
                this.sessions.push({
                    name: c.name,
                    status: null
                })
            }

            // Set the index of the client in the sessions array.
            i = index;

            // Setting the status of the client to 0 (awaiting QR code)
            client.on('qr', async (qr) => {
                this.sessions[index].status = STATUS_AWAITING_QR_CODE;
                this.sessions[index].qr_code = await qrcode.toDataURL(qr);
                this.sessions[index].message = 'Awaiting QR code authentication';
            });

            // Setting the status of the client to 1 (authenticated)
            client.on('authenticated', (session) => {
                this.sessions[index].status = STATUS_AUTHENTICATED;
                this.sessions[index].qr_code = null;
                this.sessions[index].message = 'Authenticated';
                this.sessions[index].client = client;
                // // Convert it to json...
                // let data = {
                //     "data": this.sessions.map((session, index) => {
                //         let id = index + 1;
                //         return {
                //             "id": id,
                //             "name": session?.name || 'whatsapp-contact-' + id,
                //             "token": session?.token || '',
                //             "status": session?.status || '',
                //             "qr_code": session?.qr_code || '',
                //             "message": session?.message || '',
                //             // "client": session?.client || ''
                //         }
                //     })
                // }
                // // ...and save it to the clients.json file.
                // fs.writeFileSync('./src/config/clients.json', JSON.stringify(data), (err) => {
                //     err && console.log(err);
                // });
            });

            // Setting the status of the client to 2 (ready)
            client.on('ready', () => {
                this.sessions[index].status = STATUS_READY;
                this.sessions[index].qr_code = null;
                this.sessions[index].message = 'Ready';
            });

            // It initializes the client.
            client.initialize();
        });
    }
}

/* Exporting the Clients class so that it can be used in other files. */
module.exports = Clients;