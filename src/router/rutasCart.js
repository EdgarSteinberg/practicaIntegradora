import { Router } from 'express';
import CartManager from '../managers/cartManager.js';

const CartRouter = Router();
const carts = new CartManager("./src/carts.json");


// Creo mi carrito
CartRouter.post("/",async (req, res) => {
    res.send( await carts.addCarts());
})
// Obtengo todos los carritos
CartRouter.get("/", async (req, res) =>{
    res.send(await carts.getCarts());
} )

// Almaceno un producto a mi carrito por Id
CartRouter.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid); // Obtener el ID del carrito de los parámetros de la URL
    const cartsAll = await carts.getCarts(); // Obtener todos los carritos

    // Buscar el carrito con el ID especificado
    const cart = cartsAll.find(cart => cart.id === cartId);

    if (cart) {
        res.send(cart); // Si se encuentra el carrito, enviarlo como respuesta en formato JSON
    } else {
        res.status(404).send("Carrito no encontrado"); // Si no se encuentra el carrito, enviar un mensaje de error
    }
});

// Agrego un producto a mi carrito por su Id 
CartRouter.post("/:cid/products/:pid", async (req, res) => { 
        const cartId = req.params.cid;
        const productId = req.params.pid;
        
        res.send(await carts.addProductInCart(cartId, productId));
}) 

export default CartRouter