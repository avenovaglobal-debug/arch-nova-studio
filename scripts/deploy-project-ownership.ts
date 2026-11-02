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

  // The deployer receives creator permission for initial testnet setup.
  // Production deployments should use a dedicated service wallet and multisig admin.
  if (deployer.address.toLowerCase() !== admin.toLowerCase()) {
    const grant = await registry.grantRole(creatorRole, deployer.address);
    await grant.wait();
  } else {
    const grant = await registry.grantRole(creatorRole, deployer.address);
    await grant.wait();
  }

  console.log(JSON.stringify({
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    admin,
    projectOwnership: await registry.getAddress(),
    creatorRole,
    verifierRole,
    note: "Record this deployment in the ArchNova chain manifest. Do not treat the NFT as legal title to a building or copyright."
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
