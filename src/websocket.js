import ProductManager from "./managers/productManager.js"
const Manager = new ProductManager("./src/producto.json");


export default (io) => {
    io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado ------>", socket.id);


    socket.on("nuevoProducto", async data => {
        console.log("Recibido nuevo producto: ", data);
    
        const newProduct = await Manager.addProduct(data);
        // Agregar el ID generado al objeto de datos antes de emitir el evento
        const dataWithID = { id: newProduct.id, ...data };
    
        console.log("Producto enviado al cliente: ", dataWithID);
    
        socket.emit("productoAgregado", dataWithID);
    });

    // Escuchar evento para eliminar un producto
    socket.on("eliminarProducto", async productId => {
        console.log("Recibida solicitud para eliminar el producto del servidor con ID :", productId);

        await Manager.deleteProduct(productId);
        
        socket.emit("productoEliminado", productId);
    });

});
}