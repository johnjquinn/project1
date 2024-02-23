const ticketDAO = require('../repository/ticketDAO');

const getAllTickets = async () => {
    const data = await ticketDAO.getAllTickets();
    return data;
};

const getTicket = async ticket_id => {
    if(!ticket_id) return null;
    const data = await ticketDAO.getTicket(ticket_id);
    return data;
};

const getTicketsBySubmitter = async submittedBy => {
    if(!submittedBy) return null;
    const totalTickets = await ticketDAO.getAllTickets();
    const found = totalTickets.filter(ticket => {return ticket.submitted_by === submittedBy});
    return found; 
};

const getTicketsByStatus = async status => {
    if(!status) return null;
    const totalTickets = await ticketDAO.getAllTickets();
    const found = totalTickets.filter(ticket => {return ticket.status === status});
    return found;
};

const addTicket = async Ticket => {
    if(!Ticket) return null;
    const totalTickets = await ticketDAO.getAllTickets();
    const ticket_id = totalTickets.length;
    const newTicket = {
        ticket_id,
        amount: Ticket.amount,
        description: Ticket.description,
        status: "PENDING",
        submitted_by: Ticket.submitted_by
    };
    const data = await ticketDAO.postTicket(newTicket);
    return data;
};

const updateTicket = async (ticket_id, newTicket) => {
    if(!ticket_id || !newTicket) return null;
    const data = await ticketDAO.updateTicket(ticket_id, newTicket);
    return data;
};

const deleteTicket = async ticket_id => {
    if(!ticket_id) return null;
    const data = await ticketDAO.deleteTicket(ticket_id);
    return data;
};

module.exports = {
    getAllTickets,
    getTicket,
    getTicketsByStatus,
    getTicketsBySubmitter,
    addTicket,
    updateTicket,
    deleteTicket
};