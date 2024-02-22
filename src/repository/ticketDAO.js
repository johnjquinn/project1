const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "p1-Tickets";

const getAllTickets = async () => {

};
const getTicket = async ticket_id => {

};
const postTicket = async Ticket => {

};
const updateTicket = async (ticket_id, newTicket) => {

};
const deleteTicket = async ticket_id => {

};

module.exports = {
    getAllTickets,
    getTicket,
    postTicket,
    updateTicket,
    deleteTicket
};