const contract = require("../config/contract");
const web3 = require("../config/web3");
const { encrypt, decrypt } = require("../utils/crypto");

function hash(data) {
  return web3.utils.keccak256(data);
}

/**
 * LIST MEDICAL RECORD PER PATIENT
 */
exports.index = async (req, res) => {
  try {
    const { patientHash } = req.query;

    // get list pasien
    const patientCount = await contract.methods.getPatientCount().call();

    const patients = [];

    for (let i = 0; i < patientCount; i++) {
      const p = await contract.methods.getPatientByIndex(i).call();

      if (p.exists) {
        patients.push({
          nikHash: p.nikHash,
          name: p.name,
        });
      }
    }

    // if no patient selected, render with empty records
    if (!patientHash) {
      return res.render("medical/index", {
        patients,
        patientHash: null,
        records: [],
      });
    }

    // get medical records for selected patient
    const count = await contract.methods
      .getMedicalRecordCount(patientHash)
      .call({ from: req.session.admin });

    const records = [];

    for (let i = 0; i < count; i++) {
      const r = await contract.methods
        .getMedicalRecord(patientHash, i)
        .call({ from: req.session.admin });

      records.push({
        index: i,
        patientNikHash: r.patientNikHash,
        doctorIdHash: r.doctorIdHash,
        timestamp: Number(r.timestamp),
        decryptedData: decrypt(r.encryptedData),
      });
    }

    res.render("medical/index", {
      patients,
      patientHash,
      records,
    });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil rekam medis");
  }
};

/**
 * ADD PAGE
 */
exports.addPage = async (req, res) => {
  try {
    const { patientHash } = req.query;

    if (!patientHash) {
      return res.redirect("/admin/medical");
    }

    //get list doctors
    const doctorCount = await contract.methods.getDoctorCount().call();

    const doctors = [];

    for (let i = 0; i < doctorCount; i++) {
      const d = await contract.methods.getDoctorByIndex(i).call();

      if (d.exists) {
        doctors.push({
          doctorIdHash: d.doctorIdHash,
          name: d.name,
          specialization: d.specialization,
        });
      }
    }

    res.render("medical/add", {
      patientHash,
      doctors,
    });
  } catch (err) {
    console.error(err);
    res.send("Gagal load form rekam medis");
  }
};

/**
 * STORE MEDICAL RECORD
 */
/**
 * STORE MEDICAL RECORD
 */
exports.store = async (req, res) => {
  try {
    const {
      patientHash,
      doctorHash, // <--- INI BIANG KEROKNYA KALO KOSONG
      diagnosis,
      treatment,
      tension,
      weight,
      height,
      pulse,
    } = req.body;

    // --- VALIDASI TAMBAHAN ---
    // Cek kalo doctorHash kosong
    if (!doctorHash || doctorHash.trim() === "") {
      console.error("Error: Doctor Hash kosong!");
      // Bisa redirect balik atau kasih pesan error
      return res.send(
        "Gagal: Mohon pilih Dokter terlebih dahulu sebelum menyimpan!"
      );
    }
    // -------------------------

    const plainData = JSON.stringify({
      vitals: {
        tension,
        weight,
        height,
        pulse,
      },
      diagnosis,
      treatment,
    });

    const encryptedData = encrypt(plainData);
    const dataHash = hash(plainData);

    await contract.methods
      .addMedicalRecord(patientHash, doctorHash, encryptedData, dataHash)
      .send({
        from: req.session.admin,
        gas: 500000,
      });

    res.redirect(`/admin/medical?patientHash=${patientHash}`);
  } catch (err) {
    console.error(err);
    res.send("Gagal tambah rekam medis: " + err.message);
  }
};

/**
 * DETAIL MEDICAL RECORD
 */
exports.show = async (req, res) => {
  try {
    const { patientHash, index } = req.params;

    const r = await contract.methods
      .getMedicalRecord(patientHash, index)
      .call({ from: req.session.admin });

    res.render("medical/show", {
      record: {
        patientNikHash: r.patientNikHash,
        doctorIdHash: r.doctorIdHash,
        timestamp: Number(r.timestamp),
        decryptedData: decrypt(r.encryptedData),
      },
    });
  } catch (err) {
    console.error(err);
    res.send("Gagal ambil detail rekam medis");
  }
};
