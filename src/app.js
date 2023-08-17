import express from "express"; //importamos el modulo express
import handlebars from "express-handlebars"; // IMPORTAMOS HANDLEBARS
import __dirname from "./utils.js"; // ACA EN DIRNAME EN LA CARPETA UTILS PUSE LA RUTA HASTA LA CARPETA SRC PARA QUE ACCEDA A LOS DATOS
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express(); // inicializamos express
const puerto = 8080;
// aca http server que escuche
const httpServer = app.listen(puerto, () => {
  console.log("Servidor Activo en el puerto: " + puerto);
});
// aca inicializamos socket ligado a httpserver
const socketServer = new Server(httpServer);

//defino mis plantillas en mi servidor http
app.engine("handlebars", handlebars.engine()); // INICIALIZAMOS HANBLEBARDS
app.set("views", __dirname + "/views"); // DEFINIMOS A LA VISTA E INDICAR LA RUTA ABSOLUTA
app.set("view engine", "handlebars"); // indicamos que motor queremos utilizar
app.use(express.static(__dirname + "/public"));

app.use(express.json()); // que lea y codifique los json
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);

const messages = []; // ARRAY VACIO DE MENSAJES

// PROBANDO SET INTERVAL PARA CONVERSACION EN TIEMPO REAL
const updateInterval = 2000; // 2 milisegundos
setInterval(() => {
  socketServer.emit("messages", messages);
}, updateInterval);

//defino los mensajes en mi servidor socket
socketServer.on("connection", (socket) => {
  console.log("Nueva conexión!");
  socket.broadcast.emit("nuevaConexion", "Hay un nuevo Usuario conectado!");

  // USUARIO CONECTADO
  socket.on("nuevoUsuario", (data) => {
    socket.broadcast.emit("nuevoUsuario", data + " se ha conectado!");
  });

  //ACA EL SERVIDOR ESTA ESCUCHANDO EL MENSAJE QUE EL CLIENTE ENVIA DESDE INDEX.JS
  socket.on("message", (data) => {
    messages.push({
      usuario: data.usuario,
      foto: data.foto,
      mensaje: data.mensaje,
    }); // asi lo pusimos en el chatbox
    socket.emit("messages", messages); // que emita el array
  });
});
