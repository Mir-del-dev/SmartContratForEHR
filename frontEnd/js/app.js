    // Charger Web3.js
if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask trouvé !");
} else {
  alert("Veuillez installer MetaMask !");
}

// ABI et adresse du contrat
const contractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "canAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "patient",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "permissions",
    "outputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "validUntil",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "canAccess",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Remplace avec l'adresse de déploiement

let web3, contract;

// Initialisation de Web3 et du contrat
async function init() {
  try {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" }); // Demande l'accès à MetaMask
    contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log("Contrat initialisé !");
  } catch (error) {
    console.error("Erreur d'initialisation", error);
  }
}

// Fonction pour accorder l'accès à un médecin
async function grantAccess() {
  const doctorAddress = document.getElementById("doctorAddress").value;
  const duration = 60 * 60 * 24; // Durée en secondes (par exemple, 24 heures)

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.grantAccess(doctorAddress, duration).send({ from: accounts[0] });
    alert(`Accès accordé au médecin ${doctorAddress} pour 24 heures`);
  } catch (error) {
    console.error("Erreur lors de l'attribution de l'accès :", error);
    alert("Erreur lors de l'attribution de l'accès.");
  }
}

// Fonction pour révoquer l'accès
async function revokeAccess() {
  const doctorAddress = document.getElementById("doctorAddress").value;

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.revokeAccess(doctorAddress).send({ from: accounts[0] });
    alert(`Accès révoqué pour ${doctorAddress}`);
  } catch (error) {
    console.error("Erreur lors de la révocation de l'accès :", error);
    alert("Erreur lors de la révocation de l'accès.");
  }
}

// Vérifier si un médecin a accès
async function checkAccess() {
  const doctorAddress = document.getElementById("doctorAddress").value;

  try {
    const hasAccess = await contract.methods.canAccess(doctorAddress).call();
    alert(`Le médecin ${doctorAddress} ${hasAccess ? "a" : "n'a pas"} accès`);
  } catch (error) {
    console.error("Erreur lors de la vérification de l'accès :", error);
    alert("Erreur lors de la vérification.");
  }
}

async function loadDoctors() {
  try {
      const doctors = await contract.methods.getDoctorsWithAccess().call();
      const tableBody = document.getElementById("doctor-list");

      // Réinitialiser le tableau
      tableBody.innerHTML = "";

      // Ajouter chaque médecin au tableau
      doctors.forEach((doctor, index) => {
          const newRow = tableBody.insertRow();

          // Colonne 1 : Numéro
          const cell1 = newRow.insertCell(0);
          cell1.textContent = index + 1;

          // Colonne 2 : Adresse du médecin
          const cell2 = newRow.insertCell(1);
          cell2.textContent = doctor;

          // Colonne 3 : Validité (on pourrait ajouter des infos supplémentaires ici si besoin)
          const cell3 = newRow.insertCell(2);
          cell3.textContent = "Valide"; // Tu peux ajouter des détails depuis une autre fonction si nécessaire
      });
  } catch (error) {
      console.error("Erreur lors du chargement des médecins :", error);
  }
}


// Ajouter les écouteurs d'événements
document.getElementById("grant-access").addEventListener("click", grantAccess);
//document.getElementById("revoke-access").addEventListener("click", revokeAccess);
//document.getElementById("check-access").addEventListener("click", checkAccess);

// Initialisation de l'application
window.onload = init;
