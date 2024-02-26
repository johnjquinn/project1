const ticketService = require('../service/ticketService');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.P1_SECRET_KEY;

const router = express.Router();

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message: "Unauthorized Access"});
    jwt.verify(token, secretKey, (err, user) => {
        if(err) return res.status(403).json({message: "Forbidden Access"});
        req.user = user;
        next();
    });
};

const authManagerToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message: "Unauthorized Access"});
    jwt.verify(token, secretKey, (err, user) => {
        if(err || user.role !== "manager") return res.status(403).json({message: "Forbidden Access"});
        req.user = user;
        next();
    });
};

router.get('/', authToken, async (req, res) => {
    if(req.user.role === "manager"){
        const tickets = await ticketService.getTicketsByStatus("PENDING");
        return res.status(200).json({message: "Got pending tickets", tickets});
    }
    else{
        const tickets = await ticketService.getTicketsBySubmitter(req.user.username);
        return res.status(200).json({message: `Got tickets submitted by ${req.user.username}`, tickets});
    }
});

router.post('/', authToken, async (req, res) => {
    if(req.user.role !== "employee") return res.status(403).json({message: "Only employees may submit new tickets", receivedUser: req.user});
    const amount = req.body.amount;
    const description = req.body.description;
    if(!amount || !description) return res.status(400).json({message: "You must provide an amount and description"});
    const newTicket = {
        amount: req.body.amount,
        description: req.body.description,
        submitted_by: req.user.username
    };
    const data = await ticketService.addTicket(newTicket);
    if(data) return res.status(201).json({message: "Created ticket"});
    return res.status(400).json({message: "Was not created", receivedData: req.body});
});

router.put('/', authManagerToken, async (req, res) => {
    const ticket_id = req.body.ticket_id;
    const approved = req.body.approved;
    const data = await ticketService.processTicket(ticket_id, approved);
    if(!data) return res.status(400).json({message: `Ticket has already been processed`, receivedData: req.body});
    return res.status(200).json({message: `Ticket has been ${approved ? "APPROVED" : "DENIED"}`});
});

router.delete('/', authManagerToken, async (req, res) => {
    const idQuery = req.query.ticket_id;
    if(idQuery){
        const data = await ticketService.deleteTicket(idQuery);
        if(data) return res.status(200).json({message: "Deleted ticket"});
        return res.status(400).json({message: `Could not delete ticket with id ${idQuery}`});
    }
    return res.status(400).json({message: "You must provide a ticket id"});
});


module.exports = router;