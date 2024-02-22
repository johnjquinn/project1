const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");
const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "p1-Users";

const getAllUsers = async () => {
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
const getUser = async user_id => {
    const command = new GetCommand({
        TableName,
        Key: {user_id}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
};
const getUserByUsername = async username => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#n = :n",
        ExpressionAttributeNames: {"#n": "username"},
        ExpressionAttributeValues: {":n": username}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch (error) {
        logger.error(error);
    }
}
const postUser = async User => {
    const command = new PutCommand({
        TableName,
        Item: User
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
};
const updateUser = async (user_id, newUser) => {
    const command = new UpdateCommand({
        TableName,
        Key: {user_id},
        UpdateExpression: "set #u = :u, #p = :p, #r = :r",
        ExpressionAttributeNames: {"#u": "username", "#p": "password", "#r": "role"},
        ExpressionAttributeValues: {":u": newUser.username, ":p": newUser.password, ":r": newUser.role}
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.error(error);
    }
};
const deleteUser = async user_id => {
    const command = new DeleteCommand({
        TableName,
        Key: {user_id}
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    postUser,
    updateUser,
    deleteUser
};