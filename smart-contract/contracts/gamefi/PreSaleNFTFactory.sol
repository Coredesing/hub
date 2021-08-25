// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PreSaleNFTPool.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IPool {
    function initialize(address _token, uint256 _duration, uint256 _openTime, address _offeredCurrency, uint256 _offeredCurrencyDecimals, uint256 _offeredRate, address _walletAddress, address _signer) external;
}

contract PreSaleNFTFactory is AccessControl {
    // Array of created Pools Address
    address[] public allPools;
    // Mapping from User token. From tokens to array of created Pools for token
    mapping(address => mapping(address => address[])) public getPools;

    event PresalePoolCreated(
        address registedBy,
        address indexed token,
        address indexed pool,
        uint256 poolId
    );

    constructor () {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Get the number of all created pools
     * @return Return number of created pools
     */
    function allPoolsLength() public view returns (uint256) {
        return allPools.length;
    }

    /**
     * @notice Get the created pools by token address
     * @dev User can retrieve their created pool by address of tokens
     * @param _creator Address of created pool user
     * @param _token Address of token want to query
     * @return Created PreSalePool Address
     */
    function getCreatedPoolsByToken(address _creator, address _token)
    public
    view
    returns (address[] memory)
    {
        return getPools[_creator][_token];
    }

    /**
     * @notice Retrieve number of pools created for specific token
     * @param _creator Address of created pool user
     * @param _token Address of token want to query
     * @return Return number of created pool
     */
    function getCreatedPoolsLengthByToken(address _creator, address _token)
    public
    view
    returns (uint256)
    {
        return getPools[_creator][_token].length;
    }

    /**
     * @notice Register ICO PreSalePool for tokens
     * @dev To register, you MUST have an ERC20 token
     * @param _token address of ERC20 token
     * @param _duration Number of ICO time in seconds
     * @param _openTime Number of start ICO time in seconds
     * @param _offeredCurrency Address of offered token
     * @param _offeredCurrencyDecimals Decimals of offered token
     * @param _offeredRate Conversion rate for buy token. tokens = value * rate
     * @param _wallet Address of funding ICO wallets. Sold tokens in eth will transfer to this address
     * @param _signer Address of funding ICO wallets. Sold tokens in eth will transfer to this address
     */
    function registerPool(
        address _token,
        uint256 _duration,
        uint256 _openTime,
        address _offeredCurrency,
        uint256 _offeredCurrencyDecimals,
        uint256 _offeredRate,
        address _wallet,
        address _signer
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address pool) {
        require(_token != address(0), "ICOFactory::ZERO_ADDRESS");
        require(_duration != 0, "ICOFactory::ZERO_DURATION");
        require(_wallet != address(0), "ICOFactory::ZERO_ADDRESS");
        require(_offeredRate != 0, "ICOFactory::ZERO_OFFERED_RATE");
        bytes memory bytecode = type(PreSaleNFTPool).creationCode;
        uint256 tokenIndex = getCreatedPoolsLengthByToken(msg.sender, _token);
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _token, tokenIndex));
        pool = Create2.deploy(0, salt, bytecode);

        IPool(pool).initialize(
            _token,
            _duration,
            _openTime,
            _offeredCurrency,
            _offeredRate,
            _offeredCurrencyDecimals,
            _wallet,
            _signer
        );

        IMinterNFT(_token).grantMinterRole(pool);
        getPools[msg.sender][_token].push(pool);
        allPools.push(pool);

        emit PresalePoolCreated(msg.sender, _token, pool, allPools.length - 1);
    }
}