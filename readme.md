# 🏥 RekaminAja

**Blockchain-Based Medical Record Management System**

RekaminAja adalah aplikasi web berbasis **Blockchain (Ethereum)** yang digunakan untuk mengelola **data pasien, dokter, dan rekam medis** secara **aman, terverifikasi, dan immutable**. Sistem ini dirancang dengan pendekatan **on-chain data integrity** dan **off-chain encryption**, sehingga hanya **admin yang berwenang** yang dapat mengakses isi rekam medis.

---

## ✨ Fitur Utama

### 🔐 Autentikasi Admin

- Login menggunakan **private key Ethereum**
- Tidak menggunakan username/password konvensional
- Autentikasi berbasis signature blockchain

### 👨‍⚕️ Manajemen Dokter

- Tambah data dokter
- Edit data dokter
- Hapus data dokter
- Lihat daftar dokter

### 🧑‍🤝‍🧑 Manajemen Pasien

- NIK disimpan dalam bentuk **hash (keccak256)**
- Alamat pasien juga di-hash untuk menjaga privasi
- CRUD data pasien

### 📄 Rekam Medis (Immutable)

- Rekam medis **tidak dapat diubah atau dihapus**
- Data rekam medis dienkripsi sebelum disimpan
- Validasi integritas data menggunakan hash

---

## 🧠 Arsitektur Sistem

```
Admin
  ↓
Express.js + EJS (MVC)
  ↓
Web3.js
  ↓
Smart Contract (Solidity)
  ↓
Ganache (Local Blockchain)
```

---

## 🔗 Teknologi yang Digunakan

| Layer       | Teknologi           |
| ----------- | ------------------- |
| Frontend    | EJS, Tailwind CSS   |
| Backend     | Node.js, Express.js |
| Blockchain  | Solidity, Ethereum  |
| Framework   | Truffle             |
| Local Chain | Ganache             |
| Crypto      | Web3.js, AES        |
| Session     | express-session     |

---

## 📂 Struktur Folder

```
RekaminAja/
├── app/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   ├── views/
│   └── app.js
├── contracts/
│   └── MedicalRecordSystem.sol
├── migrations/
├── truffle-config.js
├── .env
└── README.md
```

---

## ⚙️ Instalasi & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/kakonoomoidee/RekaminAja.git
cd RekaminAja
```

### 2️⃣ Install Dependency

```bash
npm install
```

### 3️⃣ Jalankan Ganache

- RPC: `http://127.0.0.1:7545`
- Chain ID: `1337`

### 4️⃣ Deploy Smart Contract

```bash
truffle compile
truffle migrate --reset
```

---

## 🔐 Environment Variable

Buat file `.env`:

```env
PORT=3000
SESSION_SECRET=rekaminaja_secret
GANACHE_RPC=http://127.0.0.1:7545
ADMIN_PRIVATE_KEY=0x...
MEDICAL_SECRET=rekaxxxxx
```

---

## ▶️ Menjalankan Aplikasi

```bash
node app/app.js
```

Akses aplikasi melalui browser:

```
http://localhost:3000
```

---

## 🛡️ Keamanan Data

- Data sensitif pasien disimpan dalam bentuk **hash**
- Rekam medis dienkripsi menggunakan **AES**
- Blockchain hanya menyimpan data terenkripsi
- Rekam medis bersifat **immutable**

---

## 📜 Smart Contract Highlight

```solidity
function addMedicalRecord(
    bytes32 patientNikHash,
    bytes32 doctorIdHash,
    string calldata encryptedData,
    bytes32 dataHash
) external onlyAdmin;
```

---

## 🎯 Tujuan Proyek

- Menjaga integritas rekam medis
- Mencegah manipulasi data medis
- Implementasi blockchain pada sistem kesehatan
- Media pembelajaran Web3 dan Smart Contract

---

## 👨‍💻 Author

**RekaminAja**
Blockchain Project – Semester 7
Program Studi Teknologi Informasi

---

> ⚠️ Proyek ini dibuat untuk keperluan akademik.
> Tidak direkomendasikan untuk penggunaan produksi tanpa audit keamanan.
