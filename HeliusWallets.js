const axios = require("axios");

async function checkWallets(amt, myAddress){
  try{
    const walletLength = myAddress.length 
    const amountofWallets = amt === 0.001 ? 100 : amt === 0.002 ? 200 : amt === 0.003 ? 500 : 20
    console.log(amountofWallets)
    const addressToHelius = walletLength >= amountofWallets ? myAddress.slice(0, amountofWallets) : myAddress 
    console.log('all address to helius', addressToHelius)
      const getResponse = await fetch(
        `https://api.helius.xyz/v0/webhooks/9f5b398e-99b1-4a3c-911e-6593f0630943?api-key=${process.env.API_KEY}`
      );
      const webhookData = await getResponse.json();
    const combinedAddresses = webhookData.accountAddresses;
    const updatedAddresses = combinedAddresses.filter(item => !myAddress.includes(item));
      const ttAddresses = [...new Set([...updatedAddresses, ...addressToHelius])];

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
            accountAddresses: ttAddresses,
            webhookType: "enhanced",
          }),
        }
      );
      const data = await response.json();
      console.log({ data });
  }catch(e){
    console.log('no wallets sent to helius')
  }
}

module.exports = {checkWallets}