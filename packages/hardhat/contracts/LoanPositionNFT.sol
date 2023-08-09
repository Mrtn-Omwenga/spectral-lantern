//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";

contract LoanPositionNFT is ERC721BurnableUpgradeable, OwnableUpgradeable {
    struct LoanPosition {
        address borrowerAddress;
        address lenderAddress;
        address loanToken;
        uint256 loanAmount;
        address collateralToken;
        uint256 collateralAmount;
        uint256 liquidationThreshold;
        uint256 initialThreshold;
        uint64 loanRepayDeadline;
        uint64 loanRequestDeadline;
        uint32 interestRate;
    }

    mapping(uint256 => LoanPosition) private _loanPositions;
    uint256 public nextTokenId;

    function initialize() external initializer {
        nextTokenId = 1;
        __ERC721_init("Koryntia Loan Position NFT", "KLPN");
        __ERC721Burnable_init();
        __Ownable_init();
    }

    function init(uint256 tokenId, uint256 amount) external onlyOwner returns (bool) {
        require(_loanPositions[tokenId].loanAmount == 0, "Loan already initialized");
        require(amount > 0, "Amount zero");
        _loanPositions[tokenId].loanAmount = amount;
        return true;
    }

    function addCollateral(uint256 loanId, uint256 amount) external onlyOwner returns (bool) {
        require(loanPositions(loanId).collateralAmount > 0, "Loan not initialized");
        _loanPositions[loanId].collateralAmount += amount;
        return true;
    }

    function mint(
        address applicant,
        address loanToken,
        address collateralToken,
        uint256 collateralAmount,
        uint32 liquidationThreshold,
        uint32 initialThreshold,
        uint64 loanRepayDeadline,
        uint64 loanRequestDeadline,
        uint32 interestRate
    ) external onlyOwner returns (uint256 tokenId) {
        LoanPosition memory newPosition;
        newPosition.borrowerAddress = applicant;
        newPosition.loanToken = loanToken;
        newPosition.initialThreshold = initialThreshold;
        newPosition.collateralToken = collateralToken;
        newPosition.collateralAmount = collateralAmount;
        newPosition.liquidationThreshold = liquidationThreshold;
        newPosition.loanRepayDeadline = loanRepayDeadline;
        newPosition.loanRequestDeadline = loanRequestDeadline;
        newPosition.interestRate = interestRate;

        tokenId = nextTokenId;
        _mint(owner(), nextTokenId);
        _loanPositions[nextTokenId] = newPosition;
        nextTokenId++;
    }

    function burn(uint256 tokenId) public override onlyOwner {
        _burn(tokenId);
        delete _loanPositions[tokenId];
    }

    function loanPositions(uint256 tokenId) public view returns (LoanPosition memory) {
        return _loanPositions[tokenId];
    }

    // function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
    //     internal
    //     override
    // {
    //     _loanPositions[firstTokenId].lenderAddress = to;
    // }
}
