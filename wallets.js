const axios = require("axios");
const fs = require('fs');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const {apiUrl} = require('./api')
const {deleteResponse, walletsLimitplan} = require('./messages')


async function getAllWalletsbyUser(chatID) {
  try {
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    console.log(res.data.wallets);
    const data = res.data.wallets;
    const groupA = data.filter((item) => item.group === "A");
    const groupB = data.filter((item) => item.group === "B");
    const groupD = data.filter((item) => item.group === "D");
    const groupG = data.filter((item) => item.group === "G");
    const groupData = {
      total: data,
      groupA,
      groupB,
      groupD,
      groupG,
    };
    return groupData;
  } catch (e) {
    console.log('errrrrrrrrrrr');
  }
}

async function getActiveWalletsbyUser(chatID) {
  try {
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const WalletLimitData = response.data.walletLimit;
    console.log(walletsLimitplan)
    console.log(res.data.wallets);
    const data = res.data.wallets;
    const activeWallets = data.slice(0, WalletLimitData)
    const groupA = activeWallets.filter((item) => item.group === "A");
    const groupB = activeWallets.filter((item) => item.group === "B");
    const groupD = activeWallets.filter((item) => item.group === "D");
    const groupG = activeWallets.filter((item) => item.group === "G");
    const groupData = {
      total: activeWallets,
      groupA,
      groupB,
      groupD,
      groupG,
    };
    return groupData;
  } catch (e) {
    console.log('errrrrrrrrrrr');
  }
}

async function getInactiveWalletsbyUser(chatID) {
  try {
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const WalletLimitData = response.data.walletLimit;
    console.log(walletsLimitplan)
    console.log(res.data.wallets);
    const data = res.data.wallets;
    const inactiveWallets = data.slice(WalletLimitData)
    const groupA = inactiveWallets.filter((item) => item.group === "A");
    const groupB = inactiveWallets.filter((item) => item.group === "B");
    const groupD = inactiveWallets.filter((item) => item.group === "D");
    const groupG = inactiveWallets.filter((item) => item.group === "G");
    const groupData = {
      total: inactiveWallets,
      groupA,
      groupB,
      groupD,
      groupG,
    };
    return groupData;
  } catch (e) {
    console.log('errrrrrrrrrrr');
  }
}

// async function getAllWalletsbyAllUser() {
//   try {
//     const res = await axios.get(
//       `${apiUrl}wallet-addresses`,
//     );
//     // console.log(res.data);
//   } catch (e) {
//     console.log(e);
//   }
// }

function parseAddressesAndNames(input, ctx) {
  try{
    const lines = input.split("\n");
    const eachLines = lines.filter(item => item.trim() !== "")
    const result = eachLines.map((line) => {
      const addressData = line.split(" ")
      const addressParts = addressData.filter(parts => parts.trim() !== "")
      const [address, name, ...groupn] = addressParts;
      const groupdata = groupn.join(" ");
      const group = groupdata.toUpperCase()
  
      // Define default values
      const defaultAddress = "default_address";
      const defaultName = "default_name";
      const defaultGroup = "default_group";
  
      if (!address || !name || !group) {
        return { address: defaultAddress, name: defaultName, group: defaultGroup };
      }
  
      if (group === "A" || group === "B" || group === "D" || group === "G") {
        return { address, name, group };
      } else {
        ctx.reply("Invalid wallet, name or group");
        return { address: defaultAddress, name: defaultName, group: defaultGroup };
      }
    });
    return result;    
  }catch(e){
    console.log('error in adding wallets')
  }
}

function deleteAddressesAndNames(input, ctx) {
  try{
    const lines = input.split("\n");
    const eachLines = lines.filter(item => item.trim() !== "")
    const result = eachLines.map((line) => {
      const addressline = line.split(" ");
      const addressParts = addressline.filter(parts => parts.trim() !== "")
      console.log(addressParts)
      if(addressParts.length > 1){
        ctx.reply('Send only the address of the wallet you want to unalive ☠️')
      }else if(addressParts.length === 1){
        const address = addressParts[0]
        return address
      }
    });
    return result;
  }catch(e){
    console.log('err in deleting wallets')
  }
}


function walletgroup(walletData) {
  const groupname =
    walletData === "A"
      ? "ALPHA"
      : walletData === "B"
        ? "BETA"
        : walletData === "D"
          ? "DELTA"
          : walletData === "G"
            ? "GAMMA"
            : "DEFAULT";
  return groupname;
}

function planName(walletLimit){
  try{
    console.log(walletLimit)
    const walletName = walletLimit == 20 ? 'Free' : 
                     walletLimit == 100 ? '🐦‍🔥 Phoenix' : 
                     walletLimit == 200 ? '🎠 Valkyrie' : 
                     walletLimit == 400 ? '🪬 Odin' : 
                     walletLimit == 600 ? '⚡️ Zeus' : 
                     'Free';
  return walletName;
  }catch(e){
    console.log('error in plan')
    return 100
  }
}

async function addRemoveWallet(
  text,
  solanaAddressRegex,
  addNewWallets,
  ctx,
  chatID,
  userCache,
  editWebhook,
  deleteWallets, 
  removeWalletWebhook,
) {
   const user = userCache.get(ctx.from.username);
  const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const WalletLimitData = response.data.walletLimit;
  console.log(WalletLimitData)
  const walletLimit = WalletLimitData ? WalletLimitData : 20
  const totalWallets = user.wallets.length 
  if(totalWallets >= walletLimit && addNewWallets){ 
    ctx.reply('You have reached the maximum number of wallets allowed.')
  }else{
    if (addNewWallets) {
      const walletsData = parseAddressesAndNames(text, ctx);
      try{
        for (let walletData of walletsData) {
          const wAdd = walletData.address; // /add when clicked twice gives an error
          if (wAdd.match(solanaAddressRegex)) {
            const wallet = {
              address: walletData.address,
              name: walletData.name || "",
              group: walletData.group, //incase of setting a default group
            };
            const groupname = walletgroup(walletData);
            console.log("this is the wallets" + wallet);
              // Check if the wallet already exists in the userCache
              let walletExists = false;
              if (userCache.has(ctx.from.username)) {
                const user = userCache.get(ctx.from.username);
                walletExists = user.wallets.some((w) => w.address === wallet.address);
              }
              console.log(walletExists)
              if (walletExists) {
                ctx.reply(`Wallet ${wallet.address} already exists`);
              } else {
                // Make the POST request to add the wallet
                await axios.post(
                  `${apiUrl}${chatID}/addWallet`,
                  {
                    wallet: wallet,
                  },
                );
                console.log("Wallet added");
                ctx.reply(
                  `${walletgroup(wallet.group)} Wallet ${wallet.address} named as ${wallet.name} saved successfully🎊 \n\nTo add multiple wallets, send /tutorials`,
                );
  
                // Update the cache
                if (user) {
                  user.wallets.push(wallet);
                  console.log(user.wallets);
                  userCache.set(ctx.from.username, user);
                }
  
                const allWallets = [];
                userCache.forEach((user) => {
                  user.wallets.forEach((wallet) => {
                    allWallets.push(wallet.address);
                  });
                });
  
                await editWebhook(wallet.address);
              }
  
          } else {
            ctx.reply("Invalid address/name or Incomplete data");
          }
        }
      }catch(e){
        console.log("Error adding wallet");
        ctx.reply("Error adding wallet");
      }
    } else if (deleteWallets) {
      const walletData = deleteAddressesAndNames(text, ctx);
      try{
        for (const address of walletData) {
          if (address.match(solanaAddressRegex)) {
              // Check if the wallet exists in the userCache
              let walletExists = false;
              if (userCache.has(ctx.from.username)) {
                const user = userCache.get(ctx.from.username);
                walletExists = user.wallets.some((w) => w.address === address);
              }
              if (!walletExists) {
                ctx.reply(`I've searched high and low, but ${address} is nowhere to be found. It's like it never existed! 🙅‍♂️`);
              } else {
                // Make the DELETE request to remove the wallet
                await axios.delete(
                  `${apiUrl}${chatID}/removeWallet`,
                  {
                    data: {
                      address: address,
                    },
                  },
                );
                ctx.reply(deleteResponse());
      
                // Update the cache
                const user = userCache.get(ctx.from.username);
                if (user) {
                  user.wallets = user.wallets.filter(
                    (item) => item.address !== address,
                  );
                  userCache.set(ctx.from.username, user); // Update the cache
                }
      
                await removeWalletWebhook(address);
              }
          } else {
            ctx.reply(`Invalid address: ${address}`);
          }
        }
      }catch(e){
        console.log('Invalid address')
      }
    }
     else if (!addNewWallets && !deleteWallets) {
      ctx.reply("Click start for more instructions");
    }
  }
}


async function walletPdf(ctx, chatID) {
  try {
    const response = await axios.get(
      `${apiUrl}${chatID}`
    );
    const data = response.data.wallets;
    const doc = new PDFDocument();
    const filePath = 'data.pdf';
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(12).text('Wallet Data', { align: 'center' });
    data.forEach((wallet, index) => {
      doc.moveDown().fontSize(10).text(`Wallet ${index + 1}:`);
      doc.text(`Name: ${wallet.name}`);
      doc.text(`Address: ${wallet.address}`);
      doc.text(`Group: ${wallet.group ? wallet.group : 'No group' }`);
      doc.moveDown();
    });
    doc.end();
    stream.on('finish', () => {
      const fileStream = fs.createReadStream(filePath);
      ctx.replyWithDocument({ source: fileStream, filename: 'wallets.pdf' });
    });
  } catch (e) {
    console.log('error generating pdf');
  }
}

module.exports = {
  getAllWalletsbyUser,
  getActiveWalletsbyUser,
  getInactiveWalletsbyUser,
  parseAddressesAndNames,
  walletgroup,
  planName,
  addRemoveWallet,
  walletPdf
};
