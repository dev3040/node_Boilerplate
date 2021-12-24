import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
import db from './models';
import router from './routes'
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname+'/.env' });

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
app.use('/api',router)
app.get("/",(req,res,get)=>{
    res.send("heloo")
})