import { expect } from "chai";
import { ethers } from "hardhat";
import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { LoanPositionManager, LoanPositionNFT, Treasury, YourContract } from "../typechain-types";
import { Oracle } from "../typechain-types";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let yourContract: YourContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(owner.address)) as YourContract;
    await yourContract.deployed();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await yourContract.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should allow setting a new message", async function () {
      const newGreeting = "Learn Scaffold-ETH 2! :)";

      await yourContract.setGreeting(newGreeting);
      expect(await yourContract.greeting()).to.equal(newGreeting);
    });
  });
});

describe("Oracle Contract", function () {
  const allowedAddresses = [
    "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
  ];

  const tokenAddress = "0x82fb927676b53b6eE07904780c7be9b4B50dB80b";
  const valid_priceFeed = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
  const invalid_priceFeed = "0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22";

  //We gonna write test inside this function
  let oracle: Oracle;
  beforeEach(async () => {
    //Fetch Token from Blockchain
    const Oracle = await ethers.getContractFactory("Oracle");
    oracle = (await Oracle.deploy(allowedAddresses)) as Oracle;
  });

  describe("Deployment", async function () {
    it("Should revert if no address passed", async function () {
      await expect(oracle.addNewToken(tokenAddress, valid_priceFeed)).not.to.be.reverted;
    });

    it("Should allow the valid pricefeed address", async function () {
      await expect(oracle.addNewToken(tokenAddress, valid_priceFeed)).not.to.be.reverted;
    });

    it("Should not allow invalid pricefeed address", async function () {
      await expect(oracle.addNewToken(tokenAddress, invalid_priceFeed)).to.be.revertedWith(
        "Not an allowed price feed address",
      );
    });
  });
});

describe("LoanPositionManager", function () {
  let user: string | Signer | Provider;

  const allowedAddresses = [
    "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
  ];

  let manager: LoanPositionManager;
  let oracle: Oracle;
  let nftContract: LoanPositionNFT;
  let treasuryContract: Treasury;
  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    user = accounts[1];

    const Oracle = await ethers.getContractFactory("Oracle");
    oracle = (await Oracle.deploy(allowedAddresses)) as Oracle;
    await oracle.deployed();

    const NFTContract = await ethers.getContractFactory("LoanPositionNFT");
    nftContract = (await NFTContract.deploy()) as LoanPositionNFT;
    await nftContract.deployed();

    const TreasuryContract = await ethers.getContractFactory("Treasury");
    treasuryContract = (await TreasuryContract.deploy()) as Treasury;
    await treasuryContract.deployed();

    const Manager = await ethers.getContractFactory("LoanPositionManager");
    manager = (await Manager.deploy()) as LoanPositionManager;

    await manager.initialize(oracle.address, nftContract.address, treasuryContract.address);
  });

  it("should update the Oracle Address when called by the owner", async function () {
    const newOracleAddress = "0x0123456789abcDEF0123456789abCDef01234567";

    await manager.updateOracleAddress(newOracleAddress);

    expect(await manager.oracle()).to.equal(newOracleAddress.toString());
  });

  it("should not allow non-owners to update the Oracle Address", async function () {
    const newOracleAddress = "0x0123456789abcDEF0123456789abCDef01234567";

    // Switching to a different user
    await expect(manager.connect(user).updateOracleAddress(newOracleAddress)).to.be.revertedWith("Not the owner");
  });

  // Add more test cases as needed
});
