//routes decide quem vai controlar aquela rota.
// exemplo: entrei na pgnHome,
// quem vai decidir o que fazer nela vai ser o homeControler

const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeControllers");
const loginController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoControllers");
module.exports = route;

const { loginRequired } = require("./src/middlewares/middlewares");

// Rotas da home
route.get("/", homeController.index);

// Rotas de login
route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

// Rotas contato
route.get("/contato/index", loginRequired, contatoController.index);
route.post("/contato/register", loginRequired, contatoController.register);
route.get("/contato/index/:id", loginRequired, contatoController.editIndex);
route.post("/contato/edit/:id", loginRequired, contatoController.edit);
route.get("/contato/delete/:id", loginRequired, contatoController.delete);
