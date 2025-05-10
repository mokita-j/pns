pragma solidity >=0.8.4;

import "../registry/PNS.sol";
import "./IBaseRegistrar.sol";

contract BaseRegistrar is IBaseRegistrar {
    // A map of expiry times
    mapping(string => uint256) expiries;
    // The PNS registry
    PNS public pns;
    // The namehash of the TLD this registrar owns (eg, .dot)
    bytes32 public baseNode;

    address public owner;

    constructor(PNS _pns, bytes32 _baseNode) {
        owner = msg.sender;
        pns = _pns;
        baseNode = _baseNode;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier live() {
        require(pns.owner(baseNode) == address(this));
        _;
    }

    // Returns true iff the specified name is available for registration.
    function available(string memory name) public view override returns (bool) {
        // Not available if it's registered here or in its grace period.
        return expiries[name] < block.timestamp;
    }

    // Set the resolver for the TLD this registrar manages.
    function setResolver(address resolver) external override onlyOwner {
        pns.setResolver(baseNode, resolver);
    }

    // Returns the expiration timestamp of the specified id.
    function nameExpires(string memory name) external view override returns (uint256) {
        return expiries[name];
    }

    /// @dev Register a name.
    /// @param name .
    /// @param owner The address that should own the registration.
    /// @param duration Duration in seconds for the registration.
    function register(
        string memory name,
        address owner,
        uint256 duration
    ) external override returns (uint256) {
        return _register(name, owner, duration);
    }

    function _register(
        string memory name,
        address owner,
        uint256 duration
    ) internal live returns (uint256) {
        require(available(name));
        require(
            block.timestamp + duration >
                block.timestamp
        ); // Prevent future overflow

        expiries[name] = block.timestamp + duration;
        bytes32 id = keccak256(abi.encodePacked(name));
        pns.setSubnodeOwner(baseNode, id, owner);

        emit NameRegistered(name, owner, block.timestamp + duration);

        return block.timestamp + duration;
    }

    function renew(
        string memory name,
        uint256 duration
    ) external override live returns (uint256) {
        require(expiries[name] >= block.timestamp); // Name must be registered here or in grace period
        require(
            expiries[name] + duration > duration
        ); // Prevent future overflow

        expiries[name] += duration;
        emit NameRenewed(name, expiries[name]);
        return expiries[name];
    }
}
