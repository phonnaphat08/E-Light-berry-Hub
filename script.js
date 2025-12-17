/* E Lightberry Hub - PURCHASE & CANCEL SYSTEM (13 Books) */
const STATIC_USER_KEY = 'GuestUser'; 
const DUMMY_NAME = localStorage.getItem('userNickname') || 'Guest Customer';
const QR_CODE_PATH = 'qr_code_payment.png'; 

let purchasedBooks = JSON.parse(localStorage.getItem(`purchased_${STATIC_USER_KEY}`)) || [];
let currentBookToBuy = null;

// Database: 13 Books
const globalLibraryBooks = [
    { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", price: 250, stock: 3, description: "A young prince visits various planets and learns about life.", imageUrl: "1.png" },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", price: 300, stock: 2, description: "A classic novel exploring love and social standing in England.", imageUrl: "2.png" },
    { id: 3, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fiction", price: 280, stock: 5, description: "Alice's adventure through a whimsical and nonsensical world.", imageUrl: "3.png" },
    { id: 4, title: "Harry Potter 1", author: "J.K. Rowling", category: "Fiction", price: 350, stock: 4, description: "A young boy discovers he is a wizard and starts at magic school.", imageUrl: "4.png" },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400, stock: 1, description: "Bilbo Baggins' epic journey to reclaim a lost kingdom.", imageUrl: "5.png" },
    { id: 6, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", category: "Comics", price: 220, stock: 6, description: "The beginning of Usagi Tsukino's journey as a Sailor Guardian.", imageUrl: "6.png" },
    { id: 7, title: "The Sandman", author: "Neil Gaiman", category: "Comics", price: 250, stock: 2, description: "A deep dive into the metaphysical world of dreams.", imageUrl: "7.png" },
    { id: 8, title: "Watchmen", author: "Alan Moore", category: "Comics", price: 280, stock: 3, description: "A complex take on the lives and morality of superheroes.", imageUrl: "8.png" },
    { id: 9, title: "Persepolis", author: "Marjane Satrapi", category: "Comics", price: 230, stock: 4, description: "A memoir about growing up during the Iranian Revolution.", imageUrl: "9.png" },
    { id: 10, title: "Calculus for Dummies", author: "Mark Zegarelli", category: "Learning", price: 450, stock: 7, description: "An easy guide to understanding complex calculus concepts.", imageUrl: "10.png" },
    { id: 11, title: "Art of Programming", author: "Donald Knuth", category: "Learning", price: 550, stock: 2, description: "Fundamental principles and insights into programming.", imageUrl: "11.png" },
    { id: 12, title: "Psychology", author: "Michael Passer", category: "Learning", price: 480, stock: 3, description: "Insights into the science of human behavior and the mind.", imageUrl: "12.png" },
    { id: 13, title: "History of Time", author: "Stephen Hawking", category: "Learning", price: 380, stock: 5, description: "Exploring the origins and structure of our universe.", imageUrl: "13.png" }
];

if (document.body.querySelector('.library-catalog')) {
    const bookListContainer = document.getElementById('book-list-container');

    function createBookCard(book, isOwned) {
        return `
            <div class="book-card" data-category="${book.category}" data-id="${book.id}">
                <div class="book-image-wrapper">
                    <img src="${book.id}.png" class="book-cover-image" onerror="this.src='https://via.placeholder.com/150?text=No+Cover'">
                </div>
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p class="description-text">${book.description}</p>
                <div class="book-data-column">
                    <div class="book-price">Price: ฿${book.price}</div>
                    <div class="book-stock">In Stock: ${book.stock} units</div>
                </div>
                <div class="status ${isOwned ? 'reserved' : 'available'}">
                    ${isOwned ? 'Status: Purchased' : 'Status: For Sale'}
                </div>
                <div class="card-action-container">
                    ${isOwned ? 
                        `<button class="book-btn cancel-purchase-btn" onclick="handleCancelPurchase(${book.id})">Cancel Order</button>` : 
                        `<button class="book-btn buy-now-btn" onclick="showPaymentModal(${book.id})">Buy Now</button>`}
                </div>
            </div>`;
    }

    async function renderBookList() {
        purchasedBooks = JSON.parse(localStorage.getItem(`purchased_${STATIC_USER_KEY}`)) || [];
        bookListContainer.innerHTML = globalLibraryBooks.map(book => {
            const isOwned = purchasedBooks.includes(book.id);
            return createBookCard(book, isOwned);
        }).join('');
    }

    window.showPaymentModal = (id) => {
        const book = globalLibraryBooks.find(b => b.id === id);
        currentBookToBuy = id;
        document.getElementById('paymentDetails').innerHTML = `
            <p>Purchase: <strong>${book.title}</strong></p>
            <p style="font-size: 1.4em; color: #28a745; font-weight: bold;">Price: ฿${book.price}</p>
            <img src="${QR_CODE_PATH}" style="width: 200px; margin: 10px auto; display: block;">
        `;
        document.getElementById('paymentModal').style.display = 'block';
    };

    window.closePaymentModal = () => {
        document.getElementById('paymentModal').style.display = 'none';
        currentBookToBuy = null;
    };

    window.processPurchase = () => {
        if (currentBookToBuy) {
            purchasedBooks.push(currentBookToBuy);
            localStorage.setItem(`purchased_${STATIC_USER_KEY}`, JSON.stringify(purchasedBooks));
            alert('Purchase Successful!');
            closePaymentModal();
            renderBookList();
        }
    };

    // --- ฟังก์ชันใหม่: ยกเลิกการซื้อ ---
    window.handleCancelPurchase = (id) => {
        if (confirm('Are you sure you want to cancel this order? The amount will be refunded.')) {
            purchasedBooks = purchasedBooks.filter(bookId => bookId !== id);
            localStorage.setItem(`purchased_${STATIC_USER_KEY}`, JSON.stringify(purchasedBooks));
            alert('Order Cancelled Successfully.');
            renderBookList();
        }
    };

    window.filterBooks = (category) => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
        document.querySelectorAll('.book-card').forEach(card => {
            const isOwned = purchasedBooks.includes(parseInt(card.dataset.id));
            if (category === 'reserved') card.style.display = isOwned ? 'flex' : 'none';
            else card.style.display = (category === 'all' || card.dataset.category === category) ? 'flex' : 'none';
        });
    };

    renderBookList();
}
