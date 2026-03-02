import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { createServer } from "http";/** */
import { fileURLToPath } from "url";

import homerouter from './routers/home.router.js'
import uploadrouter from './routers/upload.router.js'
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer (app);/** */
const PORT = 3000;
const io = new Server(httpServer);/**Nuevo servidor coorriendo websoket */

/**Definimos Motor  */
app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
/**Carpeta static sera public */
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/**Dar la ruta a bootstrp y sweetalert2*/
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/sweetalert2', express.static(path.join(__dirname, 'node_modules/sweetalert2/dist')));

/**Routers */
app.use('/', homerouter);
app.use('/upload', uploadrouter);

/**Pagina 404 */
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
})
/**definimos el websocket */
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on ('chat:message', (data) => {
        io.emit('chat:message',data);
    });
    socket.on('disconnect', () =>{
        console.log ('usuario desconectado')
    });
})


httpServer.listen(PORT, () => console.log(`Servidor OK:${PORT}`));
/**websoket solo funciona con httpServer */