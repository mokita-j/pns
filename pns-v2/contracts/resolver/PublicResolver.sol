pragma solidity >=0.8.4;

import "../registry/PNS.sol";

contract PublicResolver {
    event AddrChanged(bytes32 indexed node, address a);
    event ContentChanged(bytes32 indexed node, bytes32 hash);

    PNS pns;
    mapping(bytes32=>address) addresses;

    modifier only_owner(bytes32 node) {
        if(pns.owner(node) != msg.sender) {
            revert("Not the owner");
        }
        _;
    }

    constructor(address pnsAddr) {
        pns = PNS(pnsAddr);
    }

    function addr(bytes32 node) public view returns (address ret) {
        ret = addresses[node];
    }

    function setAddr(bytes32 node, address newAddr) only_owner(node) public {
        addresses[node] = newAddr;
        emit AddrChanged(node, newAddr);
    }

    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
    }
}