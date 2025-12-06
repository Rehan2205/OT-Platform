import API from "./axios";

export const getTests = async () => {
  return API.get("/tests");
};
