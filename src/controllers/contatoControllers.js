const { async } = require("regenerator-runtime");
const Contato = require("../models/ContatoModels");

exports.index = (req, res) => {
  res.render("contato", {
    contato: {},
  });
};
exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(function () {
        // salva a sessão
        return res.redirect("/contato/index");
      });
      return;
    }

    req.flash("success", "Contato registrado com sucesso");
    req.session.save(function () {
      // salva a sessão
      return res.redirect(`/contato/index/${contato.contato._id}`);
    });
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async function (req, res) {
  if (!req.params.id) return res.render("404");

  const contato = await Contato.buscaPorId(req.params.id);
  if (!contato) return res.render("404");

  res.render("contato", { contato });
};
exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render("404");
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(function () {
        // salva a sessão
        return res.redirect("back");
      });
      return;
    }

    req.flash("success", "Contato editado com sucesso");
    req.session.save(function () {
      // salva a sessão
      return res.redirect(`/contato/index/${contato.contato._id}`);
    });
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};
exports.delete = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contato = await Contato.delete(req.params.id);
  if (!contato) return res.render("404");

  req.flash("success", "Contato apagado com sucesso");
  req.session.save(function () {
    return res.redirect("back");
  });
  return;
};
