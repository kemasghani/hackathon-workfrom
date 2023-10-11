import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from "dotenv";
import fileUpload from 'express-fileupload';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import PropertyRoute from './routes/PropertyRoute.js';
import AuthRoute from './routes/AuthRoute.js';

dotenv.config()

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db
});

(async()=>{
    await db.sync();
})();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: { secure: 'auto' }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(fileUpload());
app.use(express.json())
app.use(UserRoute);
app.use(PropertyRoute);
app.use(AuthRoute);

store.sync();

app.listen(process.env.APP_PORT, () => console.log('Server started on port ' + process.env.APP_PORT));