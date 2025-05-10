// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PNSRegistryModule = buildModule("PNSRegistryModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", 1000000n * 10n ** 18n);

  const token = m.contract("PNSRegistry", []);

  return { token };
});

module.exports = PNSRegistryModule;
