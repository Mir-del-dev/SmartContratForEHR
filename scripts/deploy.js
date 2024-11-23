async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const DMEContract = await ethers.getContractFactory("DMEContract");
    const dmeContractd = await DMEContract.deploy();
    console.log("Contract deployed to:", dmeContractd.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
