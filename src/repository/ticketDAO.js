const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
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
        Key: {ticket_id}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
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
// const updateTicket = async (ticket_id, newTicket) => {
//     const command = new UpdateCommand({
//         TableName,
//         Key: {ticket_id},
//         UpdateExpression: "set "
//     })
// };
const deleteTicket = async ticket_id => {
    const command = new DeleteCommand({
        TableName,
        Key: {ticket_id}
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
    //updateTicket,
    deleteTicket
};