const contract = require("../config/contract");
const web3 = require("../config/web3");

function hash(data) {
  return web3.utils.keccak256(data);
}

/**
 * LIST PASIEN
 */
exports.index = async (req, res) => {
  try {
    const count = await contract.methods.getPatientCount().call();
    const patients = [];

    for (let i = 0; i < count; i++) {
      const p = await contract.methods.getPatientByIndex(i).call();

      if (p.exists) {
        patients.push({
          nikHash: p.nikHash,
          name: p.name,
          addressHash: p.addressHash,
        });
      }
    }

    res.render("patients/index", { patients });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil data pasien");
  }
};

/**
 * ADD PAGE
 */
exports.addPage = (req, res) => {
  res.render("patients/add");
};

/**
 * STORE PASIEN
 */
exports.store = async (req, res) => {
  try {
    const { nik, name, address } = req.body;

    const nikHash = hash(nik);
    const addressHash = hash(address);

    await contract.methods.registerPatient(nikHash, name, addressHash).send({
      from: req.session.admin,
      gas: 300000,
    });

    res.redirect("/admin/patients");
  } catch (err) {
    console.error(err);
    res.send("Gagal tambah pasien");
  }
};

/**
 * DETAIL PASIEN
 */
exports.show = async (req, res) => {
  try {
    const { nikHash } = req.params;
    const p = await contract.methods.patients(nikHash).call();

    if (!p.exists) return res.send("Pasien tidak ditemukan");

    res.render("patients/show", {
      patient: p,
    });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil detail pasien");
  }
};

/**
 * EDIT PAGE
 */
exports.editPage = async (req, res) => {
  try {
    const { nikHash } = req.params;
    const p = await contract.methods.patients(nikHash).call();

    res.render("patients/edit", {
      patient: p,
    });
  } catch (err) {
    console.error(err);
    res.send("Gagal load edit pasien");
  }
};

/**
 * UPDATE PASIEN
 */
exports.update = async (req, res) => {
  try {
    const { nikHash } = req.params;
    const { name, address } = req.body;

    const addressHash = hash(address);

    await contract.methods.updatePatient(nikHash, name, addressHash).send({
      from: req.session.admin,
      gas: 300000,
    });

    res.redirect("/admin/patients");
  } catch (err) {
    console.error(err);
    res.send("Gagal update pasien");
  }
};

/**
 * DELETE PASIEN
 */
exports.destroy = async (req, res) => {
  try {
    const { nikHash } = req.params;

    await contract.methods.deletePatient(nikHash).send({
      from: req.session.admin,
      gas: 200000,
    });

    res.redirect("/admin/patients");
  } catch (err) {
    console.error(err);
    res.send("Gagal hapus pasien");
  }
};
