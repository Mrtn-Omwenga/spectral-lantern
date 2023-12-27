//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    error StalePrice();

    uint256 private constant TIMEOUT = 3 hours;
    mapping(address => AggregatorV3Interface) priceFeeds;

    mapping(address => bool) allowedPriceFeed;
    bool public isPriceFeedEmpty = true;

    constructor(address[] memory _initialAllowedAddresses) {
        if(_initialAllowedAddresses.length > 0){
            for(uint i = 0; i < _initialAllowedAddresses.length; i++)
            {
                allowedPriceFeed[_initialAllowedAddresses[i]] = true;
            }
            isPriceFeedEmpty = false; 
        }     
    }

    /**
     * @notice returns the price of a token with some extra security checks
     * @param _tokenAddress : address of the token
     * @dev throws error if the price is outdated
     */

    function getPrice(address _tokenAddress) public view returns (uint80, int256, uint256, uint256, uint80) {
        AggregatorV3Interface chainlinkFeed = priceFeeds[_tokenAddress];
        (uint80 roundId, int256 price, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
            chainlinkFeed.latestRoundData();

        if (updatedAt == 0 || answeredInRound < roundId) {
            revert StalePrice();
        }

        uint256 secondsSince = block.timestamp - updatedAt;
        if (secondsSince > TIMEOUT) revert StalePrice();

        return (roundId, price, startedAt, updatedAt, answeredInRound);
    }


    /**
     * @notice adds new priceFeed address to allowedPriceFeed mapping
     * @param _newAddress : address of the new PriceFeed address
     * @dev throws error if called by non-owner or priceFeed is already in the allowed mapping
     */
    function addPriceFeedAddress(address _newAddress) external onlyOwner {
        require(allowedPriceFeed[_newAddress] == false, "Price Feed is already allowed");
        allowedPriceFeed[_newAddress] = true;
    }


    /**
     * @notice delete a priceFeed address from allowedPriceFeed mapping
     * @param _addressToDelete : address of the new PriceFeed address
     * @dev throws error if called by non-owner or priceFeed is not in the allowed mapping
     */
    function deletePriceFeedAddress(address _addressToDelete) external onlyOwner {
        require(allowedPriceFeed[_addressToDelete], "Price Feed is not allowed");
        allowedPriceFeed[_addressToDelete] = false;
    }

    /**
     * @notice Add a new available token
     * @param _tokenAddress : token interface
     * @param _priceFeed : aggregator interface address
     */

    function addNewToken(address _tokenAddress, address _priceFeed) public  {
    if (!isPriceFeedEmpty)
    {
        require(allowedPriceFeed[_priceFeed], "Not an allowed price feed address");
    }

        AggregatorV3Interface priceFeed = AggregatorV3Interface(_priceFeed);
        priceFeeds[_tokenAddress] = priceFeed;
    }

    /**
     * @notice Checks if a token is available
     * @param _tokenAddress : token address
     */
    function isAllowedToken(address _tokenAddress) public view returns (bool) {
        return address(priceFeeds[_tokenAddress]) != address(0);
    }

    function getTimeout(AggregatorV3Interface) public pure returns (uint256) {
        return TIMEOUT;
    }
}
