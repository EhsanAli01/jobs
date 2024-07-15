export const dataHandler = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const token = localStorage.getItem("token");
  const data = localStorage.getItem("dat_xyz");

  let parseData;
  try {
    parseData = data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing data from localStorage:", error);
    parseData = null;
  }

  const userType = parseData?.userType;
  const id = parseData?.id;
  const email = parseData?.email;
  const userName = parseData?.userName;

  return { baseUrl, userType, userName, id, email, token };
};
