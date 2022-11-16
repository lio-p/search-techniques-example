const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/suggest', async (req, res) => {

    const client = await new Client({
        node: [process.env.ES_URL],
        auth: {
            apiKey: process.env.ES_API_KEY
        }
    })
    const body = await client.searchTemplate({
        index: "suggest",
        id: 'did-you-mean-template',
        params: {
            query_string: req.body.query
        }
    })
    res.status(200).json({ body })
});


app.listen(port, () => console.log(`Listening on port ${port}`));