// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Simple Name Service
/// @notice A service for registering and managing names on the blockchain
contract SimpleNameService {
    // Mapping from name to owner address
    mapping(string => address) public nameToAddress;

    /// @notice Registers a new name
    /// @param name The name to register
    function register(string memory name) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(nameToAddress[name] == address(0), "Name already registered");
        require(isValidName(name), "Invalid name format");

        nameToAddress[name] = msg.sender;
    }

    /// @notice Transfers ownership of a name
    /// @param name The name to transfer
    /// @param to The new owner's address
    function transfer(string memory name, address to) public {
        require(nameToAddress[name] == msg.sender, "Not the owner");
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot transfer to self");

        nameToAddress[name] = to;
    }

    /// @notice Resolves a name to its owner's address
    /// @param name The name to resolve
    /// @return The address associated with the name
    function resolve(string memory name) public view returns (address) {
        return nameToAddress[name];
    }

    /// @notice Checks if a name is available for registration
    /// @param name The name to check
    /// @return True if the name is available
    function isNameAvailable(string memory name) public view returns (bool) {
        return nameToAddress[name] == address(0);
    }

    /// @notice Validates that a name only contains allowed characters
    /// @param name The name to validate
    /// @return True if the name is valid
    function isValidName(string memory name) internal pure returns (bool) {
        bytes memory b = bytes(name);
        if (b.length == 0) return false;
        
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x5A) && // A-Z
                !(char >= 0x61 && char <= 0x7A) && // a-z
                char != 0x2D) { // hyphen
                return false;
            }
        }
        return true;
    }
}