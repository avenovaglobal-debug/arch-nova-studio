import { expect } from "chai";
import { ethers } from "hardhat";
import { ProjectOwnership } from "../typechain-types";

describe("ProjectOwnership", function () {
  let registry: ProjectOwnership;
  let admin: any;
  let creator: any;
  let verifier: any;
  let owner: any;
  let stranger: any;

  const projectId = ethers.keccak256(ethers.toUtf8Bytes("archnova-project-001"));
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes("floorplan-v1"));
  const nextContentHash = ethers.keccak256(ethers.toUtf8Bytes("floorplan-v2"));

  beforeEach(async function () {
    [admin, creator, verifier, owner, stranger] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ProjectOwnership");
    registry = await factory.deploy(admin.address) as ProjectOwnership;
    await registry.waitForDeployment();
    await registry.grantRole(await registry.PROJECT_CREATOR_ROLE(), creator.address);
    await registry.grantRole(await registry.PROJECT_VERIFIER_ROLE(), verifier.address);
  });

  it("registers a project and mints its certificate to the nominated owner", async function () {
    await expect(registry.connect(creator).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/project-001"
    )).to.emit(registry, "ProjectRegistered");

    expect(await registry.ownerOf(1)).to.equal(owner.address);
    expect(await registry.tokenURI(1)).to.equal("ipfs://metadata/project-001");
    expect(await registry.projectIdRegistered(projectId)).to.equal(true);
  });

  it("rejects duplicate project identifiers", async function () {
    await registry.connect(creator).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/project-001"
    );
    await expect(registry.connect(creator).registerProject(
      owner.address, projectId, nextContentHash, "ipfs://metadata/project-duplicate"
    )).to.be.revertedWithCustomError(registry, "ProjectAlreadyRegistered");
  });

  it("restricts registration to project creators", async function () {
    await expect(registry.connect(stranger).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/project-001"
    )).to.be.reverted;
  });

  it("allows the owner to update the content commitment and invalidates verification", async function () {
    await registry.connect(creator).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/v1"
    );
    await registry.connect(verifier).verifyProject(1);
    expect((await registry.getProject(1)).verified).to.equal(true);

    await registry.connect(owner).updateProjectContent(1, nextContentHash, "ipfs://metadata/v2");
    const project = await registry.getProject(1);
    expect(project.contentHash).to.equal(nextContentHash);
    expect(project.verified).to.equal(false);
    expect(await registry.tokenURI(1)).to.equal("ipfs://metadata/v2");
  });

  it("allows only verifiers to verify a project", async function () {
    await registry.connect(creator).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/project-001"
    );
    await expect(registry.connect(stranger).verifyProject(1)).to.be.reverted;
    await expect(registry.connect(verifier).verifyProject(1))
      .to.emit(registry, "ProjectVerificationChanged")
      .withArgs(1, true, verifier.address);
  });

  it("does not imply that certificate transfer grants legal title to physical property", async function () {
    // The contract deliberately records only ERC-721 certificate ownership.
    // Off-chain legal rights must be documented and checked independently.
    await registry.connect(creator).registerProject(
      owner.address, projectId, contentHash, "ipfs://metadata/project-001"
    );
    await registry.connect(owner).transferFrom(owner.address, stranger.address, 1);
    expect(await registry.ownerOf(1)).to.equal(stranger.address);
  });
});
