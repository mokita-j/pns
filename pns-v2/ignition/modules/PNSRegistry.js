// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PNSRegistryModule = buildModule("PNSRegistryModule", (m) => {

  const registry = m.contract("PNSRegistry", []);

  return { registry };
});

module.exports = PNSRegistryModule;
