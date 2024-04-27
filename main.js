const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let productos = [];

fetch("/js/producto.json")
  .then((res) => res.json())
  .then((data) => {
    productos = [...data];
    cargarProductos(productos);
  });

const cargarProductos = (productos) => {
  contenedorProductos.innerHTML = "";
  productos.forEach((producto) => {
    let div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="producto-img" src="${producto.img}">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
        `;

    let button = document.createElement("button");
    button.classList.add("producto-btn");
    button.innerText = "Agregar al carrito";
    button.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });
    div.append(button);
    contenedorProductos.append(div);
  });
};

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
// const carritoComprado = document.querySelector("#carrito-comprado")
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");

productos.forEach((producto) => {
  let div = document.createElement("div");
  div.classList.add("producto");
  div.innerHTML = `
    <img class="producto-img" src="${producto.img}">
    <h3>${producto.titulo}</h3>
    <p>$${producto.precio}</p>
    `;

  let button = document.createElement("button");
  button.classList.add("producto-btn");
  button.innerText = "Agregar al carrito";
  button.addEventListener("click", () => {
    agregarAlCarrito(producto);
  });

  div.append(button);
  contenedorProductos.append(div);
});

const actualizarCarrito = () => {
  if (carrito.length === 0) {
    carritoVacio.classList.remove("d-none");
    carritoProductos.classList.add("d-none");
  } else {
    carritoVacio.classList.add("d-none");
    carritoProductos.classList.remove("d-none");

    carritoProductos.innerHTML = "";
    carrito.forEach((producto) => {
      let div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
            <p>Cant: ${producto.cantidad}</p>
            `;

      let button = document.createElement("button");
      button.classList.add("carrito-producto-btn");
      button.innerText = "X";
      button.addEventListener("click", () => {
        borrarDelCarrito(producto);
      });
      div.append(button);
      carritoProductos.append(div);
    });
  }
  actualizarTotal();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarAlCarrito = (producto) => {
  const itemEncontrado = carrito.find((item) => item.id === producto.id);
  if (itemEncontrado) {
    itemEncontrado.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();

  Toastify({
    text: "Producto agregado al carrito!",
    duration: 2500,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #ffbe5cc4, #ffd79cc4)",
    },
  }).showToast();
};

const borrarDelCarrito = (producto) => {
  const prodIndex = carrito.findIndex((item) => item.id === producto.id);
  carrito.splice(prodIndex, 1);
  actualizarCarrito();
  
  Toastify({
    text: "Producto eliminado del carrito!",
    duration: 2500,
    close: true,
    gravity: "bottom",
    position: "right",
    style: {
      background: "linear-gradient(to right, #ffd79cc4, #ffbe5cc4)",
    },
  }).showToast();
};

const actualizarTotal = () => {
  const total = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );
  carritoTotal.innerText = `$${total}`;
};

actualizarCarrito();