import axios from 'axios';

export const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};
