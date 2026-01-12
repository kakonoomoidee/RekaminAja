// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecordSystem {
    /* ========== ADMIN ========== */

    struct Admin {
        string username;
        address publicKey;
        uint256 registeredAt;
        bool exists;
    }

    mapping(address => Admin) public admins;

    /* ========== DOCTOR ========== */

    struct Doctor {
        string doctorId;
        string name;
        string specialization;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => Doctor) public doctors;

    /* ========== PATIENT ========== */

    struct Patient {
        bytes32 nikHash;
        string name;
        bytes32 addressHash;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => Patient) public patients;

    /* ========== MEDICAL RECORD ========== */

    struct MedicalRecord {
        bytes32 patientNikHash;
        bytes32 doctorIdHash;
        string encryptedData;
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(bytes32 => MedicalRecord[]) private medicalRecords;

    /* ========== MODIFIERS ========== */

    modifier onlyAdmin() {
        require(admins[msg.sender].exists, "Not authorized admin");
        _;
    }

    /* ========== CONSTRUCTOR ========== */

    constructor(string memory _username) {
        Admin storage admin = admins[msg.sender];
        admin.username = _username;
        admin.publicKey = msg.sender;
        admin.registeredAt = block.timestamp;
        admin.exists = true;
    }

    /* ========== ADMIN FUNCTIONS ========== */

    function registerAdmin(
        address adminAddress,
        string calldata username
    ) external onlyAdmin {
        Admin storage admin = admins[adminAddress];
        admin.username = username;
        admin.publicKey = adminAddress;
        admin.registeredAt = block.timestamp;
        admin.exists = true;
    }

    function isAdmin(address account) external view returns (bool) {
        return admins[account].exists;
    }

    /* ========== DOCTOR FUNCTIONS ========== */

    function registerDoctor(
        string calldata doctorId,
        string calldata name,
        string calldata specialization
    ) external onlyAdmin {
        bytes32 doctorHash = keccak256(abi.encodePacked(doctorId));

        Doctor storage doctor = doctors[doctorHash];
        doctor.doctorId = doctorId;
        doctor.name = name;
        doctor.specialization = specialization;
        doctor.registeredAt = block.timestamp;
        doctor.exists = true;
    }

    function getDoctor(
        bytes32 doctorIdHash
    ) external view returns (Doctor memory) {
        return doctors[doctorIdHash];
    }

    /* ========== PATIENT FUNCTIONS ========== */

    function registerPatient(
        bytes32 nikHash,
        string calldata name,
        bytes32 addressHash
    ) external onlyAdmin {
        Patient storage patient = patients[nikHash];
        patient.nikHash = nikHash;
        patient.name = name;
        patient.addressHash = addressHash;
        patient.registeredAt = block.timestamp;
        patient.exists = true;
    }

    function getPatient(
        bytes32 nikHash
    ) external view returns (Patient memory) {
        return patients[nikHash];
    }

    /* ========== MEDICAL RECORD FUNCTIONS ========== */

    function addMedicalRecord(
        bytes32 patientNikHash,
        bytes32 doctorIdHash,
        string calldata encryptedData,
        bytes32 dataHash
    ) external onlyAdmin {
        require(patients[patientNikHash].exists, "Patient not found");
        require(doctors[doctorIdHash].exists, "Doctor not found");

        medicalRecords[patientNikHash].push(
            MedicalRecord(
                patientNikHash,
                doctorIdHash,
                encryptedData,
                dataHash,
                block.timestamp
            )
        );
    }

    function getMedicalRecordCount(
        bytes32 patientNikHash
    ) external view onlyAdmin returns (uint256) {
        return medicalRecords[patientNikHash].length;
    }

    function getMedicalRecord(
        bytes32 patientNikHash,
        uint256 index
    )
        external
        view
        onlyAdmin
        returns (bytes32, bytes32, string memory, bytes32, uint256)
    {
        MedicalRecord memory record = medicalRecords[patientNikHash][index];
        return (
            record.patientNikHash,
            record.doctorIdHash,
            record.encryptedData,
            record.dataHash,
            record.timestamp
        );
    }
}
