async function testData(){
  const url = `https://api.helius.xyz/v0/transactions/?api-key=${process.env.API_KEY}`;
  try{
     const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: ['Z5LqjLUxYkU9wUEV2mFEtR1iZAoFdDxPi7JJmqmXdg2vRtGV9dbjA5ExDbifAZ7y9vYKvPGSMAZBB1ysMy8YFbH'],
        }),
      });
      const data = await response.json();
      // console.log("parsed transaction: ", data);
    const url2 = `https://godeye-3d8a522e85b5.herokuapp.com/webhook`
    const response2 = await fetch(url2, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // const data2 = await response2.json();
  }catch(e){
    console.log('error in nft data') 
  }
}

module.exports = {testData}