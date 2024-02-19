const userOps = require("./user");

let ticketList = [];
const getTickets = () => ticketList;
const clearTickets = () => {ticketList = []};
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

module.exports = {
    getTickets,
    clearTickets,
    submitTicket
}