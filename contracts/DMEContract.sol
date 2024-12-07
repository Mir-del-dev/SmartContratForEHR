// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DMEContract {
    struct Permission {
        address doctor;
        uint256 validUntil;
        bool canAccess;
        string doctorName;
        string[] cids; // Liste des fichiers accessibles par le médecin
    }
     struct File {
        string cid; // CID du fichier (hash IPFS)
        string fileType; // Type de fichier (ex : "Consultation", "Test COVID", etc.)
    }

    mapping(address => Permission) public permissions;
    address public patient;
    File[] public files;
    address[] public doctorsWithAccess; // Liste des adresses des médecins ayant accès

    constructor() {
        patient = msg.sender; // Le patient est le créateur du contrat
    }

    modifier onlyPatient() {
        require(msg.sender == patient, "Only the patient can manage permissions");
        _;
    }

    // Fonction pour accorder l'accès à un médecin
     function grantAccess(
        address doctor,
        uint256 duration,
        string memory doctorName,
        string[] memory cids
    ) public onlyPatient {
        if (!permissions[doctor].canAccess) {
            doctorsWithAccess.push(doctor);
        }
        permissions[doctor] = Permission({
            doctor: doctor,
            validUntil: block.timestamp + duration,
            canAccess: true,
            doctorName: doctorName,
            cids: cids
        });
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
   function getDoctorsWithAccess() public view returns (address[] memory, string[] memory) {
        uint256 count = 0;

        // Compter les médecins ayant encore accès
        for (uint256 i = 0; i < doctorsWithAccess.length; i++) {
            if (permissions[doctorsWithAccess[i]].canAccess && block.timestamp <= permissions[doctorsWithAccess[i]].validUntil) {
                count++;
            }
        }

        // Créer les tableaux pour les adresses et les noms
        address[] memory validDoctors = new address[](count);
        string[] memory doctorNames = new string[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < doctorsWithAccess.length; i++) {
            if (permissions[doctorsWithAccess[i]].canAccess && block.timestamp <= permissions[doctorsWithAccess[i]].validUntil) {
                validDoctors[index] = doctorsWithAccess[i];
                doctorNames[index] = permissions[doctorsWithAccess[i]].doctorName;
                index++;
            }
        }

        return (validDoctors, doctorNames);
    }

    // Ajouter un nouveau fichier médical
    function addFile(string memory cid, string memory fileType) public onlyPatient {
        files.push(File(cid, fileType));
    }
    function canAccess(address doctor, string memory cid) public view returns (bool) {
        Permission memory permission = permissions[doctor];
        if (!permission.canAccess || block.timestamp > permission.validUntil) return false;

        for (uint256 i = 0; i < permission.cids.length; i++) {
            if (keccak256(abi.encodePacked(permission.cids[i])) == keccak256(abi.encodePacked(cid))) {
                return true;
            }
        }
        return false;
    }

    function getFilesWithAccess(address doctor) public view returns (string[] memory) {
        Permission memory permission = permissions[doctor];
       
        return permission.cids;
    }

     // Récupérer les détails d'un fichier par son index
    function getFileDetails(uint256 fileIndex) public view returns (string memory cid, string memory fileType) {
        require(fileIndex < files.length, "Invalid file index");
        File memory file = files[fileIndex];
        return (file.cid, file.fileType);
    }
     // Fonction pour récupérer la liste des fichiers du patient
    function getFiles() public view returns (string[] memory, string[] memory) {
        uint256 totalFiles = files.length;

        string[] memory cids = new string[](totalFiles);
        string[] memory fileTypes = new string[](totalFiles);

        for (uint256 i = 0; i < totalFiles; i++) {
            cids[i] = files[i].cid;
            fileTypes[i] = files[i].fileType;
        }

        return (cids, fileTypes);
    }
}
