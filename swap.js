const { formatNumber, formatMcap } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const {walletgroup} = require("./wallets");
const {fetchData, nftMetaData} = require("./metadata");



async function swapMessage(webhookEvent, Source, wallet, desc, sol, AW1, sig, solcAcct, solToken, user, buyButtons, bot) {
  try {
    const UserAccount = webhookEvent[0].tokenTransfers[0].fromUserAccount;
    const tokenTransfersLength = webhookEvent[0].tokenTransfers.length
    const Mint1 = webhookEvent[0].tokenTransfers[tokenTransfersLength - 2].mint
    const Mint2 = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].mint
    const Mint1swap = webhookEvent[0].tokenTransfers[0].mint
    const Mintswap = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].mint
    if(desc[3] === 'SOL' || desc[6]==='SOL'){
      if(Mint1 == "So11111111111111111111111111111111111111112"){
        const transactionType = 'BUY'
        const quantitySol = webhookEvent[0].tokenTransfers[tokenTransfersLength - 2].tokenAmount 
        const quantitytoken = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].tokenAmount 
        const dexresult = await fetchData(Mint2, quantitySol, quantitytoken);
        const testMessage = `${walletgroup(wallet.group)} ALERT \n*${wallet.name}* *BOUGHT* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(Mint1, quantitySol)}) on ${Source.replace(/_/g, " ")}\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${Mint2}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`
        
        const messageToSend = testMessage;
        // console.log(messageToSend);
  
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: buyButtons(Mint2),
          },
        });
  
      }else if(Mint2 == "So11111111111111111111111111111111111111112"){
        const transactionType = 'SELL'
        const quantitySol = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].tokenAmount 
        const quantitytoken = webhookEvent[0].tokenTransfers[tokenTransfersLength - 2].tokenAmount 
        const dexresult = await fetchData(Mint1, quantitySol, quantitytoken);
         const testMessage = `${walletgroup(wallet.group)} ALERT \n*${wallet.name}* *SOLD* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(Mint2, quantitySol)}) on ${Source.replace(/_/g, " ")}\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${Mint1}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`
  
         const messageToSend = testMessage;
        //  console.log(messageToSend);
   
         bot.telegram.sendMessage(user.chat_id, messageToSend, {
           parse_mode: "Markdown",
           disable_web_page_preview: true,
           reply_markup: {
             inline_keyboard: buyButtons(Mint1),
           },
         });
  
      }
    }else if(Mint1swap !== 'So11111111111111111111111111111111111111112' && Mintswap !== 'So11111111111111111111111111111111111111112'){
      const quantitytoken1 = webhookEvent[0].tokenTransfers[0].tokenAmount 
      const quantitytoken2 = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].tokenAmount 
      const dexresult = await fetchData(Mint1swap);
      const dexresult2 = await fetchData(Mintswap);
       const testMessage = `${walletgroup(wallet.group)} ALERT \n*${wallet.name}* *SWAPPED* *${formatMcap(quantitytoken1)} ${dexresult.ticker}* for *${formatMcap(quantitytoken2)} ${dexresult2.ticker}*(${await soldollarvalue(Mint1swap, quantitytoken1)}) on ${Source.replace(/_/g, " ")}\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${Mint1swap}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick})| [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n*💡${dexresult2.ticker} | MC: ${dexresult2.mcap}*\n\`${Mintswap}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult2.twitter}) | [RICK](${dexresult2.rick})| [DS](${dexresult2.Dexscreener}) | [DT](${dexresult2.Dextools}) | [BE](${dexresult2.Birdeye}) | [Pump](${dexresult2.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`

      const messageToSend = testMessage;
      // console.log(messageToSend);

      bot.telegram.sendMessage(user.chat_id, messageToSend, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: buyButtons(Mint2),
        },
      });
    }

    // if(desc[3] === 'SOL' || desc[6]==='SOL'){
    //   const Mint1 =
    //     webhookEvent[0].tokenTransfers[0].mint ===
    //     "So11111111111111111111111111111111111111112"
    //       ? webhookEvent[0].tokenTransfers[1].mint
    //       : webhookEvent[0].tokenTransfers[0].mint;

    //   const dexresult = await fetchData(Mint1);
    //   console.log('wallet name', wallet.name)
    //   console.log('transcation  result', dexresult);

    //   const swapMessageReply = `
      // ${walletgroup(wallet.group)} ALERT \n${desc[3] === "SOL" ? `[🟢BUY ${desc[6]}](${sig})` : desc[6] === "SOL" ? `[🔴SELL ${desc[3]}](${sig})` : "SWAP"} on ${Source.replace(/_/g, " ")}\n\`${UserAccount}\`(${wallet.name})\n\n 🔹[${wallet.name}](${solcAcct}${UserAccount}) ${desc[1]} ${formatNumber(desc[2])} [${desc[3]}](${solToken}${desc[3] === "SOL" ? sol : Mint1})(${desc[3] === "SOL" ? await soldollarvalue(sol, desc[2]) : await soldollarvalue(Mint1, desc[2])}) ${desc[4]} ${formatNumber(desc[5])} [${desc[6]}](${solToken}${desc[6] === "SOL" ? sol : Mint1})(${desc[6] === "SOL" ? await soldollarvalue(sol, desc[5]) : await soldollarvalue(Mint1, desc[5])}) \n\n*🔗${dexresult.ticker ? dexresult.ticker: desc[3]==='SOL' ? desc[6]: desc[3]}(MC: $${dexresult.mcap})*\nDYOR: [SOT](${dexresult.twitter}) |[DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [PH](${dexresult.Photon})| [BE](${dexresult.Birdeye})| [Rick](${dexresult.rick})| [Pump](${dexresult.pump})\nAnalyse Wallet: [W1](${AW1}${UserAccount})\n*CA:*\`${Mint1}\`
    //   `;

    //   console.log(swapMessageReply)
    //   const messageToSend = swapMessageReply;
    //   console.log(messageToSend);
    //   console.log(desc);

    //   bot.telegram.sendMessage(user.chat_id, messageToSend, {
    //     parse_mode: "Markdown",
    //     disable_web_page_preview: true,
    //     reply_markup: {
    //       inline_keyboard: buyButtons(Mint1),
    //     },
    //   });
    // }else{
    //   const Mint1 = webhookEvent[0].tokenTransfers[0].mint
    //   const Mint2 = webhookEvent[0].tokenTransfers[1].mint

    //   const dexresult = await fetchData(Mint1);
    //   const dexresult2 = await fetchData(Mint2);
    //   console.log(dexresult);
    //   console.log(dexresult2);

    //   const swapMessageReply = `
    //   ${walletgroup(wallet.group)} ALERT  \n[SWAP](${sig}) on ${Source.replace(/_/g, " ")}\n\`${UserAccount}\`(${wallet.name})\n\n 🔹[${wallet.name}](${solcAcct}${UserAccount}) ${desc[1]} ${formatNumber(desc[2])} [${desc[3]}](${solToken}${Mint1})(${await soldollarvalue(Mint1, desc[2])}) ${desc[4]} ${formatNumber(desc[5])} [${desc[6]}](${solToken}${Mint2})(${await soldollarvalue(Mint2, desc[5])}) \n\n*🔗${dexresult.ticker}(MC: ${dexresult.mcap})*\nDYOR: [SOT](${dexresult.twitter}) |[DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [PH](${dexresult.Photon})| [BE](${dexresult.Birdeye})| [Rick](${dexresult.rick})| [Pump](${dexresult.pump})\nAnalyse Wallet: [W1](${AW1}${UserAccount})\n*CA:*\`${Mint1}\` \n\n*🔗${dexresult2.ticker}(MC: $${dexresult2.mcap})*\nDYOR: [SOT](${dexresult2.twitter}) |[DS](${dexresult2.Dexscreener}) | [DT](${dexresult2.Dextools}) | [PH](${dexresult2.Photon})| [BE](${dexresult2.Birdeye})| [Rick](${dexresult2.rick})| [Pump](${dexresult2.pump})\nAnalyse Wallet: [W1](${AW1}${UserAccount})\n*CA:*\`${Mint2}\`
    //   `;
 
    //   const messageToSend = swapMessageReply;
    //   console.log(messageToSend);
    //   console.log(desc);

    //   bot.telegram.sendMessage(user.chat_id, messageToSend, {
    //     parse_mode: "Markdown",
    //     disable_web_page_preview: true,
    //     reply_markup: {
    //       inline_keyboard: buyButtons(Mint1),
    //     },
    //   });
    // }
  } catch (e) {
    console.log("buy, sell or swap error", e);
  }
}


module.exports = {swapMessage}