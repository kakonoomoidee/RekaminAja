const web3 = require("../config/web3");
const contract = require("../config/contract");

exports.loginPage = (req, res) => {
  const nonce = "LOGIN_" + Date.now();
  req.session.nonce = nonce;
  res.render("login", { nonce });
};

exports.login = async (req, res) => {
  const { address, signature } = req.body;
  const nonce = req.session.nonce;

  if (!nonce) return res.send("Nonce expired");

  try {
    const recovered = web3.eth.accounts.recover(nonce, signature);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.send("❌ Signature tidak valid");
    }

    const isAdmin = await contract.methods.isAdmin(address).call();
    if (!isAdmin) return res.send("❌ Bukan admin");

    req.session.admin = address;
    delete req.session.nonce;

    res.redirect("/admin/dashboard");
  } catch (e) {
    console.error(e);
    res.send("Login error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};
