const solanaWeb3 = require("@solana/web3.js");
const { default: axios } = require("axios");
const bs58 = require("bs58").default;
// const {continueWallets} = require('./webhook')
const { checkWallets } = require("./HeliusWallets");
const { payReferralBonus } = require("./referral");
const {apiUrl} = require('./api')


async function createWallet(ctx, userCache, chatID) {
  const user = userCache.get(ctx.from.username);
  console.log(user); 

  try {
    // Fetch existing keys
    const response = await axios.get(
      `${apiUrl}${chatID}`,
    );
    console.log("Nice", response);
    const keys = response.data.key;

    if (keys) {
      // Key already exists, fetch balance and respond
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("mainnet-beta"),
        "confirmed",
      );
      const balance = await connection.getBalance(
        new solanaWeb3.PublicKey(keys.publicKey),
      );
      const balanceInSol = balance / solanaWeb3.LAMPORTS_PER_SOL;
      ctx.reply(
        `👤 Your godeye wallet address: \n\`${keys.publicKey}\`\nSOl balance:  ${balanceInSol} SOL \n\n📝 Tips: We would never ask for your private key via phone, email, or text. Protect yourself from scams.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Show private key", callback_data: "pk" }],
              [{ text: "Back", callback_data: "Back" }],
            ],
          },
        },
      );
    } else {
      // No keys found, generate a new key
      const newKeypair = solanaWeb3.Keypair.generate();
      const publicKey = newKeypair.publicKey.toString();
      const privateKey = newKeypair.secretKey;
      const key = {
        publicKey: publicKey,
        privateKey: privateKey,
      };

      try {
        // Post the new key to the API
        await axios.post(
          `${apiUrl}${chatID}/addkey`,
          { key: key },
        );
        console.log("Wallet generated");
        user.key = key;
        userCache.set(ctx.from.username, user); // Update the cache

        const connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl("mainnet-beta"),
          "confirmed",
        );
        const balance = await connection.getBalance(
          new solanaWeb3.PublicKey(publicKey),
        );
        const balanceInSol = balance / solanaWeb3.LAMPORTS_PER_SOL;
        ctx.reply(
          `Your wallet address: \n\`${publicKey}\` \n\n ${balanceInSol} SOL`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Show private key", callback_data: "pk" }],
                [{ text: "Back", callback_data: "Back" }],
              ],
            },
          },
        );
      } catch (e) {
        console.log("No wallet generated", e);
        ctx.reply("Failed to generate wallet. Please try again later.");
      }
      console.log("Connected to Solana mainnet-beta");
      console.log("Public Key:", publicKey);
      console.log("Private Key:", privateKey);
    }
  } catch (error) {
    console.log("Error fetching keys", error);
    ctx.reply("Error fetching keys. Please try again later.");
  }
}



async function payFee(amount, ctx, chatID, userCache) {
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta"),
    "confirmed",
  );
  try {
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const allWallets = res.data.wallets;
    const myaddress = allWallets.map((item) => item.address);
    const data = res.data.key;
    const fromSecretKeyObject = data.privateKey;
    const fromSecretKeyArray = Object.values(fromSecretKeyObject);
    const fromSecretKeyUint8Array = Uint8Array.from(fromSecretKeyArray);
    const fromKeypair = solanaWeb3.Keypair.fromSecretKey(
      fromSecretKeyUint8Array,
    );
    console.log("gucci", fromKeypair);
    const payAmt = amount * 0.85;
    const solamt = payAmt * solanaWeb3.LAMPORTS_PER_SOL;
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new solanaWeb3.PublicKey(
          "AspZqqECZfy1ZpVVd8iHkhm3wnQ1u82MiKTEPuod7q1R",
        ),
        lamports: solamt,
      }),
    );
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair],
    );

    const payReferral = await payReferralBonus(chatID);
    console.log(payReferral);
    if (payReferral) {
      const refAmt = amount * payReferral.percent;
      const solRefAmt = refAmt * solanaWeb3.LAMPORTS_PER_SOL;
      const transaction2 = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new solanaWeb3.PublicKey(payReferral.walletAddress),
          lamports: solRefAmt,
        }),
      );
      const signature2 = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction2,
        [fromKeypair],
      );
      console.log(signature2);
    }
    // set wallet Limit
    const walletLimit =
      amount === 0.001
        ? 100
        : amount === 0.002
          ? 200
          : amount === 0.003
            ? 400
            : amount === 0.004
              ? 600 : 20;
    const duration = 30 * 24 * 60 * 60 * 1000;
    const pro = true;
    await axios.post(
      `${apiUrl}${chatID}/setWalletLimit`,
      { walletLimit: walletLimit },
    );
    await axios.post(
      `${apiUrl}${chatID}/setCountdown`,
      { duration: duration },
    );
    await axios.post(
      `${apiUrl}${chatID}/setPro`,
      { pro: pro },
    );
    const user = userCache.get(ctx.from.username);
    if(user){
      user.walletLimit = walletLimit;
      user.wallets = user.wallets.slice(0, walletLimit); // Update the wallets array
      userCache.set(username, user); // Put the updated user back into the cache
    }
    // await checkWallets(amount, myaddress);
    // await continueWallets(ctx)
    console.log(
      "Limit updated and countdown set and wallet resumed and pro enabled",
    );
    ctx.reply(
      `Transaction confirmed:\n\n [View Transaction](https://solscan.io/tx/${signature})`,
      {
        parse_mode: "Markdown",
      },
    );
  } catch (e) {
    console.log("insufficient balance", e);
    ctx.reply(`Insufficient sol balance `);
  }
}

async function generatePrivateKey(ctx, chatID) {
  try {
    const res = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const data = res.data.key;
    const fromSecretKeyObject = data.privateKey;
    const fromSecretKeyArray = Object.values(fromSecretKeyObject);
    console.log("Original private key bytes:", fromSecretKeyArray);
    const fromSecretKeyUint8Array = Uint8Array.from(fromSecretKeyArray);
    const paddedUint8Array = new Uint8Array(64);
    paddedUint8Array.set(fromSecretKeyUint8Array);
    console.log("Padded Uint8Array:", paddedUint8Array);
    const privateKeyBase58 = bs58.encode(paddedUint8Array);
    ctx.reply(`Your Private Key is:\n\n \`${privateKeyBase58}\` `, {
      parse_mode: "Markdown",
    })
    .then((result) => { setTimeout(() => {
      ctx.deleteMessage(result.message_id)
  }, 15 * 1000)})
  .catch(err => console.log(err))
    console.log("Base58 Encoded Private Key:", privateKeyBase58);
  } catch (e) {
    console.error("Error:pkkk ");
    ctx.reply("Error fetching private key");
  }
}

module.exports = { createWallet, payFee, generatePrivateKey };
