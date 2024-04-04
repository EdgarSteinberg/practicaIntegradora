import express from "express";
import handlebars from "express-handlebars";
import rutasProduct from "./router/rutasProduct.js";
import rutasCart from "./router/rutasCart.js";
import viewsRouter from './router/viewsRouter.js'
import __dirname from "./utils/constantsUtil.js"
import { Server } from 'socket.io';
import websocket from './websocket.js'

// import ProductManager from "./managers/productManager.js"
// const Manager = new ProductManager("./src/producto.json");


const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);


//Routers
app.use("/api/products", rutasProduct);
app.use("/api/cart", rutasCart);
app.use("/products", viewsRouter);


//Rutas carpeta public
// app.use("/img", express.static(__dirname + "/../../../public/img"));
// app.use("/css", express.static(__dirname + "/../../../public/css"));
// app.use("/js", express.static(__dirname + "/../../../public/js"));



//Websocket
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})

const io = new Server(httpServer);

websocket(io);



