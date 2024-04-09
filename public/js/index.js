const socket = io();


document.addEventListener('DOMContentLoaded', function () {
    socket.on('productoAgregado', (nuevoProducto) => {
        console.log('Datos del nuevo producto:', nuevoProducto);
        const listaProductos = document.getElementById('listaProductos');
        const nuevoElementoProducto = document.createElement('div');
        nuevoElementoProducto.classList.add('products');
        nuevoElementoProducto.id = nuevoProducto.id;
        nuevoElementoProducto.innerHTML = `
            <h2>${nuevoProducto.title}</h2>
            <p>Descripción: ${nuevoProducto.description}</p>
            <p>Precio: $ ${nuevoProducto.price}</p>
            <p>Código: ${nuevoProducto.code}</p>
            <p>Category: ${nuevoProducto.category}</p>
            <img src="${nuevoProducto.thumbnail}" alt="${nuevoProducto.description}">
            <br>
            <button class="delete" data-productid="${nuevoProducto.id}" >Eliminar</button>
        `;
        listaProductos.appendChild(nuevoElementoProducto);
    });

    const formulario = document.getElementById('formulario');
    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const code = document.getElementById('code').value;
            const stock = document.getElementById('stock').value;
            const category = document.getElementById('category').value;

            const nuevoProducto = {
                title: title,
                description: description,
                price: price,
                code: code,
                stock: stock,
                category: category
            };

            socket.emit('nuevoProducto', nuevoProducto);
            document.getElementById('formulario').reset();
        });
    }

    const listaProductos = document.getElementById('listaProductos');
    if (listaProductos) {
        listaProductos.addEventListener('click', function (event) {
            const deleteButton = event.target.closest('.delete');
            if (deleteButton) {
                const productId = deleteButton.getAttribute('data-productid');
                const productElement = deleteButton.closest('.products');
                if (productElement) {
                    productElement.remove();
                    console.log('Producto eliminado del DOM:', productId);
                } else {
                    console.error('El producto con ID', productId, 'no se encontró en el DOM.');
                }
                socket.emit('eliminarProducto', productId);
            }
        });
    }
});

