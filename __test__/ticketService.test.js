const ticketService = require('../src/service/ticketService');
const ticketDAO = require('../src/repository/ticketDAO');

jest.mock('../src/repository/ticketDAO');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Getting All Tickets', () => {
    test('Empty ticket list', async () => {
        ticketDAO.getAllTickets.mockResolvedValue([]);
        const result = await ticketService.getAllTickets();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual([]);
    });
    test('One ticket', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket]);
        const result = await ticketService.getAllTickets();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(ticket);
    });
    test('Two tickets', async () => {
        const ticket0 = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc0",
            status: "PENDING",
            submitted_by: "testuser0"
        };
        const ticket1 = {
            ticket_id: 1,
            amount: 100,
            description: "testdesc1",
            status: "PENDING",
            submitted_by: "testuser1"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket0, ticket1]);
        const result = await ticketService.getAllTickets();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(2);
        expect(result[0]).toStrictEqual(ticket0);
        expect(result[1]).toStrictEqual(ticket1);
    });
});

describe('Getting One Ticket', () => {
    test('No ticket id', async () => {
        const result = await ticketService.getTicket();
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getTicket.mockResolvedValue(ticket);
        const result = await ticketService.getTicket(0);
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(ticket);
    });
});

describe('Getting a Group of Tickets', () => {
    test('No submitter', async () => {
        const result = await ticketService.getTicketsBySubmitter();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Submitter provided', async () => {
        const ticket0 = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc0",
            status: "PENDING",
            submitted_by: "testuser0"
        };
        const ticket1 = {
            ticket_id: 1,
            amount: 100,
            description: "testdesc1",
            status: "PENDING",
            submitted_by: "testuser1"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket0, ticket1]);
        const result = await ticketService.getTicketsBySubmitter("testuser0");
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(ticket0);
    });
    test('No status', async () => {
        const result = await ticketService.getTicketsByStatus();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Status provided', async () => {
        const ticket0 = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc0",
            status: "PENDING",
            submitted_by: "testuser0"
        };
        const ticket1 = {
            ticket_id: 1,
            amount: 100,
            description: "testdesc1",
            status: "APPROVED",
            submitted_by: "testuser1"
        };
        const ticket2 = {
            ticket_id: 2,
            amount: 100,
            description: "testdesc2",
            status: "DENIED",
            submitted_by: "testuser2"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket0, ticket1, ticket2]);
        const result = await ticketService.getTicketsByStatus("APPROVED");
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual(ticket1);
    });
});

describe('Adding Tickets', () => {
    test('No ticket data', async () => {
        const result = await ticketService.addTicket();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(ticketDAO.postTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket data provided', async () => {
        const ticket = {
            amount: 100,
            description: "testdesc",
            submitted_by: "testuser"
        };
        ticketDAO.getAllTickets.mockResolvedValue([]);
        ticketDAO.postTicket.mockResolvedValue(true);
        const result = await ticketService.addTicket(ticket);
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(ticketDAO.postTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Updating Tickets', () => {
    test('No ticket id or new ticket data', async () => {
        const result = await ticketService.updateTicket();
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id but no new ticket data', async () => {
        const result = await ticketService.updateTicket(0);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id and new data', async () => {
        ticketDAO.updateTicket.mockResolvedValue(true);
        const newTicket = {
            amount: 200,
            description: "pibager",
            submitted_by: "mytr5w4"
        };
        const result = await ticketService.updateTicket(0, newTicket);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Deleting Tickets', () => {
    test('No ticket id', async () => {
        const result = await ticketService.deleteTicket();
        expect(ticketDAO.deleteTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id provided', async () => {
        ticketDAO.deleteTicket.mockResolvedValue(true);
        const result = await ticketService.deleteTicket(0);
        expect(ticketDAO.deleteTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Processing Tickets', () => {
    test('No ticket id', async () => {
        const result = await ticketService.processTicket();
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id provided but no approved flag', async () => {
        const result = await ticketService.processTicket(0);
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('Ticket id provided, is approved', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getTicket.mockResolvedValue(ticket);
        ticketDAO.updateTicket.mockResolvedValue(true);
        const result = await ticketService.processTicket(0, true);
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(1);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
    test('Ticket id provided, is denied', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getTicket.mockResolvedValue(ticket);
        ticketDAO.updateTicket.mockResolvedValue(true);
        const result = await ticketService.processTicket(0, true);
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(1);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});