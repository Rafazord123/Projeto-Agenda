import validator from "validator";
export default class Contato {
  constructor(formContatos) {
    this.form = document.querySelector(formContatos);
  }
  init() {
    this.events();
  }
  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }
  validate(e) {
    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const sobrenomeInput = el.querySelector('input[name="sobrenome"]');
    const emailInput = el.querySelector('input[name="email"]');
    const telefoneInput = el.querySelector('input[name="telefone"]');
    let error = false;
    for (let errorText of this.form.querySelectorAll(".error-text")) {
      errorText.remove();
    }

    if (!nomeInput.value) {
      this.criaErro(nomeInput, "O campo nome é obrigátorio");
      error = true;
    }
    if (emailInput.value && !validator.isEmail(emailInput.value)) {
      this.criaErro(emailInput, "E-mail precisa ser um email válido");
      error = true;
    }
    if (!emailInput.value && !telefoneInput.value) {
      this.criaErro(
        telefoneInput,
        "Pelo menos um contato precisa ser enviado: e-mail ou telefone."
      );
      error = true;
    }

    if (!error) el.submit();
  }
  criaErro(campo, msg) {
    const div = document.createElement("div");
    div.innerText = msg;
    div.classList.add("error-text");
    campo.insertAdjacentElement("afterend", div);
  }
}
