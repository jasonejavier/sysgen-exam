import ApiService from "./APIService";

const { get, post, put, remove } = ApiService();

export const getPhotosList = ({ skip = 0, limit = 12 }) => {
  const route = "/photos/list";
  const body = {
    skip,
    limit,
  };

  return post(`${route}`, body, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const uploadPhotos = ({ formData }) => {
  const route = "/photos";

  return put(`${route}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const deletePhotos = ({ body = [] }) => {
  const route = "/photos";

  return remove(`${route}`, { data: body })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
