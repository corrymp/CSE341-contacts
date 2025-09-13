const express = require('express');
const router = express.Router();

const controller = require('../controllers/contacts');

router.post('/', controller.createContact);
/* #swagger.requestBody = { 
    required: true, 
    consumes: ['application/json'],
    produces: ['application/json']
    content: { 
        "application/json": { 
            schema: { 
                $firstName: "string", 
                $lastName: "string", 
                $email: "string", 
                $favoriteColor: "string", 
                $birthday: "string"
            }
        }
    }
} */

router.get('/:id', controller.getContact);
// #swagger.start
/*
    #swagger.path = '/contacts/{id}'
    #swagger.method = 'get'
    #swagger.tags = ['contact']
    #swagger.description = 'get a contact by id'
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        description: 'contact id to lookup'
    }

    #swagger.responses[200] = {
        description: "contact returned", 
        content: {
            "application/json": {
                schema: { 
                    error: false, 
                    success: true, 
                    data: {
                        _id: "string",
                        firstName: "string",
                        lastName: "string",
                        email: "string",
                        favoriteColor: "string",
                        birthday: "string"
                    }
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: "contact not found", 
        content: {
            "application/json": {
                schema: { 
                    error: false, 
                    success: false,
                    data: 'contact not found'
                }
            }
        }
    }
    #swagger.responses[406] = {
        description: "malformed id", 
        content: {
            "application/json": {
                schema: { 
                    error: false, 
                    success: false,
                    data: "malformed id"
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: "server threw an error", 
        content: {
            "application/json": {
                schema: { 
                    error: true, 
                    success: false
                }
            }
        }
    } 
*/
// #swagger.end

router.put('/:id', controller.updateContact);
/* #swagger.description = 'update a contact via id'
#swagger.requestBody = { 
    required: true, 
    consumes: ['application/json'],
    produces: ['application/json']
    content: { 
        "application/json": { 
            schema: { 
                firstName: "string", 
                lastName: "string", 
                email: "string", 
                favoriteColor: "string", 
                birthday: "string"
            }
        }
    }
} */

router.delete('/:id', controller.deleteContact);

router.get('/', controller.getAll);

module.exports = router;
