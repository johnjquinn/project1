const userDAO = require('../repository/userDAO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10;
const secretKey = process.env.P1_SECRET_KEY;

const getAllUsers = async () => {
    const data = await userDAO.getAllUsers();
    return data;
};

const getUser = async user_id => {
    if(user_id == null) return null;
    const data = await userDAO.getUser(user_id);
    return data;
};

const getUserByUsername = async username => {
    if(!username) return null;
    const totalUsers = await userDAO.getAllUsers();
    const found = totalUsers.filter(user => {return user.username === username});
    return found[0];
};

const registerUser = async (username, password, manager=false) => {
    if(!username || !password) return null;
    let extantUser = await getUserByUsername(username);
    if(extantUser) return null;
    let encPassword = await bcrypt.hash(password, saltRounds);
    const totalUsers = await userDAO.getAllUsers();
    const user_id = totalUsers.length;
    const newUser = {
        user_id,
        username: username,
        password: encPassword,
        role: manager ? "manager" : "employee"
    };
    const data = await userDAO.postUser(newUser);
    return data;
};

const loginUser = async (username, password) => {
    if(!username || !password) return null;
    const foundUser = await getUserByUsername(username);
    if(!foundUser || !(await bcrypt.compare(password, foundUser.password))) return null;
    const token = jwt.sign(
        {
            user_id: foundUser.user_id,
            username: foundUser.username,
            role: foundUser.role
        },
        secretKey,
        {
            expiresIn: "15m"
        });
    return token;
};

const authenticateUser = token => {
    if(!token) return null;
    let authd;
    jwt.verify(token, secretKey, (err, user) => {
        if(err) return null;
        authd = user;
    });
    return authd;
};

const updateUser = async (user_id, newUser) => {
    if(user_id == null || !newUser) return null;
    const data = await userDAO.updateUser(user_id, newUser);
    return data;
};

const deleteUser = async user_id => {
    if(user_id == null) return null;
    const data = await userDAO.deleteUser(user_id);
    return data;
};

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    registerUser,
    loginUser,
    authenticateUser,
    updateUser,
    deleteUser
};