const setupMongo = require('./src/services/mongo')();
const { PORT } = require('./src/config');
const app = require('./src')();

setupMongo.finally(() => {
    app.listen(PORT, () => {
        console.log(`> Listening on port ${PORT}...`);
    });
});
