"use strict";
/*
 *  DI CIO JOAQUIN
 */

const productsList = [
  {
    id: 1,
    nombre: "Smartphone",
    descripcion: "Teléfono inteligente con pantalla AMOLED",
    precio: 699.99,
    imagen:
      "https://d2ihpvt6nd5q28.cloudfront.net/wp-content/uploads/2023/02/iPhone_14_Midnight_PDP_Image_Position-1A_LAES.jpg",
    categoria: "Teléfonos",
  },
  {
    id: 2,
    nombre: "Auriculares Bluetooth",
    descripcion: "Auriculares inalámbricos con cancelación de ruido",
    precio: 129.99,
    imagen:
      "https://ar.oneclickstore.com/wp-content/uploads/2021/04/AirPods-2_001.jpg",
    categoria: "Accesorios",
  },
  {
    id: 3,
    nombre: "Portátil Ultrabook",
    descripcion: "Portátil ligero y potente con SSD",
    precio: 1299.99,
    imagen:
      "https://tiendadiggit.com.ar/web/image/product.image/4055/image_1024/Notebook%20gamer%20ROG%20Strix%20Scar%2018%20Core%20i9%20G834JY-N6016W%201TB%2032GB%20RTX%204090?unique=f15b5f6",
    categoria: "Computadoras",
  },
  {
    id: 4,
    nombre: "TV 4K",
    descripcion: "Televisor con resolución Ultra HD y Smart TV",
    precio: 899.99,
    imagen:
      "https://d2eebw31vcx88p.cloudfront.net/garbarino/uploads/0549da656f71cc118c1080984bad17506f8c48e4.jpg",
    categoria: "Electrodomésticos",
  },
  {
    id: 5,
    nombre: "Cámara de Seguridad",
    descripcion: "Cámara de seguridad con visión nocturna",
    precio: 159.99,
    imagen: "https://siccba.com.ar/wp-content/uploads/2020/09/V-DHD200S.webp",
    categoria: "Accesorios",
  },
  {
    id: 6,
    nombre: "Tablet",
    descripcion: "Tablet con pantalla táctil de 10 pulgadas",
    precio: 299.99,
    imagen:
      "https://media-cdn.bnn.in.th/246356/iPad_Pro_Wi-Fi_11_in_4th_Gen_Silver_8-square_medium.jpg",
    categoria: "Computadoras",
  },
  {
    id: 7,
    nombre: "Altavoces Bluetooth",
    descripcion: "Altavoces portátiles con conectividad inalámbrica",
    precio: 79.99,
    imagen:
      "https://files.cults3d.com/uploaders/22539349/illustration-file/81d76dc1-ebc0-4139-b366-34727a0964c4/untitled.3626.jpg",
    categoria: "Accesorios",
  },
  {
    id: 8,
    nombre: "Monitor Gaming",
    descripcion: "Monitor curvo de alta frecuencia de actualización",
    precio: 499.99,
    imagen: "https://mla-s1-p.mlstatic.com/834906-MLA52555960227_112022-F.jpg",
    categoria: "Computadoras",
  },
  {
    id: 9,
    nombre: "Robot Aspirador",
    descripcion: "Aspiradora robot inteligente con mapeo",
    precio: 349.99,
    imagen:
      "https://compuliderstore.com.ar/wp-content/uploads/2021/04/XIAOMIROBOT-1.jpg",
    categoria: "Electrodomésticos",
  },
];

//using set constructor to remove duplicated values from the mapped array
//this creates a dynamic categories array
let categories = [
  ...new Set(productsList.map((product) => product.categoria)),
  "todos",
];
//if there is data in localstorage...if not, use empty array for cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//initialize
init();

function init() {
  renderProducts(productsList);
  renderFilters();
  //we need to update the preview in case there is data in localstorage
  if (cart.length > 0) updateCartPreview();
}
//rendering products
function renderProducts(productsToRender) {
  const productsContainer = document.querySelector("#products");
  productsToRender.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("product-card");
    //creating image for product
    const img = document.createElement("img");
    img.setAttribute("src", product.imagen);
    img.setAttribute("alt", product.nombre);
    li.appendChild(img);
    //creating div for product
    const div = document.createElement("div");
    li.appendChild(div);
    //adding info to div
    const h3 = document.createElement("h3");
    h3.textContent = product.nombre;
    div.appendChild(h3);
    AddParagraph(div, product.precio + "$", "price");
    AddParagraph(div, product.categoria, "category");
    //creates a button
    const btn = document.createElement("button");
    btn.addEventListener("click", () => addToCart(product.id));
    btn.textContent = "Añadir al carrito";
    li.appendChild(btn);
    li.addEventListener("click", (e) => showProductDetails(product, e.target));
    //appends everything to the container
    productsContainer.appendChild(li);
  });
}
//show product details
function showProductDetails(product, target) {
  if (target.tagName !== "BUTTON") {
    const { modalContainer, modal } = generateNewModal(product.nombre);
    //modal image
    const img = document.createElement("img");
    img.setAttribute("src", product.imagen);
    img.setAttribute("alt", product.nombre);
    modal.appendChild(img);
    //modal product description
    AddParagraph(modal, product.descripcion);
    //modal buy button
    const btn = document.createElement("button");
    btn.addEventListener("click", () => addToCart(product.id));
    btn.textContent = "Añadir al carrito";
    modal.appendChild(btn);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
  }
}
//show cart
function showCart() {
  const { modalContainer, modal } = generateNewModal("Carrito", "modal-cart");
  //Cart list
  const cartList = generateCartList();
  //Cart total
  const ammount = cart.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  const total = document.createElement("p");
  total.textContent = `TOTAL:  $${ammount.toFixed(2)}`;
  total.setAttribute("id", "cart-total");
  //checkout btn
  const checkoutBtn = document.createElement("button");
  checkoutBtn.setAttribute("type", "submit");
  checkoutBtn.textContent = "Finalizar Compra";
  checkoutBtn.addEventListener("click", () => showCheckoutModal());
  //appends everything to modal
  modal.appendChild(cartList);
  modal.appendChild(total);
  if (cart.length > 0) modal.appendChild(checkoutBtn);
  modalContainer.appendChild(modal);
  document.body.appendChild(modalContainer);
}
//Generte cart list
function generateCartList() {
  const ul = document.createElement("ul");
  cart.forEach((itemInCart) => {
    //item container
    const item = document.createElement("li");
    item.id = itemInCart.id;
    item.classList.add("cart-item");
    //image item
    const img = document.createElement("img");
    img.setAttribute("src", itemInCart.imagen);
    img.setAttribute("alt", itemInCart.nombre);
    item.appendChild(img);
    //item name
    AddParagraph(item, itemInCart.nombre);
    //item qty
    AddParagraph(item, "x" + itemInCart.cantidad);
    //item price
    AddParagraph(item, itemInCart.precio + "$");
    //delete btn
    const btn = document.createElement("button");
    btn.classList.add("btn-delete");
    btn.textContent = "Borrar";
    btn.addEventListener("click", () => removeFromCart(itemInCart.id));

    item.appendChild(btn);
    ul.appendChild(item);
  });
  return ul;
}
//remove from cart
function removeFromCart(id) {
  const item = cart.find((itemCart) => itemCart.id === id);
  if (item) {
    item.cantidad--;
  }
  if (item.cantidad == 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }
  console.log(cart);
  document.body.removeChild(document.getElementById("modal-cart"));
  showCart();
  updateCartPreview();
}
//closes any active modal
function closeModal() {
  document.body.removeChild(document.querySelector(".modal-container"));
}
//rendering filters
function renderFilters() {
  const filtersContainer = document.getElementById("filters");
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.addEventListener("click", () => showProductsByCategory(cat));
    filtersContainer.appendChild(btn);
  });
}
//filter products by category
function showProductsByCategory(cat) {
  if (cat === "todos") {
    clearList();
    removeBanner();
    renderProducts(productsList);
  } else {
    const result = productsList.filter((product) => product.categoria == cat);
    clearList();
    generateBanner(cat);
    if (result) renderProducts(result);
  }
}
//clears products list
function clearList() {
  const ul = document.getElementById("products");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}
//generates specific banner for each category
function generateBanner(cat) {
  //remove previous banner if there is one
  removeBanner();
  //generate new banner
  const bannerContainer = document.createElement("div");
  bannerContainer.id = "banner";
  const bannerTitle = document.createElement("h2");
  bannerTitle.textContent = "Descubri las increibles ofertas en " + cat;
  bannerContainer.appendChild(bannerTitle);
  document
    .getElementById("list-title")
    .insertAdjacentElement("beforebegin", bannerContainer);
  setTimeout(() => removeBanner(), 10000);
}
function removeBanner() {
  if (document.getElementById("banner")) {
    document.getElementById("banner").remove();
  }
}
//add to cart
function addToCart(id) {
  const item = productsList.find((item) => item.id === id);
  //veryfies if the item is already in cart
  const itemInCart = cart.find((item) => item.id === id);
  if (!itemInCart) {
    cart.push({ ...item, cantidad: 1 });
  } else {
    itemInCart.cantidad++;
  }
  updateCartPreview();
}

//update cart-preview data
function updateCartPreview() {
  const qty = cart.reduce((qty, item) => qty + item.cantidad, 0);
  const ammount = cart.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  document.getElementById("cart-items").textContent = qty;
  document.getElementById("cart-total").textContent = ammount.toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));
}
//displays checkout modal
function showCheckoutModal() {
  closeModal();
  //generating new modal
  const { modalContainer, modal } = generateNewModal("Checkout");
  //modal form
  modal.appendChild(generateCheckoutForm());
  modalContainer.appendChild(modal);
  document.body.appendChild(modalContainer);
}
//generate form for checkout-modal
function generateCheckoutForm() {
  const checkoutForm = document.createElement("form");
  checkoutForm.classList.add("form-checkout");
  //username
  checkoutForm.appendChild(createInput("Nombre", "text", null, "name", true));
  //tel
  checkoutForm.appendChild(
    createInput("11 1234 - 5678", "tel", null, "tel", true)
  );
  //email
  checkoutForm.appendChild(
    createInput("alguien@gmail.com", "email", null, "email", true)
  );
  //requesting card info
  const h5Card = document.createElement("h5");
  h5Card.textContent = "Datos de la tarjeta";
  checkoutForm.appendChild(h5Card);
  //payment method
  const paymentMethodContainer = document.createElement("div");
  paymentMethodContainer.classList.add("payment-methods");
  // ----- debit
  const debitBtn = document.createElement("button");
  debitBtn.textContent = "Debito";
  debitBtn.className = "payment-method-btn method-selected";
  paymentMethodContainer.appendChild(debitBtn);
  debitBtn.addEventListener("click", (e) => togglePaymentMethod(e));
  // ----- credit
  const creditBtn = document.createElement("button");
  creditBtn.textContent = "Credito";
  creditBtn.className = "payment-method-btn";
  paymentMethodContainer.appendChild(creditBtn);
  creditBtn.addEventListener("click", (e) => togglePaymentMethod(e));
  checkoutForm.appendChild(paymentMethodContainer);
  //card number
  checkoutForm.appendChild(
    createInput("1234 5678 9123 4567", "text", null, "card-number", true)
  );
  //card cvv
  checkoutForm.appendChild(
    createInput("CVV", "number", "d-inline-block", "cvv", true)
  );
  //card exp
  checkoutForm.appendChild(
    createInput("MMAA", "text", "d-inline-block", "card-expiration", true)
  );
  //delivery info
  const h5Delivery = document.createElement("h5");
  h5Delivery.textContent = "Datos de envio";
  checkoutForm.appendChild(h5Delivery);
  //delivery adress
  checkoutForm.appendChild(
    createInput("Direccion 1234", "text", null, "adress", true)
  );
  //ZIP code
  checkoutForm.appendChild(
    createInput("Codigo Postal", "text", "d-inline-block", "zip", true)
  );
  // doorbell
  checkoutForm.appendChild(
    createInput("Timbre", "text", "d-inline-block", "bell", true)
  );
  //submit btn
  const submit = document.createElement("button");
  submit.classList.add("checkout-btn");
  submit.type = "submit";
  submit.textContent = "Finalizar";
  submit.addEventListener("click", (e) => showThanksModal(e));
  checkoutForm.appendChild(submit);

  return checkoutForm;
}
function showThanksModal(e) {
  e.preventDefault();
  if (validateForm()) {
    //restarting cart
    cart = [];
    updateCartPreview();
    //closing previous modal
    closeModal();
    //generating new one
    const { modalContainer, modal } = generateNewModal("Compra finalizada");
    //thanks title
    const title = document.createElement("h5");
    title.classList.add("thanks-message");
    title.textContent = "Gracias por tu compra!";
    //thanks message
    const p = document.createElement("p");
    p.textContent =
      "Tu compra ha sido finalizada con exito, podes revisar el progreso del envio a traves del mail que enviamos a tu casilla de correo";
    //btn download
    const btnDownload = document.createElement("a");
    btnDownload.textContent = "Descargar Factura";
    btnDownload.classList = "btn-download";
    btnDownload.target = "_blank";
    btnDownload.href = "./assets/facturaejemplo.pdf";
    modal.appendChild(title);
    modal.appendChild(p);
    modal.appendChild(btnDownload);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
  }
}

//============================================UTILITIES
function AddParagraph(appendTo, text, classname) {
  if (text) {
    const p = document.createElement("p");
    p.textContent = text;
    if (classname) {
      p.classList.add(classname);
    }
    appendTo.appendChild(p);
  }
}
function togglePaymentMethod(e) {
  e.preventDefault();
  isCreditCard(e.target.textContent);
  const buttons = document.querySelectorAll(".payment-method-btn");
  buttons.forEach((button) => button.classList.toggle("method-selected"));
}
function createInput(placeholder, type, classname, id, required) {
  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.type = type;
  if (classname) input.classList.add(classname);
  if (id) input.id = id;
  input.required = required;

  return input;
}
function isCreditCard(cardType) {
  if (cardType === "Credito") {
    //select in case is credit card
    const select = document.createElement("select");
    select.id = "select-credit";
    const options = [
      "1 cuota sin interes",
      "3 cuotas sin interes",
      "6 cuotas sin interes",
    ];
    options.forEach((optionTxt) => {
      const opt = document.createElement("option");
      opt.value = optionTxt;
      opt.text = optionTxt;
      select.add(opt);
    });
    document
      .getElementById("card-expiration")
      .insertAdjacentElement("afterend", select);
  } else {
    document.getElementById("select-credit").remove();
  }
}
//generates a generic modal ==> return two HTMLelements: modalContainer and modal
function generateNewModal(title, id) {
  //new modal
  const modalContainer = document.createElement("div");
  if (id) modalContainer.setAttribute("id", id);
  modalContainer.classList.add("modal-container");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  //modal header
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  const h3 = document.createElement("h3");
  h3.textContent = title;
  //close btn
  const span = document.createElement("span");
  span.textContent = "X";
  span.classList.add("close-btn");
  span.addEventListener("click", () => closeModal());
  modalHeader.appendChild(h3);
  modalHeader.appendChild(span);
  modal.appendChild(modalHeader);

  return { modalContainer, modal };
}
//trigger form validations
function validateForm() {
  let isValid = true;
  //verifies if any input is empty
  getInputsFromCheckout().forEach((input) => {
    if (input.value.trim() === "") {
      isValid = false;
      markUpError(input);
    } else {
      input.style.border = "none";
    }
  });
  //validate email
  if (!validateEmail()) {
    isValid = false;
    markUpError(document.getElementById("email"), "Formato de mail invalido");
  }
  if (
    !validateCardNumbers(
      document.getElementById("card-number"),
      document.getElementById("cvv"),
      document.getElementById("card-expiration")
    )
  )
    isValid = false;
  if (isNaN(document.getElementById("tel").value)) {
    isValid = false;
    markUpError(document.getElementById("tel"), "Telefono invalido");
  }
  return isValid;
}
function validateCardNumbers(cardnumber, cvv, exp) {
  let isValid = true;
  const cardData = [cardnumber, cvv, exp];
  //verifying data is type number
  cardData.forEach((input) => {
    if (isNaN(input.value)) {
      isValid = false;
      markUpError(input, "Deben ser numeros");
    }
  });
  //cardnumber lenght
  if (cardnumber.value.length !== 16) {
    isValid = false;
    markUpError(cardnumber, "Deben ser 16 digitos sin espacios");
  }
  //code lenght
  if (cvv.value.length !== 3) {
    isValid = false;
    markUpError(cvv);
  }
  //expiration format
  if (exp.value.length !== 4) {
    isValid = false;
    markUpError(exp);
  }
  return isValid;
}
//displays error msg
function markUpError(element, message) {
  element.style.border = "1px solid red";
  if (message && !checkErrorExistence(element)) {
    const err = document.createElement("p");
    err.style.color = "red";
    err.textContent = message;
    err.style.fontSize = "12px";
    err.style.width = "100%";
    err.id = "p-" + element.id;
    element.insertAdjacentElement("afterend", err);
  }
}
//check if error msg is already displayed
function checkErrorExistence(element) {
  if (document.getElementById("p-" + element.id)) return true;
  return false;
}
function getInputsFromCheckout() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const tel = document.getElementById("tel");
  const cardNumber = document.getElementById("card-number");
  const cardExpiration = document.getElementById("card-expiration");
  const cvv = document.getElementById("cvv");
  const adress = document.getElementById("adress");
  const bell = document.getElementById("bell");
  const zip = document.getElementById("zip");
  const inputsArr = [
    name,
    email,
    tel,
    cardNumber,
    cardExpiration,
    cvv,
    adress,
    bell,
    zip,
  ];
  return inputsArr;
}
function validateEmail() {
  const email = document.getElementById("email").value;
  //check if there is any blank spaces
  if (/\s/.test(email)) return false;
  // Check that there is exactly one '@' symbol
  const atSymbols = email.split("@");
  if (atSymbols.length !== 2) {
    return false;
  }

  // Check that there is at least one '.' symbol after '@'
  const dotsAfterAt = atSymbols[1].split(".");
  if (dotsAfterAt.length < 2) {
    return false;
  }

  // Check for consecutive dots in the local and domain parts
  if (atSymbols[0].includes("..") || atSymbols[1].includes("..")) {
    return false;
  }

  // Check for dots at the beginning or end of the email
  if (
    atSymbols[0].startsWith(".") ||
    atSymbols[0].endsWith(".") ||
    atSymbols[1].startsWith(".") ||
    atSymbols[1].endsWith(".")
  ) {
    return false;
  }
  // If all conditions are met, the email is considered valid
  return true;
}
