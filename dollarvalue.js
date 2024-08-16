const axios = require("axios");

async function soldollarvalue(mint, value){
  try{
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${mint}`)
    const priceData = response.data
    const price = priceData.data[mint].price
    const dollarValue = price * value
    const data = '$' + dollarValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return data
  }catch(e){ 
    console.log('error fetching dollar value', e)
    const data = '$ -'
    return data
  }
}


module.exports = soldollarvalue