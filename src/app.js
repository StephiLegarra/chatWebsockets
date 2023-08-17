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

// CLASE 11 - VAMOS A IMPLEMENTAR SWEETALERT EN LA PLANTILLA BASE
/* Vamos a usar sweetalert para bloquear la pantalla del chat hasta que el usuario se identifique y para notificar a los usuarios cuando alguien se conecte al chat
1.INSTALACION: en el index.handlebars vamos a pegar el cdn
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
2.UTILIZACION: por ejemplo en el index.js le podes aplicar el swal.fire de sweetalert y te va a aparecer el mensaje

-- AUTENTICACION DE USUARIO CON SWEETALERT
1. index.handlebars -> lo configuramos con un campo de texto que tenga el chatbox donde se puedan escribir los mensajes y messagelogs donde se van a ir despachando los mensajes
  <input type="text" class="form-control" id="chatBox" />
   <div class="col-md-6 offset-md-3"> 
      <div id="menssageLogs"></div>
2. index.js -> hacemos referencia a estos dos id que creamos y vamos a crear un sweetalert donde se pueda ingresar un campo de texto donde se pueda capturar el usuario y generar el msj
3. app.js ->escuchar el mensaje que generamos con sweetalert con un socket.on
4. index.js -> hacer el socket on para que reciba el mensaje del servidor (app.js)

-- AGREGAMOS IMAGEN
1. index.js -> creamos let foto y agregamos el swal.fire para cargar la imagen, y en el chatbox le vamos a agregar la foto al objeto
2. en el app.js -> tbm agregamos la foto al objeto
3. index.js cuando hacemos el render de los parrafos le agregamos que se vea la foto tambien

--- ALERTAS PARA QUE CUANDO EL USUARIO SE CONECTA LE MANDE MENSAJES DE LOGS DE TODO EL CHAT Y SE RECIBA UNA NOTIFICACION DE QUE HAY UN NUEVO USUARIO CONECTADO
1. app.js en la nueva conexion agregar el broadcast para que le avise al resto que hay un nuevo usuario conectado
2. index.js : agregar el emit -> socket.emit("nuevoUsuario", usuario); en la promesa
tambien tendremos que hacer dos socket on de nueva conexion y nuevo usuario xxx conectado
3. en app.js agregar el mensaje para todos de que xxx usuario se conecto!


DEPLOY EN GLITCH (localhost significa solo para mi, hacer diploy es subirla a la nube y poder compartirla)
https://glitch.com/
1. subir el repo a github publico, sin el node modules e incluir el script "start" en package.json ->  "start": "node src/app.js",
esto hace que sea lo que ejecuta primero cuando comienza la aplicacion
vamos a glitch nos logueamos con github tocamos en nuevo proyecto y importar desde github
*/

const messages = []; // ARRAY VACIO DE MENSAJES

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
