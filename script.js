// script.js - FINAL ENGLISH VERSION (60 Books, RESERVATION/FINE Logic, 3 DEMO STATUSES, QR CODE PAYMENT)

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
// *** NEW: QR Code image path (Must be in the same folder) ***
const QR_CODE_IMAGE_PATH = 'qr_code_payment.png'; 

// *** START: DEMO DATA GENERATION ***
// This array will overwrite the actual user reservations on page load to show the 3 statuses.
let userReservations = [
    // 1. 🚨 Example: OVERDUE - Due 3 days ago (For QR Code Test)
    { 
        id: 1, 
        title: "The Little Prince", 
        fullName: DUMMY_NAME,
        reservationDate: Date.now() - (10 * MS_PER_DAY), 
        dueDate: Date.now() - (3 * MS_PER_DAY), 
    },
    // 2. ⚠️ Example: DUE SOON - Due in 2 days
    { 
        id: 5, 
        title: "Harry Potter and the Sorcerer's Stone", 
        fullName: DUMMY_NAME,
        reservationDate: Date.now() - (5 * MS_PER_DAY), 
        dueDate: Date.now() + (2 * MS_PER_DAY), 
    },
    // 3. 📚 Example: RESERVED (Standard) - Due in 5 days
    { 
        id: 10, 
        title: "Brave New World", 
        fullName: DUMMY_NAME,
        reservationDate: Date.now() - (2 * MS_PER_DAY), 
        dueDate: Date.now() + (5 * MS_PER_DAY), 
    }
];

// Force save the demo data to Local Storage
localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));

// *** END: DEMO DATA GENERATION ***

const isCatalogPage = document.body.querySelector('.library-catalog');


// ---------------------------------------------------------------------
// MOCK BOOK DATA (60 Books - Same as before)
// ---------------------------------------------------------------------

const globalLibraryBooks = [
    // Fiction & Fantasy 
    { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Fiction", price: 250 },
    { id: 2, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", price: 300 },
    { id: 4, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fiction", price: 280 },
    { id: 5, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fiction", price: 350 },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", price: 400 },
    { id: 7, title: "The Lord of the Rings: The Fellowship of the Ring", author: "J.R.R. Tolkien", category: "Fiction", price: 400 },
    { id: 8, title: "1984", author: "George Orwell", category: "Fiction", price: 320 },
    { id: 9, title: "Animal Farm", author: "George Orwell", category: "Fiction", price: 270 },
    { id: 10, title: "Brave New World", author: "Aldous Huxley", category: "Fiction", price: 310 },
    { id: 11, title: "Dune", author: "Frank Herbert", category: "Fiction", price: 380 },
    { id: 12, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", price: 290 },
    { id: 13, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", price: 330 },
    { id: 14, title: "Moby Dick", author: "Herman Melville", category: "Fiction", price: 360 },
    { id: 15, title: "War and Peace", author: "Leo Tolstoy", category: "Fiction", price: 450 },
    { id: 16, title: "The Odyssey", author: "Homer", category: "Fiction", price: 300 },
    { id: 17, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", category: "Fiction", price: 370 },
    { id: 18, title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", price: 310 },

    // Comics & Manga
    { id: 3, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", category: "Comics", price: 220 },
    { id: 19, title: "The Sandman: Preludes & Nocturnes", author: "Neil Gaiman", category: "Comics", price: 250 },
    { id: 20, title: "Watchmen", author: "Alan Moore", category: "Comics", price: 280 },
    { id: 21, title: "Maus", author: "Art Spiegelman", category: "Comics", price: 240 },
    { id: 22, title: "Persepolis", author: "Marjane Satrapi", category: "Comics", price: 230 },
    { id: 23, title: "V for Vendetta", author: "Alan Moore", category: "Comics", price: 260 },
    { id: 24, title: "Astro Boy Vol. 1", author: "Osamu Tezuka", category: "Comics", price: 210 },
    { id: 25, title: "Dragon Ball Vol. 1", author: "Akira Toriyama", category: "Comics", price: 200 },
    { id: 26, title: "One Piece Vol. 1", author: "Eiichiro Oda", category: "Comics", price: 200 },
    { id: 27, title: "Naruto Vol. 1", author: "Masashi Kishimoto", category: "Comics", price: 190 },
    { id: 28, title: "Attack on Titan Vol. 1", author: "Hajime Isayama", category: "Comics", price: 230 },
    { id: 29, title: "Death Note Vol. 1", author: "Tsugumi Ohba", category: "Comics", price: 220 },
    { id: 30, title: "Fullmetal Alchemist Vol. 1", author: "Hiromu Arakawa", category: "Comics", price: 210 },
    { id: 31, title: "My Hero Academia Vol. 1", author: "Kohei Horikoshi", category: "Comics", price: 200 },
    { id: 32, title: "Tokyo Ghoul Vol. 1", author: "Sui Ishida", category: "Comics", price: 210 },
    { id: 33, title: "Saga Vol. 1", author: "Brian K. Vaughan", category: "Comics", price: 240 },
    { id: 34, title: "The Walking Dead Vol. 1", author: "Robert Kirkman", category: "Comics", price: 260 },
    { id: 35, title: "Batman: The Killing Joke", author: "Alan Moore", category: "Comics", price: 250 },

    // Learning & Study Books
    { id: 36, title: "Calculus for Dummies", author: "Mark Zegarelli", category: "Learning", price: 450 },
    { id: 37, title: "The Art of Programming", author: "Donald Knuth", category: "Learning", price: 550 },
    { id: 38, title: "Psychology: The Science of Mind", author: "Michael Passer", category: "Learning", price: 480 },
    { id: 39, title: "A Brief History of Time", author: "Stephen Hawking", category: "Learning", price: 380 },
    { id: 40, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "Learning", price: 400 },
    { id: 41, title: "Cosmos", author: "Carl Sagan", category: "Learning", price: 390 },
    { id: 42, title: "The Selfish Gene", author: "Richard Dawkins", category: "Learning", price: 420 },
    { id: 43, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Learning", price: 520 },
    { id: 44, title: "Database System Concepts", author: "Avi Silberschatz", category: "Learning", price: 500 },
    { id: 45, title: "Operating System Concepts", author: "Avi Silberschatz", category: "Learning", price: 510 },
    { id: 46, title: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Learning", price: 490 },
    { id: 47, title: "Thermodynamics: An Engineering Approach", author: "Yunus Cengel", category: "Learning", price: 530 },
    { id: 48, title: "Organic Chemistry", author: "Paul A. Wade", category: "Learning", price: 480 },
    { id: 49, title: "Linear Algebra Done Right", author: "Sheldon Axler", category: "Learning", price: 450 },
    { id: 50, title: "Principles of Economics", author: "N. Gregory Mankiw", category: "Learning", price: 470 },
    { id: 51, title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", category: "Learning", price: 350 },
    { id: 52, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Learning", price: 360 },
    { id: 53, title: "The Elements of Style", author: "William Strunk Jr.", category: "Learning", price: 370 },
    { id: 54, title: "The Practice of Programming", author: "Brian Kernighan", category: "Learning", price: 500 },
    { id: 55, title: "HTML & CSS: Design and Build Websites", author: "Jon Duckett", category: "Learning", price: 410 },
    { id: 56, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "Learning", price: 430 },
    { id: 57, title: "The Intelligent Investor", author: "Benjamin Graham", category: "Learning", price: 460 },
    { id: 58, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", category: "Learning", price: 400 },
    { id: 59, title: "Clean Code", author: "Robert C. Martin", category: "Learning", price: 540 },
    { id: 60, title: "Introduction to Financial Accounting", author: "Charles T. Horngren", category: "Learning", price: 490 }
];


// ---------------------------------------------------------------------
// FINE & DATE UTILITIES
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
    
    const bookListContainer = document.getElementById('book-list-container');
    const fineModal = document.getElementById('fineModal');
    const catalogTitle = document.getElementById('catalog-title'); 
    let currentBookToReturn = null; // To hold the book ID being processed for return/fine

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
                // Button now calls the modal to show QR code for payment
                buttonHTML = `<button class="book-btn fine-btn" onclick="showFineModal(${book.id}, ${fineAmount}, '${dueDateString}')">Pay Fine & Return</button>`; 
            } else if (isDueSoon(reservation.dueDate)) { 
                // MODIFIED: Highlight Due Soon Status Text in Red
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
     * Renders all book cards based on the current userReservations state, used for 'All Books' filtering.
     */
    function renderBookList() {
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
    }
    
    // 2. Reservation Actions (omitted for brevity, unchanged)

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

    window.handleConfirmReservation = function(bookId) {
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
        renderBookList();
        filterBooks(document.querySelector('.nav-btn.active').getAttribute('data-category'));
        alert(`Book "${book.title}" successfully reserved. Due date: ${dueDate.toLocaleDateString()}`);
    }
    
    // 3. Return Actions (Non-Overdue) (omitted for brevity, unchanged)
    window.handleBookReturn = function(bookId) {
        const bookTitle = userReservations.find(r => r.id === bookId)?.title || 'Book';
        if (confirm(`Are you sure you want to return the book "${bookTitle}"?`)) {
            userReservations = userReservations.filter(r => r.id !== bookId);
            localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));
            renderBookList();
            filterBooks(document.querySelector('.nav-btn.active').getAttribute('data-category'));
            alert(`Book "${bookTitle}" returned successfully.`);
        }
    }
    
    // 4. Fine Modal Logic (Overdue Return with QR Code)
    window.showFineModal = function(bookId, fineAmount, dueDateString) {
        currentBookToReturn = bookId;
        const fineDetails = document.getElementById('fineDetails');
        const confirmBtn = document.querySelector('.confirm-fine-btn');
        const bookTitle = userReservations.find(r => r.id === bookId)?.title || 'Book';

        // *** MODIFICATION: Display QR Code and Fine Amount ***
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

    window.processFinePayment = function() {
        if (!currentBookToReturn) return;

        const bookTitle = userReservations.find(r => r.id === currentBookToReturn)?.title || 'Book';
        
        // Assume payment is successful upon click and remove reservation
        userReservations = userReservations.filter(r => r.id !== currentBookToReturn);
        localStorage.setItem(`reservations_${STATIC_USER_KEY}`, JSON.stringify(userReservations));
        
        closeFineModal();
        renderBookList();
        filterBooks(document.querySelector('.nav-btn.active').getAttribute('data-category'));
        
        alert(`Payment for "${bookTitle}" confirmed and book returned. Thank you!`);
    }

    // 5. Filtering (Unchanged from previous simplified version)
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
            
            const reservedItems = userReservations.map(res => ({
                ...globalLibraryBooks.find(b => b.id === res.id),
                ...res
            }));
            
            const overdueBooks = reservedItems.filter(item => isOverdue(item.dueDate));
            const dueSoonBooks = reservedItems.filter(item => isDueSoon(item.dueDate) && !isOverdue(item.dueDate));
            const otherReserved = reservedItems.filter(item => !isOverdue(item.dueDate) && !isDueSoon(item.dueDate));

            let htmlContent = '';

            if (overdueBooks.length > 0) {
                htmlContent += '<div class="book-list">';
                overdueBooks.forEach(book => {
                    htmlContent += createBookCard(book, book); 
                });
                htmlContent += '</div>';
            }

            if (dueSoonBooks.length > 0) {
                htmlContent += '<div class="book-list">';
                dueSoonBooks.forEach(book => {
                    htmlContent += createBookCard(book, book); 
                });
                htmlContent += '</div>';
            }
            
            if (otherReserved.length > 0) {
                htmlContent += '<div class="book-list">';
                otherReserved.forEach(book => {
                    htmlContent += createBookCard(book, book);
                });
                htmlContent += '</div>';
            }

            if (htmlContent === '') {
                 htmlContent = '<p style="padding: 20px; text-align: center;">You have no books currently reserved.</p>';
            }

            bookListContainer.innerHTML = htmlContent;
            
        } else {
            if (bookListContainer.children.length !== globalLibraryBooks.length) {
                 renderBookList(); 
            }
            
            document.querySelectorAll('.book-card').forEach(card => {
                const bookCategory = card.getAttribute('data-category');
                const isReserved = card.getAttribute('data-reserved') === 'true';

                let shouldShow = false;

                if ((category === 'all' || bookCategory === category) && !isReserved) {
                    shouldShow = true;
                } 
                
                if (category !== 'reserved' && isReserved) {
                    shouldShow = false;
                }

                card.style.display = shouldShow ? 'flex' : 'none'; 
            });
        }
    }
    
    // Initial Load
    renderBookList(); 
    filterBooks('all');
}
