const userOps = require('../src/user');


describe("Register Tests", () => {
    test("Empty data, should fail", () => {
        userOps.registerUser(null, null);
        expect(userOps.userList.length).toBe(0);
    });
    test("Username but no password, should fail", () => {
        userOps.registerUser("testuser", null);
        expect(userOps.userList.length).toBe(0);
    });
    test("Password but no username, should fail", () => {
        userOps.registerUser(null, "testpasswd");
        expect(userOps.userList.length).toBe(0);
    });
    test("Username and password but no valid role, should fail", () => {
        userOps.registerUser("testuser", "testpasswd", null);
        expect(userOps.userList.length).toBe(0);
    });
    test("Username and password as employee, should pass", () => {
        userOps.registerUser("testuser", "testpasswd");
        expect(userOps.userList.length).toBe(1);
        expect(userOps.userList[0].username).toBe("testuser");
        expect(userOps.userList[0].password).toBe("testpasswd");
        expect(userOps.userList[0].role).toBe("employee");
        expect(userOps.userList[0].isActive).toBe(false);
    });
    test("Username and password as manager, should pass", () => {
        userOps.registerUser("testuser", "testpasswd", "manager");
        expect(userOps.userList.length).toBe(1);
        expect(userOps.userList[0].username).toBe("testuser");
        expect(userOps.userList[0].password).toBe("testpasswd");
        expect(userOps.userList[0].role).toBe("manager");
        expect(userOps.userList[0].isActive).toBe(false);
    })
});
describe("Login Tests", () => {
    test("Empty data, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("", "");
        expect(userOps.userList[0].isActive).toBe(false);
    });
    test("Incorrect username, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("test", "testpasswd");
        expect(userOps.userList[0].isActive).toBe(false);
    });
    test("Correct username and incorrect password, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("testuser", "test");
        expect(userOps.userList[0].isActive).toBe(false);
    });
    test("Correct username and password, should pass", () => {
        userOps.registerUser("testuser", "testpasswd");
        userOps.loginUser("testuser", "testpasswd");
        expect(userOps.userList[0].isActive).toBe(true);
    });
})

afterEach(() => {
    userOps.userList = [];
})