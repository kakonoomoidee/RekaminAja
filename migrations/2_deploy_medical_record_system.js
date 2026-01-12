const MedicalRecordSystem = artifacts.require("MedicalRecordSystem");

module.exports = function (deployer) {
  deployer.deploy(MedicalRecordSystem, "admin_institusi");
};
