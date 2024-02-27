const userService = require('../src/service/userService');
const userDAO = require('../src/repository/userDAO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../src/repository/userDAO');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');


beforeEach(() => {
    jest.clearAllMocks();
})

describe('Getting Users', () => {
    test('GetAllUsers: Should return empty', async () => {
        userDAO.getAllUsers.mockResolvedValue([]);
        const result = await userService.getAllUsers();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual([]);
    });
    test('GetAllUsers: Should return one user', async () => {
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.getAllUsers();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0]).toStrictEqual(user);
    });
    test('GetAllUsers: Should return two users', async () => {
        const user0 = {
            user_id: 0,
            username: "testuser0",
            password: "testpassword0",
            role: "employee"
        };
        const user1 = {
            user_id: 1,
            username: "testuser1",
            password: "testpassword1",
            role: "manager"
        };
        userDAO.getAllUsers.mockResolvedValue([user0, user1]);
        const result = await userService.getAllUsers();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
        expect(result[0]).toStrictEqual(user0);
        expect(result[1]).toStrictEqual(user1);
    });
    test('GetUser: No user id, should return null', async () => {
        const result = await userService.getUser();
        expect(userDAO.getUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('GetUser: User id provided, should return one user', async () => {
        const user = {
            user_id: 0,
            username: "testuser0",
            password: "testpassword0",
            role: "employee"
        };
        userDAO.getUser.mockResolvedValue(user);
        const result = await userService.getUser(0);
        expect(userDAO.getUser).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user);
    });
    test('GetUserByUsername: No username, should return null', async () => {
        const result = await userService.getUserByUsername();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('GetUserByUsername: Username provided but user doesnt exist, should return empty', async () => {
        const user = {
            user_id: 0,
            username: "testuser0",
            password: "testpassword0",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.getUserByUsername("testuser");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
    });
    test('GetUserByUsername: Username provided, should return user', async () => {
        const user = {
            user_id: 0,
            username: "testuser0",
            password: "testpassword0",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.getUserByUsername("testuser0");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user);
    });
});

describe('Registering Users', () => {
    test('RegisterUser: No username or password, should return null', async () => {
        const result = await userService.registerUser();
        expect(bcrypt.hash).toHaveBeenCalledTimes(0);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(userDAO.postUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('RegisterUser: Username provided but no password, should return null', async () => {
        const result = await userService.registerUser("testuser");
        expect(bcrypt.hash).toHaveBeenCalledTimes(0);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(userDAO.postUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('RegisterUser: Username not unique, should return null', async () => {
        const user = {
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.registerUser("testuser", "testpasswd");
        expect(bcrypt.hash).toHaveBeenCalledTimes(0);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(userDAO.postUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('RegisterUser: Unique username and password, should return true', async () => {
        bcrypt.hash.mockResolvedValue("h iblkczbvwejrh");
        userDAO.getAllUsers.mockResolvedValue([]);
        userDAO.postUser.mockResolvedValue(true);
        const result = await userService.registerUser("testuser", "testpasswd");
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(userDAO.postUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
    test('RegisterUser: Unique username and password as manager, should return true', async () => {
        bcrypt.hash.mockResolvedValue("h iblkczbvwejrh");
        userDAO.getAllUsers.mockResolvedValue([]);
        userDAO.postUser.mockResolvedValue(true);
        const result = await userService.registerUser("testuser", "testpasswd", true);
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(userDAO.postUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Login Users', () => {
    test('LoginUser: No username or password, should return null', async () => {
        const result = await userService.loginUser();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(bcrypt.compare).toHaveBeenCalledTimes(0);
        expect(jwt.sign).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('LoginUser: Username present but no password, should return null', async () => {
        const result = await userService.loginUser("testuser");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(bcrypt.compare).toHaveBeenCalledTimes(0);
        expect(jwt.sign).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('LoginUser: Incorrect username, should return null', async () => {
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.loginUser("testuser0", "testpasswd");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(0);
        expect(jwt.sign).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('LoginUser: Incorrect password, should return null', async () => {
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        bcrypt.compare.mockResolvedValue(false);
        const result = await userService.loginUser("testuser", "testpass");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwt.sign).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('LoginUser: Correct username and password, should return token', async () => {
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        const token = "ebrwao0gbwerboqa";
        userDAO.getAllUsers.mockResolvedValue([user]);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValueOnce(token);
        const result = await userService.loginUser("testuser", "testpasswd");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(token);
    });
});

describe('Authenticating Users', () => {
    test('AuthenticateUser: No token, should return null', () => {
        const result = userService.authenticateUser();
        expect(jwt.verify).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('AuthenticateUser: Authentication failed, should return null', () => {
        const token = "ebrwao0gbwerboqa";
        jwt.verify.mockReturnValueOnce(null);
        const result = userService.authenticateUser(token);
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });
    test('AuthenticateUser: Authentication passed, should return user', () => {
        const token = "ebrwao0gbwerboqa";
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpassword",
            role: "employee"
        };
        jwt.verify.mockReturnValueOnce(user);
        const result = userService.authenticateUser(token);
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user);
    });
});

describe('Deleting Users', () => {
    test('DeleteUser: No user id, should return null', async () => {
        const result = await userService.deleteUser();
        expect(userDAO.deleteUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('DeleteUser: User id provided, should return true', async () => {
        userDAO.deleteUser.mockResolvedValue(true);
        const result = await userService.deleteUser(0);
        expect(userDAO.deleteUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});
