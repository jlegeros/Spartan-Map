import axios from "axios";

export const getRaces = async () => {
  // get the list of races...
  let data;
  data = await axios.get("/api/races").then(res => {
    data = res.data;
    return data;
  });

  return data;
};
