const ticketOps = require('../src/ticket');
const userOps = require('../src/user');

beforeEach(() => {
    ticketOps.clearTickets();
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
})