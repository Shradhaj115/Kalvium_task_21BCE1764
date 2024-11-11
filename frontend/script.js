let pdfDoc = null;
let pageNum = 1;
let pdfPageRendering = false;
const pdfCanvas = document.getElementById("pdfCanvas");
const pdfContext = pdfCanvas.getContext("2d");

let userRole = 'viewer'; // Default role is viewer
let socket;
const room = "presentation_room"; // Shared room name

// Load the PDF from the provided URL
pdfjsLib.getDocument('http://localhost:5000/pdf').promise.then(pdf => {
    pdfDoc = pdf;
    document.getElementById("totalPages").textContent = pdfDoc.numPages; // Display total pages
    renderPage(pageNum); // Render the first page initially
}).catch(error => {
    console.error("Error loading PDF:", error);
    alert("Failed to load PDF. Please try again later.");
});

// Function to load and render a specific page of the PDF
function loadPDFPage(pageNum) {
    if (pdfPageRendering || !pdfDoc) return;
    pdfPageRendering = true;

    pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: pdfContext,
            viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
            pdfPageRendering = false;
            updateButtonState();  // Check if buttons should be enabled/disabled
        });
    }).catch(error => {
        console.error("Error rendering PDF page:", error);
    });
}

// Render the page on canvas and update current page number
function renderPage(pageNum) {
    if (!pdfDoc) {
        console.error("PDF document is not loaded");
        return;
    }
    document.getElementById("pageNumber").textContent = pageNum;
    loadPDFPage(pageNum);
}

// Event listeners for navigation buttons
document.getElementById("prevPage").addEventListener("click", () => {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
        if (userRole === 'admin') {
            socket.emit('page_change', { room, page: pageNum });
        }
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
        if (userRole === 'admin') {
            socket.emit('page_change', { room, page: pageNum });
        }
    }
});

// Function to update button state (enable/disable) based on current page
function updateButtonState() {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    // Disable "Previous" button on first page
    prevButton.disabled = (pageNum <= 1);

    // Disable "Next" button on last page
    nextButton.disabled = (pageNum >= pdfDoc.numPages);
}

// Socket.io setup for synchronization
socket = io("http://localhost:5000");

// Ask the user for their role (admin or viewer)
userRole = prompt("Enter your role (admin/viewer): ").toLowerCase();
document.getElementById("userRole").textContent = userRole;

const data = { room, role: userRole };

// Join the room on connection
socket.emit('join', data);

// Listen for page updates from the server
socket.on('page_update', data => {
    pageNum = data.page;
    renderPage(pageNum);
});

// Update button state after page update
socket.on('page_change', data => {
    pageNum = data.page;
    renderPage(pageNum);
    updateButtonState();  // Check if buttons should be enabled/disabled
});
