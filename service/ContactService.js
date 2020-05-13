'use strict';


let sqlDb;

exports.contactsDbSetup = function(database) {
    sqlDb = database;
    return database.schema.hasTable("Person").then(exists => {
        if (!exists) {
            //console.log("It doesn't so we create it");
            return database.schema.createTable("Person", table => {
                //table.increments();
                table.increments("id").primary();
                table.string("full_name");
                table.string("email");
                table.string("phone");
                table.string("bio");
                table.integer("IDperson");
            });
        }
        else{
            console.log("Table already exists");
        }
    });
};




/**
 * Finds contacts
 * Get contacts
 *
 * returns List
 **/
exports.contactsGET = function() {
    return sqlDb('Person');
};


/**
 * Find contacts by ID
 *
 * id Long id to get the contact
 * returns Contact
 **/
exports.contactIdGET = function(id) {
    return sqlDb
        .from('Person')
        .select()
        .where({ IDperson: id })
        .then(data => {
            return data
        });
};


/**
 * Get the events of a contact
 *
 * id Long ID of contact of which to get the events
 * returns List
 **/
exports.contactsIdEventsGET = function(id) {

    return sqlDb
        .from("Person")
        .join('Event', 'Person.IDperson', 'Event.IDperson')
        .select("Event.IDevent", "Event.title")
        .where("Person.IDperson", id)
        .then(data => {
            return data
        });
};


