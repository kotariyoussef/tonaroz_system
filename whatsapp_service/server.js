const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

let qrCodeData = null;
let clientStatus = 'INITIALIZING'; // INITIALIZING, QR_RECEIVED, AUTHENTICATED, READY, DISCONNECTED, ERROR
let clientInfo = null;
let client = null;
let isRestarting = false;

function createClient() {
    console.log('Initializing WhatsApp Client...');
    clientStatus = 'INITIALIZING';
    qrCodeData = null;
    clientInfo = null;

    const newClient = new Client({
        authStrategy: new LocalAuth({
            dataPath: path.join(__dirname, 'whatsapp_session')
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    newClient.on('qr', async (qr) => {
        clientStatus = 'QR_RECEIVED';
        console.log('QR Code received. Please scan on the dashboard.');
        try {
            qrCodeData = await qrcode.toDataURL(qr);
        } catch (err) {
            console.error('Failed to generate QR data URL', err);
        }
    });

    newClient.on('authenticated', () => {
        clientStatus = 'AUTHENTICATED';
        qrCodeData = null;
        console.log('Authenticated successfully with WhatsApp.');
    });

    newClient.on('auth_failure', (msg) => {
        clientStatus = 'AUTHENTICATION_FAILED';
        console.error('WhatsApp Authentication failure:', msg);
        restartClient();
    });

    newClient.on('ready', () => {
        clientStatus = 'READY';
        clientInfo = newClient.info;
        console.log('WhatsApp Client is fully ready!');
    });

    newClient.on('disconnected', (reason) => {
        clientStatus = 'DISCONNECTED';
        console.log('Client was logged out / disconnected:', reason);
        restartClient();
    });

    client = newClient;

    client.initialize().catch(err => {
        clientStatus = 'ERROR';
        console.error('Failed to initialize WhatsApp client:', err);
        // Even an init failure usually means the browser/session is wedged.
        restartClient();
    });
}

// Tears down the dead client (if possible) and spins up a fresh one.
// This replaces "client.initialize() on the same instance", which is
// what was forcing a manual process restart after logout/disconnect.
async function restartClient() {
    if (isRestarting) return;
    isRestarting = true;
    try {
        const old = client;
        if (old) {
            try {
                await old.destroy();
            } catch (err) {
                console.warn('Error destroying old client (continuing anyway):', err.message);
            }
        }
    } finally {
        isRestarting = false;
        createClient();
    }
}

// Initial boot
createClient();

// Endpoints

// Get status, QR code, and connected info
app.get('/status', (req, res) => {
    res.json({
        status: clientStatus,
        qr: qrCodeData,
        info: clientInfo
    });
});

// Send message to phone number
app.post('/send', async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
        return res.status(400).json({ success: false, error: 'Phone and message are required' });
    }

    if (clientStatus !== 'READY') {
        return res.status(503).json({
            success: false,
            error: 'WhatsApp client is not ready. Current status: ' + clientStatus
        });
    }

    try {
        let cleanedPhone = phone.replace(/\D/g, '');

        if (cleanedPhone.startsWith('06') || cleanedPhone.startsWith('07') || cleanedPhone.startsWith('05')) {
            cleanedPhone = '212' + cleanedPhone.substring(1);
        } else if (cleanedPhone.startsWith('6') || cleanedPhone.startsWith('7') || cleanedPhone.startsWith('5')) {
            if (cleanedPhone.length === 9) {
                cleanedPhone = '212' + cleanedPhone;
            }
        }

        const chatId = `${cleanedPhone}@c.us`;
        console.log(`Attempting to send message to: ${chatId}`);

        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(`Number ${chatId} is not registered on WhatsApp`);
            return res.status(400).json({
                success: false,
                error: `Le numéro ${phone} n'est pas enregistré sur WhatsApp.`
            });
        }

        const response = await client.sendMessage(chatId, message);
        console.log(`Message successfully sent to ${chatId}. Message ID: ${response.id.id}`);
        res.json({ success: true, messageId: response.id.id });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Logout session
app.post('/logout', async (req, res) => {
    try {
        console.log('Logging out from WhatsApp session...');
        await client.logout();
        // 'disconnected' will fire from the logout and trigger restartClient(),
        // but we also kick it off here in case the event doesn't fire.
        restartClient();
        res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`WhatsApp automation service listening at http://localhost:${port}`);
});