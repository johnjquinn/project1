let userList = [];
const getUsers = () => userList;
const clearUsers = () => {
    userList = [];
}
const getUser = username => {
    for(let i=0; i<userList.length; i++){
        if(userList[i].username === username) return userList[i];
    }
    return null;
}

const registerUser = (username, password, role="employee") => {
    if(!username || !password) return `You must provide a username and password`;
    if(username.length === 0 || password.length === 0) return `Username and/or password cannot be empty`;
    if(role !== "employee" && role !== "manager") return `Invalid role`;
    let duplicate = getUser(username);
    if(duplicate) return `User already exists`;
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
    if(!username || !password) return `You must provide a username and password`;
    if(username.length === 0 || password.length === 0) return `Username and/or password cannot be empty`;
    let found = getUser(username);
    if(!found) return `User does not exist`;
    if(found.password !== password) return `Incorrect password`;
    found.isActive = !found.isActive;
    return `Login toggled successfully for user ${username}`;
}

module.exports = {
    getUsers,
    clearUsers,
    registerUser,
    loginUser
}