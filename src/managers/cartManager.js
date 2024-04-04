import fs from 'fs';
import ProductManager from './productManager.js';

const productAll = new ProductManager("./src/producto.json");

class CartManager {

    constructor(path) {
        this.path = path;
    }

    async getId() {
        const carts = await this.getCarts();

        if (carts.length > 0) {
            return parseInt(carts[carts.length - 1].id + 1);
        }
        return 1;
    }

    async addCarts() {
        const cartsOld = await this.getCarts();
        let id = await this.getId();

        const newCart = {
            id: id,
            products: []
        };
        const cartConcat = [...cartsOld, newCart];

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(cartConcat, null, "\t"));
            return "Carrito Creado Correctamente";

        } catch (e) {
            return (`Error al crear el carrito`, e);
        }
    }

    async getCarts() {
        try {
            let respuesta = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(respuesta);

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async addProductInCart(cartId, productId) {
        let carts = await this.getCarts();
        let products = await productAll.getProducts();

        cartId = parseInt(cartId);
        productId = parseInt(productId);

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return "Carrito no encontrado";

        const product = products.find(prod => prod.id === productId);
        if (!product) return "Producto no encontrado";

        // Buscar si el producto ya existe en el carrito
        const productInCart = cart.products.find(prod => prod.id === productId);
        if (productInCart) {
            // Si el producto ya existe, aumentar la cantidad
            productInCart.cantidad += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({ id: productId, cantidad: 1 });
        }

        try {
            // Escribir los cambios en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
            return "Producto sumado al carrito";

        } catch (e) {
            return ("Error al sumar el producto al carrito", e);
        }
    }

}


export default CartManager;






