const axios = require("axios");
const {apiUrl} = require('./api')

const editWebhook = async (wallet) => {
  try {
    // Fetch the current webhook details
    const getResponse = await fetch(
      `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
    );
    const webhookData = await getResponse.json();

    // Combine existing accountAddresses with new wallet addresses, ensuring no duplicates
    const combinedAddresses = [...new Set([...webhookData.accountAddresses, ...wallet])];

    // Update the webhook with the combined addresses
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookURL:
            "https://godeye-3d8a522e85b5.herokuapp.com/webhook",
          transactionTypes: [
            "TRANSFER",
            "SWAP",
            "ADD_LIQUIDITY",
            "BURN",
            "BURN_NFT",
            "SELL_NFT",
            "STAKE_SOL",
            "STAKE_TOKEN",
            "TOKEN_MINT",
            "UNSTAKE_SOL",
            "UNSTAKE_TOKEN",
            "NFT_LISTING",
            "NFT_SALE",
            "NFT_CANCEL_LISTING",
            "NFT_MINT",
            "COMPRESSED_NFT_BURN",
            "WITHDRAW_LIQUIDITY",
            "ADD_LIQUIDITY"
          ],
          accountAddresses: combinedAddresses,
          webhookType: "enhanced",
        }),
      }
    );
    const data = await response.json();
    console.log({ data });
  } catch (e) {
    console.error("error", e);
  }
};


// const editWebhookurl = async () => {
//   try {
//     // Fetch the current webhook details
//     const getResponse = await fetch(
//       `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
//     );
//     const webhookData = await getResponse.json();

//     // Update the webhook with the combined addresses
//     const response = await fetch(
//       `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           webhookURL:
//             "https://godeye-3d8a522e85b5.herokuapp.com/webhook",
//           transactionTypes: [
//             "TRANSFER",
//             "SWAP",
//             "ADD_LIQUIDITY",
//             "BURN",
//             "BURN_NFT",
//             "SELL_NFT",
//             "STAKE_SOL",
//             "STAKE_TOKEN",
//             "TOKEN_MINT",
//             "UNSTAKE_SOL",
//             "UNSTAKE_TOKEN",
//             "NFT_LISTING",
//             "NFT_SALE",
//             "NFT_CANCEL_LISTING",
//             "NFT_MINT",
//             "COMPRESSED_NFT_BURN",
//             "WITHDRAW_LIQUIDITY",
//             "ADD_LIQUIDITY"
//           ],
//           accountAddresses: webhookData.accountAddresses,
//           webhookType: "enhanced",
//         }),
//       }
//     );
//     const data = await response.json();
//     console.log({ data });
//   } catch (e) {
//     console.error("error", e);
//   }
// };

const removeWalletWebhook = async (wallet) => {
  try {
    // Fetch the current webhook details
    const getResponse = await fetch(
      `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
    );
    const webhookData = await getResponse.json();

    // Combine existing accountAddresses with new wallet addresses, ensuring no duplicates
    const combinedAddresses = webhookData.accountAddresses;
    const updatedAddresses = combinedAddresses.filter(item => item !== wallet)

    // Update the webhook with the combined addresses
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookURL:
            "https://godeye-3d8a522e85b5.herokuapp.com/webhook",
          transactionTypes: [
            "TRANSFER",
            "SWAP",
            "ADD_LIQUIDITY",
            "BURN",
            "BURN_NFT",
            "SELL_NFT",
            "STAKE_SOL",
            "STAKE_TOKEN",
            "TOKEN_MINT",
            "UNSTAKE_SOL",
            "UNSTAKE_TOKEN",
          ],
          accountAddresses: updatedAddresses,
          webhookType: "enhanced",
        }),
      }
    );
    const data = await response.json();
    console.log({ data });
  } catch (e) {
    console.error("error", e);
  }
};

async function haltWallets(chatID, pro){
  try {
    console.log('Halting')
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const allWallets = res.data.wallets;
    const walletLimit = res.data.walletLimit
    const myaddress = allWallets.map(item=>item.address)
    if(pro===false && walletLimit > 20 ){
      const getResponse = await fetch(
        `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
      );
      const webhookData = await getResponse.json();
      const combinedAddresses = webhookData.accountAddresses;
      const updatedAddresses = combinedAddresses.filter(item => !myaddress.includes(item));
      console.log(updatedAddresses)
      // Update the webhook with the combined addresses
      const response = await fetch(
        `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhookURL:
              "https://godeye-3d8a522e85b5.herokuapp.com/webhook",
            transactionTypes: [
              "TRANSFER",
              "SWAP",
              "ADD_LIQUIDITY",
              "BURN",
              "BURN_NFT",
              "SELL_NFT",
              "STAKE_SOL",
              "STAKE_TOKEN",
              "TOKEN_MINT",
              "UNSTAKE_SOL",
              "UNSTAKE_TOKEN",
            ],
            accountAddresses: updatedAddresses,
            webhookType: "enhanced",
          }),
        }
      );
      const data = await response.json();
      console.log('pro expired');
    }else{
      console.log('Still a pro user')
    }
  } catch (e) {
    console.error("error");
  }
}

// async function continueWallets(ctx){
//   try {
//     const res = await axios.get(
//       `${apiUrl}${ctx.from.username}`,
//     );
//     const allWallets = res.data.wallets;
//     const myaddress = allWallets.map(item=>item.address)
//     const getResponse = await fetch(
//       `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
//     );
//     const webhookData = await getResponse.json();

//     // Combine existing accountAddresses with new wallet addresses, ensuring no duplicates
//     const combinedAddresses = [...new Set([...webhookData.accountAddresses, ...myaddress])];

//     // Update the webhook with the combined addresses
//     const response = await fetch(
//       `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           webhookURL:
//             "https://04d44488-19ca-4991-9b4c-ce61ea02cb1a-00-ql75piaetz4j.janeway.replit.dev/webhook",
//           transactionTypes: [
//             "TRANSFER",
//             "SWAP",
//             "ADD_LIQUIDITY",
//             "BURN",
//             "BURN_NFT",
//             "SELL_NFT",
//             "STAKE_SOL",
//             "STAKE_TOKEN",
//             "TOKEN_MINT",
//             "UNSTAKE_SOL",
//             "UNSTAKE_TOKEN",
//           ],
//           accountAddresses: combinedAddresses,
//           webhookType: "enhanced",
//         }),
//       }
//     );
//     const data = await response.json();
//     console.log({ data });
//   } catch (e) {
//     console.error("error", e);
//   }
// }

module.exports = { editWebhook, removeWalletWebhook, haltWallets, editWebhookurl }