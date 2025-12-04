// script.js - ULTIMATE FIX: Stabilized the filterBooks() re-render check

// ---------------------------------------------------------------------
// GLOBAL DATA & INITIALIZATION (Unchanged)
// ---------------------------------------------------------------------

const STATIC_USER_KEY = 'GuestUser'; 
const DUMMY_NAME = 'Guest Customer';

// FINE CONSTANTS
const FINE_PER_DAY = 10;
const RESERVATION_DAYS = 7; 
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const QR_CODE_IMAGE_PATH = 'qr_code_payment.png'; 
const IMAGE_FOLDER_PATH = ''; // Path ถูกต้องแล้วตามโครงสร้างไฟล์ปัจจุบัน

let userReservations = JSON.parse(localStorage.getItem(`reservations_${STATIC_USER_KEY}`)) || [];

const isCatalogPage = document.body.querySelector('.library-catalog');

// ---------------------------------------------------------------------
// 💡 IMAGE PATH UTILITY & MOCK DATABASE (Unchanged)
// ---------------------------------------------------------------------

function getImageUrl(bookId) {
    return `${IMAGE_FOLDER_PATH}${bookId}.png`;
}

const globalLibraryBooks = [
    // Fiction & Fantasy (5 books)
    { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", price: 250, 
      imageUrl: getImageUrl(1) },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", price: 300, 
      imageUrl: getImageUrl(2) },
    { id: 3, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fiction", price: 280, 
      imageUrl: getImageUrl(3) },
    { id: 4, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fiction", price: 350, 
      imageUrl: getImageUrl(4) },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400, 
      imageUrl: getImageUrl(5) },

    // Comics & Manga (5 books)
    { id: 6, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", category: "Comics", price: 220, 
      imageUrl: getImageUrl(6) },
    { id: 7, title: "The Sandman: Preludes & Nocturnes", author: "Neil Gaiman", category: "Comics", price: 250, 
      imageUrl: getImageUrl(7) },
    { id: 8, title: "Watchmen", author: "Alan Moore", category: "Comics", price: 280, 
      imageUrl: getImageUrl(8) },
    { id: 9, title: "Persepolis", author: "Marjane Satrapi", category: "Comics", price: 230, 
      imageUrl: getImageUrl(9) },

    // Learning & Study Books (4 books)
    { id: 10, title: "Calculus for Dummies", author: "Mark Zegarelli", category: "Learning", price: 450, 
      imageUrl: getImageUrl(10) },
    { id: 11, title: "The Art of Programming", author: "Donald Knuth", category: "Learning", price: 550, 
      imageUrl: getImageUrl(11) },
    { id: 12, title: "Psychology: The Science of Mind", author: "Michael Passer", category: "Learning", price: 480, 
      imageUrl: getImageUrl(12) },
    { id: 13, title: "A Brief History of Time", author: "Stephen Hawking", category: "Learning", price: 380, 
      imageUrl: getImageUrl(13) },
];

// ---------------------------------------------------------------------
// MOCK API FUNCTIONS & UTILITIES (Unchanged)
// ---------------------------------------------------------------------

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function mockFetchBooks() {
    await delay(300); 
    return new Promise((resolve) => {
        resolve({
            json: () => Promise.resolve(globalLibraryBooks),
            ok: true,
            status: 200
        });
    });
}

function calculateFine(dueDateTimestamp) {
    const currentTime = new Date().getTime();
    if (currentTime <= dueDateTimestamp) return 0;
    const overdueTime = currentTime - dueDateTimestamp;
    const overdueDays = Math.ceil(overdueTime / MS_PER_DAY);
    return overdueDays * FINE_PER_DAY;
}

function isOverdue(dueDateTimestamp) {
    const currentTime = new Date().getTime();
    return currentTime > dueDateTimestamp;
}

function isDueSoon(dueDateTimestamp) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateTimestamp);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / MS_PER_DAY);
    return diffDays > 0 && diffDays <= 3; 
}


// ---------------------------------------------------------------------
// CATALOG PAGE LOGIC (Rendering and Interaction)
// ---------------------------------------------------------------------
if (isCatalogPage) {
    
    const bookListContainer = document.getElementById('book-list-container');
    const fineModal = document.getElementById('fineModal');
    const catalogTitle = document.getElementById('catalog-title'); 
    let currentBookToReturn = null; 

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
                <div class="book-image-wrapper"> 
                    <img src="${book.imageUrl}" alt="${book.title} Cover" class="book-cover-image">
                </div>
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

    async function renderBookList() {
        bookListContainer.innerHTML = '<p style="text-align: center;">... Simulating fetching books from API ...</p>';
        
        try {
            const response = await mockFetchBooks(); 
            const books = await response.json(); 
            
            userReservations = JSON.parse(localStorage.getItem(`reservations_${STATIC_USER_KEY}`)) || [];

            bookListContainer.innerHTML = ''; 
            const fragment = document.createDocumentFragment();

            globalLibraryBooks.forEach(book => {
                const userReservation = userReservations.find(r => r.id === book.id); 
                const cardHTML = createBookCard(book, userReservation); 
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cardHTML.trim();
                fragment.appendChild(tempDiv.firstChild);
            });

            bookListContainer.appendChild(fragment);
            
            // เรียก filterBooks เพื่อให้แสดงผลลัพธ์ที่กรองแล้วทันทีหลัง render
            filterBooks(document.querySelector('.nav-btn.active')?.getAttribute('data-category') || 'all');

        } catch (error) {
            bookListContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: Could not process Mock API request. Check Console for details.</p>';
            console.error('Mock Fetch error:', error);
        }
    }
    
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

    window.handleConfirmReservation = async function(bookId) {
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
        
        // เรามั่นใจว่า renderBookList() จะเรียก filterBooks() ที่ได้รับการแก้ไขแล้ว
        await renderBookList(); 
        
        alert(`Book "${book.title}" successfully reserved. Due date: ${dueDate.toLocaleDateString()}`);
    }
    
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

    window.filterBooks = function(category) {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
                catalogTitle.textContent = btn.textContent;
            }
        });
        
        if (category === 'reserved') {
            catalogTitle.textContent = 'My Reservations'; 
            bookListContainer.innerHTML = '';
            userReservations = JSON.parse(localStorage.getItem(`reservations_${STATIC_USER_KEY}`)) || [];

            const reservedItems = userReservations.map(res => {
                const book = globalLibraryBooks.find(b => b.id === res.id);
                return book ? createBookCard(book, res) : null; 
            }).filter(item => item !== null).join('');

            if (reservedItems.length === 0) {
                bookListContainer.innerHTML = '<p style="padding: 20px; text-align: center;">You have no books currently reserved.</p>';
                return;
            }
            bookListContainer.innerHTML = `<div class="book-list">${reservedItems}</div>`; 
            
        } else {
            // *** แก้ไขการตรวจสอบเงื่อนไขการ Rerender เพื่อความเสถียร ***
            const currentCards = document.querySelectorAll('.book-card').length;
            const totalBooks = globalLibraryBooks.length;
            
            // ถ้าจำนวนการ์ดไม่เท่ากับจำนวนหนังสือทั้งหมด และไม่ได้อยู่ในหน้า reserved ให้ทำการ render ใหม่
            if (currentCards !== totalBooks) {
                // ถ้าการ์ดถูกลบออกทั้งหมด (จาก renderBookList) หรือจำนวนไม่ครบ ให้เรียก render ใหม่
                renderBookList(); 
                return; 
            }
            // *** สิ้นสุดการแก้ไขการตรวจสอบเงื่อนไข ***
            
            // ดำเนินการ filter ตามปกติ
            document.querySelectorAll('.book-card').forEach(card => {
                const bookCategory = card.getAttribute('data-category');
                const isReserved = userReservations.some(r => r.id === parseInt(card.getAttribute('data-id')));
                let shouldShow = false;

                // กฎการแสดงผล: หนังสือจะแสดงต่อเมื่อ *ไม่ถูกจอง* และตรงกับ Category ที่เลือก
                if (!isReserved && (category === 'all' || bookCategory === category)) {
                    shouldShow = true;
                }
                card.style.display = shouldShow ? 'flex' : 'none'; 
            });
        }
    }
    
    // Initial Load
    document.addEventListener('DOMContentLoaded', () => {
        renderBookList(); 
        
        const allBtn = document.querySelector('.nav-btn[data-category="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
            catalogTitle.textContent = allBtn.textContent;
        }

        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', function() {
                filterBooks(this.getAttribute('data-category'));
            });
        });

        window.onclick = function(event) {
            if (event.target === fineModal) {
                closeFineModal();
            }
        }
    });
}
