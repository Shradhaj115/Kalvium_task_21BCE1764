let pdfDoc = null;
let pageNum = 1;
let pdfPageRendering = false;
const pdfCanvas = document.getElementById("pdfCanvas");
const pdfContext = pdfCanvas.getContext("2d");

// Load the PDF document
pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

// Load PDF from URL
pdfjsLib.getDocument('https://arxiv.org/pdf/1706.03762.pdf').promise.then(pdf => {
    pdfDoc = pdf;
    document.getElementById("totalPages").textContent = pdfDoc.numPages; // Display total pages
    renderPage(pageNum); // Render the first page initially
}).catch(error => {
    console.error("Error loading PDF:", error);
    alert("Failed to load PDF. Please try again later.");
});

// Function to load and render a specific page of the PDF
function loadPDFPage(pageNum) {
    if (pdfPageRendering || !pdfDoc) return; // Prevent multiple renders at the same time or if pdfDoc is not loaded
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
        });
    });
}

// Render the page on canvas and update current page number
function renderPage(pageNum) {
    document.getElementById("pageNumber").textContent = pageNum;
    loadPDFPage(pageNum);
}

// Event listeners for navigation buttons
document.getElementById("prev-page").addEventListener("click", () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById("next-page").addEventListener("click", () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});
