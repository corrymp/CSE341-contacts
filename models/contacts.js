const db = require('../db/connect');

/**
 * @param {object} contact - contact data to check against
 * @returns {typeof contact} original data if valid
 * @throws SchemaError if invalid
 */
const contactSchema = contact => {
    class SchemaError extends Error {
        name = 'SchemaError';
        constructor(message) {
            super(message);
        }
    }
    class SchemaMissingError extends SchemaError {
        constructor(prop, schema) {
            super(`"${schema}" must contain "${prop}"`);
        }
    }
    class SchemaTypeError extends SchemaError {
        constructor(propName, type, prop) {
            super(`"${propName}" must be of type "${type}", got "${typeof prop}"`);
        }
    }

    if (typeof contact !== 'object') throw new SchemaTypeError('contact', 'object', contact);

    try {
        const { firstName, lastName, email, favoriteColor, birthday } = contact;

        if (firstName === undefined) throw new SchemaMissingError('firstName', 'contact');
        if (lastName === undefined) throw new SchemaMissingError('lastName', 'contact');
        if (email === undefined) throw new SchemaMissingError('email', 'contact');
        if (favoriteColor === undefined) throw new SchemaMissingError('favoriteColor', 'contact');
        if (birthday === undefined) throw new SchemaMissingError('birthday', 'contact');

        if (typeof firstName !== 'string') throw new SchemaTypeError('firstName', 'string', firstName);
        if (typeof lastName !== 'string') throw new SchemaTypeError('lastName', 'string', lastName);
        if (typeof email !== 'string') throw new SchemaTypeError('email', 'string', email);
        if (typeof favoriteColor !== 'string') throw new SchemaTypeError('favoriteColor', 'string', favoriteColor);
        if (typeof birthday !== 'string') throw new SchemaTypeError('birthday', 'string', birthday);

        return contact;
    } catch (e) {
        if (e instanceof SchemaError) throw e;
        throw new SchemaError(e.message);
    }
};

/**@param {object} contact - data for new contact*/
async function createContact(contact) {
    try {
        return { error: null, result: await db.get().db().collection('Contacts').insertOne(contactSchema(contact)) };
    } catch (e) {
        //
        return { error: e, result: null };
    }
}

/**@param {string} id - id of contact to perform lookup on*/
async function getContact(id) {
    try {
        return {
            error: null,
            result: await db.get().db().collection('Contacts').findOne({ _id: id })
        };
    } catch (e) {
        //
        return { error: e, result: null };
    }
}

/**
 * @param {string} id - id of contact to update
 * @param {object} contact - data to set
 * */
async function updateContact(id, contact) {
    try {
        return {
            error: null,
            result: await db
                .get()
                .db()
                .collection('Contacts')
                .updateOne({ _id: id }, { $set: contactSchema(contact) })
        };
    } catch (e) {
        //
        return { error: e, result: null };
    }
}

/**@param {string} id - id of contact to delete*/
async function deleteContact(id) {
    try {
        return {
            error: null,
            result: await db.get().db().collection('Contacts').deleteOne({ _id: id })
        };
    } catch (e) {
        //
        return { error: e, result: null };
    }
}

async function getAllContacts() {
    try {
        return { error: null, result: await (await db.get().db().collection('Contacts').find()).toArray() };
    } catch (e) {
        //
        return { error: e, result: null };
    }
}

module.exports = { createContact, getContact, getAllContacts, updateContact, deleteContact };
