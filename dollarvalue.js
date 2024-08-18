const axios = require("axios");

async function soldollarvalue(mint, value){
  try{
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${mint}`)
    const priceData = response.data
    const response2 = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
    const priceData2 = response2.data.pairs
    console.log(priceData)
    if(priceData){
      const price = priceData.data[mint].price
    const dollarValue = price * value
    const data = '$' + dollarValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return data
    }else if(priceData2){
      const price = priceData2[0].priceUsd
      const dollarValue = price * value
    const data = '$' + dollarValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return data
    }
  }catch(e){ 
    console.log('error fetching dollar value', e)
    const data = '$'
    return data
  }
}


module.exports = soldollarvalue