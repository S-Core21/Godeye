async function testData(){
  const url = `https://api.helius.xyz/v0/transactions/?api-key=${process.env.API_KEY}`;
  try{
     const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: ['5DirLsLodLr4adoCnTnEntkbQUSsmni52V7Guk3ygg4TtwVTWHo2YD8qX2AF73nuP1iGn2VNJMjs6pUPzeSJjoM4'],
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
// , '5DirLsLodLr4adoCnTnEntkbQUSsmni52V7Guk3ygg4TtwVTWHo2YD8qX2AF73nuP1iGn2VNJMjs6pUPzeSJjoM4', '3zM33MvEnU4G6DZq8tTnV1t4JPStSy6ZhAS6LACB7zH4V1WCV8MKwmDX7rP2cYJekn2iwt9aR4kcJSH8sFQjKh1N'
module.exports = {testData}