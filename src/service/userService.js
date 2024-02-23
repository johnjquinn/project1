const userDAO = require('../repository/userDAO');

const getAllUsers = async () => {
    const data = await userDAO.getAllUsers();
    return data;
};

const getUser = async user_id => {
    if(!user_id) return null;
    const data = await userDAO.getUser(user_id);
    return data;
};

const getUserByUsername = async username => {
    if(!username) return null;
    const totalUsers = await userDAO.getAllUsers();
    const found = totalUsers.filter(user => {return user.username === username});
    return found[0];
};

const addUser = async User => {
    if(!User) return null;
    const totalUsers = await userDAO.getAllUsers();
    const user_id = totalUsers.length;
    const newUser = {
        user_id,
        username: User.username,
        password: User.password,
        role: User.role
    };
    const data = await userDAO.postUser(newUser);
    return data;
};

const updateUser = async (user_id, newUser) => {
    if(!user_id || !newUser) return null;
    const data = await userDAO.updateUser(user_id, newUser);
    return data;
};

const deleteUser = async user_id => {
    if(!user_id) return null;
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