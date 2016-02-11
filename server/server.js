var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var prompt = require('prompt');
prompt.start();


promptForInput();


app.get('/', function(req, res){
    res.sendfile('mobile.html');
});



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('INFO', function(num){
        // Send response to all
        console.log('Tone number request: ' + num);
        io.emit('SONG', requestToneNumber(num));
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function requestToneNumber(number){
    var response = {
        toneNumber: number
    };
    return JSON.stringify(response);
}
function sendBaseLayerRequest() {
    // Tell clients to take base layer
    console.log('Telling clients to take base layer');
    io.emit('BASE', 1);
}
function promptForInput(){
    prompt.get('val', function (err, result) {
        sendBaseLayerRequest();
        promptForInput();
    });
}