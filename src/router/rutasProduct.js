import { Router } from 'express';
//import ProductManager from "../dao/productManager.js"
import { ProductManagerDB } from '../dao/productManagerDB.js';
import { uploader } from '../utils/multerUtil.js'

const Productrouter = Router();
//const Manager = new ProductManager("./src/producto.json");
const Manager = new ProductManagerDB();


// Obtengo todos los productos
Productrouter.get("/", async (req, res) => {
    const products = await Manager.getAllProducts();
    const { limit } = req.query;

    if (limit) {
        products = products.slice(0, limit)
    }
    res.send({
        status: 'success',
        payload: products
    });
});

Productrouter.get('/:pid', async (req, res) => {

    try {
        const result = await Manager.getProductByID(req.params.pid);
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

Productrouter.post('/', uploader.array('thumbnail', 3), async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnail = [];
            req.files.forEach((file) => {
                req.body.thumbnail.push(file.filename);
            });
        }

        const result = await Manager.createProduct(req.body);
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

Productrouter.put("/:pid", uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.filename);
        });
    }
    try {
        const pid = req.params.pid;
        const result = await Manager.updateProduct(pid, req.body);
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

Productrouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        res.send(await Manager.deleteProduct(pid));
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


export default Productrouter;
