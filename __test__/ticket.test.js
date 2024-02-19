const ticketOps = require('../src/ticket');
const userOps = require('../src/user');

beforeEach(() => {
    ticketOps.clearTickets();
    ticketOps.clearOldTickets();
    userOps.clearUsers();
});

describe("Submitting Tickets", () => {
    test("User doesn't exist, should fail", () => {
        ticketOps.submitTicket("testuser", 100, "testdesc");
        let tickets = ticketOps.getTickets();
        expect(tickets.length).toBe(0);
    });
    test("User exists but incoming data is null, should fail", () => {
        userOps.registerUser("testuser", "testpasswd");
        ticketOps.submitTicket("testuser", null, null);
        let tickets = ticketOps.getTickets();
        expect(tickets.length).toBe(0);
    });
    test("User and data exists but user is manager, should fail", () => {
        userOps.registerUser("testuser", "testpasswd", true);
        ticketOps.submitTicket("testuser", 100, "testdesc");
        let tickets = ticketOps.getTickets();
        expect(tickets.length).toBe(0);
    });
    test("User and data exists, should pass", () => {
        userOps.registerUser("testuser", "testpasswd");
        ticketOps.submitTicket("testuser", 100, "testdesc");
        let tickets = ticketOps.getTickets();
        expect(tickets.length).toBe(1);
        expect(tickets[0].amount).toBe(100);
        expect(tickets[0].description).toBe("testdesc");
        expect(tickets[0].status).toBe("PENDING");
        expect(tickets[0].submittedBy).toBe("testuser");
    });
});
describe("Processing Tickets", () => {
    test("User exists but manager doesn't, should fail", () => {
        userOps.registerUser("testemployee", "pwd");
        ticketOps.submitTicket("testemployee", 100, "testdesc");
        ticketOps.processTicket("testmanager");
        let oldTickets = ticketOps.getOldTickets();
        expect(oldTickets.length).toBe(0);
    });
    test("Employee tries to process ticket, should fail", () => {
        userOps.registerUser("testemployee", "pwd");
        ticketOps.submitTicket("testemployee", 100, "testdesc");
        ticketOps.processTicket("testemployee");
        let oldTickets = ticketOps.getOldTickets();
        expect(oldTickets.length).toBe(0);
    });
    test("Manager approves ticket, should pass", () => {
        userOps.registerUser("testemployee", "pwd");
        userOps.registerUser("testmanager", "pwd", true);
        ticketOps.submitTicket("testemployee", 100, "testdesc");
        ticketOps.processTicket("testmanager");
        let oldTickets = ticketOps.getOldTickets();
        expect(oldTickets.length).toBe(1);
        expect(oldTickets[0].status).toBe("APPROVED");
    });
    test("Manager denies ticket, should pass", () => {
        userOps.registerUser("testemployee", "pwd");
        userOps.registerUser("testmanager", "pwd", true);
        ticketOps.submitTicket("testemployee", 100, "testdesc");
        ticketOps.processTicket("testmanager", false);
        let oldTickets = ticketOps.getOldTickets();
        expect(oldTickets.length).toBe(1);
        expect(oldTickets[0].status).toBe("DENIED");
    });
})