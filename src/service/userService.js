const userDAO = require('../repository/userDAO');

const getAllUsers = async () => {
    const data = await userDAO.getAllUsers();
    return data;
};

const getUser = async user_id => {
    const data = await userDAO.getUser(user_id);
    return data;
};

const getUserByUsername = async username => {
    const data = await userDAO.getUserByUsername(username);
    return data;
};

const addUser = async User => {
    const data = await userDAO.postUser(User);
    return data;
};

const updateUser = async (user_id, newUser) => {
    const data = await userDAO.updateUser(user_id, newUser);
    return data;
};

const deleteUser = async user_id => {
    const data = await userDAO.deleteUser(user_id);
    return data;
};

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser
};