function formatNumber(input) {
  const num = parseFloat(input);
  if (isNaN(num)) {
      console.log("Invalid input, not a number");
  }
  return num.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatMcap(num) {
  if (num  >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
  } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
  }else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }  else {
      return (num / 1).toFixed(2);
  }
}

function shortenString(str) {
  if (str.length <= 6) {
    return str; // If the string is too short to shorten, return it as is
  }
  const firstPart = str.slice(0, 4);
  const lastPart = str.slice(-4);
  return `${firstPart}...${lastPart}`;
}


function convertDate(isoDate) {
  const date = new Date(isoDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const formattedDate = `${month} ${day}, ${year} `;
  
  return formattedDate;
}

const isoDate = "2024-08-19T06:55:20.071+00:00";
console.log(convertDate(isoDate)); // Output: August 19, 2024 6:55am

function getDaysRemaining(endDateStr) {
  const endDate = new Date(endDateStr);
  endDate.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const timeDifference = endDate - today;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}


module.exports = {formatNumber, formatMcap, shortenString, convertDate, getDaysRemaining}; 