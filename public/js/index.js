const socket = io();

socket.on('productoAgregado', (nuevoProducto) => {

    console.log('Datos del nuevo producto:', nuevoProducto);
    // Obtener el contenedor de la lista de productos en el DOM
    const listaProductos = document.getElementById('listaProductos');

    // Crear un nuevo elemento de div para representar el nuevo producto
    const nuevoElementoProducto = document.createElement('div');
    nuevoElementoProducto.classList.add('products'); // Agregar la clase 'products' al nuevo elemento
    nuevoElementoProducto.id = nuevoProducto.id; // Establecer el ID del nuevo elemento como el ID del producto
    console.log('ID del nuevo elemento:', nuevoElementoProducto.id); // Agregar un console.log para verificar el ID

    // Llenar el contenido del nuevo elemento con la información del producto
    nuevoElementoProducto.innerHTML = `
        <h2>${nuevoProducto.title}</h2>
        <p>Descripción: ${nuevoProducto.description}</p>
        <p>Precio: $ ${nuevoProducto.price}</p>
        <p>Código: ${nuevoProducto.code}</p>
        <img src="${nuevoProducto.thumbnail}" alt="Imagen del Producto">
        <br>
        <button class="delete" data-productid="${nuevoProducto.id}" >Eliminar</button>
        
    `;
    // Adjuntar el nuevo elemento al contenedor listaProductos
    listaProductos.appendChild(nuevoElementoProducto);
});


//Agregar un event listener al formulario para enviar los datos del nuevo producto al servidor
document.getElementById('formulario').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar la recarga de la página

    // Obtener los datos del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const stock = document.getElementById('stock').value;
 
    // Crear un objeto con los datos del nuevo producto
    const nuevoProducto = {
        title: title,
        description: description,
        price: price,
        code: code,
        thumbnail: thumbnail,
        stock: stock
    };

    // Emitir el evento 'nuevoProducto' al servidor con los datos del nuevo producto
    socket.emit('nuevoProducto', nuevoProducto);

    document.getElementById('formulario').reset();
});

document.getElementById('listaProductos').addEventListener('click', (event) => {
    // Verificar si el elemento clickeado es un botón de eliminar
    const deleteButton = event.target.closest('.delete');
    if (deleteButton) {
        // Obtener el ID del producto desde el atributo data-productid del botón
        const productId = deleteButton.getAttribute('data-productid');

        // Obtener el elemento contenedor del producto
        const productElement = deleteButton.closest('.products');

        // Verificar si se encontró el contenedor del producto y eliminarlo del DOM si es así
        if (productElement) {
            productElement.remove();
            console.log('Producto eliminado del DOM:', productId);
        } else {
            console.error('El producto con ID', productId, 'no se encontró en el DOM.');
        }

        // Emitir el evento 'eliminarProducto' al servidor con el ID del producto a eliminar
        socket.emit('eliminarProducto', productId);
    }
   
});

