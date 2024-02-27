# Revature Project 1

A backend that manages user data and tickets using NodeJS.

## Components

This backend utilizes NodeJS and DynamoDB, using Winston, BCrypt, JsonWebToken, and Express.

## API

This backend uses two APIs which manage user data and ticket data respectively.

# Usage

Simply type `npm start` to begin running the server, and make HTTP requests using an app like Postman.

## /Users

 - POST: Enter in a username, password, and an optional manager flag into the request body, and it will create a user object.
 - GET: This will return a list of users. Enter a username into the URL query, and it will return the corresponding user.
 - PUT: Enter in a username and password, and it will return a JWT which can be used to access the tickets.
 - DELETE: Enter in a user id into the URL query and the corresponding user will be deleted.

## /Tickets

 - POST: Enter in an amount and description into the request body, and place an employee token inside the 'Authorization' Header (`Bearer <token>`), and a new ticket object will be created and registered as 'PENDING'.
 - GET: Use an employee token and it will return a list of tickets submitted by the employee, complete with both pending and processed tickets. Use a manager token and it will return a list of pending tickets.
 - PUT: Enter a ticket id and an approved flag into the request body with a manager token and the corresponding ticket will be processed. Its status will either be changed to 'APPROVED' or 'DENIED' based on the flag set in the body, after which point the status cannot be changed until it is deleted.
 - DELETE: Enter a ticket id into the URL query with a manager ticket and the corresponding ticket will be deleted.