(()=>{let t,e,c;async function o(){try{const t=await c.methods.getDoctorsWithAccess().call(),n=t[0],a=t[1],r=document.getElementById("doctor-list");r.innerHTML="",n.forEach(((t,n)=>{const s=r.insertRow();s.insertCell(0).textContent=n+1,s.insertCell(1).textContent=t,s.insertCell(2).textContent=a[n];const l=s.insertCell(3),i=document.createElement("button");i.type="button",i.className="btn btn-light",i.textContent="❌",i.setAttribute("data-id",t),i.setAttribute("data-bs-toggle","tooltip"),i.setAttribute("data-bs-placement","top"),i.setAttribute("data-bs-custom-class","custom-tooltip"),i.setAttribute("title","Révoquer l'accès du médecin"),i.addEventListener("click",(async()=>{await async function(t){try{const o=await e.eth.getAccounts();await c.methods.revokeAccess(t).send({from:o[0]}),alert(`Accès révoqué pour ${t}`)}catch(t){console.error("Erreur lors de la révocation de l'accès :",t),alert("Erreur lors de la révocation de l'accès.")}await o()}(t)})),l.appendChild(i)}))}catch(t){console.error("Erreur lors du chargement des médecins :",t)}}void 0!==window.ethereum?console.log("MetaMask trouvé !"):alert("Veuillez installer MetaMask !"),document.getElementById("grant-access").addEventListener("click",(async function(){const t=document.getElementById("doctorAddress").value,n=document.getElementById("doctorName").value;try{const o=await e.eth.getAccounts();await c.methods.grantAccess(t,86400,n,[]).send({from:o[0]}),alert(`Accès accordé au médecin ${t} pour 24 heures`)}catch(t){console.error("Erreur lors de l'attribution de l'accès :",t)}await o()})),document.getElementById("loadDoctors").addEventListener("click",o),document.getElementById("check-access").addEventListener("click",(async function(){try{const t=await e.eth.getAccounts();console.log("Compte déployeur :",t[0]);const o=document.getElementById("checkingAddress").value;await c.methods.canAccess(o).call()?alert(`Le médecin ${o} a accès `):alert(`Le médecin ${o} n'as pas accès  à votre dossier`)}catch(t){console.error("Erreur lors de la vérification de l'état du contrat :",t)}})),window.onload=async function(){const n=document.getElementById("ifNotLogging"),a=document.getElementById("ifLogging");try{await async function(){try{const e=await fetch("/contract.json"),c=await e.json();t=c.abi,console.log("ABI chargé :",t)}catch(t){console.error("Erreur lors du chargement de l'ABI :",t),alert("Erreur lors du chargement de l'ABI. Vérifiez votre configuration.")}}(),e=new Web3(window.ethereum),await ethereum.request({method:"eth_requestAccounts"}),c=new e.eth.Contract(t,"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"),console.log("Contrat initialisé !"),n.style.display="none",a.style.display="block"}catch(t){console.error("Erreur d'initialisation",t)}await o()}})();