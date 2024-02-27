const ticketService = require('../src/service/ticketService');
const ticketDAO = require('../src/repository/ticketDAO');

jest.mock('../src/repository/ticketDAO');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Getting Tickets', () => {
    test('GetAllTickets: Should return no tickets', async () => {
        ticketDAO.getAllTickets.mockResolvedValue([]);
        const result = await ticketService.getAllTickets();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(0);
    });
    test('GetAllTickets: Should return one ticket', async () => {
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
        expect(result).toHaveLength(1);
        expect(result[0]).toStrictEqual(ticket);
    });
    test('GetAllTickets: Should return two tickets', async () => {
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
        expect(result).toHaveLength(2);
        expect(result[0]).toStrictEqual(ticket0);
        expect(result[1]).toStrictEqual(ticket1);
    });
    test('GetTicket: No ticket id, should return null', async () => {
        const result = await ticketService.getTicket();
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('GetTicket: Ticket id present, should return ticket', async () => {
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
    test('GetTicketBySubmitter: No submitter present, should return null', async () => {
        const result = await ticketService.getTicketsBySubmitter();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('GetTicketBySubmitter: Submitter provided, should return one ticket', async () => {
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
        expect(result).toHaveLength(1);
        expect(result[0]).toStrictEqual(ticket0);
    });
    test('GetTicketByStatus: No status, should return null', async () => {
        const result = await ticketService.getTicketsByStatus();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('GetTicketByStatus: Status provided, should return one ticket', async () => {
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
    test('AddTicket: No ticket data, should return null', async () => {
        const result = await ticketService.addTicket();
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(0);
        expect(ticketDAO.postTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('AddTicket: Ticket data provided, should return true', async () => {
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

describe('Processing Tickets', () => {
    test('ProcessTicket: No ticket id, should return null', async () => {
        const result = await ticketService.processTicket();
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('ProcessTicket: Ticket id but no approved flag, should return null', async () => {
        const result = await ticketService.processTicket(0);
        expect(ticketDAO.getTicket).toHaveBeenCalledTimes(0);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('ProcessTicket: Ticket id provided, should be approved', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket]);
        ticketDAO.updateTicket.mockResolvedValue(true);
        const result = await ticketService.processTicket(0, true);
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
    test('ProcessTicket: Ticket id provided, should be denied', async () => {
        const ticket = {
            ticket_id: 0,
            amount: 100,
            description: "testdesc",
            status: "PENDING",
            submitted_by: "testuser"
        };
        ticketDAO.getAllTickets.mockResolvedValue([ticket]);
        ticketDAO.updateTicket.mockResolvedValue(true);
        const result = await ticketService.processTicket(0, true);
        expect(ticketDAO.getAllTickets).toHaveBeenCalledTimes(1);
        expect(ticketDAO.updateTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});

describe('Deleting Tickets', () => {
    test('DeleteTicket: No ticket id, should return null', async () => {
        const result = await ticketService.deleteTicket();
        expect(ticketDAO.deleteTicket).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });
    test('DeleteTicket: Ticket id provided, should return true', async () => {
        ticketDAO.deleteTicket.mockResolvedValue(true);
        const result = await ticketService.deleteTicket(0);
        expect(ticketDAO.deleteTicket).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
});