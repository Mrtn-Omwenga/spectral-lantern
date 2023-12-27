//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LoanPositionNFT} from "./LoanPositionNFT.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

interface IOracleContract {
    function getPrice(address tokenAddress) external view returns (uint80, int256, uint256, uint256, uint80);
    function isAllowedToken(address tokenAddress) external view returns (bool);
}


contract LoanPositionManager is Initializable {
    /// @notice Constants
    uint256 private constant LIQUIDATION_BONUS = 500; // the bonus the liquidator gets from the collateral (5%)
    uint256 private constant MIN_HEALTH_FACTOR = 1e18; // the min health factor to maintain a financially healthy position
    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10; // precision to get oracle prices with 18 decimals precision
    uint256 private constant FEED_PRECISION = 1e8; //oracle returns prices with 8 decimals precision
    uint256 private constant PROTOCOL_FEE = 100; // fee protocol gets for every new position(1%)
    uint256 private constant INTEREST_PRECISION = 10000; //{LIQUIDATION_BONUS} and {PROTOCOL_FEE} precision

    IOracleContract public oracle;
    LoanPositionNFT private nft;
    address private treasury;
    address private owner;

    ///@notice Parameter errors
    error LoanPositionManager__LoanParams_LiquidationThreshold();
    error LoanPositionManager__LoanParams_InitialThreshold();
    error LoanPositionManager__LoanParams_LoanAmount();
    error LoanPositionManager__LoanParams_CollateralAmount();
    error LoanPositionManager__LoanParams_RepayDeadline();
    error LoanPositionManager__LoanParams_RequestDeadline();
    error LoanPositionManager__LoanParams_InterestRate();
    error LoanPositionManager__LoanParams_Applicant();

    ///@notice Logic errors
    error LoanPositionManager__Loan_AlreadyInitialized();
    error LoanPositionManager__TokenNotAvailable();
    error LoanPositionManager__LoanNotFundable();
    error LoanPositionManager__TransferFailed();
    error LoanPositionManager__LoanFundingFailed();
    error LoanPositionManager__HealthFactorOk();
    error LoanPositionManager__LiquidationError();
    error LoanPositionManager__SenderNotOwner();
    error LoanPositionManager__AddCollateralFailed();
    error LoanPositionManager__RepayExpired();
    error LoanPositionManager__RequestExpired();

    ///@notice  Events
    event LoanPositionCreated(
        uint256 indexed loanId, uint256 indexed collateralAmount, uint256 indexed initialThreshold
    );
    event LoanFunded(uint256 indexed loanId, uint256 indexed loanAmount, uint256 indexed debtAmount);
    event LoanLiquidation(uint256 indexed loanId);
    event CollateralAdded(uint256 indexed loanId, uint256 indexed amount);
    event LoanRepaid(uint256 indexed loanId);

    modifier isAllowedToken(address tokenAddress) {
        if (!oracle.isAllowedToken(tokenAddress)) {
            revert LoanPositionManager__TokenNotAvailable();
        }
        _;
    }

    modifier isLoanFundable(uint256 loanId) {
        if (nft.ownerOf(loanId) != address(this)) {
            revert LoanPositionManager__LoanNotFundable();
        }

        if (nft.loanPositions(loanId).loanRequestDeadline < uint64(block.timestamp)) {
            revert LoanPositionManager__RequestExpired();
        }
        _;
    }

    modifier isBorrower(uint256 loanId) {
        if (nft.loanPositions(loanId).borrowerAddress != msg.sender) {
            revert LoanPositionManager__SenderNotOwner();
        }
        _;
    }

    // Modifier to ensure that only the owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    
    function initialize(address oracleAdress, address nftAddress, address treasuryAddress) external initializer {
        owner = msg.sender;
        oracle = IOracleContract(oracleAdress);
        nft = LoanPositionNFT(nftAddress);
        treasury = treasuryAddress;
    }
    /**
     * @notice Create a new loan position
     * @dev the loan amount will be calculated in the moment of this being
     * granted, according to both token's USD value
     * @dev the protocol fee will be directly substracted from the collateral
     * @param loanToken : the adress of the token to borrow
     * @param collateralToken : the address of the collateral token the borrower
     * deposits
     * @param collateralAmount : amount of collateral to deposit
     * @param liquidationThreshold : % of borrowed value over the collateral value
     * needed for the position to be liquidated
     * @param initialThreshold : the desired initial threshold for the borrower,
     * so when the loan is granted doesn't hit the liquidation threshold
     * @param loanRepayDeadline : repay deadline timestamp
     * @param loanRequestDeadline : loan grant deadline timestamp
     * @param interestRate : interest rate the lender gets
     */

    function createLoanPosition(
        address loanToken,
        address collateralToken,
        uint256 collateralAmount,
        uint32 liquidationThreshold,
        uint32 initialThreshold,
        uint64 loanRepayDeadline,
        uint64 loanRequestDeadline,
        uint32 interestRate
    ) external isAllowedToken(loanToken) isAllowedToken(collateralToken) returns (uint256 loanId) {
        if (interestRate == 0 || interestRate >= INTEREST_PRECISION) {
            revert LoanPositionManager__LoanParams_InterestRate();
        }
        if (collateralAmount == 0) {
            revert LoanPositionManager__LoanParams_CollateralAmount();
        }
        if (liquidationThreshold > calculateMaxAllowedLiquidationThreshold(interestRate) || liquidationThreshold == 0) {
            revert LoanPositionManager__LoanParams_LiquidationThreshold();
        }
        if (initialThreshold >= liquidationThreshold || initialThreshold == 0) {
            revert LoanPositionManager__LoanParams_InitialThreshold();
        }
        if (loanRequestDeadline <= uint64(block.timestamp)) {
            revert LoanPositionManager__LoanParams_RequestDeadline();
        }
        if (loanRepayDeadline <= loanRequestDeadline) {
            revert LoanPositionManager__LoanParams_RepayDeadline();
        }

        bool success = IERC20(collateralToken).transferFrom(msg.sender, address(this), collateralAmount);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }

        // Calculate collateral after protocol fee
        uint256 collateralAfterFees = collateralAmount * (INTEREST_PRECISION - PROTOCOL_FEE) / INTEREST_PRECISION;

        success = IERC20(collateralToken).transfer(treasury, collateralAmount - collateralAfterFees);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }

        loanId = nft.mint(
            msg.sender,
            loanToken,
            collateralToken,
            collateralAfterFees,
            liquidationThreshold,
            initialThreshold,
            loanRepayDeadline,
            loanRequestDeadline,
            interestRate
        );
        emit LoanPositionCreated(loanId, collateralAmount, initialThreshold);
    }
    /**
     * @notice Fund an existing loan proposal
     * @param loanId : the id of the token that represents
     * the selected loan proposal
     * @return loanAmount : loan amount the borrower gets
     * @return debtAmount : total debt(loan amount + interest)
     */

    function fundLoan(uint256 loanId)
        external
        isLoanFundable(loanId)
        returns (uint256 loanAmount, uint256 debtAmount)
    {
        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        debtAmount = calculateDebtAmount(
            loanData.collateralToken, loanData.collateralAmount, loanData.loanToken, loanData.initialThreshold
        );

        loanAmount = debtAmount * INTEREST_PRECISION / ((INTEREST_PRECISION + loanData.interestRate));
        bool success = IERC20(loanData.loanToken).transferFrom(msg.sender, loanData.borrowerAddress, loanAmount);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }
        success = nft.init(loanId, debtAmount);
        if (!success) {
            revert LoanPositionManager__LoanFundingFailed();
        }
        nft.transferFrom(address(this), msg.sender, loanId);
        emit LoanFunded(loanId, loanAmount, debtAmount);
    }

    /**
     * @notice Liquidate unhealthy loan positions
     * @param loanId : the id of the token that represents
     * the selected loan
     * @notice after a loan is liquidated the borrower will permanently lose  his collateral and
     * it will be sent to the lender, the sender of the function also gets a bonus out of it
     */

    function liquidate(uint256 loanId) external {
        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        if (healthFactor(loanId) < MIN_HEALTH_FACTOR || loanData.loanRepayDeadline < uint64(block.timestamp)) {
            uint256 reward = loanData.collateralAmount * LIQUIDATION_BONUS / INTEREST_PRECISION;
            uint256 refund = loanData.collateralAmount - reward;
            IERC20 collateralToken = IERC20(loanData.collateralToken);
            bool success = collateralToken.transfer(loanData.lenderAddress, refund);
            if (!success) {
                revert LoanPositionManager__TransferFailed();
            }

            success = collateralToken.transfer(msg.sender, reward);
            if (!success) {
                revert LoanPositionManager__TransferFailed();
            }
            nft.burn(loanId);
            emit LoanLiquidation(loanId);
        } else {
            revert LoanPositionManager__LiquidationError();
        }
    }

    /**
     * @notice Withdraw the provided collateral before the loan is granted
     */

    function withdrawCollateral(uint256 loanId) external isBorrower(loanId) isLoanFundable(loanId) {
        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        bool success = IERC20(loanData.collateralToken).transfer(msg.sender, loanData.collateralAmount);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }
        nft.burn(loanId);
    }
    /**
     * @notice Add more collateral to an existing loan position
     * @param loanId : the id of the token that represents
     * the selected loan
     * @param amount : amount of extra collateral
     */

    function addCollateral(uint256 loanId, uint256 amount) external isBorrower(loanId) {
        if (amount == 0) {
            revert LoanPositionManager__LoanParams_CollateralAmount();
        }

        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        bool success = IERC20(loanData.collateralToken).transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }
        success = nft.addCollateral(loanId, amount);
        if (!success) {
            revert LoanPositionManager__AddCollateralFailed();
        }
        emit CollateralAdded(loanId, amount);
    }

    /// @notice repay a requested loan
    function repay(uint256 loanId) external isBorrower(loanId) {
        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        if (nft.loanPositions(loanId).loanRepayDeadline < uint64(block.timestamp)) {
            revert LoanPositionManager__RepayExpired();
        }
        bool success = IERC20(loanData.loanToken).transferFrom(msg.sender, loanData.lenderAddress, loanData.loanAmount);
        if (!success) {
            revert LoanPositionManager__TransferFailed();
        }
        success = IERC20(loanData.collateralToken).transfer(msg.sender, loanData.collateralAmount);
        nft.burn(loanId);
        emit LoanRepaid(loanId);
    }

    /**
     * @notice The health factor of a specific loan position
     * @notice If it's lesser than {MIN_HEALTH_FACTOR} the position is liquidated
     * @param loanId : the id of the token that represents
     * the selected loan
     */

    function healthFactor(uint256 loanId) public view returns (uint256) {
        LoanPositionNFT.LoanPosition memory loanData = nft.loanPositions(loanId);
        uint256 collateralValueUsd = _getUsdValue(loanData.collateralToken, loanData.collateralAmount);
        uint256 loanValueUsd = _getUsdValue(loanData.loanToken, loanData.loanAmount);
        return _getHealthFactor(loanValueUsd, collateralValueUsd, loanData.liquidationThreshold);
    }
    ///@notice calcualtes the max liquidation threshold considering the @param interestRate of the loan

    function calculateMaxAllowedLiquidationThreshold(uint32 interestRate) public pure returns (uint32) {
        return uint32(INTEREST_PRECISION * INTEREST_PRECISION / (INTEREST_PRECISION + interestRate));
    }

    /// @notice Get the USD value of a amount of tokens, using an oracle contract
    function _getUsdValue(address tokenAddress, uint256 amount) private view returns (uint256) {
        (, int256 price,,,) = oracle.getPrice(tokenAddress);
        return ((uint256(price) * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;
    }

    /// @dev calcualte the loan amount the borrower is getting ,considering the initialThreshold and values of the tokens
    function calculateDebtAmount(
        address collateralToken,
        uint256 collateralAmount,
        address loanToken,
        uint256 initialThreshold
    ) public view returns (uint256 debtAmount) {
        uint256 debtUsdValue = _getUsdValue(collateralToken, collateralAmount) * initialThreshold / INTEREST_PRECISION;
        debtAmount = debtUsdValue * PRECISION / _getUsdValue(loanToken, PRECISION);
    }

    function _getHealthFactor(uint256 loanValueUsd, uint256 collateralValueUsd, uint256 liquidationThreshold)
        private
        pure
        returns (uint256)
    {
        uint256 collateralAdjustedThreshold = (collateralValueUsd * liquidationThreshold) / INTEREST_PRECISION;
        return (collateralAdjustedThreshold * PRECISION) / loanValueUsd;
    }


    // Function to update the Oracle Address, accessible only by the owner
    function updateOracleAddress(address newOracleAddress) external onlyOwner {
        oracle = IOracleContract(newOracleAddress);
    }
}
