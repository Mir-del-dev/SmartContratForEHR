
   // Charger Web3.js
if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask trouvé !");
} else {
  alert("Veuillez installer MetaMask !");

}
let contractAbi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let web3, contract;

async function loadAbi() {
  try {
    const response = await fetch("/contract.json");
    const artifact = await response.json();
    contractAbi = artifact.abi;
    console.log("ABI chargé :", contractAbi);
  } catch (error) {
    console.error("Erreur lors du chargement de l'ABI :", error);
    alert("Erreur lors du chargement de l'ABI. Vérifiez votre configuration.");
  }
}
// Initialisation de Web3 et du contrat
async function init() {

  const div1 = document.getElementById('ifNotLogging');
  const div2 = document.getElementById('ifLogging');
  
  try {
    await loadAbi();
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" }); // Demande l'accès à MetaMask
    contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log("Contrat initialisé !");
    div1.style.display = 'none';
    div2.style.display = 'block';
  } catch (error) {
    console.error("Erreur d'initialisation", error);
  }
  await loadDoctors();


}

// Fonction pour accorder l'accès à un médecin
async function grantAccess() {
  const doctorAddress = document.getElementById("doctorAddress").value;
  const doctorName = document.getElementById("doctorName").value;
  const duration = 60 * 60 * 24; 

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.grantAccess(doctorAddress, duration,doctorName,[]).send({ from: accounts[0] });
    alert(`Accès accordé au médecin ${doctorAddress} pour 24 heures`);
  } catch (error) {
    console.error("Erreur lors de l'attribution de l'accès :", error);
    alert("Erreur lors de l'attribution de l'accès.");
  }
  await loadDoctors();
}

// Fonction pour révoquer l'accès
async function revokeAccess(doctorAddress) {

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.revokeAccess(doctorAddress).send({ from: accounts[0] });
    alert(`Accès révoqué pour ${doctorAddress}`);
  } catch (error) {
    console.error("Erreur lors de la révocation de l'accès :", error);
    alert("Erreur lors de la révocation de l'accès.");
  }
  await  loadDoctors();
}

// Vérifier si un médecin a accès
async function refreshList() {
  await loadDoctors();
}

async function checkContractState() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("Compte déployeur :", accounts[0]);

    // Vérifiez les permissions pour un médecin fictif
    const testDoctor = "0x71bE63f3384f5fb98995898A86B02Fb2426c5788";
    const canAccess = await contract.methods.canAccess(testDoctor).call();
    console.log(`Le médecin ${testDoctor} a accès ?`, canAccess);
  } catch (error) {
    console.error("Erreur lors de la vérification de l'état du contrat :", error);
  }
}

async function loadDoctors() {
  try {

    const result = await contract.methods.getDoctorsWithAccess().call();
    const addresses = result[0]; // Liste des adresses
    const names = result[1]; // Liste des noms
      const tableBody = document.getElementById("doctor-list");

      // Réinitialiser le tableau
      tableBody.innerHTML = "";

      // Ajouter chaque médecin au tableau
      addresses.forEach((address, index) => {
          const newRow = tableBody.insertRow();

          // Colonne 1 : nom
          const cell1 = newRow.insertCell(0);
          cell1.textContent = index + 1;

          // Colonne 2 : Adresse du médecin
          const cell2 = newRow.insertCell(1);
          cell2.textContent = address;

          // Colonne 3
          const cell3 = newRow.insertCell(2);
          cell3.textContent = names[index];
          
          // Colonne 
          const cell4 = newRow.insertCell(3);
          const revokeButton = document.createElement("button");
              revokeButton.type = "button";
              revokeButton.className = "btn btn-light";
              revokeButton.textContent = "❌";
              revokeButton.setAttribute("data-id", address);
              revokeButton.setAttribute("data-bs-toggle", "tooltip");
              revokeButton.setAttribute("data-bs-placement", "top");
              revokeButton.setAttribute("data-bs-custom-class", "custom-tooltip");
              revokeButton.setAttribute("title", "Révoquer l'accès du médecin");

              // Ajouter un événement au bouton
              revokeButton.addEventListener("click", async () => {
                await revokeAccess(address);
              });

              // Ajouter le bouton dans la cellule
              cell4.appendChild(revokeButton);
      });
  } catch (error) {
      console.error("Erreur lors du chargement des médecins :", error);
  }
}


// Ajouter les écouteurs d'événements
document.getElementById("grant-access").addEventListener("click", grantAccess);
document.getElementById("loadDoctors").addEventListener("click", loadDoctors);
document.getElementById("check-access").addEventListener("click", checkContractState);

// Initialisation de l'application
window.onload = init;


