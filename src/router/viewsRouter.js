import { Router } from 'express';
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { CartManagerDB } from '../dao/cartManagerDB.js';
import { MessagesManagerDB } from '../dao/messagesManagerDB.js';


const Manager = new ProductManagerDB();
const CartManager = new CartManagerDB();
const Messages = new MessagesManagerDB();


const router = Router();

router.get('/', (req, res) => {
    
    res.redirect('/products');
});

router.get("/products", async (req, res) => {
    try {
        // Obtener los parámetros de la consulta
        const queryParams = {
            page: req.query.page,
            limit: req.query.limit,
            sort: req.query.sort,
            category: req.query.category,
            query: {} // Puedes añadir un objeto de consulta si es necesario
        };

        // Obtener todos los productos con los parámetros de la consulta
        const result = await Manager.getAllProducts(queryParams);

        // Renderizar la vista con los productos y los enlaces de paginación
        res.render("home", {
            title: "Coder Ecommerce",
            products: result.payload, 
            style: "index.css",
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/realTimeProducts", async (req, res) => {
    const queryParams = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
        category: req.query.category,
        query: req.query.query
    };

    try {
        let allProduct = await Manager.getAllProducts(queryParams);

        res.render("realTimeProduct", { 
            title: "Coder Ecommerce",
            products: allProduct.payload, // Accede al array de productos en el payload
            style: "index.css"
        });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).send("Error al obtener los productos en tiempo real");
    }
});



router.get("/chat", async (req,res) => {
    const allMessage = await Messages.getAllMessages();

    res.render("chat", {
        title: "Coder Chat",
        chats: allMessage,
        style: "index.css"
    });
});

//ruta producs/cars/:cid
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getProductsFromCartByID(req.params.cid);
        console.log(cart); 
        res.render("carts", {
            title: "Carrito Compras",
            cart: cart,
            style: "index.css"
        });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


export default router;