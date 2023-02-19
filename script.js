const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const tabla = document.getElementById("carro")

function calcularTotal (){
    let total  = carrito.reduce((acc, {total}) => acc + total, 0)
    sumaTotal.innerHTML = `<h2>${total}</h2>`;
    return total
}

const tostadaUnidad = (producto, masOmenos) => {
    Toastify({
        text:`${masOmenos}1 unidad ${producto.nombre}`,
        duration: 2000,
        style: {
            background: "linear-gradient(to right, #FFAC1C, #800020)",
        }
    }).showToast();
}


const botonTarjeta = libro => {
    document.querySelector(`#libro-${libro.id} button`).addEventListener('click', () => {  
        const productoEnElCarrito = carrito.find((productoCarrito) => productoCarrito.id === libro.id);
        const cantidad = (productoEnElCarrito?.cantidad || 0) + 1
        const total = (productoEnElCarrito?.total || 0) + libro.precio
        if (productoEnElCarrito) {
            productoEnElCarrito.cantidad = cantidad;
            productoEnElCarrito.total = total;
        } else {
            carrito.push({...libro,cantidad,total})
        }
        carrito.forEach(libro => {itemsDelCarro(libro)})
        tabla.innerHTML = ""
        carrito.forEach(libro => {itemsDelCarro(libro)})
        let totalReal = carrito.reduce((acc, {total}) => acc + total, 0)
        sumaTotal.innerHTML = `<h2>${totalReal}</h2>`;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        tostadaUnidad(libro, "+")
})}

const botonBorrar = libro => { 
    const boton = document.querySelector(`#casillero-${libro.id} button`)
    boton.addEventListener('click', ()  => {
        if (libro.cantidad === 1){
            const contenedor = boton.parentNode
            const idBoton = boton.id
            const libroABorrar = carrito.find((libro) => libro.nombre == idBoton )
            let indice = carrito.map(libro => libro.nombre).indexOf(libroABorrar.nombre)
            contenedor.parentNode.remove()
            carrito.splice(indice, 1)
            localStorage.setItem('carrito', JSON.stringify(carrito))
            calcularTotal()
        }
        else if(libro.cantidad >1){
            libro.cantidad = libro.cantidad - 1
            libro.total = libro.total - libro.precio
            calcularTotal()
            const casilleroCantidad = document.getElementById(`cantidad-${libro.nombre}`)
            casilleroCantidad.innerHTML= `<div><h3>${libro.cantidad}</h3></div>`
            tostadaUnidad(libro, "-")
        }
        
})}

const librero = document.getElementById("libreria")
const tarjetaLibro = libro => {
    const tarjeta = document.createElement('div');
    tarjeta.className = "col filtro"
    tarjeta.innerHTML= 
        `<div id="libro-${libro.id}" class="card" >
            <img src="${libro.imagen}" class="card-img-top">
            <div class="card-body">
                <h5>${libro.nombre}</h5>
                <p>tipo: ${libro.tipo}</p>
                <p>precio: $${libro.precio}</p>
                <button class="btn btn-primary" id="botonCompra">agregar al carrito</button>
            </div>
        </div>`;
    librero.append(tarjeta)
    botonTarjeta(libro)
}

const itemsDelCarro = item => {
    const hilera = document.createElement('div')
    hilera.className = "row"
    hilera.innerHTML = `
        <div class="col-3 border-1 casillero"><h3>${item.nombre}</h3></div>
        <div class="col-3 border-1 casillero"><h3>$${item.precio}</h3></div>
        <div class="col-3 border-1 casillero" id="cantidad-${item.nombre}"><h3>${item.cantidad}</h3></div>
        <div class="col-3 border-1  casillero" id="casillero-${item.id}"><button class="btn btn-primary" name="botonBorrar" id="${item.nombre}">quitar</button></div>`
    tabla.append(hilera)
    botonBorrar(item)
    }

function iniciar(productos){
    productos.forEach(libro => {tarjetaLibro(libro)})
    carrito.forEach(libro => {itemsDelCarro(libro)})
}

const botonesDeRadio = data =>{ 
const radios = document.querySelectorAll(('input[name="filtro"]'))
    for (const radio of radios) {
        radio.onclick = (e) => {
            const tipoDeLibro = e.target.value;
            const productosFiltrados = tipoDeLibro ?
                data.filter((libro) => libro.tipo === tipoDeLibro) :
                data;
            document.querySelectorAll('.filtro').forEach(child => child.remove());
            productosFiltrados.forEach(libro => {tarjetaLibro(libro)})
    }}}

const botonCompra = document.getElementById("botonCompra")
botonCompra.addEventListener('click', () => {
    if (carrito.length >0){carrito.splice(0, carrito.length)
        console.log(carrito)
        localStorage.setItem('carrito', JSON.stringify(carrito))
        tabla.innerHTML= ""
        sumaTotal.innerHTML= ""
        Swal.fire({
            title: 'Gracias por su compra',
            text: 'vuelva pronto',
            icon: 'success',
            timer: 1300,
            showConfirmButton: false,
            background: '#36454F',
            color: '#FFAC1C'
        })}
    else{
        Toastify({
            text: "No hay productos en el carro",
            duration: 2000,
            style: {
                background: "linear-gradient(to right, #FFAC1C, #800020)",
            }
            
        }).showToast();
}})

const traerLibros = async () => {
    try {
        const response  = await fetch('./libros.json')
    const productos = await response.json()
    botonesDeRadio(productos)
    iniciar(productos)
    } catch (error) {
        console.log("algo fallo")
    }
    
}

traerLibros()










// carrito.map(libro => libro.nombre).indexOf(libroABorrar)
// const libroABorrar = carrito.map(libro => libro.nombre).find((libro) => libro.id = libroid)
        // const indice = carrito.map(libro => libro.nombre).indexOf(libroABorrar)