    // Charger Web3.js
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask trouvé !");
      } else {
        alert("Veuillez installer MetaMask !");
      }
      
      // ABI et adresse du contrat
      const contractAbi =  [
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
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "doctorsWithAccess",
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
          "inputs": [],
          "name": "getDoctorsWithAccess",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
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
// Soumettre une demande d'accès
async function submitAccessRequest() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const doctorAddress = document.getElementById("doctorAddress").value;
        const dataSelection = Array.from(document.getElementById("dataSelection").selectedOptions).map(option => option.value);
        const reason = document.getElementById("reason").value;

        // Vérifier si des données sont sélectionnées
        if (dataSelection.length === 0) {
            alert("Veuillez sélectionner des données.");
            return;
        }

        // Appel à la fonction `grantAccess` du smart contract pour chaque donnée
        const duration = 3600; // durée en secondes
        for (let data of dataSelection) {
            const transaction = await contract.methods.grantAccess(doctorAddress, duration).send({ from: account });
            console.log("Demande soumise :", transaction);
        }

        document.getElementById("responseMessage").textContent = "Accès accordé avec succès.";
        document.getElementById("responseMessage").style.color = "green";
    } catch (error) {
        console.error("Erreur lors de la soumission :", error);
        document.getElementById("responseMessage").textContent = "Erreur lors de la soumission.";
        document.getElementById("responseMessage").style.color = "red";
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
// Consulter les journaux d'accès
async function viewAccessLogs() {
    try {
        const logs = await contract.methods.getDoctorsWithAccess().call();
        console.log("Journaux d'accès :", logs);
        document.getElementById("responseMessage").textContent = `Médecins ayant accès : ${logs.join(", ")}`;
    } catch (error) {
        console.error("Erreur lors de la récupération des journaux :", error);
        document.getElementById("responseMessage").textContent = "Erreur lors de la récupération des journaux.";
    }
}

// Gestion des événements
//document.getElementById("requestAccessButton").addEventListener("click", submitAccessRequest);
//document.getElementById("viewLogsButton").addEventListener("click", viewAccessLogs);


document.getElementById("requestAccessButton").addEventListener("click", grantAccess);
//document.getElementById("revoke-access").addEventListener("click", revokeAccess);
//document.getElementById("check-access").addEventListener("click", checkAccess);

// Initialisation de l'application
window.onload = init;