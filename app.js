var app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http)
const users = {}

app.get('/', function(req, res) {
   res.sendfile(__dirname +'/index.html');
});

app.get('/script.js', function(req, res, next) {  
    //console.log("before redirection");
    res.sendfile(__dirname +'/script.js'); 
});

io.on('connection', socket => {
    //console.log("new user")
    //socket.emit('chat-message', 'Hello world')

    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

http.listen(80, function() {
   console.log('listening on *:80');
});

