const api = require('./src/api/routes');

api.listen(3000, () => {
    console.log(`Running`);
});