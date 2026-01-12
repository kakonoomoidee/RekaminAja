const contract = require("../config/contract");
const web3 = require("../config/web3");

function hash(data) {
  return web3.utils.keccak256(data);
}

/**
 * LIST DOKTER
 */
exports.index = async (req, res) => {
  try {
    const count = await contract.methods.getDoctorCount().call();
    const doctors = [];

    for (let i = 0; i < count; i++) {
      const d = await contract.methods.getDoctorByIndex(i).call();

      if (d.exists) {
        doctors.push({
          doctorIdHash: d.doctorIdHash,
          doctorId: d.doctorId,
          name: d.name,
          specialization: d.specialization,
        });
      }
    }

    res.render("doctors/index", { doctors });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil data dokter");
  }
};

/**
 * ADD PAGE
 */
exports.addPage = (req, res) => {
  res.render("doctors/add");
};

/**
 * STORE DOKTER
 */
exports.store = async (req, res) => {
  try {
    const { doctorId, name, specialization } = req.body;

    await contract.methods.registerDoctor(doctorId, name, specialization).send({
      from: req.session.admin,
      gas: 300000,
    });

    res.redirect("/admin/doctors");
  } catch (err) {
    console.error(err);
    res.send("Gagal tambah dokter");
  }
};

/**
 * DETAIL DOKTER
 */
exports.show = async (req, res) => {
  try {
    const { doctorIdHash } = req.params;
    const d = await contract.methods.doctors(doctorIdHash).call();

    if (!d.exists) return res.send("Dokter tidak ditemukan");

    res.render("doctors/show", { doctor: d });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil detail dokter");
  }
};

/**
 * EDIT PAGE
 */
exports.editPage = async (req, res) => {
  try {
    const { doctorIdHash } = req.params;
    const d = await contract.methods.doctors(doctorIdHash).call();

    res.render("doctors/edit", { doctor: d });
  } catch (err) {
    console.error(err);
    res.send("Gagal load edit dokter");
  }
};

/**
 * UPDATE DOKTER
 */
exports.update = async (req, res) => {
  try {
    const { doctorIdHash } = req.params;
    const { name, specialization } = req.body;

    await contract.methods
      .updateDoctor(doctorIdHash, name, specialization)
      .send({
        from: req.session.admin,
        gas: 300000,
      });

    res.redirect("/admin/doctors");
  } catch (err) {
    console.error(err);
    res.send("Gagal update dokter");
  }
};

/**
 * DELETE DOKTER
 */
exports.destroy = async (req, res) => {
  try {
    const { doctorIdHash } = req.params;

    await contract.methods.deleteDoctor(doctorIdHash).send({
      from: req.session.admin,
      gas: 200000,
    });

    res.redirect("/admin/doctors");
  } catch (err) {
    console.error(err);
    res.send("Gagal hapus dokter");
  }
};
