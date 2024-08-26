npm install express body-parser
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your application's public key
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';

app.use(bodyParser.json({ verify: verifyRequestSignature }));

function verifyRequestSignature(req, res, buf, encoding) {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];

    const isValidSignature = crypto.verify(
        'sha256',
        Buffer.from(buf),
        {
            key: PUBLIC_KEY,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        },
        Buffer.from(signature, 'hex')
    );

    if (!isValidSignature) {
        throw new Error('Invalid request signature');
    }
}

app.post('/interactions', (req, res) => {
    const { type, data } = req.body;

    // Handle different interaction types
    if (type === 1) {
        res.send({ type: 1 }); // Ping
    } else if (type === 2) {
        res.send({ type: 4, data: { content: 'Hello from the interactions endpoint!' } }); // Pong
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
