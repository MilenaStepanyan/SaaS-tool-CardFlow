const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined in .env');
}

export const fetchStatus = async () => {
  const response = await fetch(`${API_URL}/status`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
