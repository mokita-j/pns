const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ResolversModule = buildModule("ResolversModule", async (m) => {
  // Get the PNS registry reference
  const { registry } = await m.getModule("PNSRegistryModule");

  const publicResolver = await m.contract("PublicResolver", [registry.address]);
  const metadataResolver = await m.contract("MetadataResolver", [registry.address]);

  return { publicResolver, metadataResolver };
});

module.exports = ResolversModule;
