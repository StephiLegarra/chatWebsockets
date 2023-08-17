import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// asi se importan y se generan las constantes que rutean
// en app.js le vamos a decir a partir de ahora cuando yo hago un get, cargame esto.

// ESTO ES VALIDO SOLO SI TRABAJAMOS CON EL TYPE MODULE QUE AGREGAMOS EN EL PACKAGE JSON

export default __dirname;
