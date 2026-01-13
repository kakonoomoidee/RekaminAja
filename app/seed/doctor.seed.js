require("dotenv").config(); // Load environment variables
const web3 = require("../config/web3");
const contract = require("../config/contract");

// Data Dokter (Sama persis kayak request Yang Mulia)
const doctorData = [
  {
    poli: "Poli Umum",
    code: "01",
    docs: [
      "dr. Marisa",
      "dr. Vitria Puspita Arum",
      "dr. Prila Anggita M",
      "dr. Melvanda Gisela Putri",
    ],
  },
  {
    poli: "Poli VCT & PDP",
    code: "02",
    docs: ["dr. Vitria Puspita Arum", "dr. Fitriandi, Sp. PD"],
  },
  {
    poli: "Poli Gigi & Mulut",
    code: "03",
    docs: [
      "drg. Irma Frimayanti Y",
      "drg. Mirza Muttaqin",
      "drg. Elsa Wahyudi",
      "drg. Indri Herdiyani",
      "drg. Sieska Olivya F",
      "drg. Detin Nitami, Sp. Pros",
    ],
  },
  {
    poli: "Poli Bedah Umum",
    code: "04",
    docs: [
      "dr. Atang Kosasih, Sp. B",
      "dr. R. Ilham Syamsudin, Sp. B",
      "dr. Deddy Kurniawan, Sp. B",
      "dr. Dwitya Budhi Sardjana, Sp. B",
    ],
  },
  {
    poli: "Poli Bedah Orthopedi",
    code: "05",
    docs: ["dr. Magie Kusumah W., Sp. OT"],
  },
  {
    poli: "Poli Penyakit Dalam",
    code: "06",
    docs: [
      "dr. Henhen Heryaman, Sp. PD",
      "dr. Muh Fitriandi Budiman, Sp. PD",
      "dr. Apen Apgani R., Sp. PD",
      "dr. Ayatullah Khomaini, Sp. PD",
    ],
  },
  {
    poli: "Poli Kebidanan & Kandungan",
    code: "07",
    docs: [
      "dr. A. Munawar Giandra, Sp. OG",
      "dr. Arif Tribawono, Sp. OG",
      "dr. Asri Kurnia Dewi, Sp. OG",
    ],
  },
  {
    poli: "Poli Anak",
    code: "08",
    docs: ["dr. Nia Kania, Sp.A, M.Kes", "dr. Jujun J. Gartijana, Sp.A, M.Kes"],
  },
  {
    poli: "Poli Saraf",
    code: "09",
    docs: [
      "dr. Ihrul Prianza Prajitno, Sp.S",
      "dr. Nurul Ihsanah Susilowati, Sp.S",
    ],
  },
  {
    poli: "Poli Urologi",
    code: "10",
    docs: ["dr. Stephen Kuswanto, Sp. U"],
  },
  {
    poli: "Poli THT",
    code: "11",
    docs: ["dr. Endang Suherlan, Sp.THT-KL", "dr. Ifiq Budiyan Nazar, Sp.THT"],
  },
  {
    poli: "Poli Mata",
    code: "12",
    docs: ["dr. Dian Andriani, Sp.M"],
  },
  {
    poli: "Poli Psikiatri",
    code: "13",
    docs: ["dr. Nurlita Triani, Sp.KJ", "dr. Rozaq Noor Hakim, Sp.KJ"],
  },
  {
    poli: "Poli Kulit & Kelamin",
    code: "14",
    docs: ["dr. Anie Daryulina, Sp.KK", "dr. Nur Mala Il A'la, Sp.DVE"],
  },
  {
    poli: "Poli Rehab Medik",
    code: "15",
    docs: ["dr. Susan Salsabila, Sp.KFR", "dr. Husna Lathifa, Sp.KFR"],
  },
  {
    poli: "Poli Jantung & Pembuluh Darah",
    code: "16",
    docs: ["dr. Ria Ristianis, Sp.JP FIHA"],
  },
];

const seedDoctors = async () => {
  try {
    // 1. Get Accounts (Ambil akun pertama dari Ganache)
    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];

    // Validasi Akun Admin biar ga "undefined"
    if (!adminAccount) {
      throw new Error(
        "❌ GAGAL: Tidak bisa mengambil akun Admin. Pastikan Ganache nyala & port 7545 bener!"
      );
    }

    const netId = await web3.eth.net.getId();
    console.log(`\n🚀 Starting seed on Network ID: ${netId}`);
    console.log(`👤 Admin Account: ${adminAccount}`);

    // Validasi Contract Address
    if (!contract.options.address) {
      throw new Error(
        "❌ GAGAL: Contract Address kosong! Cek file .env Yang Mulia."
      );
    }
    console.log(`📝 Contract Address: ${contract.options.address}\n`);

    let totalRegistered = 0;

    for (const category of doctorData) {
      console.log(`👉 Processing: ${category.poli}...`);

      for (let i = 0; i < category.docs.length; i++) {
        const docName = category.docs[i];
        const docIndex = (i + 1).toString().padStart(3, "0");
        const docId = `DOC-${category.code}-${docIndex}`;

        process.stdout.write(`   - Registering: ${docId} | ${docName}... `);

        try {
          // 1. Estimasi Gas (Ini return BigInt di Web3 v4)
          const gasEstimate = await contract.methods
            .registerDoctor(docId, docName, category.poli)
            .estimateGas({ from: adminAccount });

          // 2. Konversi BigInt ke Number -> Kali Buffer -> Balikin ke String Integer
          // Ini solusi "Cannot mix BigInt" error
          const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

          // 3. Eksekusi
          await contract.methods
            .registerDoctor(docId, docName, category.poli)
            .send({
              from: adminAccount,
              gas: gasLimit,
            });

          console.log(`✅ OK`);
          totalRegistered++;

          // Delay dikit biar terminal gak pusing (50ms)
          await new Promise((r) => setTimeout(r, 50));
        } catch (err) {
          // Tangkap error spesifik dari smart contract
          // Kalo errornya karena "Doctor exists", kita anggep skip aja
          const msg = err.message || "";
          if (msg.includes("Doctor exists") || msg.includes("revert")) {
            console.log(`⚠️  SKIP (Udah Ada)`);
          } else {
            // Kalo error lain (koneksi dll), baru tampilin merah
            console.log(`\n     ❌ FAILED: ${msg.split("\n")[0]}`);
          }
        }
      }
    }

    console.log(
      `\n🎉 SEEDING SELESAI! Total Dokter Sukses Terdaftar: ${totalRegistered}`
    );
    process.exit(0);
  } catch (error) {
    console.error("\n💀 SEEDING CRITICAL ERROR:", error.message);
    process.exit(1);
  }
};

// Execute
seedDoctors();
