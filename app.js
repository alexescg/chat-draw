var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');


var app = express();
var port = 8080;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

var server = require('http').Server(app);
var io = require("socket.io")(server);

//mongoose.connect('mongodb://localhost/chat');
mongoose.connect('mongodb://usr_chat:1234@ds021172.mlab.com:21172/chat')
var Schema = mongoose.Schema;

var mensajeSchema = new Schema({
    nombrePersona: String,
    texto: String
});
//El mongose agarra el nombre en singular y lo transforma en plural y quita el capital para agregarlo a mongo
var Mensaje = mongoose.model("Mensaje", mensajeSchema);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/mensajes/all', function (req, res) {
    Mensaje.find({}).exec(function (err, mensajes) {
        if (err) {
            throw err;
        }
        return res.json(mensajes);
    })
});

app.post('/mensaje/create', function (req, res) {
    var mensaje = new Mensaje({
        nombrePersona: req.body.nombrePersona,
        texto: req.body.texto
    });

    mensaje.save(function (err, obj) {
        console.log("Guardado exitosamente");
    });
});


var getMessages = Mensaje.find({}).then(function successCallback(success) {
    return success;
}, function errorCallback(error) {
    throw error;
});

io.on('connect', function (socket) {

    // console.log(getMessages());
    socket.emit('sendMessages', getMessages);

    socket.on('newMessage', function (data) {
        var mensajeNuevo = new Mensaje(data);
        mensajeNuevo.save(function (err, obj) {
            if (obj) {
                io.sokets.emit('sendMessage',obj);
            }
        });
    });
});

server.listen(port, function () {
    console.log("Escuchando en: " + port);
});
