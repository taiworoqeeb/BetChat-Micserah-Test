const app = require('./app');
const mongoose= require('mongoose');
require('dotenv').config();


const DB = process.env.DATABASE;

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DB, option)
.then(() => console.log("Database connected!"));



const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`listening to https://localhost:${port}`)
});
