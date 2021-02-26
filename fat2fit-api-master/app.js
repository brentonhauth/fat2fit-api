const { PORT } = require('./src/config');
const app = require('./src')();

app.listen(PORT, () => {
    console.log(`> Listening on port ${PORT}...`);
});
