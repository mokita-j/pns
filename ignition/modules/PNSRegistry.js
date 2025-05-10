// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PNSRegistryModule = buildModule("PNSRegistry", (m) => {
//   const initialSupply = m.getParameter("initialSupply", 1000000n * 10n ** 18n);

  const pns = m.contract("PNSRegistry", []);

  return { pns };
});

module.exports = PNSRegistryModule;
