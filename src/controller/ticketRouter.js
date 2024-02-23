const ticketService = require('../service/ticketService');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const idQuery = req.query.ticket_id;
    const submitterQuery = req.query.submitted_by;
    const statusQuery = req.query.status;
    if(idQuery){
        const ticket = await ticketService.getTicket(idQuery);
        return res.status(200).json({message: "Got ticket", ticket});
    } else if(submitterQuery){
        const ticket = await ticketService.getTicketsBySubmitter(submitterQuery);
        return res.status(200).json({message: "Got ticket", ticket});
    } else if(statusQuery){
        const tickets = await ticketService.getTicketsByStatus(statusQuery);
        return res.status(200).json({message: "Got tickets", tickets});
    } else {
        const tickets = await ticketService.getAllTickets();
        return res.status(200).json({message: "Got all tickets", tickets});
    }
});

router.post('/', async (req, res) => {
    const data = await ticketService.addTicket(req.body);
    if(data) return res.status(201).json({message: "Created ticket", data});
    if(!req.body) return res.status(400).json({message: "You must provide an amount, description, and the submitter"});
    return res.status(400).json({message: "Was not created", receivedData: req.body});
});

router.put('/', async (req, res) => {
    const idQuery = req.query.ticket_id;
    if(idQuery){
        const data = await ticketService.updateTicket(idQuery, req.body);
        if(data) return res.status({message: "Updated ticket", data});
        if(!req.body) return res.status(400).json({message: "You must provide a new amount, description, status, and submitter"});
        return res.status(400).json({message: `Could not update ticket with id ${idQuery}`});
    }
    return res.status(400).json({message: "You must provide a ticket id"});
});

router.delete('/', async (req, res) => {
    const idQuery = req.query.ticket_id;
    if(idQuery){
        const data = await ticketService.deleteTicket(idQuery);
        if(data) return res.status(200).json({message: "Deleted ticket", data});
        return res.status(400).json({message: `Could not delete ticket with id ${idQuery}`});
    }
    return res.status(400).json({message: "You must provide a ticket id"});
});

module.exports = router;