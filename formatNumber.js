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

module.exports = {formatNumber, formatMcap, shortenString}; 