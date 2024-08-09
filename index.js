const app = require('./src/app');

//port setup
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.info(`Server is up on ${port}`)
})