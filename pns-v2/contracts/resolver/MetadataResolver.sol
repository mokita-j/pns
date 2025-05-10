pragma solidity >=0.8.4;

import "../registry/PNS.sol";

contract PublicResolver {
    event MetadataChanged(bytes32 indexed node, string a);

    PNS pns;
    mapping(bytes32=>string) public metadata;

    modifier only_owner(bytes32 node) {
        if(pns.owner(node) != msg.sender) {
            revert("Not the owner");
        }
        _;
    }

    constructor(address pnsAddr) {
        pns = PNS(pnsAddr);
    }

    function setMetadata(bytes32 node, string memory _metadata) only_owner(node) public {
        metadata[node] = _metadata;
        emit MetadataChanged(node, _metadata);
    }

    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
    }
}