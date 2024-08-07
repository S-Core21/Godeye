const { Telegraf } = require("telegraf");
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const { Transaction } = require("mongodb");

const {apiUrl} = require('./api')
const { editWebhook, removeWalletWebhook} = require("./webhook");
const userCache = new Map(); // Use a Map to store user data
const fetchAllUsers = require("./users");
const {
  getAllWalletsbyUser,
  walletgroup,
  addRemoveWallet,
  walletPdf,
} = require("./wallets");
const {
  startMessage,
  addMessage,
  deleteMessage,
  socialsMessage,
  importTransferKey, 
  supportMessage,
  inlineKeys,
  buyButtons,
  walletsLimitplan,
  upgradePro,
  transferKeyMsg,
} = require("./messages");
const { formatNumber, formatMcap, shortenString } = require("./formatNumber");
const { createWallet, payFee, generatePrivateKey } = require("./WalletCreate");
const { getCountdown, sendReminder } = require("./countdown");
const {fetchData, nftMetaData, tokenMintData} = require("./metadata");
const soldollarvalue = require("./dollarvalue");
const {checkreferrals, createReferralLink, generateTransferCode} = require('./referral')
const {swapMessage} = require('./swap')
const {transferMessage} = require('./transfer')
const {nftSaleMessage, nftMintMessage, nftListMessage, nftCanListMessage, addLiquidityMessage, removeLiquidityMessage} = require('./nft')
const {testData} = require('./test')

async function main() {
  console.log(apiUrl)
  await fetchAllUsers(userCache); // Fetch all users at startup
  const app = express();
  app.use(express.json());
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const PORT = process.env.PORT;
  console.log("running");

  let addNewWallets;
  let deleteWallets;
  let importTransferKey;

  // for blocked users
  async function sendMessage(ctx, text, options) {
    try {
      await bot.telegram.sendMessage(ctx, text, options);
    } catch (e) {
      console.log(`Error sending message to ${ctx}:`);
    }
  }

  // Start Command for the bot
  bot.start(async (ctx) => {
    const chatID = ctx.message.chat.id;
    const username = ctx.from.username;
    addNewWallets = false;
    deleteWallets = false;
    importTransferKey = false
    console.log(chatID);
    const allmessages = ctx.message.text 
    const msgArray = allmessages.split(' ')
    if(msgArray.length === 2){
      await checkreferrals(ctx, chatID)
    }
    
    sendMessage(ctx.message.chat.id, startMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: inlineKeys,
      },
    });

    const user = {
      username: ctx.from.username,
      chat_id: ctx.message.chat.id,
      wallets: [],
      walletLimit: 20,
      pro: false,
      referredBy: msgArray.length === 2 ? msgArray[1] : null
    };


    await axios
      .post(
        `${apiUrl}`,
        user,
      )
      .then((res) => {
        console.log("User added");
        userCache.set(user.username, user); // Add user to cache
      })
      .catch((e) => {
        console.log("user already exists");
      });
  });

  // settings()
  await sendReminder(bot, userCache) 
  
  

  // add buttons
  bot.action("Add", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    addNewWallets = true;
    deleteWallets = false;
    importTransferKey = false
    ctx.reply(addMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.command("add", async (ctx) => {
    ctx.deleteMessage();
    addNewWallets = true;
    deleteWallets = false;
    importTransferKey = false
    sendMessage(ctx.message.chat.id, addMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });

  // delete buttons
  bot.action("Delete", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    deleteWallets = true;
    addNewWallets = false;
    importTransferKey = false
    ctx.reply(deleteMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.command("delete", async (ctx) => {
    ctx.deleteMessage();
    deleteWallets = true;
    addNewWallets = false;
    importTransferKey = false;
    sendMessage(ctx.message.chat.id, deleteMessage, {
      parse_mode: "HTML",
    });
  });

  bot.command("Settings", async (ctx) => {
    // ctx.deleteMessage();
    // console.log('details',ctx.message.chat.id)
    // bot.telegram.sendPhoto(ctx.message.chat.id, 'https://na-assets.pinit.io/AwAmH7kqcXWy31H576yWmZx93BVGUdXdigC223t45CKJ/866f3615-4f3e-4ef2-b1cd-c3dd527b1352/255', {
    //   caption: '*nftsssss*',
    //   parse_mode: 'Markdown'
    // })
    await testData()
  });
  bot.action("Wallets", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await createWallet(ctx, userCache, chatID);
  });
  bot.command("wallets", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.message.chat.id
    await createWallet(ctx, userCache, chatID);
  });

  bot.action("Pro", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    console.log(ctx.from.username)
    const proMessage = await walletsLimitplan(chatID);
    const proinlineKeys = await upgradePro(chatID);
    ctx.reply(proMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: proinlineKeys,
      },
    });
  });
  bot.command("pro", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.message.chat.id
    const proMessage = await walletsLimitplan(chatID);
    const proinlineKeys = await upgradePro(chatID);
    ctx.reply(proMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: proinlineKeys,
      },
    });
  });

  bot.action("TransferAccount", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    console.log(ctx.from.username)
    ctx.reply(transferKeyMsg, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Import Wallet', callback_data: 'import'
            }
          ],
          [
            {
              text: 'Export wallet', callback_data: 'export'
            }
          ]
        ],
      },
    });
  });
  bot.action("import", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    addNewWallets = false;
    deleteWallets = false;
    importTransferKey = true 
    console.log(ctx.from.username)
    ctx.reply('Send me the transfer key of the account you want to import', {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  });
  bot.action("export", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    const key = generateTransferCode()
    try{
      await axios.post(`${apiUrl}${chatID}/transferKey`, {
        transferKey : key
      })
      ctx.reply(`Your Account Transfer Key:\n\n${key}`, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    }catch(e){
      console.log('no transfer key saved')
    }
  });
  // add payments options
  bot.action("pro1", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.001, ctx, chatID);
  });
  bot.action("pro2", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.002, ctx, chatID);
  });
  bot.action("pro3", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.003, ctx, chatID);
  });
  bot.action("pro4", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.003, ctx, chatID);
  });

  // show private key
  bot.action("pk", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await generatePrivateKey(ctx, chatID);
  });
  // down wallets pdf
  bot.action("walletpdf", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await walletPdf(ctx, chatID);
  });
  // tutorials
  bot.action("Tutorials", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply('How to use Theia \n\n Theia A \n\n Theia B', {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.action("Socials", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply(socialsMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.action("support", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply(supportMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  //referrals 
  bot.action("Referrals", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
     await createReferralLink(ctx, chatID)
  });

  //add and delete wallets
  bot.on("text", async (ctx) => {
    const chatID = ctx.message.chat.id
    const user = userCache.get(chatID);
    console.log(user)
    const text = ctx.message.text;
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if(addNewWallets || deleteWallets){
      await addRemoveWallet(
        text,
        solanaAddressRegex,
        addNewWallets,
        ctx,
        chatID,
        userCache,
        editWebhook,
        deleteWallets,
        removeWalletWebhook,
      );
    }else if(importTransferKey){
      ctx.reply(`Account will be migrated within the next 6hours`)
    }
  });

  // manage walltes
  bot.action("manage", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    const userData = await getAllWalletsbyUser(chatID);
    console.log(userData)
    let header = false; 
    if (userData) {
      ctx.sendMessage(
        `You are currently tracking ${userData.total.length}/1000`,
      );
      header = true
      if(header){
        ctx.sendMessage(
          `ALPHA WALLETS \n\n${userData.groupA.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
        ctx.sendMessage(
          `BETA WALLETS \n\n${userData.groupB.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
        ctx.sendMessage(
          `DELTA WALLETS \n\n${userData.groupD.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
        ctx.sendMessage(
          `GAMMA WALLETS \n\n${userData.groupG.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
      }
    } else {
      ctx.reply("No wallets found.");
    }
  });

  bot.action("Back", (ctx) => {
    ctx.deleteMessage();
    ctx.reply(startMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: inlineKeys,
      },
    });
  });

  // remiders
  // app.post('/remiders', async (req, res) =>{
  //   const message = req.body
  //   if(message.length === 0){
  //     console.log('no message')
  //   }else{

  //   }
  // })
  // webhooks
  app.post("/webhook", async (req, res) => {
    const webhookEvent = req.body;
    console.log(webhookEvent);
    if (webhookEvent.length === 0) {
      console.log("Empty webhook event");
    } else {
      const Transferdescription = webhookEvent[0].description;
      console.log(Transferdescription);
      const desc = Transferdescription.split(" ");
      const address1 = desc[0];
      const address2 = desc[5]?.replace(".", "");
      userCache.forEach(async (user) => {
        const wallet = user.wallets.find(
          (wallet) => wallet.address === address1,
        );
        const wallet2 = user.wallets.find(
          (wallet2) => wallet2.address === address2,
        );
        const sol = "So11111111111111111111111111111111111111112";
        const AW1 = `https://dexcheck.ai/app/wallet-analyzer/`;
        const signature = webhookEvent[0].signature;
        const sig = `https://solscan.io/tx/${signature}`;
        const solcAcct = "https://solscan.io/account/";
        const solToken = "https://solscan.io/token/";
        if (wallet || wallet2) {
          const Type = webhookEvent[0].type;
          const Source = webhookEvent[0].source;

          if (Type === "SWAP") {
            await swapMessage(webhookEvent, Source, wallet, desc, sol, AW1, sig, solcAcct, solToken, user, buyButtons, bot)
            
          } else if (Type === "TRANSFER") {
           await transferMessage(webhookEvent, wallet, wallet2, sig, Source, solcAcct, desc, sol, AW1, bot, user, address1, address2, buyButtons)
            
          }else if(Type === 'BURN'){
            const txid = webhookEvent[0].signature;
            const txidLink = `https://solscan.io/tx/${txid}`;
            const acctPrefix = "https://solscan.io/account/";
            const tokenName = desc[3]?.replace(".", "")
            const mint = webhookEvent[0].tokenTransfers[0].mint;
            console.log(mint);
            const dexresult = await fetchData(mint);

            if(wallet){
              const messageToSend = `${walletgroup(wallet.group)} ALERT \n🔥[BURN](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *burned* ${formatNumber(desc[2])} ${tokenName}\n\n*🔗${desc[3]}(MC: $${formatMcap(dexresult.mcap)})*\nDYOR: [SOT](${dexresult.twitter}) |[DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [PH](${dexresult.Photon})| [BE](${dexresult.Birdeye})| [Rick](${dexresult.rick})\nAnalyse Wallet: [W1](${AW1}${wallet})\n\`${mint}\` `;
              bot.telegram.sendMessage(user.chat_id, messageToSend, {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: {
                  inline_keyboard: buyButtons(mint),
                },
              });
            }
        }else if(Type === 'TOKEN_MINT'){
              const txid = webhookEvent[0].signature;
              const txidLink = `https://solscan.io/tx/${txid}`;
              const acctPrefix = "https://solscan.io/account/";
              const tokenName = desc[3]?.replace(".", "")
              const mint = webhookEvent[0].tokenTransfers[0].mint;
              console.log(mint);
              const dexresult = await tokenMintData(mint);

              if(wallet){
                const messageToSend = `${walletgroup(wallet.group)} ALERT \n[TOKEN MINT](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *minted* ${formatNumber(desc[2])} ${tokenName}\n\n*🔗${dexresult.ticker}(MC: $${formatMcap(dexresult.mcap)})*\nDYOR: [SOT](${dexresult.twitter})| [PH](${dexresult.Photon})| [BE](${dexresult.Birdeye})| [Rick](${dexresult.rick})\nAnalyse Wallet: [W1](${AW1}${wallet})\n\`${mint}\` `;
                bot.telegram.sendMessage(user.chat_id, messageToSend, {
                  parse_mode: "Markdown",
                  disable_web_page_preview: true,
                  reply_markup: {
                    inline_keyboard: buyButtons(mint),
                  },
                });
              }
          }else if(Type === 'NFT_MINT'){
            await nftMintMessage(webhookEvent, desc, wallet, Source, bot, user)
          }else if(Type === 'NFT_SALE'){
              await nftSaleMessage(webhookEvent, desc, wallet, Source, bot, user)
          }else if(Type === 'NFT_LISTING'){
             await nftListMessage(webhookEvent, desc, wallet, Source, bot, user)
          }else if(Type === 'NFT_CANCEL_LISTING'){
            console.log('cancelleddddddd')
             await nftCanListMessage(webhookEvent, desc, wallet, Source, bot, user)
          }else if(Type === 'WITHDRAW_LIQUIDITY'){
            await removeLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user)
          }else if(Type === 'ADD_LIQUIDITY'){
            await addLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user)
          }// add new transaction types here 
        }
      });
    }
    res.sendStatus(200); // Respond to indicate the webhook was received
  });

  bot.launch();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
