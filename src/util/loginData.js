export const dataHandler = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const token = localStorage.getItem("token");
  const data = localStorage.getItem("data");
  let parseData;
  token ? (parseData = JSON.parse(data)) : null;

  const userType = parseData?.userType;
  const id = parseData?.id;
  const email = parseData?.email;
  const userName = parseData?.userName;
  const status = parseData?.status;

  return { baseUrl, userType, userName, id, email, token, status };
};
