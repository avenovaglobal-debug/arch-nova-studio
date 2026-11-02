import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";

const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
const accounts = deployerKey ? [deployerKey] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 300 },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
    ...(process.env.ETHEREUM_SEPOLIA_RPC_URL
      ? { sepolia: { url: process.env.ETHEREUM_SEPOLIA_RPC_URL, accounts, chainId: 11155111 } }
      : {}),
    ...(process.env.BASE_SEPOLIA_RPC_URL
      ? { baseSepolia: { url: process.env.BASE_SEPOLIA_RPC_URL, accounts, chainId: 84532 } }
      : {}),
    ...(process.env.POLYGON_AMOY_RPC_URL
      ? { polygonAmoy: { url: process.env.POLYGON_AMOY_RPC_URL, accounts, chainId: 80002 } }
      : {}),
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
      baseSepolia: process.env.BASESCAN_API_KEY ?? "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? "",
    },
  },
};
export default config;
