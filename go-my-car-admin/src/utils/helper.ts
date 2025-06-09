import Toast from '@/components/toast/commonToast';

export const convertToFormData = data => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      // Handle arrays (e.g., multiple files)
      data[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (data[key] instanceof File) {
      // Handle File objects
      formData.append(key, data[key]);
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      // Convert nested objects to JSON string
      formData.append(key, JSON.stringify(data[key]));
    } else {
      // Append normal key-value pairs
      formData.append(key, data[key]);
    }
  });

  return formData;
};

export const generateFakePayments = (count: number) => {
  const statuses = ['pending', 'processing', 'success', 'failed'];

  return Array.from({ length: count }, (_, i) => ({
    id: `id-${i + 1}`, // Unique ID using a simple counter
    amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1000
    status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
    email: `user${i + 1}@example.com`, // Sequential fake email addresses
  }));
};
export const onFormErrors = errors => {
  const firstError = Object.values(errors)?.[0]?.message;
  if (firstError) {
    Toast('destructive', firstError);
  }
};
// Generate 50 fake records
