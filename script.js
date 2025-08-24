// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para productos
    const sampleParts = [
        {
            id: 1,
            name: "Pantalla iPhone 11",
            description: "Pantalla original de repuesto para iPhone 11, con garantía de 6 meses.",
            price: 89.99,
            image: "img/pantalla-iphone11.jpg"
        },
        {
            id: 2,
            name: "Batería Samsung S20",
            description: "Batería de alta capacidad para Samsung Galaxy S20, con herramientas de instalación.",
            price: 49.99,
            image: "img/bateria-s20.jpg"
        },
        {
            id: 3,
            name: "Cargador Rápido USB-C",
            description: "Cargador rápido de 25W compatible con la mayoría de dispositivos USB-C.",
            price: 24.99,
            image: "img/cargador-usbc.jpg"
        }
    ];

    const samplePhones = [
        {
            id: 101,
            name: "iPhone XS Max",
            description: "iPhone XS Max en excelente estado, 64GB, desbloqueado, con todos sus accesorios.",
            price: 349.99,
            image: "img/iphone-xs-1.jpg",
            image2: "img/iphone-xs-2.jpg"
        },
        {
            id: 102,
            name: "Samsung Galaxy S10",
            description: "Samsung Galaxy S10, 128GB, color negro, con funda y protector de pantalla incluidos.",
            price: 279.99,
            image: "img/s10-1.jpg",
            image2: "img/s10-2.jpg"
        }
    ];

    // Cargar productos desde localStorage o usar datos de ejemplo
    let parts = JSON.parse(localStorage.getItem('movillap-parts')) || sampleParts;
    let phones = JSON.parse(localStorage.getItem('movillap-phones')) || samplePhones;

    // Elementos del DOM
    const partsContainer = document.getElementById('parts-container');
    const phonesContainer = document.getElementById('phones-container');
    const repairForm = document.getElementById('repair-form');
    const adminModal = document.getElementById('admin-modal');
    const productModal = document.getElementById('product-modal');
    const adminLoginBtn = document.getElementById('admin-login');
    const adminForm = document.getElementById('admin-form');
    const productForm = document.getElementById('product-form');
    const closeButtons = document.querySelectorAll('.close');
    const deleteProductBtn = document.getElementById('delete-product');

    // Inicializar la página
    function init() {
        renderProducts(parts, partsContainer, 'part');
        renderProducts(phones, phonesContainer, 'phone');
        setupEventListeners();
    }

    // Renderizar productos
    function renderProducts(products, container, type) {
        container.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Para teléfonos, crear un carrusel de imágenes
            const imagesHtml = type === 'phone' && product.image2 ? 
                `<div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <img src="${product.image2}" alt="${product.name}" style="display:none;">
                </div>` :
                `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div>`;
            
            productCard.innerHTML = `
                ${imagesHtml}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn buy-btn" data-id="${product.id}" data-type="${type}">Comprar</button>
                </div>
            `;
            
            container.appendChild(productCard);
        });

        // Configurar carrusel para teléfonos
        if (type === 'phone') {
            setupImageCarousels();
        }
    }

    // Configurar carrusel de imágenes para teléfonos
    function setupImageCarousels() {
        const imageContainers = document.querySelectorAll('.product-image');
        
        imageContainers.forEach(container => {
            if (container.querySelectorAll('img').length > 1) {
                let currentImage = 0;
                const images = container.querySelectorAll('img');
                
                container.addEventListener('click', function() {
                    images[currentImage].style.display = 'none';
                    currentImage = (currentImage + 1) % images.length;
                    images[currentImage].style.display = 'block';
                });
                
                // Cambiar automáticamente cada 3 segundos
                setInterval(() => {
                    images[currentImage].style.display = 'none';
                    currentImage = (currentImage + 1) % images.length;
                    images[currentImage].style.display = 'block';
                }, 3000);
            }
        });
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Botones de compra
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productType = this.getAttribute('data-type');
                const product = productType === 'part' ? 
                    parts.find(p => p.id == productId) : 
                    phones.find(p => p.id == productId);
                
                // Enviar mensaje de WhatsApp
                const message = `Hola, estoy interesado en comprar: ${product.name} - $${product.price.toFixed(2)}`;
                const whatsappURL = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
                window.open(whatsappURL, '_blank');
            });
        });

        // Formulario de reparación
        repairForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const repairData = {
                name: formData.get('name'),
                address: formData.get('address'),
                phoneType: formData.get('phone-type'),
                brand: formData.get('brand'),
                problem: formData.get('problem'),
                date: formData.get('date')
            };
            
            // Crear mensaje para WhatsApp
            const message = `*Nueva solicitud de reparación:*%0A%0A` +
                            `*Nombre:* ${repairData.name}%0A` +
                            `*Dirección:* ${repairData.address}%0A` +
                            `*Tipo de teléfono:* ${repairData.phoneType}%0A` +
                            `*Marca:* ${repairData.brand}%0A` +
                            `*Problema:* ${repairData.problem}%0A` +
                            `*Fecha deseada:* ${repairData.date}`;
            
            const whatsappURL = `https://wa.me/1234567890?text=${message}`;
            window.open(whatsappURL, '_blank');
            
            // Limpiar formulario
            this.reset();
            alert('Solicitud enviada. Será redirigido a WhatsApp para confirmar.');
        });

        // Modal de administración
        adminLoginBtn.addEventListener('click', function() {
            adminModal.style.display = 'flex';
        });

        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('admin-user').value;
            const password = document.getElementById('admin-password').value;
            
            // Verificación simple (en producción usar método seguro)
            if (username === 'admin' && password === 'admin123') {
                adminModal.style.display = 'none';
                productModal.style.display = 'flex';
                // Aquí cargaríamos la interfaz de administración completa
                alert('Bienvenido al panel de administración');
            } else {
                alert('Credenciales incorrectas');
            }
        });

        // Formulario de productos (admin)
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });

        deleteProductBtn.addEventListener('click', function() {
            deleteProduct();
        });

        // Cerrar modales
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                adminModal.style.display = 'none';
                productModal.style.display = 'none';
            });
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                adminModal.style.display = 'none';
            }
            if (e.target === productModal) {
                productModal.style.display = 'none';
            }
        });
    }

    // Guardar producto (admin)
    function saveProduct() {
        const productId = document.getElementById('product-id').value;
        const productType = document.getElementById('product-type').value;
        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const image = document.getElementById('product-image').value;
        const image2 = document.getElementById('product-image2').value;
        
        const productData = {
            id: productId ? parseInt(productId) : Date.now(),
            name,
            description,
            price,
            image,
            image2: productType === 'phone' ? image2 : undefined
        };
        
        if (productType === 'part') {
            if (productId) {
                // Editar producto existente
                const index = parts.findIndex(p => p.id == productId);
                if (index !== -1) parts[index] = productData;
            } else {
                // Agregar nuevo producto
                parts.push(productData);
            }
            localStorage.setItem('movillap-parts', JSON.stringify(parts));
            renderProducts(parts, partsContainer, 'part');
        } else {
            if (productId) {
                // Editar teléfono existente
                const index = phones.findIndex(p => p.id == productId);
                if (index !== -1) phones[index] = productData;
            } else {
                // Agregar nuevo teléfono
                phones.push(productData);
            }
            localStorage.setItem('movillap-phones', JSON.stringify(phones));
            renderProducts(phones, phonesContainer, 'phone');
        }
        
        productModal.style.display = 'none';
        productForm.reset();
    }

    // Eliminar producto (admin)
    function deleteProduct() {
        const productId = document.getElementById('product-id').value;
        const productType = document.getElementById('product-type').value;
        
        if (!productId) return;
        
        if (productType === 'part') {
            parts = parts.filter(p => p.id != productId);
            localStorage.setItem('movillap-parts', JSON.stringify(parts));
            renderProducts(parts, partsContainer, 'part');
        } else {
            phones = phones.filter(p => p.id != productId);
            localStorage.setItem('movillap-phones', JSON.stringify(phones));
            renderProducts(phones, phonesContainer, 'phone');
        }
        
        productModal.style.display = 'none';
        productForm.reset();
    }

    // Inicializar la aplicación
    init();
});