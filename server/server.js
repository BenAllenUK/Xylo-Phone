var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('mobile.html');
});



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('INFO', function(num){
        console.log('Tone number request: ' + num);
        //socket.emit('SONG', playToneNumber(num));
        io.emit('SONG', playToneNumber(num));
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function playToneNumber(number){
    var response = {
        toneNumber: number
    };
    return JSON.stringify(response);
}