from flask import Flask, send_from_directory, request  # Import request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Dictionary to store current page of each room
rooms_pages = {}
rooms_roles = {}  # Store the role (admin or viewer) for each user in a room

@app.route('/')
def index():
    return "PDF Sync Viewer Backend"

# Serve PDF
@app.route('/pdf')
def serve_pdf():
    try:
        # Specify the full file path
        return send_from_directory(r'C:/Users/HP/Desktop/pdf_sync_viewer', 'covid.pdf')
    except Exception as e:
        return f"Error: {e}", 404

@socketio.on('join')
def on_join(data):
    room = data['room']
    user_role = data['role']  # Role can be either 'admin' or 'viewer'
    join_room(room)
    
    # Set the user's role in the room
    rooms_roles[room] = rooms_roles.get(room, {})
    rooms_roles[room][request.sid] = user_role

    # Set the default page if the room does not have a page set
    if room not in rooms_pages:
        rooms_pages[room] = 1  # Default to page 1

    # Emit the current page to the newly joined user
    emit('page_update', {'page': rooms_pages[room]}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    if room in rooms_roles:
        del rooms_roles[room][request.sid]

@socketio.on('page_change')
def on_page_change(data):
    room = data['room']
    page = data['page']
    user_role = rooms_roles.get(room, {}).get(request.sid, None)
    
    # Only the admin can change the page
    if user_role == 'admin':
        rooms_pages[room] = page
        emit('page_update', {'page': page}, room=room, broadcast=True)  # Broadcast to all viewers

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    socketio.run(app, debug=True)
