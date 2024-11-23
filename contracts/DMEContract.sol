// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DMEContract {
    struct Permission {
        address doctor;
        uint256 validUntil;
        bool canAccess;
    }

    mapping(address => Permission) public permissions;
    address public patient;

    constructor() {
        patient = msg.sender; // Le patient est le créateur du contrat
    }

    modifier onlyPatient() {
        require(msg.sender == patient, "Only the patient can manage permissions");
        _;
    }

    // Fonction pour gérer l'accès d'un médecin
    function grantAccess(address doctor, uint256 duration) public onlyPatient {
        permissions[doctor] = Permission(doctor, block.timestamp + duration, true);
    }

    // Fonction pour révoquer l'accès d'un médecin
    function revokeAccess(address doctor) public onlyPatient {
        permissions[doctor].canAccess = false;
    }

    // Fonction pour vérifier si un médecin peut accéder aux DME
    function canAccess(address doctor) public view returns (bool) {
        Permission memory permission = permissions[doctor];
        return permission.canAccess && block.timestamp <= permission.validUntil;
    }
}
