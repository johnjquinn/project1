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

describe('Getting All Users', () => {
    test('This should return empty', async () => {
        userDAO.getAllUsers.mockResolvedValue([]);
        const result = await userService.getAllUsers();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual([]);
    });
    test('This should return one user', async () => {
        const user = {
            user_id: 0,
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        userDAO.getAllUsers.mockResolvedValue([user]);
        const result = await userService.getAllUsers();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result[0]).toStrictEqual(user);
    });
    test('This should return two users', async () => {
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
        expect(result.length).toBe(2);
    });
});

describe('Getting One User', () => {
    test('Adding two users but no user id', async () => {
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
        userDAO.getUser.mockResolvedValue(user0);
        const result = await userService.getUser();
        expect(userDAO.getUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Adding two users, returning the first', async () => {
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
        userDAO.getUser.mockResolvedValue(user0);
        const result = await userService.getUser(0);
        expect(userDAO.getUser).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user0);
    });
    test('Adding two users, returning the second', async () => {
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
        userDAO.getUser.mockResolvedValue(user1);
        const result = await userService.getUser(1);
        expect(userDAO.getUser).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user1);
    });
    test('Adding two users, getting first one by username', async () => {
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
        const result = await userService.getUserByUsername("testuser0");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(user0);
    });
});

describe('Adding Users', () => {
    test('Null data returning null', async () => {
        userDAO.getAllUsers.mockResolvedValue([]);
        const result = await userService.addUser();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Adding user', async () => {
        userDAO.getAllUsers.mockResolvedValue([]);
        userDAO.postUser.mockResolvedValue(true);
        const user = {
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        const result = await userService.addUser(user);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(userDAO.postUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Updating Users', () => {
    test('User id but no new user', async () => {
        userDAO.updateUser.mockResolvedValue(false);
        const result = await userService.updateUser(0);
        expect(userDAO.updateUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('User id and new user', async () => {
        userDAO.updateUser.mockResolvedValue(true);
        const newUser = {
            username: "testuser23",
            password: "kpowerq",
            role: "employee"
        };
        const result = await userService.updateUser(0, newUser);
        expect(userDAO.updateUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Deleting Users', () => {
    test('No user id', async () => {
        const result = await userService.deleteUser();
        expect(userDAO.deleteUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('User id present', async () => {
        userDAO.deleteUser.mockResolvedValue(true);
        const result = await userService.deleteUser(0);
        expect(userDAO.deleteUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Register and Login', () => {
    test('Register with no data', async () => {
        const result = await userService.registerUser();
        expect(bcrypt.hash).toHaveBeenCalledTimes(0);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(userDAO.postUser).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Register with data', async () => {
        bcrypt.hash.mockResolvedValue("h iblkczbvwejrh");
        userDAO.getAllUsers.mockResolvedValue([]);
        userDAO.postUser.mockResolvedValue(true);
        const user = {
            username: "testuser",
            password: "testpasswd",
            role: "employee"
        };
        const result = await userService.registerUser(user);
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(userDAO.postUser).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
    test('Login with no username or password', async () => {
        const result = await userService.loginUser();
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(0);
        expect(bcrypt.compare).toHaveBeenCalledTimes(0);
        expect(jwt.sign).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Login with username and password', async () => {
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
        const result = await userService.loginUser("testuser", "testpassword");
        expect(userDAO.getAllUsers).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(result).toBe(token);
    });
});