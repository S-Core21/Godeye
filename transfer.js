const { formatNumber, formatMcap, shortenString } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const {walletgroup} = require("./wallets");
const {fetchData, checkProgramId, nftMetaData} = require("./metadata");



async function transferMessage(webhookEvent, wallet, wallet2, sig, Source, solcAcct, desc, sol, AW1, bot, user, address1, address2, buyButtons){
  try{
    const pumpFunProgramID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
    const moonshotProgramID = 'MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG'
    const degenFundProgramID = 'degenhbmsyzLpJUwwrzjsPyhPNvLurBFB4k1pBWSoxs'
    const instructions = webhookEvent[0].instructions
    const isPumpId = checkProgramId(instructions, pumpFunProgramID);
    const isMoonshotId = checkProgramId(instructions, moonshotProgramID);
    const isDegenId = checkProgramId(instructions, degenFundProgramID);
    const sourceofTx = isPumpId ? 'PUMP FUN' : isMoonshotId ? 'MOONSHOT' : isDegenId ? 'DEGEN FUND' : 'UNKNOWN'
    const accountData = webhookEvent[0].accountData
    const senderAcctData = accountData.find(
      (accountInfo) => accountInfo.account === address1
    )
    const ReceiverAcctData = accountData.find(
      (accountInfo) => accountInfo.account === address2
    )
    console.log(senderAcctData)
    console.log(ReceiverAcctData)
    if (wallet && wallet2) {
      if (desc[3] === "SOL") {
        const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *${wallet2.name}*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${wallet})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        const tmint = webhookEvent[0].tokenTransfers[0].mint;
         console.log('ca:', tmint)
        const dexresult = await fetchData(tmint);

        const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *${wallet2.name}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet.address}) `
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: buyButtons(tmint),
          },
        });
      }
    } else if (wallet && !wallet2) {
      if (desc[3] === "SOL" && webhookEvent[0].tokenTransfers.length !== 2 ) {
        const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *ANON*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${address2}\` ➡️ [ANON](${solcAcct}${address2}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      }else if(desc[3] === "SOL" && webhookEvent[0].tokenTransfers.length === 2){
        const quantitySol = webhookEvent[0].tokenTransfers[0].tokenAmount
        const quantitytoken = webhookEvent[0].tokenTransfers[1].tokenAmount 
        const tmint = webhookEvent[0].tokenTransfers[1].mint;
        const txsource = await checksource(tmint)
        const solmint = "So11111111111111111111111111111111111111112"
        const dexresult = await fetchData(tmint, quantitySol, quantitytoken);
          const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* *BOUGHT* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(solmint, quantitySol)}) on *${Source.replace(/_/g, " ")}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse wallet:* [W1](${AW1}${wallet.address})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address})`
          bot.telegram.sendMessage(user.chat_id, messageToSend, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: buyButtons(tmint),
            },
          });
      }else {
          if(ReceiverAcctData.nativeBalanceChange !== 0 && Source === 'SYSTEM_PROGRAM'){
            const quantitySol = Math.abs(ReceiverAcctData.nativeBalanceChange / 1000000000) 
            console.log(quantitySol)
            const quantitytoken = webhookEvent[0].tokenTransfers[0].tokenAmount 
            const tmint = webhookEvent[0].tokenTransfers[0].mint;
            const solmint = "So11111111111111111111111111111111111111112"
            const dexresult = await fetchData(tmint, quantitySol, quantitytoken);
              const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* *SOLD* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(solmint, quantitySol)}) on *${sourceofTx}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | ${sourceofTx === 'PUMP FUN' ? `[Pump](https://pump.fun/${tmint})`: '' }\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${wallet.address})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address})`
              bot.telegram.sendMessage(user.chat_id, messageToSend, {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: {
                  inline_keyboard: buyButtons(tmint),
                },
              });
          }else{
            const tmint = webhookEvent[0].tokenTransfers[0].mint;
            const dexresult = await fetchData(tmint);
            console.log('ca:', tmint)
            const messageToSend = `${walletgroup(wallet.group)} ALERT\n👤*${wallet.name}* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *ANON*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${address2}\` ➡️ [ANON](${solcAcct}${address2}) `
            bot.telegram.sendMessage(user.chat_id, messageToSend, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: buyButtons(tmint),
              },
            });
          }
      }
    } else if (!wallet && wallet2) {
      if (desc[3] === "SOL") {
        const messageToSend = `${walletgroup(wallet2.group)} ALERT\n👤*ANON* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *${wallet2.name}*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${address1}\` ➡️ [ANON](${solcAcct}${address1}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${address2}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        if(senderAcctData.nativeBalanceChange !== 0 && Source === 'SYSTEM_PROGRAM'){
          const quantitySol = senderAcctData.nativeBalanceChange / 1000000000
          console.log(quantitySol)
          const quantitytoken = webhookEvent[0].tokenTransfers[0].tokenAmount 
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          const solmint = "So11111111111111111111111111111111111111112"
          const dexresult = await fetchData(tmint, quantitySol, quantitytoken);
            const messageToSend = `${walletgroup(wallet2.group)} ALERT\n👤*${wallet2.name}* *BOUGHT* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(solmint, quantitySol)}) on *${sourceofTx}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | ${sourceofTx === 'PUMP FUN' ? `[Pump](https://pump.fun/${tmint})`: '' }\n\n🕵️‍♂️ *Analyse Wallet2:* [W1](${AW1}${wallet2.address})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address})`
            bot.telegram.sendMessage(user.chat_id, messageToSend, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: buyButtons(tmint),
              },
            });
        }else{
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          const dexresult = await fetchData(tmint);
          const nftresult = await nftMetaData(tmint);
          if(dexresult){
            const messageToSend = `${walletgroup(wallet2.group)} ALERT\n👤*ANON* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *${wallet2.name}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${address1}\` ➡️ [ANON](${solcAcct}${wallet2.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address}) `
            bot.telegram.sendMessage(user.chat_id, messageToSend, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: buyButtons(tmint),
              },
            });
          }else if(nftresult){
            const tokenAmt = webhookEvent[0].tokenTransfers[0].tokenAmount
            const caption = `${walletgroup(wallet2.group)} ALERT \n🎨 NFT SELL \n\n👤*ANON* *TRANSFERRED* ${tokenAmt} ${nftData.name} to ${wallet2.name} on ${Source.replace(/_/g, " ")} \n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
              return `\n*${item.trait_type ? item.trait_type.toString().replace(/_/g, " ") : item.traitType.toString().replace(/_/g, " ")}*: ${item.value.toString().replace(/_/g, " ")}`
            })}\n\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${acctPrefix}${wallet2.address})\n\`${address1}\` ➡️ [ANON](${acctPrefix}${address1})`
            bot.telegram.sendPhoto(user.chat_id, photUrl, {
              caption: caption,
              parse_mode: 'Markdown'
            })
            .then(()=>{
              console.log('sent')
            })
            .catch((err)=>{
              console.log(err)
              bot.telegram.sendMessage(user.chat_id, caption, {
                parse_mode: "Markdown",
                disable_web_page_preview: true
              });
            })
          }
        }
      }
    }
  }catch(e){
    console.log('error in transfer message', e)
  }
}


module.exports = {transferMessage}