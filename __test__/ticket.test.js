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
});
describe("Ticket History", () => {
    test("User exists but no tickets, should return empty", () => {
        userOps.registerUser("employee", "pwd");
        let hist = ticketOps.ticketHistory("employee");
        expect(hist.length).toBe(0);
    });
    test("Tickets exist but not the user requesting history", () => {
        userOps.registerUser("emp1", "pwd");
        ticketOps.submitTicket("emp1", 100, "desc1");
        ticketOps.submitTicket("emp1", 120, "desc2");
        let hist1 = ticketOps.ticketHistory("emp1");
        expect(hist1.length).toBe(2);
        let hist2 = ticketOps.ticketHistory("emp2");
        expect(hist2.length).toBe(0);
    });
    test("User submitted tickets, some of which are approved", () => {
        userOps.registerUser("employee", "pwd");
        userOps.registerUser("manager", "pwd", true);
        ticketOps.submitTicket("employee", 100, "desc1");
        ticketOps.submitTicket("employee", 120, "desc2");
        ticketOps.submitTicket("employee", 140, "desc3");
        ticketOps.processTicket("manager");
        ticketOps.processTicket("manager", false)
        let hist = ticketOps.ticketHistory("employee");
        expect(hist.length).toBe(3);
        expect(hist[0].status).toBe("APPROVED");
        expect(hist[1].status).toBe("DENIED");
        expect(hist[2].status).toBe("PENDING");
    });
    test("Two different users submitted tickets", () => {
        userOps.registerUser("emp1", "pwd");
        userOps.registerUser("emp2", "pwd");
        userOps.registerUser("manager", "pwd", true);
        ticketOps.submitTicket("emp1", 100, "desc1");
        ticketOps.submitTicket("emp1", 120, "desc2");
        ticketOps.submitTicket("emp2", 100, "desc3");
        ticketOps.submitTicket("emp1", 140, "desc4");
        ticketOps.submitTicket("emp2", 120, "desc5");
        let hist1 = ticketOps.ticketHistory("emp1");
        let hist2 = ticketOps.ticketHistory("emp2");
        expect(hist1.length).toBe(3);
        expect(hist2.length).toBe(2);
    });
});