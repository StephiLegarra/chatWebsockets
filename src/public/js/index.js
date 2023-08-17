const socket = io();
const chatBox = document.getElementById("chatBox"); // traemos el id
const messageLogs = document.getElementById("messageLogs"); // traemos el id
let usuario = ""; // definimos una variable que permita capturar el valor
let foto = ""; // definimos una variable vacia para capturar la img

// SWEET ALERT!!!
//Swal.fire("Hola este es un mensaje desde sweet alert!");
// PARA CAPTURAR EL NOMBRE DEL USUARIO
Swal.fire({
  title: "Bienvenida",
  text: "Ingrese su Nombre",
  input: "text",
  inputValidator: (value) => {
    return !value && "Error! No se ingresó un Nombre!";
  }, // si no hay mensaje muestra el error
}).then((data) => {
  usuario = data.value;
  // messageLogs.innerHTML = usuario; -> con esto podes chequear si funciona porque te va a mostrar el nombre en el chat
  socket.emit("nuevoUsuario", usuario);

  // AGREGAMOS FOTO:
  Swal.fire({
    text: "Ingrese su foto",
    input: "text",
    inputValidator: (value) => {
      return !value && "Error! No se cargo una imagen!";
    }, // si no hay mensaje muestra el error
  }).then((data) => {
    foto = data.value;
  });
});

// PARA ENVIAR EL MENSAJE: vamos a usar el evento keyup (cuando soltas la tecla se dispara el evento) en el chatbox que es el campo de texto
chatBox.addEventListener("keyup", (evento) => {
  if (evento.key === "Enter") {
    // el mensaje se envia cuando el usuario aprieta enter
    if (chatBox.value.trim().length > 0) {
      // el trim quita los espacios en blanco y lenght devuelve la longitud de caracteres por eso q sea mayor a cero
      socket.emit("message", {
        usuario: usuario,
        foto: foto,
        mensaje: chatBox.value.trim(),
      }); // que emita el mensaje, se tiene que pasar como objeto usuario y el mensaje
      chatBox.value = ""; // limpiar la conversacion
    }
  }
});

// NUEVA CONEXION DE UN USUARIO
socket.on("nuevaConexion", (data) => {
  Swal.fire({
    position: "top-end",
    title: data,
    showConfirmButton: false,
    timer: 1000,
  });
});

// NUEVO USUARIO CONECTADO
socket.on("nuevoUsuario", (data) => {
  Swal.fire({
    position: "top-end",
    title: data,
    showConfirmButton: false,
    timer: 1000,
  });
});

// ESCUCHA EL MENSAJE DEL SERVIDOR
socket.on("messages", (data) => {
  let salida = ``; // ESTO ES LO QUE QUEREMOS CREAR

  data.forEach((item) => {
    // HACEMOS UN FOREACH QUE RECORRA EL ARRAY DE MENSAJES Y POR CADA UNO GENERE ESTO
    salida += `<div class="row mb-3">
    <div class="col-md-1"><img src="${item.foto}" alt="Foto" width="48" class="rounded-circle"></div>
    <div class="col-md-11"><b>${item.usuario}:</b><br><span class="fw-light">${item.mensaje}</span></div>
    </div>`; // armamos el html c lo que queremos que diga x ej"lola: hola como estas?""
  });

  messageLogs.innerHTML = salida;
});
