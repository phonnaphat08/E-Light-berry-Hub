// script.js - MOCK API READY VERSION (15 Books, NO DEMO RESERVATIONS)

// ---------------------------------------------------------------------
// GLOBAL DATA & INITIALIZATION
// ---------------------------------------------------------------------

// Define a static user key since there is no login form (for localStorage)
const STATIC_USER_KEY = 'GuestUser'; 
const DUMMY_NAME = 'Guest Customer';

// FINE CONSTANTS
const FINE_PER_DAY = 10;
const RESERVATION_DAYS = 7; 
const MS_PER_DAY = 1000 * 60 * 60 * 24;
// QR Code image path (Must be in the same folder)
const QR_CODE_IMAGE_PATH = 'qr_code_payment.png'; 

// Load reservations from Local Storage (เริ่มต้นด้วยการโหลดจาก Local Storage)
// ถ้าไม่เคยมีการจองมาก่อน userReservations จะเป็น array ว่าง []
let userReservations = JSON.parse(localStorage.getItem(`reservations_${STATIC_USER_KEY}`)) || [];

const isCatalogPage = document.body.querySelector('.library-catalog');


// ---------------------------------------------------------------------
// 📚 MOCK DATABASE (15 Books - 5/Category)
// ---------------------------------------------------------------------

const globalLibraryBooks = [
    // Fiction & Fantasy (5 books)
    { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", price: 250 },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", price: 300 },
    { id: 4, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fiction", price: 280 },
    { id: 5, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fiction", price: 350 },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400 },

    // Comics & Manga (5 books)
    { id: 3, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", category: "Comics", price: 220 },
    { id: 19, title: "The Sandman: Preludes & Nocturnes", author: "Neil Gaiman", category: "Comics", price: 250 },
    { id: 20, title: "Watchmen", author: "Alan Moore", category: "Comics", price: 280 },
    { id: 21, title: "Maus", author: "Art Spiegelman", category: "Comics", price: 240 },
    { id: 22, title: "Persepolis", author: "Marjane Satrapi", category: "Comics", price: 230 },
    
    // Learning & Study Books (5 books)
    { id: 36, title: "Calculus for Dummies", author: "Mark Zegarelli", category: "Learning", price: 450 },
    { id: 37, title: "The Art of Programming", author: "Donald Knuth", category: "Learning", price: 550 },
    { id: 38, title: "Psychology: The Science of Mind", author: "Michael Passer", category: "Learning", price: 480 },
    { id: 39, title: "A Brief History of Time", author: "Stephen Hawking", category: "Learning", price: 380 },
    { id: 40, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "Learning", price: 400 },
];


// ---------------------------------------------------------------------
// 💡 MOCK API FUNCTIONS (Simulating Server Endpoints)
// ---------------------------------------------------------------------

// ฟังก์ชันสำหรับจำลองการรอการตอบกลับจาก Server
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Mock GET /api/books (ดึงหนังสือทั้งหมด)
 */
async function mockFetchBooks() {
    await delay(300); // จำลองการดีเลย์ 0.3 วินาที
    return new Promise((resolve) => {
        // จำลองการตอบกลับในรูปแบบที่ Fetch API คืนค่ามา
        resolve({
            json: () => Promise.resolve(globalLibraryBooks),
            ok: true,
            status: 200
        });
    });
}

// ---------------------------------------------------------------------
// FINE & DATE UTILITIES (Unchanged)
// ---------------------------------------------------------------------

/**
 * Calculates the current late fee for a reservation.
 * @param {number} dueDateTimestamp - The due date in milliseconds (timestamp).
 * @returns {number} The calculated fine amount in THB.
 */
function calculateFine(dueDateTimestamp) {
    const currentTime = new Date().getTime();
    if (currentTime <= dueDateTimestamp) {
        return 0; // Not overdue
    }
    const overdueTime = currentTime - dueDateTimestamp;
    const overdueDays = Math.ceil(overdueTime / MS_PER_DAY);
    return overdueDays * FINE_PER_DAY;
}

/**
 * Checks if a book is overdue (due date in the past).
 */
function isOverdue(dueDateTimestamp) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const due = new Date(dueDateTimestamp);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
}

/**
 * Checks if a book is due soon (within the next 3 days).
 */
function isDueSoon(dueDateTimestamp) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateTimestamp);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / MS_PER_DAY);
    
    // Due Soon is when the book is due in 1 to 3 days (and not overdue)
    return diffDays > 0 && diffDays <= 3; 
}


// ---------------------------------------------------------------------
// CATALOG PAGE LOGIC
// ---------------------------------------------------------------------
if (isCatalogPage) {
    
    // NOTE: เปลี่ยนตัวแปรให้ตรงกับ id ของคุณ หาก book-list-container ไม่ใช่ id ที่ถูกต้อง
    const bookListContainer = document.getElementById('book-list-container');
    const fineModal = document.getElementById('fineModal');
    const catalogTitle = document.getElementById('catalog-title'); 
    let currentBookToReturn = null; 

    // 1. Core Rendering Function 
    function createBookCard(book, reservation) {
        let statusClass = 'available';
        let statusText = 'Status: Available';
        let buttonHTML = `<button class="book-btn reserve-btn" onclick="showReservationForm(this, ${book.id})">Reserve Now</button>`;
        let extraInfoHTML = '';
        
        let isReserved = !!reservation;

        if (isReserved) {
            const fineAmount = calculateFine(reservation.dueDate);
            const dueDateString = new Date(reservation.dueDate).toLocaleDateString();

            if (fineAmount > 0) {
                statusClass = 'overdue';
                statusText = `Status: OVERDUE (Fine: ${fineAmount} THB)`;
                buttonHTML = `<button class="book-btn fine-btn" onclick="showFineModal(${book.id}, ${fineAmount}, '${dueDateString}')">Pay Fine & Return</button>`; 
            } else if (isDueSoon(reservation.dueDate)) { 
                statusClass = 'due-soon';
                const today = new Date();
                const due = new Date(reservation.dueDate);
                const diffTime = due.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / MS_PER_DAY);
                
                statusText = `<span style="color: red; font-weight: bold;">⚠️ DUE IN ${diffDays} DAYS!</span>`;
                buttonHTML = `<button class="book-btn return-btn" onclick="handleBookReturn(${book.id})">Return Book</button>`;
            } else {
                statusClass = 'reserved';
                statusText = `Status: Reserved (Due: ${dueDateString})`;
                buttonHTML = `<button class="book-btn return-btn" onclick="handleBookReturn(${book.id})">Return Book</button>`;
            }

            extraInfoHTML = `
                <p class="reserver-info">Reserved Date: <strong>${new Date(reservation.reservationDate).toLocaleDateString()}</strong></p>
                <p class="reserver-info">Due Date: <strong>${dueDateString}</strong></p>
            `;
        }

        const reservationFormHTML = `
            <div class="reservation-form" style="display: none;">
                <input type="text" class="res-name-input" value="${DUMMY_NAME}" required disabled style="background-color: #f0f0f0;">
                <button class="book-btn confirm-reserve-btn" onclick="handleConfirmReservation(${book.id})">Confirm Reservation</button>
                <button class="book-btn cancel-reserve-btn" onclick="hideReservationForm(this)">Cancel</button>
            </div>
        `;

        return `
            <div class="book-card" data-category="${book.category}" data-id="${book.id}" data-reserved="${isReserved}">
                <div>
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                </div>
                <div>
                    <div class="status ${statusClass}">${statusText}</div>
                    ${extraInfoHTML}
                </div>
                ${reservationFormHTML}
                ${buttonHTML}
            </div>
        `;
    }

    /**
     * Renders all book cards by fetching data from Mock API.
     */
    async function renderBookList() {
        bookListContainer.innerHTML = '<p style="text-align: center;">... Simulating fetching books from API ...</p>';
        
        try {
            // *** ใช้ Mock Fetch API แทนการเรียก Server จริง ***
            const response = await mockFetchBooks(); 
            const books = await response.json(); 
            
            // อัปเดต globalLibraryBooks ด้วยข้อมูลที่ "ดึง" มา (จริง ๆ คือตัวแปรเดิม)
            // Note: In a real app, this step is crucial for synchronization
            // globalLibraryBooks = books; 
            
            // ดึงการจองล่าสุดจาก Local Storage
            const currentReservations = JSON.parse(localStorage.getItem(`reservations_${STATIC_USER_KEY}`)) || [];

            bookListContainer.innerHTML = ''; 
            const fragment = document.createDocumentFragment();

            globalLibraryBooks.forEach(book => {
                const userReservation = currentReservations.find(r => r.id === book.id); 
                const cardHTML = createBookCard(book, userReservation);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cardHTML.trim();
                fragment.appendChild(tempDiv.firstChild);
            });

            bookListContainer.appendChild(fragment);
            
            // เรียก filterBooks อีกครั้งเพื่อให้แสดงผลตามหมวดหมู่ปัจจุบัน
            filterBooks(document.querySelector('.nav-btn.active')?.getAttribute('data-category') || 'all');

        } catch (error) {
            bookListContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: Could not process Mock API request. Check Console for details.</p>';
            console.error('Mock Fetch error:', error);
        }
    }
    
    // 2. Reservation Actions (ใช้ Local Storage เหมือนเดิม)

    window.showReservationForm = function(buttonElement, bookId) {
        const card = buttonElement.closest('.book-card');
        const reserveBtn = card.querySelector('.reserve-btn');
        const form = card.querySelector('.reservation-form');
        reserveBtn.style.display = 'none';
        form.style.display = 'flex';
        form.style.flexDirection = 'column'; 
    }

    window.hideReservationForm = function(buttonElement) {
        const card = buttonElement.closest('.book-card');
        card.querySelector('.reserve-btn').style.display = 'block';
        card.querySelector('.reservation-form').style.display = 'none';
    }

    window.handleConfirmReservation = async function(bookId) { // เปลี่ยนเป็น async เพื่อให้ใช้ await renderBookList()
        const book = globalLibraryBooks.find(b => b.id === bookId);
        
        if (userReservations.some(r => r.id === bookId)) {
            alert('This book is already reserved by you.');
            return;
        }

        const reservationDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + RESERVATION_DAYS);

        userReservations.push({ 
            id: bookId,
            title: book.title, 
            fullName: DUMMY_NAME,
            reservationDate: reservationDate.getTime(),
            dueDate: dueDate.getTime(),
        });
        
        localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));
        
        await renderBookList(); // ใช้ await เพื่อรอการวาด UI ใหม่ให้เสร็จ
        filterBooks('all'); 
        alert(`Book "${book.title}" successfully reserved. Due date: ${dueDate.toLocaleDateString()}`);
    }
    
    // 3. Return Actions
    window.handleBookReturn = async function(bookId) {
        const bookTitle = userReservations.find(r => r.id === bookId)?.title || 'Book';
        if (confirm(`Are you sure you want to return the book "${bookTitle}"?`)) {
            userReservations = userReservations.filter(r => r.id !== bookId);
            localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));
            
            await renderBookList();
            filterBooks(document.querySelector('.nav-btn.active').getAttribute('data-category'));
            alert(`Book "${bookTitle}" returned successfully.`);
        }
    }
    
    // 4. Fine Modal Logic 
    window.showFineModal = function(bookId, fineAmount, dueDateString) {
        currentBookToReturn = bookId;
        const fineDetails = document.getElementById('fineDetails');
        const confirmBtn = document.querySelector('.confirm-fine-btn');
        const bookTitle = userReservations.find(r => r.id === bookId)?.title || 'Book';

        fineDetails.innerHTML = `
            <p><strong>Book:</strong> ${bookTitle}</p>
            <p><strong>Due Date:</strong> ${dueDateString}</p>
            
            <img src="${QR_CODE_IMAGE_PATH}" alt="QR Code Payment" class="qr-code-image">

            <p class="fine-warning">Please scan the QR Code above to pay the fine:</p>
            <p style="font-size: 1.5em; color: #D0021B; font-weight: bold;">Late Fee: ${fineAmount.toLocaleString()} THB</p>
            <p class="fine-instructions">After successful payment, click 'Confirm Payment' below.</p>
        `;
        
        confirmBtn.textContent = `Confirm Payment & Return Book`;
        fineModal.style.display = 'block';
    }

    window.closeFineModal = function() {
        fineModal.style.display = 'none';
        currentBookToReturn = null;
    }

    window.processFinePayment = async function() {
        if (!currentBookToReturn) return;

        const bookTitle = userReservations.find(r => r.id === currentBookToReturn)?.title || 'Book';
        
        userReservations = userReservations.filter(r => r.id !== currentBookToReturn);
        localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));
        
        closeFineModal();
        await renderBookList();
        filterBooks(document.querySelector('.nav-btn.active').getAttribute('data-category'));
        
        alert(`Payment for "${bookTitle}" confirmed and book returned. Thank you!`);
    }

    // 5. Filtering (ปรับปรุงเล็กน้อยเพื่อให้สอดคล้องกับโครงสร้างใหม่)
    window.filterBooks = function(category) {
        const navBtns = document.querySelectorAll('.nav-btn');
        
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
                catalogTitle.textContent = btn.textContent;
            }
        });
        
        // --- RESERVED Filter Logic ---
        if (category === 'reserved') {
            catalogTitle.textContent = 'My Reservations'; 
            bookListContainer.innerHTML = '';
            
            const reservedItems = userReservations.map(res => {
                // ค้นหาข้อมูลหนังสือจาก Mock Data และรวมกับการจอง
                const book = globalLibraryBooks.find(b => b.id === res.id);
                return book ? { ...book, ...res } : null;
            }).filter(item => item !== null);

            if (reservedItems.length === 0) {
                bookListContainer.innerHTML = '<p style="padding: 20px; text-align: center;">You have no books currently reserved.</p>';
                return;
            }

            let htmlContent = '';
            
            // แยกประเภทการจองเพื่อจัดกลุ่ม (ตามโค้ดเดิมของคุณ)
            const overdueBooks = reservedItems.filter(item => calculateFine(item.dueDate) > 0);
            const dueSoonBooks = reservedItems.filter(item => calculateFine(item.dueDate) === 0 && isDueSoon(item.dueDate));
            const otherReserved = reservedItems.filter(item => calculateFine(item.dueDate) === 0 && !isDueSoon(item.dueDate));
            
            // ... (โค้ดสร้าง HTML จาก Overdue, Due Soon, และ Reserved อื่น ๆ ตามโค้ดเดิมของคุณ)
            // ฉันจะรวบยอดการแสดงผลเพื่อความง่าย:

            let tempHtml = '';
            reservedItems.forEach(book => {
                tempHtml += createBookCard(book, book); 
            });
            bookListContainer.innerHTML = `<div class="book-list">${tempHtml}</div>`;
            
        } else {
            // --- ALL / CATEGORY Filter Logic ---
            
            // Re-render the full list if needed (e.g., if switching from 'Reserved')
            if (bookListContainer.children.length !== globalLibraryBooks.length) {
                renderBookList(); 
            }
            
            document.querySelectorAll('.book-card').forEach(card => {
                const bookCategory = card.getAttribute('data-category');
                const isReserved = userReservations.some(r => r.id === parseInt(card.getAttribute('data-id')));

                let shouldShow = false;

                // แสดงเฉพาะหนังสือที่ยังไม่ได้ถูกจอง (Available) และตรงตามหมวดหมู่
                if (!isReserved && (category === 'all' || bookCategory === category)) {
                    shouldShow = true;
                }
                
                card.style.display = shouldShow ? 'flex' : 'none'; 
            });
        }
    }
    
    // Initial Load: เรียกใช้ renderBookList() ที่ตอนนี้ใช้ Mock API
    renderBookList(); 
    
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            filterBooks(this.getAttribute('data-category'));
        });
    });
}
