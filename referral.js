const { default: axios } = require("axios");
const {apiUrl, refUrl} = require('./api')

function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result; 
}

async function createReferralLink(ctx, chatID){
    try{
        const response = await axios.get(`${apiUrl}${chatID}/referral`)
        const referralData = response.data;
        console.log('ref', response.data)
        if(referralData){
            const referralCode = referralData.referralCode;
            const referralCount = referralData.referralCount;
            const referralLink = `https://t.me/thetheiabot?start=${referralCode}`
            const referralMessage = `Refer your friends and earn up to 10% of their monthly PRO subscription \n\n Copy and share yout referral link below: \n${referralLink} \n\nReferrals: ${referralCount} `
            ctx.reply(referralMessage,{
                       parse_mode: "Markdown",
                       reply_markup: {
                         inline_keyboard: [[{ text: "Request Withdrawal", callback_data: "referralWithdrawal" }],[{ text: "Back", callback_data: "Back" }]],
                       },
                     })
        }else{
            const referralCode = generateReferralCode()
            const referralCount = 0
            const referral = {
                referralCode : referralCode,
                referralCount : referralCount
            }
            console.log(referral)
            await axios.post(`${apiUrl}${chatID}/referral`, {
                referral : referral 
            })
            const referralLink = `https://t.me/thetheiabot?start=${referralCode}`
            const referralMessage = `Refer your friends and earn up to 25% of their monthly PRO subscription, it's simple \n\n Share the love! 🫶❤️\n\n🔗Referral link: ${referralLink} \n🔢Referrals: ${referralCount} \n\nYour referral bonus will be credited to your Godeye account automatically upon successful referrals.\n\n🪽1-10 referrals: 15% of their monthly sub\n🪽10+ referrals: 25% of their monthly sub`
            ctx.reply(referralMessage,{
                       parse_mode: "Markdown",
                       reply_markup: {
                         inline_keyboard: [[{ text: "Request Withdrawal", callback_data: "referralWithdrawal" }],[{ text: "Back", callback_data: "Back" }]],
                       },
                     })
        }
    }catch(e){
        console.log('errror creating referral link')
    }
}

async function checkreferrals(ctx, chatID){
    try{
        const message = ctx.message.text
        const referralCode = message.split(' ')[1]
        console.log(referralCode)
        await axios.post(`${refUrl}referrals/${referralCode}`, {
            chat_id : chatID
        })
    }catch(e){
        console.log('error updating referral count')
    }
}

async function payReferralBonus(chatID){
    try{
        console.log('food')
        const response = await axios.get(`${apiUrl}${chatID}`)
        const refferedBy = response.data.referredBy
        if(refferedBy){
            const response2 = await axios.get(`${apiUrl}referrals/${refferedBy}`)
            const bonusReceiver = response2.data
            const walletAdd = bonusReceiver.key.publicKey
            const referralCount = bonusReceiver.referral.referralCount
            const bonusPercent = referralCount < 10 ? 0.15 : referralCount > 10 ? 0.25 : 0.1
            const bonusData = {
                walletAddress: walletAdd,
                percent: bonusPercent
            }
            return bonusData
        }else{
            return false 
        }
    }catch(e){
        console.log('yoo')
    }
}

function generateTransferCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 11; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return `Transfer key: ${result}`; 
}


module.exports = { generateReferralCode, createReferralLink, checkreferrals, payReferralBonus, generateTransferCode }