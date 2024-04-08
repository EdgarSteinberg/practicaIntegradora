import { Router } from 'express';
//import ProductManager from '../dao/productManager.js'
//import CartManager from '../dao/cartManager.js';
import { CartManagerDB } from '../dao/cartManagerDB.js';
import { ProductManagerDB } from '../dao/productManagerDB.js';

const CartRouter = Router();
//const productsM = new ProductManager("./src/producto.json");
//const carts = new CartManager("./src/carts.json", productsM);
const carts = new CartManagerDB()
const products = new ProductManagerDB()

CartRouter.get('/', async (req,res) => {
    try{
        const result = await carts.getAllCarts();
        res.send({
            status: 'success',
            payload: result
        })
    }catch(error){
        res.status(400).send({
            status: 'error',
            payload: error.message
        })
    }
});

CartRouter.get('/:cid', async (req, res) => {

    try{
        const result = await carts.getProductsFromCartByID(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        res.status(400).send({
            status: error,
            message: error.message
        });
    }
});


CartRouter.post("/",async (req, res) => {
   
    try {
        const result = await carts.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


CartRouter.post("/:cid/products/:pid", async (req, res) => { 
      
    try{
        const result = await carts.addProductByID(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            payload: result
        });
    }catch(error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }      
        
}) 

export default CartRouter