async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Déployer le contrat
    const DMEContract = await ethers.getContractFactory("DMEContract");
    const dmeContract = await DMEContract.deploy();
    //très important d'attendre la fin du déploiement pour avoir l'addresesseessee
    const receipt = await dmeContract.waitForDeployment();
    console.log("Contract deployed to:", receipt.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error.message);
        process.exit(1);
    });
