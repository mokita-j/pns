require('@nomicfoundation/hardhat-toolbox');
require('@parity/hardhat-polkadot');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: '0.8.28',
    resolc: {
        compilerSource: 'npm',
    },
    // networks: {
    //     hardhat: {
    //         polkavm: true,
    //         forking: {
    //             url: 'wss://westend-asset-hub-rpc.polkadot.io',
    //         },
    //         adapterConfig: {
    //             adapterBinaryPath: './bin/eth-rpc',
    //             dev: true,
    //         },
    //     },
    // }
    networks: {
        hardhat: {
            polkavm: true,
            // Uncomment to deploy to a local fork of the westend network.
            forking: {
                url: 'wss://westend-asset-hub-rpc.polkadot.io',
            },
            adapterConfig: {
                adapterBinaryPath: vars.get('ADAPTER_BINARY_PATH'),
                dev: true,
            },
        },
        // localNode: {
        //     polkavm: true,
        //     url: `http://127.0.0.1:8545`,
        // },
        westendAssetHub: {
            polkavm: true,
            url: 'https://westend-asset-hub-eth-rpc.polkadot.io',
            accounts: [vars.get('WESTEND_HUB_PK')],
        },
    }
};