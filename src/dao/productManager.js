import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async getAllProducts() {
        try {
            let products = await fs.promises.readFile(this.path, "utf-8");
            return (JSON.parse(products));

        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    async getId() {
        const products = await this.getAllProducts();

        if (products.length > 0) {
            return parseInt(products[products.length - 1].id + 1);
        }

        return 1;
    }

    async getProductByID(pid) {
        const products = await this.getAllProducts();

        const productFilter = products.filter(product => product.id == pid);

        if (productFilter.length > 0) {
            return productFilter[0];
        }

        throw new Error(`El producto ${pid} no existe!`);
    }


    async createProduct(product) {
        const { title, description, code, price, stock, category, thumbnail } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto');
        }
        const products = await this.getAllProducts();

        const newProduct = {
            id: await this.getId(),
            title: product.title ?? "Sin titulo",
            description: product.description ?? "Sin descripcion",
            price: product.price ?? "Sin precio",
            status: true,
            code: product.code ?? "Sin code",
            stock: product.stock ?? "Sin stock",
            category: product.category ?? "Sin category",
            thumbnail: thumbnail ?? [],
        };

        products.push(newProduct);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

            return newProduct;
        } catch (error) {
            throw new Error("Error al crear el producto")
        }
    }


    async updateProduct(id, productUpdate) {

        const products = await this.getAllProducts();

        let productoUpdated = {};

        for (let key in products) {
            if (products[key].id == id) {
                products[key].title = productUpdate.title ? productUpdate.title : products[key].title;
                products[key].description = productUpdate.description ? productUpdate.description : products[key].description;
                products[key].price = productUpdate.price ? productUpdate.price : products[key].price;
                products[key].code = productUpdate.code ? productUpdate.code : products[key].code;
                products[key].stock = productUpdate.stock ? productUpdate.stock : products[key].stock;
                products[key].category = productUpdate.category ? productUpdate.category : products[key].category;
                products[key].thumbnail = productUpdate.thumbnail ? productUpdate.thumbnail : products[key].thumbnail;

                productoUpdated = products[key];
            }
        }

        const initLength = products.length;

        const productoProccesed = products.filter(pr => pr.id != id);

        const finalLength = productoProccesed.length;

        try {
            if (initLength == finalLength) {
                throw new Error(`Error: No se encontró ningún producto con el ID ${id}`);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

            return productoUpdated;

        } catch (error) {
            throw new Error('Error al actualizar el producto');

        }
    }

    async deleteProduct(pid) {
        const products = await this.getAllProducts();

        const productsFilter = products.filter(pr => pr.id != pid);

        if (products.length === productsFilter.length) {
            throw new Error(`El producto ${pid} no existe!`);
        }
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(productsFilter, null, "\t"));

            return productsFilter;
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }
    }
}

export default ProductManager;






