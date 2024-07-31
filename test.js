async function testData(){
  const url = `https://api.helius.xyz/v0/transactions/?api-key=${process.env.API_KEY}`;
  try{
     const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: ['4jNWQ1eADrvZwZfU9UYTb81szEGKFN1vjY4NsYmhby5HqHbQ5yE1DpZF3Q31bg13akQP5o911n8i2eVogKf7xDxo'],
        }),
      });
      const data = await response.json();
      // console.log("parsed transaction: ", data);
    const url2 = `https://04d44488-19ca-4991-9b4c-ce61ea02cb1a-00-ql75piaetz4j.janeway.replit.dev/webhook`
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