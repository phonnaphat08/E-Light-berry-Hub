// script.js (FINAL VERSION: 60 Books + Diverse Mock Reservation Data)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mock Book Data Array (UPDATED: Setting up 3 reservation statuses for demonstration)
    const RESERVATION_DAYS = 7; // Fixed reservation period (7 days)
    const FINE_PER_DAY = 5; // Fine amount per day (5 THB)
    
    // Helper function to calculate timestamp for a past/future date
    const daysToTimestamp = (days) => days * 24 * 60 * 60 * 1000;
    
    // --- Setup Scenario Dates ---
    // 1. Overdue: 3 days overdue (Reserved 10 days ago)
    const reservedDate_Overdue = Date.now() - daysToTimestamp(RESERVATION_DAYS + 3); 
    const dueDate_Overdue = reservedDate_Overdue + daysToTimestamp(RESERVATION_DAYS); 
    
    // 2. Warning: 2 days left (Reserved 5 days ago)
    const reservedDate_Warning = Date.now() - daysToTimestamp(RESERVATION_DAYS - 2); 
    const dueDate_Warning = reservedDate_Warning + daysToTimestamp(RESERVATION_DAYS); 
    
    // 3. New: 6 days left (Reserved 1 day ago)
    const reservedDate_New = Date.now() - daysToTimestamp(1); 
    const dueDate_New = reservedDate_New + daysToTimestamp(RESERVATION_DAYS); 
    
    
    let libraryBooks = [
        // --- 3 RESERVED BOOKS FOR DEMO ---
        // 1. New Reservation (The Little Prince) - Status: Booked, Time Left: 6 days
        { id: 1, title: "The Little Prince", author: "Antoine de Saint-Exupéry", status: "Booked", category: "Fiction", isReserved: true, reservedDate: reservedDate_New, dueDate: dueDate_New },
        
        // 2. Overdue Reservation (Pride and Prejudice) - Status: Overdue, Fine: 15 THB
        { id: 2, title: "Pride and Prejudice", author: "Jane Austen", status: "Booked", category: "Fiction", isReserved: true, reservedDate: reservedDate_Overdue, dueDate: dueDate_Overdue },
        
        // 3. Warning Reservation (Sailor Moon Vol. 1) - Status: Booked, Time Left: 2 days
        { id: 3, title: "Sailor Moon Vol. 1", author: "Naoko Takeuchi", status: "Booked", category: "Comics", isReserved: true, reservedDate: reservedDate_Warning, dueDate: dueDate_Warning },
        
        // --- REMAINING 57 BOOKS (All Available) ---
        // Fiction & Fantasy (17 books total: ID 1, 2, 4-18)
        { id: 4, title: "Alice in Wonderland", author: "Lewis Carroll", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 5, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 7, title: "The Lord of the Rings: The Fellowship of the Ring", author: "J.R.R. Tolkien", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 8, title: "1984", author: "George Orwell", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 9, title: "Animal Farm", author: "George Orwell", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 10, title: "Brave New World", author: "Aldous Huxley", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 11, title: "Dune", author: "Frank Herbert", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 12, title: "The Great Gatsby", author: "F. Scott Fitzgerald", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 13, title: "To Kill a Mockingbird", author: "Harper Lee", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 14, title: "Moby Dick", author: "Herman Melville", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 15, title: "War and Peace", author: "Leo Tolstoy", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 16, title: "The Odyssey", author: "Homer", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 17, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },
        { id: 18, title: "The Catcher in the Rye", author: "J.D. Salinger", status: "Available", category: "Fiction", isReserved: false, reservedDate: null, dueDate: null },

        // Comics & Manga (18 books total: ID 3, 19-35)
        { id: 19, title: "The Sandman: Preludes & Nocturnes", author: "Neil Gaiman", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 20, title: "Watchmen", author: "Alan Moore", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 21, title: "Maus", author: "Art Spiegelman", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 22, title: "Persepolis", author: "Marjane Satrapi", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 23, title: "V for Vendetta", author: "Alan Moore", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 24, title: "Astro Boy Vol. 1", author: "Osamu Tezuka", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 25, title: "Dragon Ball Vol. 1", author: "Akira Toriyama", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 26, title: "One Piece Vol. 1", author: "Eiichiro Oda", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 27, title: "Naruto Vol. 1", author: "Masashi Kishimoto", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 28, title: "Attack on Titan Vol. 1", author: "Hajime Isayama", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 29, title: "Death Note Vol. 1", author: "Tsugumi Ohba", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 30, title: "Fullmetal Alchemist Vol. 1", author: "Hiromu Arakawa", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 31, title: "My Hero Academia Vol. 1", author: "Kohei Horikoshi", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 32, title: "Tokyo Ghoul Vol. 1", author: "Sui Ishida", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 33, title: "Saga Vol. 1", author: "Brian K. Vaughan", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 34, title: "The Walking Dead Vol. 1", author: "Robert Kirkman", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },
        { id: 35, title: "Batman: The Killing Joke", author: "Alan Moore", status: "Available", category: "Comics", isReserved: false, reservedDate: null, dueDate: null },

        // Learning & Study Books (25 books total: ID 36-60)
        { id: 36, title: "Calculus for Dummies", author: "Mark Zegarelli", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 37, title: "The Art of Programming", author: "Donald Knuth", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 38, title: "Psychology: The Science of Mind", author: "Michael Passer", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 39, title: "A Brief History of Time", author: "Stephen Hawking", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 40, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 41, title: "Cosmos", author: "Carl Sagan", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 42, title: "The Selfish Gene", author: "Richard Dawkins", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 43, title: "Introduction to Algorithms", author: "Thomas H. Cormen", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 44, title: "Database System Concepts", author: "Avi Silberschatz", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 45, title: "Operating System Concepts", author: "Avi Silberschatz", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 46, title: "Computer Networking: A Top-Down Approach", author: "James Kurose", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 47, title: "Thermodynamics: An Engineering Approach", author: "Yunus Cengel", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 48, title: "Organic Chemistry", author: "Paula Yurkanis Bruice", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 49, title: "Principles of Physics", author: "David Halliday", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 50, title: "Economics: Principles, Problems, and Policies", author: "Campbell McConnell", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 51, title: "Microeconomics", author: "Paul Krugman", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 52, title: "Macroeconomics", author: "N. Gregory Mankiw", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 53, title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 54, title: "Emotional Intelligence", author: "Daniel Goleman", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 55, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 56, title: "Design of Everyday Things", author: "Donald A. Norman", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 57, title: "Clean Code", author: "Robert C. Martin", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 58, title: "The Mythical Man-Month", author: "Frederick Brooks Jr.", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 59, title: "Data Science for Dummies", author: "Lillian Pierson", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null },
        { id: 60, title: "Deep Learning with Python", author: "François Chollet", status: "Available", category: "Learning", isReserved: false, reservedDate: null, dueDate: null }
    ];
    
    // The rest of the script.js remains the same (Modal, Handlers, Render functions)
    const bookListContainer = document.getElementById('book-list-container');
    const catalogTitle = document.getElementById('catalog-title');
    const navButtons = document.querySelectorAll('.nav-btn');

    // Modal Elements
    const fineModal = document.getElementById('fineModal');
    const closeBtn = document.querySelector('.close-btn');
    const confirmPaidBtn = document.getElementById('confirmPaidBtn');
    let currentOverdueBookId = null; // To store the ID of the book being paid for

    // --- Modal Handlers ---
    closeBtn.onclick = function() {
        fineModal.style.display = 'none';
        currentOverdueBookId = null;
    }

    window.onclick = function(event) {
        if (event.target == fineModal) {
            fineModal.style.display = 'none';
            currentOverdueBookId = null;
        }
    }

    confirmPaidBtn.onclick = handleConfirmPayment; 
    // --- End Modal Handlers ---

    // Helper to format date
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    
    // Helper to calculate days overdue (returns positive number for overdue)
    const calculateDaysOverdue = (dueDate) => {
        const timeDiff = Date.now() - dueDate;
        if (timeDiff <= 0) return 0;
        // Calculate days overdue (rounded UP to include the current day)
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    // Helper to calculate remaining days (returns positive number for remaining)
    const calculateDaysRemaining = (dueDate) => {
        const timeRemaining = dueDate - Date.now();
        return Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));
    };

    // 2. Main function to render the book list based on filtered books
    function renderBookList(books, isReservationView = false) {
        bookListContainer.innerHTML = ''; 

        if (books.length === 0) {
             const msg = isReservationView ? "You currently have no active reservations." : "No books found in this category.";
             bookListContainer.innerHTML = `<p style="width:100%; text-align:center; color: #8C6A57; padding: 40px 0;">${msg}</p>`;
             return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            
            const isAvailable = book.status === 'Available';
            const isBooked = book.isReserved;
            const daysOverdue = isBooked ? calculateDaysOverdue(book.dueDate) : 0;
            const isOverdue = daysOverdue > 0;
            const currentFine = isOverdue ? daysOverdue * FINE_PER_DAY : 0; // Calculate total fine
            
            const statusClass = isAvailable ? 'available' : 'booked';
            const statusText = isAvailable ? 'Available' : 'Reserved';
            
            // --- Determine which button to show ---
            let buttonHTML = '';
            if (isAvailable) {
                 buttonHTML = `<button class="book-btn reserve-btn" data-book-id="${book.id}">Reserve Now</button>`;
            } else if (isOverdue && isReservationView) {
                // Overdue books in 'My Reservations' get a PAY FINE button
                 buttonHTML = `<button class="book-btn fine-btn" data-book-id="${book.id}" data-book-title="${book.title}" data-fine-amount="${currentFine}">Pay Fine (${currentFine} THB)</button>`;
            } else if (isBooked && isReservationView) {
                // Booked books (not overdue) in 'My Reservations' get a RETURN button
                 buttonHTML = `<button class="book-btn return-btn" data-book-id="${book.id}">Return Book</button>`;
            } else {
                // Reserved books in the main Catalog view get a disabled button
                 buttonHTML = `<button class="book-btn" disabled>Reserved</button>`;
            }
            // --- End Button Logic ---

            // --- Info for Reserved Books (shows only in Reservation View) ---
            let reservationInfoHTML = '';
            if (isReservationView && isBooked) {
                const daysRemaining = calculateDaysRemaining(book.dueDate);
                
                let timerClass = '';
                let timerText = '';

                if (isOverdue) {
                    timerClass = 'booked overdue'; 
                    timerText = `OVERDUE: ${daysOverdue} days! Fine: ${currentFine} THB`;
                } else if (daysRemaining <= 2) {
                    timerClass = 'booked warning'; 
                    timerText = `Warning: ${daysRemaining} days left!`;
                } else {
                    timerClass = 'available';
                    timerText = `Time Left: ${daysRemaining} days`;
                }
                
                reservationInfoHTML = `
                    <p>Reserved on: ${formatDate(book.reservedDate)}</p>
                    <p>Due Date: ${formatDate(book.dueDate)}</p>
                    <p class="status-timer ${timerClass}">${timerText}</p>
                `;
            }
            // --- End Reservation Info ---

            card.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                ${reservationInfoHTML}
                <p class="status ${statusClass}" id="status-${book.id}">Status: ${statusText}</p>
                ${buttonHTML}
            `;
            bookListContainer.appendChild(card);
        });

        // Re-attach event listeners after re-rendering
        document.querySelectorAll('.reserve-btn').forEach(button => {
            button.addEventListener('click', handleReserve);
        });
        
        document.querySelectorAll('.return-btn').forEach(button => {
            button.addEventListener('click', handleReturn); 
        });

        document.querySelectorAll('.fine-btn').forEach(button => {
            button.addEventListener('click', handlePayFine); // Now opens the modal
        });
    }

    // 3. Function to handle the RESERVE click event 
    function handleReserve(event) {
        // (Reserve logic remains the same)
        const bookId = parseInt(event.target.dataset.bookId); 
        const bookToUpdate = libraryBooks.find(book => book.id === bookId);
        
        const newReservedDate = Date.now();
        const newDueDate = Date.now() + (RESERVATION_DAYS * 24 * 60 * 60 * 1000); 

        if (bookToUpdate && bookToUpdate.status === 'Available') {
            bookToUpdate.status = 'Booked';
            bookToUpdate.isReserved = true;
            bookToUpdate.reservedDate = newReservedDate;
            bookToUpdate.dueDate = newDueDate;

            alert(`✅ Success! You reserved: "${bookToUpdate.title}". Due date: ${formatDate(newDueDate)}`);
            
            const activeNav = document.querySelector('.nav-btn.active');
            if (activeNav) {
                handleFilter(activeNav.dataset.view);
            }
        }
    }

    // 4. Function: Handle the RETURN click event
    function handleReturn(event) {
        const bookId = parseInt(event.target.dataset.bookId); 
        const bookToUpdate = libraryBooks.find(book => book.id === bookId);
        
        if (calculateDaysOverdue(bookToUpdate.dueDate) > 0) {
            alert("🛑 Error: This book is overdue. Please pay the fine before returning.");
            return;
        }

        if (bookToUpdate && bookToUpdate.status === 'Booked') {
            bookToUpdate.status = 'Available';
            bookToUpdate.isReserved = false;
            bookToUpdate.reservedDate = null;
            bookToUpdate.dueDate = null;

            alert(`🎉 Thank you! You have successfully returned: "${bookToUpdate.title}".`);

            const activeNav = document.querySelector('.nav-btn.active');
            if (activeNav) {
                handleFilter(activeNav.dataset.view);
            }
        }
    }
    
    // 5. NEW FUNCTION: Handle the PAY FINE click event (Opens Modal)
    function handlePayFine(event) {
        const bookId = parseInt(event.target.dataset.bookId); 
        const fineAmount = event.target.dataset.fineAmount;
        const bookTitle = event.target.dataset.bookTitle;

        // Set the global variable for the book being paid for
        currentOverdueBookId = bookId; 

        // Update Modal Content
        document.getElementById('modalBookTitle').textContent = bookTitle;
        document.getElementById('modalFineAmount').textContent = `${fineAmount} THB`;
        
        // Display the Modal
        fineModal.style.display = 'block';
    }
    
    // 6. NEW FUNCTION: Handle the Confirm Payment Button inside the Modal
    function handleConfirmPayment() {
        if (!currentOverdueBookId) return; // Safety check

        const bookToUpdate = libraryBooks.find(book => book.id === currentOverdueBookId);

        if (bookToUpdate) {
            // Simulated return after payment
            // We use a confirm box here to simulate the user verifying they have paid
            const confirmation = confirm("Are you sure you have completed the PromptPay transfer for the fine?");

            if (!confirmation) {
                // If the user cancels the confirmation
                return; 
            }

            bookToUpdate.status = 'Available';
            bookToUpdate.isReserved = false;
            bookToUpdate.reservedDate = null;
            bookToUpdate.dueDate = null;

            alert(`✅ Payment Confirmed! The book "${bookToUpdate.title}" has been successfully returned.`);
            
            // Close the modal and refresh view
            fineModal.style.display = 'none';
            currentOverdueBookId = null;
            const activeNav = document.querySelector('.nav-btn.active');
            if (activeNav) {
                handleFilter(activeNav.dataset.view);
            }
        }
    }

    // 7. FUNCTION: Handle all View/Category Filter logic
    function handleFilter(view) {
        let filteredBooks = [];
        let title = '';

        if (view === 'All') {
            filteredBooks = libraryBooks;
            title = 'All Books';
            renderBookList(filteredBooks);
        } else if (view === 'Reservations') {
            filteredBooks = libraryBooks.filter(book => book.isReserved);
            title = 'My Reservations (7-Day Period)';
            renderBookList(filteredBooks, true); 
        } else {
            // Category Filter (Fiction, Comics, Learning)
            filteredBooks = libraryBooks.filter(book => book.category === view);
            title = `${view} Books`;
            renderBookList(filteredBooks);
        }

        catalogTitle.textContent = title;
    }

    // 8. Add Event Listeners to View/Category Buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const selectedView = event.target.dataset.view;
            handleFilter(selectedView);
        });
    });

    // Initial load: show all books when the page first loads
    handleFilter('All');

});
