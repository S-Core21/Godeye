const axios = require("axios");
const {apiUrl} = require('./api')

const fetchAllUsers = async (userData) => {
  try {
    const response = await axios.get(
      `${apiUrl}`,
    );
    const users = response.data;
    users.forEach((user) => {
      userData.set(user.username, {
        ...user,
        wallets : user.wallets.slice(0, user.walletLimit)
      });
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
};

module.exports = fetchAllUsers