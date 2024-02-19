let userList = [];
const getUsers = () => userList;
const getUser = username => {
    for(let i=0; i<userList.length; i++){
        if(userList[i].username === username) return userList[i];
    }
    return null;
}
const getEmployees = () => userList.filter(user => {return user.role === "employee"});
const getManagers = () => userList.filter(user => {return user.role === "manager"})
const clearUsers = () => {
    userList = [];
}
const registerUser = (username, password, isManager=false) => {
    if(!username || !password) return `You must provide a username and password`;
    if(username.length === 0 || password.length === 0) return `Username and/or password cannot be empty`;
    let duplicate = getUser(username);
    if(duplicate) return `User already exists`;
    let newUser = {
        username,
        password,
        role: isManager ? "manager" : "employee",
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
    getUser,
    getUsers,
    getEmployees,
    getManagers,
    clearUsers,
    registerUser,
    loginUser
}