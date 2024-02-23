const userService = require('../service/userService');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const idQuery = req.query.user_id;
    const usernameQuery = req.query.username;
    if(idQuery){
        const user = await userService.getUser(idQuery);
        return res.status(200).json({message: "Got user", user});
    }else if(usernameQuery){
        const user = await userService.getUserByUsername(usernameQuery);
        return res.status(200).json({message: "Got user", user});
    }
    else{
        const users = await userService.getAllUsers();
        return res.status(200).json({message: "Got all users", users});
    }
});

//WILL BE REPLACED BY REGISTER FUNCTION IN APP.JS
router.post('/', async (req, res) => {
    const data = await userService.addUser(req.body);
    if(data) return res.status(201).json({message: "Created user", data});
    if(!req.body) return res.status(400).json({message: "You must provide a username, password, and role"});
    return res.status(400).json({message: "Was not created", receivedData: req.body});
});

router.put('/', async (req, res) => {
    const idQuery = req.query.user_id;
    if(idQuery){
        const data = await userService.updateUser(idQuery, req.body);
        if(data) return res.status(200).json({message: "Updated user", data});
        if(!req.body) return res.status(400).json({message: "You must provide a new username, password, and role"});
        return res.status(400).json({message: `Could not update user with id ${idQuery}`});
    }
    return res.status(400).json({message: "You must present a user id"});
});

router.delete('/', async (req, res) => {
    const idQuery = req.query.user_id;
    if(idQuery){
        const data = await userService.deleteUser(idQuery);
        if(data) return res.status(200).json({message: "Deleted user", data});
        return res.status(400).json({message: `Could not delete user with id ${idQuery}`});
    }
    return res.status(400).json({message: "You must present a user id"});
});

module.exports = router;