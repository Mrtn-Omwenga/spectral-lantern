# 🏗 Scaffold-ETH 2

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## Contents

- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Deploying your Smart Contracts to a Live Network](#deploying-your-smart-contracts-to-a-live-network)
- [Deploying your NextJS App](#deploying-your-nextjs-app)
  - [Scaffold App Configuration](#scaffold-app-configuration)
- [Deploying to Vercel without any checks](#deploying-to-vercel-without-any-checks)
- [How to interact with the frontend](#how-to-interact-with-the-frontend)
  
  
  

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/Koryntia/simpleFrontendDemo__usingScaffoldETH.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:
// run 
```
node -v 
```
to make sure your node version is 18, if not run
```
nvm install 18
```
after your node version is 18, then run yarn start as the below says
```
yarn start

```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the contract component or the example ui in the frontend. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Deploying your Smart Contracts to a Live Network

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/hardhat/hardhat.config.ts.` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Check the `hardhat.config.ts` for the networks that are pre-configured. You can also add other network settings to the `hardhat.config.ts` file. Here are the [Alchemy docs](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask) for information on specific networks.

Example: To deploy the contract to the Sepolia network, run the command below:

```
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```
ALCHEMY_API_KEY="",
DEPLOYER_PRIVATE_KEY=""
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```
yarn verify --network network_name
```

## Deploying your NextJS App

**Hint**: We recommend connecting your GitHub repo to Vercel (through the Vercel UI) so it gets automatically deployed when pushing to `main`.

If you want to deploy directly from the CLI, run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Make sure to check the values of your Scaffold Configuration before deploying your NextJS App.**

### Scaffold App Configuration

You can configure different settings for your dapp at `packages/nextjs/scaffold.config.ts`.

```ts
export type ScaffoldConfig = {
  targetNetwork: chains.Chain;
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
  // your dapp custom config, eg:
  // tokenIcon : string;
};
```

The configuration parameters are described below, make sure to update the values according to your needs:

- **targetNetwork**  
  Sets the blockchain network where your dapp is deployed. Use values from `wagmi/chains`.

- **pollingInterval**  
  The interval in milliseconds at which your front-end application polls the RPC servers for fresh data. _Note that this setting does not affect the local network._

- **alchemyApiKey**  
  Default Alchemy API key from Scaffold ETH 2 for local testing purposes.  
  It's recommended to obtain your own API key from the [Alchemy Dashboard](https://dashboard.alchemyapi.io/) and store it in an environment variable: `NEXT_PUBLIC_ALCHEMY_API_KEY` at `\packages\nextjs\.env.local` file.

- **walletConnectProjectId**  
  WalletConnect's default project ID from Scaffold ETH 2 for local testing purposes.
  It's recommended to obtain your own project ID from the [WalletConnect website](https://cloud.walletconnect.com) and store it in an environment variable: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` at `\packages\nextjs\.env.local` file.

- **onlyLocalBurnerWallet**  
  Controls the networks where the Burner Wallet feature is available. This feature provides a lightweight wallet for users.

  - `true` => Use Burner Wallet only on hardhat network.
  - `false` => Use Burner Wallet on all networks.

- **walletAutoConnect**  
  Set it to `true` to activate automatic wallet connection behavior:
  - If the user was connected into a wallet before, on page reload it reconnects automatically.
  - If user is not connected to any wallet, on reload, it connects to the burner wallet if it is enabled for the current network. See `onlyLocalBurnerWallet`

You can extend this configuration file, adding new parameters that you need to use across your dapp **(make sure you update the above type `ScaffoldConfig`)**:

```ts
  tokenIcon: "💎",
```

To use the values from the `ScaffoldConfig` in any other file of your application, you first need to import it in those files:

```ts
import scaffoldConfig from "~~/scaffold.config";
```



### Deploying to Vercel without any checks

By default, Vercel runs types and lint checks before building your app. The deployment will fail if there are any types or lint errors.

To ignore these checks while deploying from the CLI, use:

```shell
yarn vercel:yolo
```

If your repo is connected to Vercel, you can set `NEXT_PUBLIC_IGNORE_BUILD_ERROR` to `true` in a [environment variable](https://vercel.com/docs/concepts/projects/environment-variables).


### How to interact with the frontend
                              


1. Forget about the YourContract smart when you see on the frontend, it has nothing to do with the lending protocol,
   it just shows how to create a awesome UI when you click the Example UI in the banner of the demo app
   (packages/nextjs/components/example-ui) you can have a look at this path on how to create the awesome UI according to the 
   contract if you want to

2. ```
   ////////////////////////////////////////////////////////////////////////
   ///First, we need to interact with the Oracle contract//////////////////
   ////////////////////////////////////////////////////////////////////////
   ```
   1. go to ```https://sepolia.etherscan.io/``` and search the type of token you want to collateral,
      you will see the token address of it
   2. put that token address to isAllowedToken function to see if it is allowed,
      if it is allowed, perfect! you can continute, if not, go to ```https://docs.chain.link/data-feeds/price-feeds/addresses```
      select the pricefeed address according to you type of token under sepolia testnet,
      put the type of token address and pricefeed address to addNewToken function, then you can add a new type of token
      to collateral
   3. when a type of token is allowed, you can get the token price by putting the type of token address to getPrice function

3. ```
   ////////////////////////////////////////////////////////////////////////
   ///Second, we can  to interact with the LoanPositionNFT contract////////
   ////////////////////////////////////////////////////////////////////////
   ```
   1. click the initialize function first
   2. use mint function to mint a NFT, it will return a token ID, first token ID will be 1
   3. call the balanceOf function by the parameter of your metamask contract, if it is minted sucessfully
      you will see the result is 1
   4. call the init function by passing the token ID and the loanamount you would like to loan(it must less
      than you collateral ammount)
   5. call the loanPositions function with the token ID, you can see all the parameters of your NFT
   6. the Owner of LoanPositionNFT can call the burn function by passing the token ID to burn the NFT 

4. ```
   ////////////////////////////////////////////////////////////////////////
   ////Third, we can  to interact with the LoanPositionManager contract////
   ////////////////////////////////////////////////////////////////////////
   ```
   1. There is a bug that need to be fix

5. ```
   ////////////////////////////////////////////////////////////////////////
   ///Four, we can  to interact with the Treasury contract/////////////////
   ////////////////////////////////////////////////////////////////////////
   ```
   1. call the withdraw function to withdraw the collateral fee, perfect!!!
  
   
