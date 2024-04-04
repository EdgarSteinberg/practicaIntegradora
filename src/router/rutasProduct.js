import { Router } from 'express';
import ProductManager from "../managers/productManager.js"
import { uploader } from '../utils/multerUtil.js'

const Productrouter = Router();
const Manager = new ProductManager("./src/producto.json");


// Obtengo todos los productos
Productrouter.get("/", async (req, res) => {
    let products = await Manager.getProducts();
    const { limit } = req.query;

    if (limit) {
        products = products.slice(0, limit)
    }
    res.send(products);
});

// Creo los productos
Productrouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    
    if (!req.file) {
        return res.status(400).send({ error: "Se necesita crgar una imagen para crear un producto!" })
    }
    const thumbnail = req.file.filename;

    const { title, description, price, code, stock } = req.body

    if (!title || !description || !price || !code || !stock) {
        return res.status(400).send({ error: "Faltan datos para crear el producto" })

    } else {
        const response = await Manager.addProduct(req.body, thumbnail);
        res.status(201).send(response);
    }
});

// Actualizo producto existente por su id
Productrouter.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    res.send(await Manager.updateProduct(pid, req.body));
});

// Elimino el producto por id
Productrouter.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    res.send(await Manager.deleteProduct(pid));
});

// Busco un producto específico por su ID
Productrouter.get("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    const productAll = await Manager.getProducts();

    const product = productAll.find(prod => prod.id === productId);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send("Producto no encontrado");
    }
});


export default Productrouter;
