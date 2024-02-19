const userOps = require("./user");

let ticketList = [];
let oldTickets = [];
const getTickets = () => ticketList;
const getOldTickets = () => oldTickets;
const clearTickets = () => {ticketList = []};
const clearOldTickets = () => {oldTickets = []};
const submitTicket = (username, amount, description) => {
    let user = userOps.getUser(username);
    if(!user) return "User doesn't exist";
    if(user.role !== "employee") return "Only employees can submit tickets";
    if(!amount || !description) return "You must provide an amount and description";
    if(amount < 0 || description.length === 0) return "Cannot provide empty data";
    let newTicket = {
        amount,
        description,
        status : "PENDING",
        submittedBy: username
    };
    ticketList.push(newTicket);
    return `User ${username} submitted ticket successfully`;
};
const processTicket = (username, approved=true) => {
    let user = userOps.getUser(username);
    if(!user) return "User doesn't exist";
    if(user.role !== "manager") return "Only managers can process tickets";
    let ticket = ticketList.splice(0, 1)[0];
    ticket.status = approved ? "APPROVED" : "DENIED";
    oldTickets.push(ticket);
    return (approved ? "Ticket has been approved" : "Ticket has been denied"); 
}

module.exports = {
    getTickets,
    getOldTickets,
    clearTickets,
    clearOldTickets,
    submitTicket,
    processTicket
}