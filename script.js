/* E Lightberry Hub - CUTE RECEIPT VERSION */
const STATIC_USER_KEY = 'GuestUser'; 
const DUMMY_NAME = localStorage.getItem('userNickname') || 'Guest';
const QR_CODE_PATH = 'qr_code_payment.png'; 
const DISCOUNT_RATE = 0.10; // ส่วนลด 10%

// ฟังก์ชันเรียกรูป (วางรูปไว้ที่เดียวกับ HTML)
function getImageUrl(id) { return `${id}.png`; }

let purchasedBooks = JSON.parse(localStorage.getItem(`purchased_${STATIC_USER_KEY}`)) || [];
let currentBookToBuy = null;

const globalLibraryBooks = [
    { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", price: 250, stock: 3, isPopular: true, description: "A young prince visits various planets.", imageUrl: getImageUrl(1) },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", price: 300, stock: 2, isPopular: false, description: "A classic novel exploring love.", imageUrl: getImageUrl(2) },
    { id: 3, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fiction", price: 280, stock: 5, isPopular: true, description: "Alice's fantastical adventure.", imageUrl: getImageUrl(3) },
    { id: 4, title: "Harry Potter 1", author: "J.K. Rowling", category: "Fiction", price: 350, stock: 4, isPopular: true, description: "A young boy discovers he is a wizard.", imageUrl: getImageUrl(4) },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400, stock: 1, isPopular: false, description: "Bilbo Baggins' epic journey.", imageUrl: getImageUrl(5) },
    { id: 6, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", category: "Comics", price: 220, stock: 6, isPopular: false, description: "The beginning of Usagi Tsukino's journey.", imageUrl: getImageUrl(6) },
    { id: 7, title: "The Sandman", author: "Neil Gaiman", category: "Comics", price: 250, stock: 2, isPopular: true, description: "Deep dive into dreams.", imageUrl: getImageUrl(7) },
    { id: 8, title: "Watchmen", author: "Alan Moore", category: "Comics", price: 280, stock: 3, isPopular: false, description: "Retired superheroes.", imageUrl: getImageUrl(8) },
    { id: 9, title: "Persepolis", author: "Marjane Satrapi", category: "Comics", price: 230, stock: 4, isPopular: false, description: "Growing up during the revolution.", imageUrl: getImageUrl(9) },
    { id: 10, title: "Calculus for Dummies", author: "Mark Zegarelli", category: "Learning", price: 450, stock: 7, isPopular: false, description: "Easy guide to calculus.", imageUrl: getImageUrl(10) },
    { id: 11, title: "Art of Programming", author: "Donald Knuth", category: "Learning", price: 550, stock: 2, isPopular: true, description: "Principles of programming.", imageUrl: getImageUrl(11) },
    { id: 12, title: "Psychology", author: "Michael Passer", category: "Learning", price: 480, stock: 3, isPopular: false, description: "Science of human behavior.", imageUrl: getImageUrl(12) },
    { id: 13, title: "History of Time", author: "Stephen Hawking", category: "Learning", price: 380, stock: 5, isPopular: true, description: "Origins of our universe.", imageUrl: getImageUrl(13) }
];

// ฟังก์ชันสร้างการ์ดหนังสือ
window.createBookCard = function(book, isOwned) {
    const popularTag = book.isPopular ? `<span class="popular-badge">🔥 Popular</span>` : '';
    return `
        <div class="book-card" data-category="${book.category}" data-id="${book.id}">
            ${popularTag}
            <div class="book-image-wrapper">
                <img src="${book.imageUrl}" class="book-cover-image" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <h3>${book.title}</h3>
            <p class="description-text">${book.description}</p>
            <div class="book-data-column">
                <div class="book-price">฿${book.price}</div>
                <div class="book-stock">Stock: ${book.stock}</div>
            </div>
            <div class="card-action-container">
                ${isOwned ? 
                    `<button class="book-btn cancel-purchase-btn" onclick="handleCancelPurchase(${book.id})">Cancel Order</button>` : 
                    `<button class="book-btn buy-now-btn" onclick="showPaymentModal(${book.id})">Buy Now</button>`}
            </div>
        </div>`;
}

// แสดงหน้าต่างจ่ายเงิน
window.showPaymentModal = function(id) {
    const book = globalLibraryBooks.find(b => b.id === id);
    currentBookToBuy = id;
    const discount = book.price * DISCOUNT_RATE;
    const finalPrice = book.price - discount;

    document.getElementById('modalTitle').innerText = "💳 Checkout";
    const confirmBtn = document.getElementById('confirmPayBtn');
    if(confirmBtn) confirmBtn.style.display = "block"; // โชว์ปุ่มจ่ายเงิน

    document.getElementById('paymentDetails').innerHTML = `
        <div style="text-align:left; background:#f9f9f9; padding:15px; border-radius:10px;">
            <p><strong>Item:</strong> ${book.title}</p>
            <p>Price: ฿${book.price}</p>
            <p style="color:#e74c3c;">Discount 10%: -฿${discount.toFixed(0)}</p>
            <hr style="border-top:1px solid #ddd;">
            <p style="font-size:1.5em; color:#28a745; font-weight:bold;">Pay: ฿${finalPrice.toFixed(0)}</p>
        </div>
        <img src="${QR_CODE_PATH}" style="width:180px; margin:15px auto; display:block; border:4px solid #eee; border-radius:10px;">
    `;
    document.getElementById('paymentModal').style.display = 'flex';
}

// กดปุ่มยืนยันจ่ายเงิน -> โชว์ใบเสร็จน่ารัก
window.processPurchase = function() {
    const book = globalLibraryBooks.find(b => b.id === currentBookToBuy);
    const discount = book.price * DISCOUNT_RATE;
    const finalPrice = book.price - discount;

    purchasedBooks.push(currentBookToBuy);
    localStorage.setItem(`purchased_${STATIC_USER_KEY}`, JSON.stringify(purchasedBooks));
    
    // ซ่อนปุ่มจ่ายเงิน
    document.getElementById('confirmPayBtn').style.display = "none";
    document.getElementById('modalTitle').innerText = ""; 

    // HTML ใบเสร็จน่ารัก
    document.getElementById('paymentDetails').innerHTML = `
        <div class="receipt-box">
            <p>Customer: <strong>${DUMMY_NAME}</strong></p>
            <p style="font-size:0.8em; color:#888;">${new Date().toLocaleString()}</p>
            <hr>
            <p style="text-align:left;">📖 ${book.title}</p>
            <div style="display:flex; justify-content:space-between; margin-top:5px;">
                <span>Price</span> <span>฿${book.price}</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#ff6b6b;">
                <span>Discount 10%</span> <span>-฿${discount.toFixed(0)}</span>
            </div>
            <hr>
            <div style="display:flex; justify-content:space-between; font-size:1.4em; font-weight:bold; color:#444;">
                <span>Total</span> <span>฿${finalPrice.toFixed(0)}</span>
            </div>
            <p style="margin-top:20px; font-size:2em;">PAID ✅</p>
            <button onclick="closePaymentModal()" style="background:#ffb7b2; border:none; border-radius:20px; color:white; font-weight:bold; padding:10px 20px; margin-top:10px; cursor:pointer;">Close Slip</button>
        </div>
    `;
    renderBookList();
}

window.closePaymentModal = function() { document.getElementById('paymentModal').style.display = 'none'; }

window.handleCancelPurchase = function(id) {
    if (confirm('Cancel this order?')) {
        purchasedBooks = purchasedBooks.filter(bid => bid !== id);
        localStorage.setItem(`purchased_${STATIC_USER_KEY}`, JSON.stringify(purchasedBooks));
        renderBookList();
    }
}

window.filterBooks = function(category) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    document.querySelectorAll('.book-card').forEach(card => {
        const book = globalLibraryBooks.find(b => b.id === parseInt(card.dataset.id));
        const isOwned = purchasedBooks.includes(book.id);
        if (category === 'popular') card.style.display = book.isPopular ? 'flex' : 'none';
        else if (category === 'reserved') card.style.display = isOwned ? 'flex' : 'none';
        else card.style.display = (category === 'all' || book.category === category) ? 'flex' : 'none';
    });
}

function renderBookList() {
    const container = document.getElementById('book-list-container');
    if (!container) return;
    purchasedBooks = JSON.parse(localStorage.getItem(`purchased_${STATIC_USER_KEY}`)) || [];
    container.innerHTML = globalLibraryBooks.map(book => createBookCard(book, purchasedBooks.includes(book.id))).join('');
}

document.addEventListener('DOMContentLoaded', () => { renderBookList(); });
