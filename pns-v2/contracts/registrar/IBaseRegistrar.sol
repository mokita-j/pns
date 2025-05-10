//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PNS} from "../registry/PNS.sol";

interface IBaseRegistrar {
    event NameMigrated(
        string name,
        address indexed owner,
        uint256 expires
    );
    event NameRegistered(
        string name,
        address indexed owner,
        uint256 expires
    );

    event NameRenewed(string name, uint256 expires);

    // Set the resolver for the TLD this registrar manages.
    function setResolver(address resolver) external;

    // Returns the expiration timestamp of the specified label hash.
    function nameExpires(string memory name) external view returns (uint256);

    // Returns true if the specified name is available for registration.
    function available(string memory name) external view returns (bool);

    /// @dev Register a name.
    function register(
        string memory name,
        address owner,
        uint256 duration
    ) external returns (uint256);

    function renew(string memory name, uint256 duration) external returns (uint256);
}