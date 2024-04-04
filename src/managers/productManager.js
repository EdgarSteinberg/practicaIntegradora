import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path;
    }
    //Creamos un ID
    async getId() {
        const productos = await this.getProducts();

        if (productos.length > 0) {
            return parseInt(productos[productos.length - 1].id + 1);
        }

        return 1;
    }
 
    // Recibimos el producto y creamos
    async addProduct(producto, thumbnail) {
        const productos = await this.getProducts();

        const product = {
            id: await this.getId(),
            title: producto.title ?? "Sin titulo",
            description: producto.description ?? "Sin descripcion",
            price: producto.price ?? "Sin precio",
            thumbnail: thumbnail ?? "Sin thumbnail",
            code: producto.code ?? "Sin code",
            stock: producto.stock ?? "Sin stock"
        };

        productos.push(product);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
            return { id: product.id, message: "Producto creado correctamente" };
        } catch (e) {
            return { id: undefined, message: "Error al crear el producto" };
        }
    }


    async getProducts() {
        try {
            let respuesta = await fs.promises.readFile(this.path, "utf-8");
            return (JSON.parse(respuesta));

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async deleteProduct(id) {
        const productos = await this.getProducts();

        //almaceno los productos 
        const initLength = productos.length;
        // busco por id y creo un array nuevo con los productos q me quedaron 
        const productoProccesed = productos.filter(pr => pr.id != id);

        const finalLength = productoProccesed.length;

        // aca podria mandar un msj cuando no existe nada en {}
        try {
            // aca comparamos para filtrar
            if (initLength == finalLength) {
                throw new Error(`No fue posible eliminar el usuario ${id}`);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productoProccesed, null, "\t"));

            //msj 200 paso todos los filtros
            return `El usuario ${id} fue eliminado correctamente`;

        } catch (e) {
            return e.message;
        }

    }
    async updateProduct(id, producto) {
        const productos = await this.getProducts();

        let productoUpdated = {};

        for (let key in productos) {
            if (productos[key].id == id) {
                productos[key].title = producto.title ? producto.title : productos[key].title;
                productos[key].description = producto.description ? producto.description : productos[key].description;
                productos[key].price = producto.price ? producto.price : productos[key].price;
                productos[key].thumbnail = producto.thumbnail ? producto.thumbnail : productos[key].thumbnail;
                productos[key].code = producto.code ? producto.code : productos[key].code;
                productos[key].stock = producto.stock ? producto.stock : productos[key].stock;

                productoUpdated = productos[key];
            }
        }

        const initLength = productos.length;

        const productoProccesed = productos.filter(pr => pr.id != id);

        const finalLength = productoProccesed.length;

        try {
            if (initLength == finalLength) {
                throw new Error(`Error: No se encontró ningún producto con el ID ${id}`);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));

            return productoUpdated;

        } catch (e) {
            return e.message;

        }
    }

}

export default ProductManager;






