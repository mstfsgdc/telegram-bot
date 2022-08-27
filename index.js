require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { TOKEN, SERVER_URI } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URI + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data);
}

app.post(URI, async (req, res) => {
    console.log(req.body);

    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;

    switch(text) {
        case "!github":
            await sendMessage(chatId, "GitHub: https://github.com/mstfsgdc");
        break;
        
        default:
            await sendMessage(chatId, `Üzgünüm ${req.body.message.chat.first_name}, dediğini anlamadım.`);
        break;
    }
    
    return res.send();
});

app.listen(process.env.PORT || 5000, async () => {
    console.log('app running on port: ', process.env.PORT || 5000);
    await init();
});

function sendMessage(chatId, text) {
    return axios.post(TELEGRAM_API + "/sendMessage", {
        chat_id: chatId,
        text: text
    });
}