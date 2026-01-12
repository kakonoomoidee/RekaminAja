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

    modifier onlyAdmin() {
        require(admins[msg.sender].exists, "Not authorized admin");
        _;
    }

    constructor(string memory _username) {
        admins[msg.sender] = Admin(
            _username,
            msg.sender,
            block.timestamp,
            true
        );
    }

    function isAdmin(address account) external view returns (bool) {
        return admins[account].exists;
    }

    /* ========== DOCTOR ========== */

    struct Doctor {
        bytes32 doctorIdHash;
        string doctorId;
        string name;
        string specialization;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => Doctor) public doctors;
    bytes32[] private doctorIndex;

    function registerDoctor(
        string calldata doctorId,
        string calldata name,
        string calldata specialization
    ) external onlyAdmin {
        bytes32 hashId = keccak256(abi.encodePacked(doctorId));
        require(!doctors[hashId].exists, "Doctor exists");

        doctors[hashId] = Doctor(
            hashId,
            doctorId,
            name,
            specialization,
            block.timestamp,
            true
        );

        doctorIndex.push(hashId);
    }

    function updateDoctor(
        bytes32 doctorIdHash,
        string calldata name,
        string calldata specialization
    ) external onlyAdmin {
        require(doctors[doctorIdHash].exists, "Doctor not found");

        doctors[doctorIdHash].name = name;
        doctors[doctorIdHash].specialization = specialization;
    }

    function deleteDoctor(bytes32 doctorIdHash) external onlyAdmin {
        require(doctors[doctorIdHash].exists, "Doctor not found");
        doctors[doctorIdHash].exists = false;
    }

    function getDoctorCount() external view returns (uint256) {
        return doctorIndex.length;
    }

    function getDoctorByIndex(
        uint256 index
    ) external view returns (Doctor memory) {
        require(index < doctorIndex.length, "Index out of bounds");
        return doctors[doctorIndex[index]];
    }

    /* ========== PATIENT ========== */

    struct Patient {
        bytes32 nikHash;
        string name;
        bytes32 addressHash;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => Patient) public patients;
    bytes32[] private patientIndex;

    function registerPatient(
        bytes32 nikHash,
        string calldata name,
        bytes32 addressHash
    ) external onlyAdmin {
        require(!patients[nikHash].exists, "Patient exists");

        patients[nikHash] = Patient(
            nikHash,
            name,
            addressHash,
            block.timestamp,
            true
        );

        patientIndex.push(nikHash);
    }

    function updatePatient(
        bytes32 nikHash,
        string calldata name,
        bytes32 addressHash
    ) external onlyAdmin {
        require(patients[nikHash].exists, "Patient not found");

        patients[nikHash].name = name;
        patients[nikHash].addressHash = addressHash;
    }

    function deletePatient(bytes32 nikHash) external onlyAdmin {
        require(patients[nikHash].exists, "Patient not found");
        patients[nikHash].exists = false;
    }

    function getPatientCount() external view returns (uint256) {
        return patientIndex.length;
    }

    function getPatientByIndex(
        uint256 index
    ) external view returns (Patient memory) {
        require(index < patientIndex.length, "Index out of bounds");
        return patients[patientIndex[index]];
    }

    /* ========== MEDICAL RECORD (IMMUTABLE) ========== */

    struct MedicalRecord {
        bytes32 patientNikHash;
        bytes32 doctorIdHash;
        string encryptedData;
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(bytes32 => MedicalRecord[]) private medicalRecords;

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
    ) external view onlyAdmin returns (MedicalRecord memory) {
        require(index < medicalRecords[patientNikHash].length, "Out of bounds");
        return medicalRecords[patientNikHash][index];
    }
}
