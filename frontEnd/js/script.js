
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
  try {
    await loadAbi();
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
       const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const doctorAddress = document.getElementById("doctorAddress").value;
        const duration = 3600; // durée en secondes
        const transaction = await contract.methods.grantAccess(doctorAddress, duration,"docteur",[]).send({ from: account });
            console.log("Demande soumise :", transaction);

        document.getElementById("responseMessage").textContent = "Accès accordé avec succès.";
        document.getElementById("responseMessage").style.color = "green";
    } catch (error) {
        console.error("Erreur lors de la soumission :", error);
        document.getElementById("responseMessage").textContent = "Erreur lors de la soumission.";
        document.getElementById("responseMessage").style.color = "red";
    }
}

document.getElementById("requestAccessButton").addEventListener("click", submitAccessRequest);

window.onload = init;