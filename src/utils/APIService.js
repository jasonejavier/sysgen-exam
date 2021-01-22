import axios from "axios";

const default_api = "http://localhost:8888";

const handleSuccess = (response) => {
  return response.data;
};
const handleError = (error) => {
  // handle requests with no response;
  if (!error.response) {
    const errors = {
      data: {
        code: "ZERO_RES",
        message: "Unable to connect to server.",
        statusText: "Unable to connect to server.",
        context: "Please check your internet connection.",
      },
    };
    throw errors;
  }
  if (error.response) {
    return Promise.reject(error.response);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error.request;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};

const handleHeaders = () => {
  let service = axios.create({
    baseURL: default_api,
    "Content-Type": "application/json",
  });

  service.interceptors.response.use(handleSuccess, handleError);
  return service;
};

const ApiService = () => {
  const get = (path, params) => {
    let service = handleHeaders();
    return service.get(path, params);
  };
  const post = (path, body) => {
    let service = handleHeaders();
    return service.post(path, body);
  };
  const put = (path, body) => {
    let service = handleHeaders();
    return service.put(path, body);
  };
  const remove = (path, body) => {
    let service = handleHeaders();
    return service.delete(path, body);
  };

  return {
    get,
    post,
    put,
    remove,
  };
};

export default ApiService;
