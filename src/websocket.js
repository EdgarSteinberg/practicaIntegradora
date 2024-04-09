//import ProductManager from "./dao/productManager.js"
//const Manager = new ProductManager("./src/producto.json");
import { ProductManagerDB } from "./dao/productManagerDB.js";
import { MessagesManagerDB } from "./dao/messagesManagerDB.js";
const Manager = new ProductManagerDB();
const Message = new MessagesManagerDB();



export default (io) => {
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado ------>", socket.id);


        socket.on("nuevoProducto", async data => {
            console.log("Recibido nuevo producto: ", data);

            const newProduct = await Manager.createProduct(data);
            // Agregar el ID generado al objeto de datos antes de emitir el evento
            const dataWithID = { id: newProduct.id, ...data };

            console.log("Producto enviado al cliente: ", dataWithID);

            socket.emit("productoAgregado", dataWithID);
        });

        // Escuchar evento para eliminar un producto
        socket.on("eliminarProducto", async productId => {
            try {
                console.log("Recibida solicitud para eliminar el producto del servidor con ID:", productId);

                await Manager.deleteProduct(productId);

                socket.emit("productoEliminado", productId);
            } catch (error) {
                console.error("Error al eliminar el producto:", error.message);
                // Aquí puedes decidir cómo manejar el error, por ejemplo, enviar un mensaje de error al cliente
                socket.emit("errorEliminarProducto", error.message);
            }
        });


        //socket chat
        socket.on("nuevoMensaje", async data => {
            console.log(data)
            await Message.createMessages(data);

            io.emit("nuevoMensaje", data);
        });


    });
}