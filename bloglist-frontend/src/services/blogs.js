import axios from 'axios';
const baseUrl = '/api/v1/blogs';

let token = '';

const setToken = (newToken) => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = async (updatedObj) => {
    const response = await axios.put(`${baseUrl}/${updatedObj.id}`, updatedObj);
    return response.data;
};

const remove = async (blogId) => {
    const config = {
        headers: { Authorization: token },
    };
    const response = await axios.delete(`${baseUrl}/${blogId}`, config);
    return response.data;
};

export default { getAll, create, setToken, update, remove };
