require("dotenv").config(); // Load environment variables
const web3 = require("../config/web3");
const contract = require("../config/contract");

// Helper untuk hashing
const hash = (data) => web3.utils.keccak256(data);

// 40+ Data Dummy Pasien
const patientData = [
  // Batch 1: Umum
  {
    nik: "3201120101900001",
    name: "Budi Santoso",
    address: "Jl. Merdeka No. 45, Bandung",
  },
  {
    nik: "3201124505920002",
    name: "Siti Aminah",
    address: "Komp. Permata Hijau Blok A2, Jakarta",
  },
  {
    nik: "3204081212850003",
    name: "Rizki Pratama",
    address: "Jl. Diponegoro No. 10, Surabaya",
  },
  {
    nik: "3273206503980004",
    name: "Dewi Lestari",
    address: "Gg. Melati No. 5, Yogyakarta",
  },
  {
    nik: "3205112010880005",
    name: "Agus Kurniawan",
    address: "Jl. Jendral Sudirman Kav. 50, Jakarta",
  },

  // Batch 2: Modern
  {
    nik: "3216065507950006",
    name: "Ratna Sari",
    address: "Perumahan Griya Indah No. 88, Bekasi",
  },
  {
    nik: "3201121010000007",
    name: "Doni Haryanto",
    address: "Jl. Kebon Jeruk No. 12, Jakarta Barat",
  },
  {
    nik: "3209126002930008",
    name: "Maya Putri",
    address: "Jl. Asia Afrika No. 99, Bandung",
  },
  {
    nik: "3671020505800009",
    name: "Eko Prasetyo",
    address: "Jl. Raya Bogor KM 30, Depok",
  },
  {
    nik: "3275015509990010",
    name: "Indah Permatasari",
    address: "Jl. Pahlawan Seribu, Tangerang Selatan",
  },

  // Batch 3: Jawa Tengah & Timur
  {
    nik: "3301120101850011",
    name: "Joko Widodo",
    address: "Jl. Slamet Riyadi No. 1, Solo",
  },
  {
    nik: "3302234506900012",
    name: "Sri Mulyani",
    address: "Jl. Pemuda No. 45, Semarang",
  },
  {
    nik: "3504081212880013",
    name: "Bambang Pamungkas",
    address: "Jl. Darmo No. 12, Surabaya",
  },
  {
    nik: "3573206503950014",
    name: "Tri Rismaharini",
    address: "Jl. Tunjungan No. 55, Surabaya",
  },
  {
    nik: "3305112010920015",
    name: "Ganjar Pranowo",
    address: "Jl. Pahlawan No. 9, Semarang",
  },

  // Batch 4: Sumatera
  {
    nik: "1206065507890016",
    name: "Sutan Syahrir",
    address: "Jl. Medan Merdeka No. 8, Medan",
  },
  {
    nik: "1301121010910017",
    name: "Cut Nyak Dien",
    address: "Jl. Teuku Umar No. 10, Banda Aceh",
  },
  {
    nik: "1409126002870018",
    name: "Imam Bonjol",
    address: "Jl. Sudirman No. 20, Padang",
  },
  {
    nik: "1671020505850019",
    name: "Raden Intan",
    address: "Jl. Raden Intan No. 5, Bandar Lampung",
  },
  {
    nik: "1575015509960020",
    name: "Sultan Mahmud",
    address: "Jl. Sultan Mahmud No. 1, Palembang",
  },

  // Batch 5: Kalimantan & Sulawesi
  {
    nik: "6401120101930021",
    name: "Mulawarman",
    address: "Jl. Mulawarman No. 45, Samarinda",
  },
  {
    nik: "7201124505950022",
    name: "Hasanuddin",
    address: "Jl. Pantai Losari No. 10, Makassar",
  },
  {
    nik: "7304081212900023",
    name: "Sam Ratulangi",
    address: "Jl. Sam Ratulangi No. 12, Manado",
  },
  {
    nik: "6273206503970024",
    name: "Tjilik Riwut",
    address: "Jl. Tjilik Riwut No. 5, Palangkaraya",
  },
  {
    nik: "7105112010890025",
    name: "Pattimura",
    address: "Jl. Pattimura No. 1, Ambon",
  },

  // Batch 6: Sunda
  {
    nik: "3204065507940026",
    name: "Asep Sunandar",
    address: "Jl. Braga No. 88, Bandung",
  },
  {
    nik: "3205121010980027",
    name: "Cecep Gorbachev",
    address: "Jl. Cihampelas No. 12, Bandung",
  },
  {
    nik: "3206126002910028",
    name: "Lilis Karlina",
    address: "Jl. Cibaduyut No. 99, Bandung",
  },
  {
    nik: "3207020505830029",
    name: "Kabayan",
    address: "Kp. Dukuh, Tasikmalaya",
  },
  { nik: "3208015509970030", name: "Iteung", address: "Kp. Naga, Garut" },

  // Batch 7: Gen Z / Modern Names
  {
    nik: "3171120101000031",
    name: "Kevin Sanjaya",
    address: "Apartemen Mediterania, Jakarta",
  },
  {
    nik: "3172124505010032",
    name: "Marcus Gideon",
    address: "PIK Cluster Walet, Jakarta",
  },
  {
    nik: "3173081212020033",
    name: "Jessica Mila",
    address: "Kemang Village, Jakarta",
  },
  {
    nik: "3174206503030034",
    name: "Reza Rahadian",
    address: "Pondok Indah, Jakarta",
  },
  {
    nik: "3175112010040035",
    name: "Maudy Ayunda",
    address: "Menteng, Jakarta",
  },

  // Batch 8: Random Mix
  {
    nik: "5101065507960036",
    name: "I Wayan Balik",
    address: "Jl. Legian No. 88, Bali",
  },
  {
    nik: "5102121010990037",
    name: "Ni Luh Putu",
    address: "Jl. Ubud No. 12, Bali",
  },
  {
    nik: "5203126002940038",
    name: "Lalu Muhammad",
    address: "Jl. Mataram No. 99, Lombok",
  },
  {
    nik: "5304020505860039",
    name: "Frans Seda",
    address: "Jl. El Tari No. 5, Kupang",
  },
  {
    nik: "9105015509980040",
    name: "Marthen Indey",
    address: "Jl. Sentani No. 1, Jayapura",
  },
];

const seedPatients = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];

    if (!adminAccount)
      throw new Error("❌ Admin Account not found on Ganache!");

    const netId = await web3.eth.net.getId();
    console.log(
      `\n🚀 Starting PATIENT SEED (40+ Data) on Network ID: ${netId}`
    );
    console.log(`👤 Admin Account: ${adminAccount}`);

    if (!contract.options.address)
      throw new Error("❌ Contract Address kosong!");
    console.log(`📝 Contract Address: ${contract.options.address}\n`);

    let totalRegistered = 0;

    for (const p of patientData) {
      const nikHash = hash(p.nik);
      const addressHash = hash(p.address);

      process.stdout.write(
        `👉 [${totalRegistered + 1}/${patientData.length}] Registering: ${
          p.name
        }... `
      );

      try {
        const gasEstimate = await contract.methods
          .registerPatient(nikHash, p.name, addressHash)
          .estimateGas({ from: adminAccount });

        const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

        await contract.methods
          .registerPatient(nikHash, p.name, addressHash)
          .send({ from: adminAccount, gas: gasLimit });

        console.log(`✅ OK`);
        totalRegistered++;
        await new Promise((r) => setTimeout(r, 20)); // Delay dikit biar ga keselek
      } catch (err) {
        const msg = err.message || "";
        if (msg.includes("Patient exists") || msg.includes("revert")) {
          console.log(`⚠️  SKIP (Udah Ada)`);
        } else {
          console.log(`\n     ❌ FAILED: ${msg.split("\n")[0]}`);
        }
      }
    }

    console.log(
      `\n🎉 MISSION ACCOMPLISHED! Total Pasien Terdaftar: ${totalRegistered}`
    );
    process.exit(0);
  } catch (error) {
    console.error("\n💀 SEEDING ERROR:", error.message);
    process.exit(1);
  }
};

seedPatients();
