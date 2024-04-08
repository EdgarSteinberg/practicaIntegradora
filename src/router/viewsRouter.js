import { Router } from 'express';
//import ProductManager from "../dao/productManager.js";
import { ProductManagerDB } from '../dao/productManagerDB.js';
//const Manager = new ProductManager("./src/producto.json");
const Manager = new ProductManagerDB();

import { MessagesManagerDB } from '../dao/messagesManagerDB.js';
const Messages = new MessagesManagerDB();


const router = Router();


router.get("/", async (req, res) => {
    let allProduct = await Manager.getAllProducts();

    res.render("home.handlebars", {
        title: "Coder Ecommerce",
        products: allProduct, 
        style: "index.css"
    });
});

router.get("/realTimeProducts", async (req, res) => {
    let allProduct = await Manager.getAllProducts();

    res.render("realTimeProduct", { 
        title: "Coder Ecommerce",
        products: allProduct,
        style: "index.css"
    });
});

router.get("/chat", async (req,res) => {
    const allMessage = await Messages.getAllMessages();

    res.render("chat", {
        title: "Coder Chat",
        chats: allMessage,
        style: "index.css"
    });
});


export default router;