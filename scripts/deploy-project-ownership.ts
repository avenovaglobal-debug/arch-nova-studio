import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("No deployer configured. Set DEPLOYER_PRIVATE_KEY.");

  const admin = process.env.ARCHNOVA_ADMIN_ADDRESS || deployer.address;
  const factory = await ethers.getContractFactory("ProjectOwnership");
  const registry = await factory.deploy(admin);
  await registry.waitForDeployment();

  const creatorRole = await registry.PROJECT_CREATOR_ROLE();
  const verifierRole = await registry.PROJECT_VERIFIER_ROLE();

  // Only grant the deployer a creator role when the deployer is also the admin.
  // If a multisig is configured as admin, grant operational roles from that multisig
  // after deployment; never bypass the multisig by assuming the deployer is privileged.
  let creatorRoleGrantedToDeployer = false;
  if (deployer.address.toLowerCase() === admin.toLowerCase()) {
    const grant = await registry.grantRole(creatorRole, deployer.address);
    await grant.wait();
    creatorRoleGrantedToDeployer = true;
  }

  console.log(JSON.stringify({
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    admin,
    projectOwnership: await registry.getAddress(),
    creatorRole,
    verifierRole,
    creatorRoleGrantedToDeployer,
    nextStep: creatorRoleGrantedToDeployer
      ? "Configure a dedicated creator service wallet and verifier wallet before production."
      : "Use the configured admin multisig to grant PROJECT_CREATOR_ROLE and PROJECT_VERIFIER_ROLE to dedicated operational wallets.",
    note: "The NFT represents a digital certificate only; it is not legal title to a building or copyright."
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
