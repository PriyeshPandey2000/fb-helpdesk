const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

const VERIFY_TOKEN = 'abdcds35253235'; 
// Replace with your verify token

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook endpoint for Facebook Messenger
router.post('/webhook', (req, res) => {
  const body = req.body;

  // Verify the request
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Handle the incoming messages
      handleIncomingMessages(webhookEvent);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Function to handle incoming messages
function handleIncomingMessages(webhookEvent) {
  const senderPSID = webhookEvent.sender.id;

  // Check if the message is a text message
  if (webhookEvent.message && webhookEvent.message.text) {
    const messageText = webhookEvent.message.text;
    console.log(`Received message: ${messageText}`);

    // Process the message as needed
    // You can store it in the database or take other actions
  }
}

module.exports = router;
