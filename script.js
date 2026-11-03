// CONFIGURACIÓN DE TU NEGOCIO
const BUSINESS_WHATSAPP = "59167796613"; // Reemplaza con tu número de WhatsApp (código de país + número sin espacios ni +)
const CURRENCY = "Bs. "; // Moneda local configurada a Bolivianos (Bs.)

// Catálogo de Productos con precios en Bolivianos (Bs.)
const products = [
   
    {
        id: 3,
        name: "Pizza Pepperoni Suprema",
        category: "pizzas",
        price: 65.00,
        description: "Masa artesanal horneada en piedra, salsa de tomate italiana, abundante queso mozzarella y rodajas de pepperoni tostado.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Pizza Hawayana Especial",
        category: "pizzas",
        price: 60.00,
        description: "Deliciosa combinación salada y dulce con piña caramelizada, jamón ahumado y doble queso mozzarella.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Jugo de Naranja Natural (1L)",
        category: "bebidas",
        price: 20.00,
        description: "Jugo 100% natural de naranjas recién exprimidas al instante. Sin azúcar añadida ni conservantes. ¡Súper refrescante!",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80"
    },
    
];

// Estado del Carrito
let cart = [];

// Inicializar aplicación
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartUI();
});

// Renderizar Tarjetas de Productos
function renderProducts(productList) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";
    productList.forEach(prod => {
        const card = document.createElement("div");
        card.className = "glass-card rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between group";
        
        card.innerHTML = `
            <div>
                <div class="relative overflow-hidden h-52">
                    <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://placehold.co/600x400/1f2937/f59e0b?text=Comida'">
                    <span class="absolute top-3 right-3 bg-gray-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-extrabold px-3 py-1 rounded-full text-xs">
                        ${CURRENCY}${prod.price.toFixed(2)}
                    </span>
                </div>
                <div class="p-6 space-y-2">
                    <h3 class="text-lg font-bold text-white group-hover:text-amber-400 transition">${prod.name}</h3>
                    <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">${prod.description}</p>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="addToCart(${prod.id})" class="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-950 border border-gray-700 hover:border-amber-500 text-amber-400 font-bold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-plus"></i>
                    <span>Agregar al Pedido</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrar categorías
function filterCategory(cat, event) {
    const buttons = document.querySelectorAll(".category-btn");
    buttons.forEach(btn => {
        btn.classList.remove("active", "bg-amber-500", "text-gray-950", "border-amber-500");
        btn.classList.add("bg-gray-900", "text-gray-300", "border-gray-800");
    });
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.remove("bg-gray-900", "text-gray-300", "border-gray-800");
        event.currentTarget.classList.add("active", "bg-amber-500", "text-gray-950", "border-amber-500");
    }

    if (cat === "all") {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast(`¡${product.name} agregado!`);
}

// Modificar cantidad en carrito
function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

// Vaciar Carrito
function clearCart() {
    cart = [];
    updateCartUI();
}

// Actualizar interfaz del carrito
function updateCartUI() {
    const cartCountBadge = document.getElementById("cart-count-badge");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const emptyMsg = document.getElementById("empty-cart-msg");
    const clientForm = document.getElementById("client-info-form");
    const modalFooter = document.getElementById("modal-footer");
    const totalPriceEl = document.getElementById("cart-total-price");

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCountBadge.innerText = totalItems;

    if (cart.length === 0) {
        emptyMsg.classList.remove("hidden");
        clientForm.classList.add("hidden");
        modalFooter.classList.add("hidden");
        cartItemsContainer.innerHTML = "";
    } else {
        emptyMsg.classList.add("hidden");
        clientForm.classList.remove("hidden");
        modalFooter.classList.remove("hidden");
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between bg-gray-800/60 p-3.5 rounded-2xl border border-gray-700/50">
                <div class="flex items-center space-x-3">
                    <img src="${item.image}" class="w-14 h-14 rounded-xl object-cover" onerror="this.src='https://placehold.co/100x100/1f2937/f59e0b?text=Food'">
                    <div>
                        <h4 class="font-bold text-white text-sm">${item.name}</h4>
                        <span class="text-xs text-amber-500 font-bold">${CURRENCY}${item.price.toFixed(2)} c/u</span>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                        <button onclick="changeQuantity(${item.id}, -1)" class="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition">-</button>
                        <span class="px-3 text-xs font-bold text-white">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" class="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition">+</button>
                    </div>
                    <span class="text-sm font-black text-white w-16 text-right">${CURRENCY}${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `).join("");
    }

    totalPriceEl.innerText = `${CURRENCY}${totalPrice.toFixed(2)}`;
}

// Alternar Modal de Carrito
function toggleCartModal() {
    const modal = document.getElementById("cart-modal");
    modal.classList.toggle("hidden");
    backToCartStep1(); // Resetear siempre al paso 1 al abrir
}

// Ir al paso 2: Mostrar QR Fijo y Total
function proceedToQR() {
    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();
    const address = document.getElementById("client-address").value.trim();

    if (!name || !phone || !address) {
        showToast("⚠️ Por favor completa tus datos de envío");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Cambiar vista de pasos
    document.getElementById("checkout-step-1").classList.add("hidden");
    document.getElementById("checkout-step-2").classList.remove("hidden");
    document.getElementById("step-1-buttons").classList.add("hidden");
    document.getElementById("step-2-buttons").classList.remove("hidden");
    
    document.getElementById("qr-total-amount").innerText = `${CURRENCY}${totalPrice.toFixed(2)}`;
}

// Regresar al Paso 1
function backToCartStep1() {
    document.getElementById("checkout-step-1").classList.remove("hidden");
    document.getElementById("checkout-step-2").classList.add("hidden");
    document.getElementById("step-1-buttons").classList.remove("hidden");
    document.getElementById("step-2-buttons").classList.add("hidden");
}

// Enviar pedido mediante WhatsApp con texto formateado
function sendOrderToWhatsApp() {
    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();
    const address = document.getElementById("client-address").value.trim();
    const notes = document.getElementById("client-notes").value.trim();

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let message = `🍔 *NUEVO PEDIDO - BURGER & PIZZA EXPRESS* 🍕\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *Teléfono:* ${phone}\n`;
    message += `📍 *Dirección:* ${address}\n`;
    if (notes) message += `📝 *Notas:* ${notes}\n`;
    message += `------------------------------------\n`;
    message += `🛒 *DETALLE DEL PEDIDO:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - ${CURRENCY}${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `------------------------------------\n`;
    message += `💰 *TOTAL A PAGAR:* ${CURRENCY}${totalPrice.toFixed(2)}\n`;
    message += `💳 *Método de Pago:* Transferencia con QR Fijo ✅\n\n`;
    message += `*¡Adjunto mi comprobante de pago por aquí!* 📸`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`;

    // Abrir enlace de WhatsApp
    window.open(whatsappURL, "_blank");

    // Limpiar carrito y cerrar modal tras enviar
    clearCart();
    toggleCartModal();
    showToast("¡Pedido enviado con éxito a WhatsApp!");
}

// Notificación Toast flotante
function showToast(msg) {
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    
    toastMsg.innerText = msg;
    toast.classList.remove("translate-y-32", "opacity-0");
    
    setTimeout(() => {
        toast.classList.add("translate-y-32", "opacity-0");
    }, 3000);
}
