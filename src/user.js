const userList = [];
const getUser = username => {
    if(!username || username.length === 0) return null;
    userList.forEach(user => {
        if(user.username === username) return user;
    });
    return null;
}
const getAllUsers = () => userList;
const registerUser = (username, password, role="employee") => {
    if(!username || !password || username.length === 0 || password.length === 0) return `You must submit a username and password`;
    if(!(role === "employee" || role === "manager")) return `Invalid role`;
    let found = getUser(username);
    if(found) return `User ${username} exists already`;
    let newUser = {
        username,
        password,
        role,
        isActive: false
    };
    userList.push(newUser);
    return `User ${username} added successfully`;
}

const loginUser = (username, password) => {
    if(!username || !password || username.length === 0 || password.length === 0) return `You must enter a username and password`;
    let found = getUser(username);
    if(found.password !== password) return `Incorrect password`;
    found.isActive = !found.isActive;
    return `Login toggled successfully for user ${username}`;
}

module.exports = {
    userList,
    getUser,
    getAllUsers,
    registerUser,
    loginUser
}