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
    address[] public doctorsWithAccess; // Liste des adresses des médecins ayant accès

    constructor() {
        patient = msg.sender; // Le patient est le créateur du contrat
    }

    modifier onlyPatient() {
        require(msg.sender == patient, "Only the patient can manage permissions");
        _;
    }

    // Fonction pour accorder l'accès à un médecin
    function grantAccess(address doctor, uint256 duration) public onlyPatient {
        // Si le médecin n'est pas déjà dans la liste, on l'ajoute
        if (!permissions[doctor].canAccess) {
            doctorsWithAccess.push(doctor);
        }
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

    // Fonction pour récupérer la liste des médecins ayant encore accès
    function getDoctorsWithAccess() public view returns (address[] memory) {
        address[] memory validDoctors = new address[](doctorsWithAccess.length);
        uint256 count = 0;

        for (uint256 i = 0; i < doctorsWithAccess.length; i++) {
            if (permissions[doctorsWithAccess[i]].canAccess && block.timestamp <= permissions[doctorsWithAccess[i]].validUntil) {
                validDoctors[count] = doctorsWithAccess[i];
                count++;
            }
        }

        // Réduire la taille du tableau pour correspondre au nombre réel de médecins valides
        assembly {
            mstore(validDoctors, count)
        }

        return validDoctors;
    }
}
