const contracts = {
  11155111: [
    {
      chainId: "11155111",
      name: "sepolia",
      contracts: {
        LoanPositionManager: {
          address: "0x4D080A303646fe3B8CDAdb9eB929148F9fCc5D6D",
          abi: [
            {
              inputs: [],
              name: "LoanPositionManager__AddCollateralFailed",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__HealthFactorOk",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LiquidationError",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanFundingFailed",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanNotFundable",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_Applicant",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_CollateralAmount",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_InitialThreshold",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_InterestRate",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_LiquidationThreshold",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_LoanAmount",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_RepayDeadline",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__LoanParams_RequestDeadline",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__Loan_AlreadyInitialized",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__RepayExpired",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__RequestExpired",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__SenderNotOwner",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__TokenNotAvailable",
              type: "error",
            },
            {
              inputs: [],
              name: "LoanPositionManager__TransferFailed",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "CollateralAdded",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint8",
                  name: "version",
                  type: "uint8",
                },
              ],
              name: "Initialized",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanAmount",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "debtAmount",
                  type: "uint256",
                },
              ],
              name: "LoanFunded",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "LoanLiquidation",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "collateralAmount",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "initialThreshold",
                  type: "uint256",
                },
              ],
              name: "LoanPositionCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "LoanRepaid",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "addCollateral",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "collateralToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "collateralAmount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "loanToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "initialThreshold",
                  type: "uint256",
                },
              ],
              name: "calculateDebtAmount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "debtAmount",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint32",
                  name: "interestRate",
                  type: "uint32",
                },
              ],
              name: "calculateMaxAllowedLiquidationThreshold",
              outputs: [
                {
                  internalType: "uint32",
                  name: "",
                  type: "uint32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "loanToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "collateralToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "collateralAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "liquidationThreshold",
                  type: "uint32",
                },
                {
                  internalType: "uint32",
                  name: "initialThreshold",
                  type: "uint32",
                },
                {
                  internalType: "uint64",
                  name: "loanRepayDeadline",
                  type: "uint64",
                },
                {
                  internalType: "uint64",
                  name: "loanRequestDeadline",
                  type: "uint64",
                },
                {
                  internalType: "uint32",
                  name: "interestRate",
                  type: "uint32",
                },
              ],
              name: "createLoanPosition",
              outputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "fundLoan",
              outputs: [
                {
                  internalType: "uint256",
                  name: "loanAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "debtAmount",
                  type: "uint256",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "healthFactor",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "oracleAdress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "treasuryAddress",
                  type: "address",
                },
              ],
              name: "initialize",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "liquidate",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "repay",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
              ],
              name: "withdrawCollateral",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        LoanPositionNFT: {
          address: "0xa4f26C5ff9F93626b74c9a5AdE3752F9208a798F",
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "approved",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Approval",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "ApprovalForAll",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint8",
                  name: "version",
                  type: "uint8",
                },
              ],
              name: "Initialized",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "Transfer",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "loanId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "addCollateral",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "burn",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "getApproved",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "init",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "initialize",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
              ],
              name: "isApprovedForAll",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "loanPositions",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "borrowerAddress",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "lenderAddress",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "loanToken",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "loanAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "address",
                      name: "collateralToken",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "collateralAmount",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "liquidationThreshold",
                      type: "uint256",
                    },
                    {
                      internalType: "uint256",
                      name: "initialThreshold",
                      type: "uint256",
                    },
                    {
                      internalType: "uint64",
                      name: "loanRepayDeadline",
                      type: "uint64",
                    },
                    {
                      internalType: "uint64",
                      name: "loanRequestDeadline",
                      type: "uint64",
                    },
                    {
                      internalType: "uint32",
                      name: "interestRate",
                      type: "uint32",
                    },
                  ],
                  internalType: "struct LoanPositionNFT.LoanPosition",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "applicant",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "loanToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "collateralToken",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "collateralAmount",
                  type: "uint256",
                },
                {
                  internalType: "uint32",
                  name: "liquidationThreshold",
                  type: "uint32",
                },
                {
                  internalType: "uint32",
                  name: "initialThreshold",
                  type: "uint32",
                },
                {
                  internalType: "uint64",
                  name: "loanRepayDeadline",
                  type: "uint64",
                },
                {
                  internalType: "uint64",
                  name: "loanRequestDeadline",
                  type: "uint64",
                },
                {
                  internalType: "uint32",
                  name: "interestRate",
                  type: "uint32",
                },
              ],
              name: "mint",
              outputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "name",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "nextTokenId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "ownerOf",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "safeTransferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "operator",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "approved",
                  type: "bool",
                },
              ],
              name: "setApprovalForAll",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "symbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "tokenURI",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        Oracle: {
          address: "0xD505B8CF9fBD7Ebbc54295387940605f41769a82",
          abi: [
            {
              inputs: [],
              name: "StalePrice",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_tokenAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_priceFeed",
                  type: "address",
                },
              ],
              name: "addNewToken",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_tokenAddress",
                  type: "address",
                },
              ],
              name: "getPrice",
              outputs: [
                {
                  internalType: "uint80",
                  name: "",
                  type: "uint80",
                },
                {
                  internalType: "int256",
                  name: "",
                  type: "int256",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
                {
                  internalType: "uint80",
                  name: "",
                  type: "uint80",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "contract AggregatorV3Interface",
                  name: "",
                  type: "address",
                },
              ],
              name: "getTimeout",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_tokenAddress",
                  type: "address",
                },
              ],
              name: "isAllowedToken",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        Treasury: {
          address: "0xe99CC6E3D1DaE3ac4930595741c3B3e261294e83",
          abi: [
            {
              inputs: [],
              name: "TokenBalanceNotGreaterThanZero",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_tokenAddress",
                  type: "address",
                },
              ],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        YourContract: {
          address: "0x6E8b9694291550650B830063eB675a6f5D4d15CD",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "greetingSetter",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "newGreeting",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "premium",
                  type: "bool",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "GreetingChange",
              type: "event",
            },
            {
              inputs: [],
              name: "greeting",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "premium",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_newGreeting",
                  type: "string",
                },
              ],
              name: "setGreeting",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "totalCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "userGreetingCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
