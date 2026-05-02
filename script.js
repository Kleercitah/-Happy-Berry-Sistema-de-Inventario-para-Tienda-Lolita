// ===== DATOS =====
// Definimos un array de productos con estructura consistente.
// Esto permite aplicar métodos como filter, find o reduce sin errores.
// Todas las propiedades se usan en la UI o en la lógica (no hay datos innecesarios).
const productos = [
  { id: 1, nombre: "Strawberry Dream Dress", categoria: "dress", talla: "M", precio: 120, stock: 5, imagen: "Happy Berry/Strawberry%20Dream%20Dress.jpg" },
  { id: 2, nombre: "Cherry Blossom Skirt", categoria: "skirt", talla: "S", precio: 80, stock: 2, imagen: "Happy Berry/Cherry%20Blossom%20Skirt.jpg" },
  { id: 3, nombre: "Sweet Ribbon Blouse", categoria: "blouse", talla: "L", precio: 60, stock: 10, imagen: "Happy Berry/Sweet%20Ribbon%20Blouse.jpg" },
  { id: 4, nombre: "Pink Cupcake Dress", categoria: "dress", talla: "S", precio: 140, stock: 1, imagen: "Happy Berry/Pink%20Cupcake%20Dress.jpg" },
  { id: 5, nombre: "Berry Lace Skirt", categoria: "skirt", talla: "M", precio: 90, stock: 7, imagen: "Happy Berry/Berry%20Lace%20Skirt.jpg" },
  { id: 6, nombre: "Angel Blouse", categoria: "blouse", talla: "S", precio: 70, stock: 3, imagen: "Happy Berry/Angel%20Blouse.jpg" },
  { id: 7, nombre: "Candy Dress", categoria: "dress", talla: "L", precio: 150, stock: 0, imagen: "Happy Berry/Candy%20Dress.jpg" },
  { id: 8, nombre: "Pastel Skirt", categoria: "skirt", talla: "L", precio: 85, stock: 6, imagen: "Happy Berry/Pastel%20Skirt.jpg" },
  { id: 9, nombre: "Princess Blouse", categoria: "blouse", talla: "M", precio: 75, stock: 4, imagen: "Happy Berry/Princess%20Blouse.jpg" },
  { id: 10, nombre: "Lovely Berry Dress", categoria: "dress", talla: "M", precio: 130, stock: 2, imagen: "Happy Berry/Lovely%20Berry%20Dress.jpg" }
];


// ===== selectores =====
// se centralizan los elementos del DOM para evitar repetir búsquedas
// y mantener el código más limpio y facil de modificar.
const contenedor = document.getElementById("contenedorProductos");
const inputBuscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroTalla = document.getElementById("filtroTalla");
const valorTotal = document.getElementById("valorTotal");
const alertaStock = document.getElementById("alertaStock");


// ===== render =====
function renderizarProductos(lista) {
  // limpiamos el contenedor antes de volver a renderizar
  contenedor.innerHTML = "";

  // estado vacio: importante para UX (no dejar pantalla en blanco)
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="estado-vacio">No se encontraron productos 💔</p>`;
    return;
  }

  // recorremos la lista y generamos las tarjetas dinámicamente
  lista.forEach(producto => {

    // decision UX: consideramos stock bajo cuando es <= 2
    // esto permite alertar antes de que el producto se agote
    const esStockBajo = producto.stock <= 2;

    contenedor.innerHTML += `
      <div class="col-md-4">
        <div class="card p-2">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p>${producto.categoria} | Talla: ${producto.talla}</p>
            <p class="precio">$${producto.precio}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            
            <!-- Se muestra solo si cumple la condición -->
            ${esStockBajo ? `<span class="stock-bajo">⚠️ Stock bajo</span>` : ""}
          </div>
        </div>
      </div>
    `;
  });
}


// ===== filtors =====
function filtrarProductos() {

  // creamos copia del array para no modificar el original
  let listaFiltrada = [...productos];

  // filter → filtra por categoría si el usuario selecciona una
  if (filtroCategoria.value !== "all") {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === filtroCategoria.value);
  }

  // filter → filtra por talla
  if (filtroTalla.value !== "all") {
    listaFiltrada = listaFiltrada.filter(p => p.talla === filtroTalla.value);
  }

  // capturamos texto del buscador
  const textoBusqueda = inputBuscador.value.toLowerCase();

  // find → busqueda exacta (requisito del proyecto)
  // se usa find porque devuelve un único resultado
  if (textoBusqueda) {
    const productoEncontrado = productos.find(p =>
      p.nombre.toLowerCase() === textoBusqueda
    );

    // si encuentra coincidencia → muestra solo ese producto
    // si no → lista vacía (activa estado vacío)
    listaFiltrada = productoEncontrado ? [productoEncontrado] : [];
  }

  // sort → ordenamos por precio ascendente
  // decision: facilita comparar precios visualmente
  listaFiltrada.sort((a, b) => a.precio - b.precio);

  // Actualizamos toda la UI con la nueva lista
  renderizarProductos(listaFiltrada);
  calcularValorTotal(listaFiltrada);
  verificarStockBajo(listaFiltrada);
}


// ===== reduce =====
function calcularValorTotal(lista) {

  // reduce → suma el valor total del inventario visible
  const total = lista.reduce((acumulador, producto) => {

    // acumulador guarda el total parcial
    // multiplicamos precio * stock para obtener valor real
    return acumulador + (producto.precio * producto.stock);

  }, 0);

  valorTotal.textContent = `$${total}`;
}


// ===== some =====
function verificarStockBajo(lista) {

  // some → verifica si al menos un producto cumple la condición
  const hayStockBajo = lista.some(producto => producto.stock <= 2);

  // Mostramos u ocultamos la alerta segun el resultado
  alertaStock.classList.toggle("d-none", !hayStockBajo);
}


// ===== eventos =====
// cada cambio del usuario dispara el filtrado completo
// esto mantiene la UI siempre sincronizada
inputBuscador.addEventListener("input", filtrarProductos);
filtroCategoria.addEventListener("change", filtrarProductos);
filtroTalla.addEventListener("change", filtrarProductos);


// ===== inicialización =====
// se renderiza todo al cargar la página
// esto asegura que el usuario vea información desde el inicio
renderizarProductos(productos);
calcularValorTotal(productos);
verificarStockBajo(productos);