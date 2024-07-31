const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const axios = require("axios");
const {isPro} = require('./countdown')
const {apiUrl} = require('./api')

const startMessage =
  "TheiaBot | Wallet Tracker\n\n <b>Welcome to THEIA</b>\n\nThis bot helps you monitor transactions across your Solana wallets. After adding wallets, you'll receive immediate notifications for any activity.\n\n You are currently tracking 0/1000 wallets\n Click PRO to get more wallets! \n\n<b><a href='t.me/devvv_s'>Official THEIABOT support</a></b>";
const addMessage =
  "Great! You can now add multiple wallets at once.\n\nSimply send me each wallet address on a new line. If you'd like to assign a nickname (40 characters max) to any wallet, add it after a space following the wallet address. For example:\n\nWalletAddress1 Name1\nWalletAddress2 Name2\nWalletAddress3 Name3\n\nTip: It might take up to 2 min to start receiving notifications for new wallets!";

const inlineKeys = [
  [
    { text: "Add", callback_data: "Add" },
    { text: "Manage", callback_data: "manage" },
  ],
  [
    { text: "Settings", callback_data: "Settings" },
    { text: "Delete", callback_data: "Delete" },
    { text: "Referrals", callback_data: "Referrals" },
  ],
  [
    { text: "PRO", callback_data: "Pro" },
    { text: "My Wallets", callback_data: "Wallets" },
    { text: "Links", callback_data: "Links" },
  ],
  [
    { text: "Download Wallets", callback_data: "walletpdf" },
    { text: "Tutorials", callback_data: "Tutorials" },
  ],
];

function buyButtons(mint){
  const inlineButtons = [
    [
      {text: 'Bonk', url: `t.me/bonkbot_bot?start=${mint}`},
      {text: 'Trojan', url: `t.me/solana_trojanbot?start=${mint}`},
      {text: 'STB', url: `t.me/solanaTradingBot?start=${mint}`},
    ],
    [
      {text: 'Pepe', url: `t.me/pepeboost_sol_bot?start=${mint}`},
      {text: 'Bullx', url: `https://bullx.io/terminal?chainId=1399811149&address=${mint}`},
      {text: 'PH', url: `https://photon-sol.tinyastro.io/en/lp/${mint}`}
    ]
  ]
  return inlineButtons
}

async function walletsLimitplan(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const WalletLimitData = response.data.walletLimit;
    const proMessage = WalletLimitData ? `Your current wallet limit is ${WalletLimitData}` : `Your current wallet limit is 20`
      return proMessage
  }catch(e){
    console.log('error')
  }
}


async function upgradePro(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const pro = await isPro(chatID) 
    const WalletLimitData = response.data.walletLimit;
    if(pro){
      if(WalletLimitData === 100){
        const proinlineKeys = [
          [
            {text: 'Upgrade 200 Wallets/0.5/1 month', callback_data: 'pro2'}
          ],
          [
            {text: 'Upgrade 500 Wallets/1/1 month', callback_data: 'pro3'}
          ],
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 200){
        const proinlineKeys = [
          [
            {text: 'Upgrade 500 Wallets/1/1 month', callback_data: 'pro3'}
          ],
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 500){
        const proinlineKeys = [
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(pro === false){
        const proinlineKeys = [
          [
            {text: 'Pay 0.3 SOL for 1 month/100 wallets', callback_data: 'pro1'},
            {text: 'Pay 0.5 SOL for 1 month/200 wallets', callback_data: 'pro2'}
          ],
          [
            {text: 'Pay 1 SOL for 1 month/500 wallets', callback_data: 'pro3'}
          ]
        ] 
        return proinlineKeys
      }
    }else{
      const proinlineKeys = [
        [
          {text: 'Pay 0.3 SOL for 1 month/100 wallets', callback_data: 'pro1'},
          {text: 'Pay 0.5 SOL for 1 month/200 wallets', callback_data: 'pro2'}
        ],
        [
          {text: 'Pay 1 SOL for 1 month/500 wallets', callback_data: 'pro3'}
        ]
      ] 
      return proinlineKeys
    }
  }catch(e){
    console.log('error')
  }
}

module.exports = {startMessage, addMessage, inlineKeys, buyButtons, walletsLimitplan, upgradePro}