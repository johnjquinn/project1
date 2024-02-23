const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");
const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "p1-Tickets";

const getAllTickets = async () => {
    const command = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
};
const getTicket = async ticket_id => {
    const command = new GetCommand({
        TableName,
        Key: {
            ticket_id: Number(ticket_id)
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (error) {
        logger.error(error);
    }
};
const postTicket = async Ticket => {
    const command = new PutCommand({
        TableName,
        Item: Ticket
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
};
const updateTicket = async (ticket_id, newTicket) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            ticket_id: Number(ticket_id)
        },
        UpdateExpression: "set #a = :a, #d = :d, #s = :s, #u = :u",
        ExpressionAttributeNames: {"#a": "amount", "#d": "description", "#s": "status", "#u": "submitted_by"},
        ExpressionAttributeValues: {":a": newTicket.amount, ":d": newTicket.description, ":s": newTicket.status, ":u": newTicket.submitted_by}
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
};
const deleteTicket = async ticket_id => {
    const command = new DeleteCommand({
        TableName,
        Key: {
            ticket_id: Number(ticket_id)
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    getAllTickets,
    getTicket,
    postTicket,
    updateTicket,
    deleteTicket
};