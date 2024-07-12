export const copyToClipboard = (data: any) => {
  try {
    window?.electronAPI?.copyToClipboard(data);
  } catch (error) {
    console.log('copyToClipboard error:', error);
  }
};
