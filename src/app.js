import express from "express";
import handlebars from "express-handlebars";
import rutasProduct from "./router/rutasProduct.js";
import rutasCart from "./router/rutasCart.js";
import rutasMessage from "./router/rutasMessage.js"
import viewsRouter from './router/viewsRouter.js'
import __dirname from "./utils/constantsUtil.js"
import { Server } from 'socket.io';
import websocket from './websocket.js'
import mongoose from "mongoose";
import session from "express-session";
import mongoStore from "connect-mongo";
import userRouter from "./router/userRouter.js";

const app = express();

//MongoDB connect
const uri = "mongodb+srv://steinberg2024:cai2024@cluster0.cl7spkj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);

//Session Middleware
app.use(session(
    {
        store: mongoStore.create(
            {
                mongoUrl: uri,
                ttl:15
            }
        ),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
))

//Routers
app.use("/api/products", rutasProduct);
app.use("/api/cart", rutasCart);
app.use("/api/chat", rutasMessage);
app.use('/api/sessions', userRouter);

app.use("/", viewsRouter);
app.use("/chat", rutasMessage)
app.use("/products", rutasProduct);
app.use("/carts/:cid", rutasCart)
app.use("/sessions", userRouter);

//Websocket
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})

const io = new Server(httpServer);

websocket(io);



