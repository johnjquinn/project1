const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
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
        Key: {
            user_id: Number(user_id)
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (error) {
        logger.error(error);
    }
};
const postUser = async User => {
    const command = new PutCommand({
        TableName,
        Item: User
    });
    try {
        const data = await documentClient.send(command);
        return data ? true : false;
    } catch (error) {
        logger.error(error);
    }
};
const updateUser = async (user_id, newUser) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id: Number(user_id)
        },
        UpdateExpression: "set #u = :u, #p = :p, #r = :r",
        ExpressionAttributeNames: {"#u": "username", "#p": "password", "#r": "role"},
        ExpressionAttributeValues: {":u": newUser.username, ":p": newUser.password, ":r": newUser.role}
    });
    try {
        const data = await documentClient.send(command);
        return data ? true : false;
    } catch (error) {
        logger.error(error);
    }
};
const deleteUser = async user_id => {
    const command = new DeleteCommand({
        TableName,
        Key: {
            user_id: Number(user_id)
        }
    });
    try {
        const data = await documentClient.send(command);
        return data ? true : false;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser
};