import { create } from "ipfs-http-client";
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
// Configuration IPFS
const ipfs = create({ host: "127.0.0.1", port: 5001, protocol: "http" }); 

async function uploadToIPFS(file) {
  try {
    const added = await ipfs.add(file);
    console.log("Fichier ajouté à IPFS :", added);
    return added.path; // Retourne le CID du fichier
  } catch (error) {
    console.error("Erreur lors de l'ajout à IPFS :", error);
    throw new Error("Impossible d'ajouter le fichier à IPFS");
  }
}

  async function addFileToContract(cid,fileType) {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.addFile(cid,fileType).send({ from: accounts[0] });
      alert("Fichier ajouté au Smart Contract :");
    } catch (error) {
      console.error("Erreur lors de l'ajout au contrat :", error);
      alert("Erreur lors de l'ajout du fichier au dossier médical.");
    }
  }
  
  document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }
  
    try {
      const cid = await uploadToIPFS(file);
      const selectedOption = document.querySelector('input[name="dmetype"]:checked');

        var fileType=selectedOption.value;
      await addFileToContract(cid,fileType);
  
      alert("Fichier uploadé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      alert("Erreur lors de l'upload du fichier.");
    }
  });

  async function getPatientFiles() {
    try {
      // Appel à la méthode du smart contract
      const result= await contract.methods.getFiles().call();
      const cids = result[0]; 
      const fileTypes = result[1];
      // Sélection de l'élément tbody du tableau
      const tableBody = document.getElementById("fileTableBody");
  
      // Réinitialisation du tableau
      tableBody.innerHTML = "";
  
      // Parcourir les fichiers et les ajouter au tableau
      cids.forEach((cid, index) => {
        const newRow = tableBody.insertRow();
  
        // Colonne 1 : Index
        const cell1 = newRow.insertCell(0);
        cell1.textContent = index + 1;
  
        // Colonne 2 : CID
        const cell2 = newRow.insertCell(1);
        cell2.textContent = cid;
  
        // Colonne 3 : Type de fichier
        const cell3 = newRow.insertCell(2);
        cell3.textContent = fileTypes[index];
      });
  
      console.log("Fichiers affichés dans le tableau !");
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers :", error);
      alert("Impossible de charger les fichiers.");
    }
  }
  
  document.getElementById("getfilespatients").addEventListener("click", getPatientFiles);

window.onload = init;

  