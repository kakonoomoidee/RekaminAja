const contract = require("../config/contract");
const web3 = require("../config/web3");

// Mapping Kode Poli (Harus sama persis text-nya dengan dropdown di UI)
const poliCodes = {
  "Poli Umum": "01",
  "Poli VCT & PDP": "02",
  "Poli Gigi & Mulut": "03",
  "Poli Bedah Umum": "04",
  "Poli Bedah Orthopedi": "05",
  "Poli Penyakit Dalam": "06",
  "Poli Kebidanan & Kandungan": "07",
  "Poli Anak": "08",
  "Poli Saraf": "09",
  "Poli Urologi": "10",
  "Poli THT": "11",
  "Poli Mata": "12",
  "Poli Psikiatri": "13",
  "Poli Kulit & Kelamin": "14",
  "Poli Rehab Medik": "15",
  "Poli Jantung & Pembuluh Darah": "16",
};

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
 * STORE DOKTER (AUTO ID GENERATOR)
 */
exports.store = async (req, res) => {
  try {
    // Kita cuma ambil name & specialization, ID-nya kita bikin sendiri
    const { name, specialization } = req.body;
    const adminAccount = req.session.admin;

    console.log(`🤖 Generating ID for: ${name} (${specialization})...`);

    // 1. Hitung urutan dokter di poli tersebut
    const totalDoctors = await contract.methods.getDoctorCount().call();
    let poliCount = 0;

    // Loop semua dokter utk hitung yang punya spesialisasi sama
    // (Note: Idealnya smart contract punya counter per poli, tapi cara ini oke buat skala kecil)
    for (let i = 0; i < totalDoctors; i++) {
      const doc = await contract.methods.getDoctorByIndex(i).call();
      if (doc.specialization === specialization) {
        poliCount++;
      }
    }

    // 2. Generate ID Format: DOC-[KODE]-[URUTAN]
    const code = poliCodes[specialization] || "99"; // 99 default kalo ga ketemu
    const sequence = (poliCount + 1).toString().padStart(3, "0"); // jadi 001, 002
    const autoDoctorId = `DOC-${code}-${sequence}`;

    console.log(`✅ ID Generated: ${autoDoctorId}`);

    // 3. Estimasi Gas (Safety buat Web3 v4)
    const gasEstimate = await contract.methods
      .registerDoctor(autoDoctorId, name, specialization)
      .estimateGas({ from: adminAccount });

    // Konversi BigInt ke String Integer + Buffer 20%
    const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

    // 4. Eksekusi Transaksi
    await contract.methods
      .registerDoctor(autoDoctorId, name, specialization)
      .send({
        from: adminAccount,
        gas: gasLimit,
      });

    console.log("🎉 Dokter berhasil ditambahkan ke Blockchain");
    res.redirect("/admin/doctors");
  } catch (err) {
    console.error("❌ Error Add Doctor:", err);
    // Tampilkan error di browser biar tau kenapa
    res.status(500).send("Gagal tambah dokter: " + (err.message || err));
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

    // Estimasi gas dulu
    const gasEstimate = await contract.methods
      .updateDoctor(doctorIdHash, name, specialization)
      .estimateGas({ from: req.session.admin });

    const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

    await contract.methods
      .updateDoctor(doctorIdHash, name, specialization)
      .send({
        from: req.session.admin,
        gas: gasLimit,
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

    const gasEstimate = await contract.methods
      .deleteDoctor(doctorIdHash)
      .estimateGas({ from: req.session.admin });

    const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

    await contract.methods.deleteDoctor(doctorIdHash).send({
      from: req.session.admin,
      gas: gasLimit,
    });

    res.redirect("/admin/doctors");
  } catch (err) {
    console.error(err);
    res.send("Gagal hapus dokter");
  }
};
