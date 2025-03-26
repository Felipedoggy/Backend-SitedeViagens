import express from 'express';
import session from 'express-session';
import PacoteViagem from './models/PacoteViagem.js';
import RoutePacote from './routes/RoutePacote.js';
import PacoteViagemDB from './database/PacoteViagemDB.js';
import conectar from './database/DB.js';

const app = express();
const pacoteDB = new PacoteViagemDB();

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/pacotes', RoutePacote);
app.use('/cadastro' , RoutePacote);
app.use(express.static('public'));
app.use(express.static('private'));
app.use(express.static('private/scripts'));
app.use(express.static('private/cadastro'));
app.set('view engine', 'ejs');
const requireAuth = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get("/", async (req, res) => {
    try {
        const pacotes = await pacoteDB.consultar();
pacotes.forEach(pkg => pkg.price = Number(pkg.price) || 0);

        res.render("index", { packages: pacotes, authenticated: req.session.authenticated });
    } catch (erro) {
        res.status(500).send("Erro ao carregar pacotes.");
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/login');
    }
    if (username === 'admin' && password === 'admin') {
        req.session.authenticated = true;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Usuário ou senha incorretos' });
    }
});



// Rota para o cadastro
app.get('/private/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'private', 'cadastro.html'));
});
import path from 'path';
import { fileURLToPath } from 'url';

// Obtendo o diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/private/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'private', 'cadastro.html'));
});

app.use('/private', express.static(path.join(__dirname, 'views/private')));



app.get('/pacote/:id', requireAuth, async (req, res) => {
    try {
        const pkg = await pacoteDB.buscarPorId(req.params.id);
        if (pkg) {
            res.render('pacote', { pkg });
        } else {
            res.status(404).send('Pacote não encontrado');
        }
    } catch (erro) {
        res.status(500).send("Erro ao carregar o pacote.");
    }
});

app.post('/cadastro', async (req, res) => {
    const { name, departure, destination, price, description, duration, departureLocation, availableSpots, image } = req.body;

    if (!name || !departure || !destination || !price || !description || !duration || !departureLocation || !availableSpots || !image) {
        return res.redirect('/private/cadastro?error=Preencha todos os campos');
    }

    try {
        const novoPacote = new PacoteViagem(null, name, departure, destination, parseFloat(price), description, duration, departureLocation, parseInt(availableSpots), image);
        await pacoteDB.criar(novoPacote);
        res.redirect('/private/cadastro?success=true');
    } catch (erro) {
        res.status(500).send("Erro ao cadastrar o pacote.");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
