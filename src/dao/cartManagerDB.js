import cartModel from '../dao/models/cartModel.js';

class CartManagerDB {


    async getAllCarts() {
        try {
            return await cartModel.find().lean();

        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los carritos");
        }
    }

    async getProductsFromCartByID(cid) {
        const carts = await cartModel.findOne({ _id: cid })

        if (!carts) throw new Error(`El carrito ${cid} no existe!`)

        return carts;
    }

    async createCart() {
        try {
            const carts = await cartModel.create({ product: [] });
            return carts;

        } catch (error) {
            console.error(error.message);
            throw new Error(`Error al crear el carrito`);
        }
    }

    // async addProductByID(cid, pid) {
    //     try {
    //         // Encuentra el carrito por su ID
    //         const cart = await cartModel.findOne({_id : cid});
    
    //         // Si el carrito no existe, lanza un error
    //         if (!cart) {
    //             throw new Error(`El carrito ${cid} no existe`);
    //         }
    
    //         // Agrega el producto al carrito
    //         cart.products.push({ product: pid, quantity: 1 });
    
    //         // Guarda los cambios en la base de datos
    //         await cart.save();
    
    //         // Devuelve el carrito actualizado
    //         return cart;
    //     } catch (error) {
    //         throw new Error('Error al actualizar el carrito: ' + error.message);
    //     }
    // }
    
    async addProductByID(cid, pid) {
        try {
            // Busca el carrito por su ID y actualiza los productos
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, "products.product": pid }, // Condición de búsqueda
                { $inc: { "products.$.quantity": 1 } }, // Incrementa la cantidad si el producto ya está en el carrito
                { new: true } // Devuelve el documento actualizado
            );
    
            // Si el producto no está en el carrito, agrégalo
            if (!cart) {
                const updatedCart = await cartModel.findOneAndUpdate(
                    { _id: cid },
                    { $push: { products: { product: pid, quantity: 1 } } },
                    { new: true }
                );
                return updatedCart;
            }
    
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }
    

}


export { CartManagerDB };






