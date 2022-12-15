import "core-js/stable";
import "regenerator-runtime/runtime";

import "./assets/css/style.css";
import Login from "./modules/Login";
import Contato from "./modules/Contato";
//formulario de cadastro
const login = new Login(".form-login");
const cadastro = new Login(".form-cadastro");
login.init();
cadastro.init();

// formulario de contato
const contato = new Contato(".form-contato");
contato.init();
