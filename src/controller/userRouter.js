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

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isManager = req.body.manager;
    if(!username || !password) return res.status(400).json({message: "You must provide a username and password"});
    const data = await userService.registerUser(username, password, isManager);
    if(data) return res.status(201).json({message: "Created user"});
    return res.status(400).json({message: "Was not created", receivedData: req.body});
});


router.put('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password) return res.status(400).json({message: "You must provide a username and password"});
    const token = await userService.loginUser(req.body.username, req.body.password);
    if(!token) return res.status(400).json({message: "Username and/or password is incorrect"});
    return res.status(200).json({message: "User logged in successfully", token});
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