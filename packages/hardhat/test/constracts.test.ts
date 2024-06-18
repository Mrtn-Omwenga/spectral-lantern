import { expect } from "chai";
import { ethers } from "hardhat";
import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { LoanPositionManager, LoanPositionNFT, Treasury } from "../typechain-types";
import { Oracle } from "../typechain-types";

describe("Oracle Contract", function () {
  const tokenAddress = "0x82fb927676b53b6eE07904780c7be9b4B50dB80b";
  const valid_priceFeed = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
  const invalid_priceFeed = "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22";
  let allowedAddresses: string[] = [];

  describe("Deployment with no allowed price feed", async function () {
    let oracle: Oracle;
    beforeEach(async () => {
      //Fetch Token from Blockchain
      const Oracle = await ethers.getContractFactory("Oracle");
      oracle = (await Oracle.deploy(allowedAddresses)) as Oracle;
    });
    it("Should allow any pricefeed address if no addresses specified", async function () {
      await expect(oracle.addNewToken(tokenAddress, valid_priceFeed)).not.to.be.reverted;
    });
  });

  describe("Deployment with allowed price feed", async function () {
    const addPriceFeed = "0x070bF128E88A4520b3EfA65AB1e4Eb6F0F9E6632";
    const allowedPriceFeed = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
    allowedAddresses = [
      "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      "0xc59E3633BAAC79493d908e63626716e204A45EdF",
      "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
    ];
    let user: string | Signer | Provider;
    let oracle: Oracle;
    beforeEach(async () => {
      //Fetch Token from Blockchain
      const accounts = await ethers.getSigners();
      user = accounts[1];
      const Oracle = await ethers.getContractFactory("Oracle");
      oracle = (await Oracle.deploy(allowedAddresses)) as Oracle;
    });
    it("Should allow valid pricefeed address", async function () {
      await expect(oracle.addNewToken(tokenAddress, valid_priceFeed)).not.to.be.reverted;
    });

    it("Should not allow invalid pricefeed address", async function () {
      await expect(oracle.addNewToken(tokenAddress, invalid_priceFeed)).to.be.revertedWith(
        "Not an allowed price feed address",
      );
    });

    it("Should not allow to addPriceFeed address already in allowed array", async function () {
      await expect(oracle.addPriceFeedAddress(allowedPriceFeed)).to.be.revertedWith("Price Feed is already allowed");
    });

    it("Should revert if deletePriceFeed not in allowed array", async function () {
      await expect(oracle.deletePriceFeedAddress(addPriceFeed)).to.be.revertedWith("Price Feed is not allowed");
    });

    it("Should add new address to the allowed array", async function () {
      await oracle.addPriceFeedAddress(addPriceFeed);
      await expect(oracle.addNewToken(tokenAddress, addPriceFeed)).not.to.be.reverted;
    });

    it("Should delete address from the allowed array", async function () {
      oracle.deletePriceFeedAddress(allowedPriceFeed);
      await expect(oracle.addNewToken(tokenAddress, allowedPriceFeed)).to.be.revertedWith(
        "Not an allowed price feed address",
      );
    });

    it("Should revert if addPriceFeed function called by non-owner", async function () {
      await expect(oracle.connect(user).addPriceFeedAddress(addPriceFeed)).to.be.reverted;
    });
    it("Should revert if deletePriceFeed function called by non-owner", async function () {
      await expect(oracle.connect(user).deletePriceFeedAddress(allowedPriceFeed)).to.be.reverted;
    });
  });
});

describe("LoanPositionManager", function () {
  let borrower: string | Signer | Provider;
  let investor: string | Signer | Provider;
  let owner: string | Signer | Provider;

  let manager: LoanPositionManager;
  let oracle: Oracle;
  let nftContract: LoanPositionNFT;
  let treasuryContract: Treasury;

  const allowedAddresses = [
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
    "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
    "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
  ];

  const tokens = {
    "ETH/USD": {
      contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      priceFeed: allowedAddresses[0],
    },
    "BTC/USD": {
      contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      priceFeed: allowedAddresses[1],
    },
    "DAI/USD": {
      contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      priceFeed: allowedAddresses[2],
    },
    "USDT/USD": {
      contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      priceFeed: allowedAddresses[3],
    },
  };

  beforeEach(async () => {
    [owner, borrower, investor] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory("Oracle");
    oracle = (await Oracle.deploy(allowedAddresses)) as Oracle;

    const NFTContract = await ethers.getContractFactory("LoanPositionNFT");
    nftContract = (await NFTContract.deploy()) as LoanPositionNFT;

    const TreasuryContract = await ethers.getContractFactory("Treasury");
    treasuryContract = (await TreasuryContract.deploy()) as Treasury;

    const Manager = await ethers.getContractFactory("LoanPositionManager");
    manager = (await Manager.deploy()) as LoanPositionManager;

    await manager.initialize(oracle.address, nftContract.address, treasuryContract.address);

    await oracle.addNewToken(tokens["ETH/USD"]["contract"], tokens["ETH/USD"]["priceFeed"]);
    await oracle.addNewToken(tokens["BTC/USD"]["contract"], tokens["BTC/USD"]["priceFeed"]);
    await oracle.addNewToken(tokens["DAI/USD"]["contract"], tokens["DAI/USD"]["priceFeed"]);
    await oracle.addNewToken(tokens["USDT/USD"]["contract"], tokens["USDT/USD"]["priceFeed"]);
  });

  it("should update the Oracle Address when called by the owner", async function () {
    const newOracleAddress = "0x0123456789abcDEF0123456789abCDef01234567";

    await manager.updateOracleAddress(newOracleAddress);

    expect(await manager.oracle()).to.equal(newOracleAddress.toString());
  });

  it("should not allow non-owners to update the Oracle Address", async function () {
    const newOracleAddress = "0x0123456789abcDEF0123456789abCDef01234567";
    await expect(manager.connect(borrower).updateOracleAddress(newOracleAddress)).to.be.revertedWith("Not the owner");
  });

  it("should create a loan position with valid parameters", async function () {
    await expect(
      manager
        .connect(owner)
        .createLoanPosition(
          tokens["USDT/USD"]["contract"],
          tokens["ETH/USD"]["contract"],
          1000,
          1500,
          2000,
          1672531199,
          1672527599,
          500,
        ),
    ).not.to.be.reverted;
  });

  it("should revert when creating a loan with invalid parameters", async function () {
    await expect(
      manager
        .connect(owner)
        .createLoanPosition(
          tokens["USDT/USD"]["contract"],
          tokens["ETH/USD"]["contract"],
          0,
          1500,
          2000,
          1829715599,
          1763961599,
          500,
        ),
    ).to.be.reverted;
  });

  it("should fund a valid loan proposal", async function () {
    await nftContract
      .connect(owner)
      .mint(
        await borrower.address,
        "0x82fb927676b53b6eE07904780c7be9b4B50dB80b",
        "0x82fb927676b53b6eE07904780c7be9b4B50dB80b",
        1000,
        1500,
        2000,
        1672531199,
        1672527599,
        500,
      );
    await expect(manager.connect(investor).fundLoan(1)).not.to.be.reverted;
  });

  it("should revert when funding a loan that doesn't meet requirements", async function () {
    await expect(manager.connect(investor).fundLoan(999)).to.be.reverted;
  });

  it("should liquidate unhealthy loan positions", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(investor).liquidate(1)).not.to.be.reverted;
  });

  it("should revert when liquidating healthy loan positions", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(investor).liquidate(1)).to.be.revertedWith("LoanPositionManager__LiquidationError");
  });

  it("should add collateral to an existing loan", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(borrower).addCollateral(1, 500)).not.to.be.reverted;
  });

  it("should revert when adding zero collateral", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(borrower).addCollateral(1, 0)).to.be.revertedWith(
      "LoanPositionManager__LoanParams_CollateralAmount",
    );
  });

  it("should repay a loan before the deadline", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(borrower).repay(1)).not.to.be.reverted;
  });

  it("should revert when repaying a loan after the deadline", async function () {
    await manager
      .connect(owner)
      .mint(
        await borrower.address,
        tokens["USDT/USD"]["contract"],
        tokens["ETH/USD"]["contract"],
        1000,
        1500,
        2000,
        1829715599,
        1763961599,
        500,
      );
    await manager.connect(investor).fundLoan(1);
    await expect(manager.connect(borrower).repay(999)).to.be.revertedWith("LoanPositionManager__LoanNotRepayable");
  });
});
