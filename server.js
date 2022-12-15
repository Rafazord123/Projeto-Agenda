require("dotenv").config(); // coisas relacionadas com o ambiente de desenvolvimento, senhas e etc (.env)
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // vai modelar a basededados e garantir que a basededados vai ser salva da forma que queremos que salve
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(() => app.emit("pronto")) // ele vai ser chamado primeiro e depois o nosso servidor vai começar a ouvir linha //46
  .catch((e) => console.log(e));
const session = require("express-session"); //geralmente cria um ID para reconhecer o navegador de um cliente e salvar, cookies dos cliente como formularios,senhas,logins e etc...
const MongoStore = require("connect-mongo"); // Salva as session dentro da base de dados para nao sobrecarregar a memoria do navegador
const flash = require("connect-flash"); // (Sem 'session' nao funciona)São mensagens auto destrutivas assim que vc ler elas sumirao "Usadas geralmete para enviar mensagens de erros ou fedback"
const routes = require("./routes"); // Rotas da nossa aplica /home,/contato,/paginainicial...
const path = require("path"); // Trabalha com caminhos de pastas e arquivos
//const helmet = require("helmet"); // usado para segurança é mais facil ler a documentçao no MDN
const csrf = require("csurf"); // Usado para crias tokens para que nenhum site externo poste coisas para dentro da nosso aplicação
const {
  middleGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middlewares");
// middlewares Sao funçoes que são executadas na rota.

//app.use(helmet());
//app.use(helmet.referrerPolicy({ policy: ["origin", "unsafe-url"] }));

app.use(express.urlencoded({ extended: true })); // com isso podemos postar formularios para dentro de nossa aplicaçao
app.use(express.json()); // permitir usar json dentro da nosso aplicação
app.use(express.static(path.resolve(__dirname, "public"))); //São todos arquivos q sao estaticos e podem ser usados na nossa aplicaçao
//exemplo: img,css,js e outros esses tipos de arquivos devem ser acesssdos diretamente.
//Tudo que tiver dentro da nossa pasta public poderá ser acessado diretamente.

const sessionOptions = session({
  secret: "ssdsadddadddsasd()sdasd555 dasd ewqeqeq",
  //store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
}); //Config da sessão
app.use(sessionOptions); //usando a session
app.use(flash()); //usando o flash

app.set("views", path.resolve(__dirname, "src", "views"));
//views: São os arquivos que serão renderizados na tela, geralemte html, acima é o caminho dele
app.set("view engine", "ejs"); // isto é como nos estamos renderizando o html "ejs"

app.use(csrf()); //usando os csrfTokens
//         Nossos proprios middlewaress
app.use(middleGlobal); // Chamando os middlewares
app.use(checkCsrfError); // Chamando os middlewares
app.use(csrfMiddleware); // Chamando os middlewares
app.use(routes); // Chamando as rotas

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
}); // primeiro abre meu banco de dados abrir, depois eu mando a aplicação escutar

// AVISO

//            Helmet no localhost(EVITE)

//   O Helmet é para segurança da aplicação,
// portanto, caso você esteja com um sistema ainda em desenvolvimento,
// usando urls como "127.0.0.1", "localhost" ou até um servidor com IP
// externo, sem usar SSL(https), é recomendável desativá - lo.
// Ele pode bloquear importação de scripts e arquivos de CSS.

// Caso ocorra erros ao importar o bundle.js,
// arquivos de CDN(como bootstrap, por exemplo) ou CSS,
// basta desativar o helmet para correção.

// Isso só ocorrerá em sistemas sem SSL(sem https na URL).
