const model = require('../models/contacts');
const { StatusCodes } = require('../utils');
const ObjectId = require('mongodb').ObjectId;

/**
 * @param {string} id - id to validate
 * @returns {ObjectId|false} a valid ObjectId from the id string or false if invalid
 */
const validateId = id => {
    let result;
    try {
        result = new ObjectId(id);
    } catch {
        result = false;
    }
    return result;
};

/**
 * @param {string} source - erroring function name
 * @param {Error} err - thrown error object
 */
const modelError = (source, err) => console.error(`\n<modelerror>\nError whilst running "controllers.contacts.${source}":\n`, err, '\n</modelerror>\n');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function createContact(req, res) {
    /* #swagger.tags = ['contact'] 
    #swagger.description = 'create a contact' */

    const resultObj = { error: false, success: false };
    res.setHeader('Content-Type', 'application/json');
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            resultObj.data = `malformed request: missing ${['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'].filter(param => !req.body[param]).join(', ')}`;
            return res.status(StatusCodes.NotAcceptable).json(resultObj);
            /* #swagger.responses[406] = {
                description: "missing required parameters", 
                content: {
                    "application/json": {
                        schema: {
                            error: false,
                            success: false,
                            data: 'malformed request: missing <parameter|parameters...>'
                        }
                    }
                }
            } */
        }
        const { error, result } = await model.createContact({ firstName, lastName, email, favoriteColor, birthday });
        if (error) throw error;
        resultObj.success = true;
        resultObj.id = result.insertedId;
        res.status(StatusCodes.Created).json(resultObj);
        /* #swagger.responses[201] = {
            description: "new contact added", 
            content: {
                "application/json": {
                    schema: {
                        error: false,
                        success: true,
                        id: 'string'
                    }
                }
            }
        } */
    } catch (e) {
        modelError('createContact', e);
        resultObj.error = true;
        res.status(StatusCodes.InternalServerError).json(resultObj);
        /* #swagger.responses[500] = {
            description: "server threw an error", 
            content: {
                "application/json": {
                    schema: {
                        error: true,
                        success: false
                    }
                }
            }
        } */
    }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function updateContact(req, res) {
    /* #swagger.tags = ['contact'] 
    #swagger.description = 'update a contact by id' */

    const resultObj = { error: false, success: false };
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;
    const id = validateId(req.params.id);
    if (!id) {
        resultObj.data = 'malformed id';
        res.status(StatusCodes.NotAcceptable).json(resultObj);
        /* #swagger.responses[406] = {
            description: "malformed id", 
            content: {
                "application/json": {
                    schema: {
                        error: false,
                        success: false, 
                        data: 'malformed id'
                    }
                }
            }
        } */
        return;
    }

    // existing contact to update: used to verify that contact exists and that changes are being made
    const existingData = (await model.getContact(id)).result;

    // contact does not exist
    if (!existingData) {
        resultObj.data = 'contact not found';
        res.status(StatusCodes.NotFound).json(resultObj);
        /* #swagger.responses[404] = {
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
        } */
        return;
    }

    // no changes
    if ((body.firstName === existingData.firstName || body.firstName === undefined) && (body.lastName === existingData.lastName || body.lastName === undefined) && (body.email === existingData.email || body.email === undefined) && (body.favoriteColor === existingData.favoriteColor || body.favoriteColor === undefined) && (body.birthday === existingData.birthday || body.birthday === undefined)) {
        res.status(StatusCodes.NotModified).send();
        /* #swagger.responses[304] = {
            description: "contact would have no changes"
        } */
        return;
    }

    // combines the data and overwrites the old
    const { firstName, lastName, email, favoriteColor, birthday } = { ...existingData, ...body };

    try {
        // actually does the update - error will be null if it succeded
        const { error } = await model.updateContact(id, { firstName, lastName, email, favoriteColor, birthday });
        if (error) throw error;

        res.status(StatusCodes.NoContent).send();
        /* #swagger.responses[204] = {
            description: "contact updated"
        } */
    } catch (e) {
        modelError('updateContact', e);
        resultObj.error = true;
        res.status(StatusCodes.InternalServerError).json(resultObj);
        /* #swagger.responses[500] = {
            description: "server threw an error", 
            content: {
                "application/json": {
                    schema: {
                        error: true,
                        success: false
                    }
                }
            }
        } */
    }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteContact(req, res) {
    /* #swagger.tags = ['contact'] 
    #swagger.description = 'delete a contact by id' */

    const resultObj = { error: false, success: false };
    res.setHeader('Content-Type', 'application/json');

    const id = validateId(req.params.id);
    if (!id) {
        resultObj.data = 'malformed id';
        res.status(StatusCodes.NotAcceptable).json(resultObj);
        /* #swagger.responses[406] = {
            description: "malformed id", 
            content: {
                "application/json": {
                    schema: { 
                        error: false, 
                        success: false, 
                        data: 'malformed ID'
                    }
                }
            }
        } */
        return;
    }

    try {
        const { error, result } = await model.deleteContact(id);
        if (error) throw error;
        if (result.deletedCount === 0) {
            resultObj.data = 'contact not found';
            res.status(StatusCodes.NotFound).json(resultObj);
            /* #swagger.responses[404] = {
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
            } */
            return;
        }
        res.status(StatusCodes.NoContent).send();
        /* #swagger.responses[204] = {
            description: "contact succesfully deleted"
        } */
    } catch (e) {
        modelError('deleteContact', e);
        resultObj.error = true;
        res.status(StatusCodes.InternalServerError).json(resultObj);
        /* #swagger.responses[500] = {
            description: "server threw an error", 
            content: {
                "application/json": {
                    schema: { 
                        error: true, 
                        success: false
                    }
                }
            }
        } */
    }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getContact(req, res) {
    const resultObj = { error: false, success: false };
    res.setHeader('Content-Type', 'application/json');
    const id = validateId(req.params.id);
    if (!id) {
        resultObj.data = 'malformed id';
        return res.status(StatusCodes.NotAcceptable).json(resultObj);
    }

    try {
        const { error, result } = await model.getContact(id);
        if (error) throw error;
        if (!result) {
            resultObj.data = 'contact not found';
            return res.status(StatusCodes.NotFound).json(resultObj);
        }

        resultObj.data = result;
        resultObj.success = true;
        res.status(StatusCodes.OK).json(resultObj);
    } catch (e) {
        modelError('getContact', e);
        resultObj.error = true;
        res.status(StatusCodes.InternalServerError).json(resultObj);
    }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAll(req, res) {
    /* #swagger.tags = ['contact'] 
    #swagger.description = 'get all contacts' */

    const resultObj = { error: false, success: false, count: 0, data: null };
    res.setHeader('Content-Type', 'application/json').status(StatusCodes.InternalServerError);
    try {
        const { error, result } = await model.getAllContacts();
        if (error) throw error;
        resultObj.success = true;
        resultObj.data = result;
        resultObj.count = result.length;
        res.status(StatusCodes.OK).json(resultObj);
        /* #swagger.responses[200] = {
            description: "all contacts returned", 
            content: {
                "application/json": {
                    schema: {
                        error: false,
                        success: true,
                        count: 1,
                        data: [
                            {
                                _id: "string",
                                firstName: "string",
                                lastName: "string",
                                email: "string",
                                favoriteColor: "string",
                                birthday: "string"
                            }
                        ]
                    }
                }
            }
        } */
    } catch (e) {
        modelError('getAll', e);
        resultObj.error = true;
        res.json(resultObj);
        /* #swagger.responses[500] = {
            description: "server threw an error", 
            content: {
                "application/json": {
                    schema: {
                        error: true, 
                        success: false, 
                        count: 0, 
                        data: null
                    }
                }
            }
        } */
    }
}

module.exports = { createContact, getContact, updateContact, deleteContact, getAll };
