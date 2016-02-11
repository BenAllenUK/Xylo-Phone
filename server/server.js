var app = require('express')();

var prompt = require('prompt');

var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
console.log(__dirname + '/public')
app.use(express.static(__dirname + '/public'));
var server = app.listen(port);

var io        = require('socket.io').listen(server);

prompt.start();


promptForInput();

app.use(express.static(__dirname + '/'));
// app.listen(port);


// app.get('/', function(req, res){
//     res.sendfile('mobile.html');
// });


var clientCount = 0;

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.emit('POSITION', clientCount);
    clientCount++;


    socket.on('disconnect', function(){
        console.log('user disconnected');
        clientCount--;
    });

    socket.on('HOVER_START', function(num){
        // Send response to all
        console.log('Tone number request: ' + num);
        io.emit('SONG', {'toneNumber': num, 'state': 1});
    });

    socket.on('HOVER_END', function(num){
        // Send response to all
        console.log('Tone number request: ' + num);
        io.emit('SONG', {'toneNumber': num, 'state': 0});
    });
});


function sendBaseLayerRequest() {
    // Tell clients to take base layer
    console.log('Telling clients to take base layer');
    io.emit('BASE', 1);
}

function promptForInput(){
    prompt.get('val', function (err, result) {
        if(result.val != "e") {
            sendBaseLayerRequest();
            promptForInput();
        } else {
            process.exit();
        }
    });
}