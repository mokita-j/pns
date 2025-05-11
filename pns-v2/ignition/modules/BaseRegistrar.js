const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const BaseRegistrarModule = buildModule("BaseRegistrarModule", async (m) => {
  // Get the PNS registry reference
  const { registry } = await m.getModule("PNSRegistryModule");
  
  // Deploy .dot registrar
  const dotNode = "0x3fce7d1364a893e213bc4212792b517ffc88f5b13b86c8ef9c8d390c3a1370ce";
  const dotRegistrar = await m.contract("BaseRegistrar", [
    registry.address,
    dotNode
  ]);

  // Deploy .jam registrar
  const jamNode = "0x6f142072f4756fbc7aaa14293ad39fafc39e33b39953c16205e8c1e0b04791bd";
  const jamRegistrar = await m.contract("BaseRegistrar", [
    registry.address,
    jamNode
  ]);

  // Deploy .pns.dot registrar
  const pnsdotNode = "0x75b0620a1da8107923fa4b10f6d6e7b4615e2b07a4a0a9d8399faaac3bb494dd";
  const pnsdotRegistrar = await m.contract("PNSDotRegistrar", [
    registry.address,
    pnsdotNode
  ]);

  return { dotRegistrar, jamRegistrar, pnsdotRegistrar };
});

module.exports = BaseRegistrarModule;
