export const formatNumber = (num, decimals = 2) => {
  return num?.toFixed(decimals) || '0.00';
};

export const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(num || 0);
};

export const formatTimestamp = (timestamp) => {
  return timestamp ? new Date(timestamp).toLocaleString('id-ID') : '-';
};