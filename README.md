# PDF Sync Viewer

The **PDF Sync Viewer** is a web-based application designed to allow real-time synchronization between a presenter (admin) and viewers using WebSockets and PDF.js. This application enables a seamless and interactive PDF viewing experience, where the presenter controls the navigation of the PDF document, and all viewers automatically follow along with the same page. The primary use case is for scenarios like online classrooms, presentations, or collaborative document reviews, where the presenter’s actions need to be reflected instantly on the viewers' screens.

## Features

- **Real-time synchronization**: The admin can navigate through the PDF, and all viewers’ pages are synchronized instantly to reflect the same page.
- **Role-based functionality**: The application supports two roles: 
  - **Admin**: Controls the navigation of the PDF.
  - **Viewer**: Follows the admin’s navigation automatically.
- **Interactive Interface**: The user interface allows easy navigation through the PDF with "Next" and "Previous" buttons, enabling a fluid experience for both admins and viewers.
- **WebSocket-based Communication**: Uses Socket.IO for real-time communication between the client (user's browser) and the server to synchronize page changes.
- **PDF Rendering with PDF.js**: The PDF pages are rendered on a canvas element in the browser, utilizing PDF.js for client-side PDF rendering.

## Use Cases

- **Virtual Classrooms**: Teachers can present PDF documents to students, ensuring they are all on the same page in real-time.
- **Remote Presentations**: Presenters can control the PDF slides, and the audience follows along automatically.
- **Collaborative Document Reviews**: Multiple users can review a PDF document together, with the document synchronized across all participants.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask, Flask-SocketIO
- **PDF Rendering**: PDF.js (JavaScript library)
- **Real-time Communication**: Socket.IO (for WebSocket communication)

## How it Works

1. The admin user joins the room and starts navigating through the PDF. Each time the admin moves to a different page, the page number is broadcasted to all connected viewers via WebSocket.
2. Viewers receive the updated page number and automatically move to the same page, ensuring synchronization.
3. The admin has control over the page navigation, while viewers follow the admin’s navigation without any control over the document.
4. The PDF is served via a Flask server, and the pages are rendered on a canvas element using PDF.js.

## Setup

### Prerequisites

- Python 3.x
- Node.js (for frontend dependencies if needed)

OUTPUT :
![image](https://github.com/user-attachments/assets/cebde954-12f6-45e1-a2a1-5c9c7c51159f)

![image](https://github.com/user-attachments/assets/37dd2c2e-d36f-4731-982e-7c0ed863acac)

![image](https://github.com/user-attachments/assets/2024481f-1012-421d-8f62-ff2e24387b9e)

![image](https://github.com/user-attachments/assets/b7bbf9db-1687-4491-a194-0db853cb3107)



