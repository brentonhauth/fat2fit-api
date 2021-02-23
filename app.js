const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('<h2>Index</h2>'));
app.get('/account', (req, res) => res.send('<h2>Account</h2>'));
app.get('/group', (req, res) => res.send('<h2>Group</h2>'));

app.listen(PORT, () => {
    console.log(`> Listening on port ${PORT}...`);
});
