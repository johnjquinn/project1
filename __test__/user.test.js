const userOps = require('../src/user');

beforeEach(() => {
    userOps.clearUsers();
})

describe("Register Tests", () => {
    test("Empty data, should fail", () => {
        userOps.registerUser(null, null);
        let users = userOps.getUsers();
        expect(users.length).toBe(0);
    });
    test("Username but no password, should fail", () => {
        userOps.registerUser("testuser", null);
        let users = userOps.getUsers();
        expect(users.length).toBe(0);
    });
    test("Password but no username, should fail", () => {
        userOps.registerUser(null, "testpasswd");
        let users = userOps.getUsers();
        expect(users.length).toBe(0);
    });
    test("Username and password are empty, should fail", () => {
        userOps.registerUser("", "");
        let users = userOps.getUsers();
        expect(users.length).toBe(0);
    });
    test("Username and password but no valid role, should fail", () => {
        userOps.registerUser("testuser", "testpasswd", "administrator");
        let users = userOps.getUsers();
        expect(users.length).toBe(0);
    });
    test("Username and password as employee, should pass", () => {
        userOps.registerUser("testuser", "testpasswd");
        let users = userOps.getUsers();
        expect(users.length).toBe(1);
        expect(users[0].username).toBe("testuser");
        expect(users[0].password).toBe("testpasswd");
        expect(users[0].role).toBe("employee");
        expect(users[0].isActive).toBe(false);
    });
    test("Username and password as manager, should pass", () => {
        userOps.registerUser("testuser", "testpasswd", "manager");
        let users = userOps.getUsers();
        expect(users.length).toBe(1);
        expect(users[0].username).toBe("testuser");
        expect(users[0].password).toBe("testpasswd");
        expect(users[0].role).toBe("manager");
        expect(users[0].isActive).toBe(false);
    });
    test("Username is already taken by another user, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.registerUser("testuser", "testtt");
        let users = userOps.getUsers();
        expect(users.length).toBe(1);
    })
});
describe("Login Tests", () => {
    test("Empty data, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("", "");
        let users = userOps.getUsers();
        expect(users[0].isActive).toBe(false);
    });
    test("Incorrect username, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("test", "testpasswd");
        let users = userOps.getUsers();
        expect(users[0].isActive).toBe(false);
    });
    test("Correct username and incorrect password, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("testuser", "test");
        let users = userOps.getUsers();
        expect(users[0].isActive).toBe(false);
    });
    test("Correct username and password, should pass", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("testuser", "testpasswd");
        let users = userOps.getUsers();
        expect(users[0].isActive).toBe(true);
    });
});
