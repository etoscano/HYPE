'use strict';


let sqlDb;

exports.activitiesDbSetup = function(database) {
    sqlDb = database;
    return database.schema.hasTable("Activity").then(exists => {
        if (!exists) {
            //console.log("It doesn't so we create it");
            return database.schema.createTable("Activity", table => {
                //table.increments();
                table.increments("id").primary();
                table.string("title");
                table.integer("IDactivity");
                table.text("description");
                table.text("practical_info");

                // table.foreign("eventId").references("events.id");
            });
        }
        else{
            //console.log("table already exists");
        }
    });
};


/**
 * Find activity with the activity's id
 *
 * id Long id of the activity you are searching
 * returns Activity
 **/
exports.activityIdGET = function(id) {
    return sqlDb
        .from('Activity')
        .select()
        .where({ IDactivity: id })
        .then(data => {
            return data
        });
};


/**
 * Find all the activities
 * List of all the activities
 * It doesn't get images
 *
 * returns List
 **/
exports.activitiesGET = function() {
    return sqlDb
        .from("Activity")
        .select("Activity.title","Activity.IDactivity")
        .orderBy('Activity.IDactivity')
        .then(data => {
            return data
        });
};


/**
 * Get the event of an activity
 *
 * id Long id of the activity you want the event of
 * returns Event
 **/
exports.activitiesIdEventGET = function(id) {
    return sqlDb
        .from("Event")
        .join('Event_activity', 'Event.IDevent', 'Event_activity.IDevent')
        .join('Activity', 'Activity.IDactivity', 'Event_activity.IDactivity')
        .select("Event.title","Event.IDevent","Event.location","Event.start_time","Event.end_time","Event.date")
        .where("Activity.IDactivity", id)
        .then(data => {
            return data
        });
};

/**
 * Get the contact of an activity
 *
 * id Long id of the activity you want the contact of
 * returns Contact
 **/
exports.activitiesIdContactGET = function(id) {
    return sqlDb
        .from("Person")
        .join('Person_activity', 'Person.IDperson', 'Person_activity.IDperson')
        .join('Activity', 'Activity.IDactivity', 'Person_activity.IDactivity')
        .select("Person.full_name","Person.IDperson","Person.img")
        .where("Activity.IDactivity", id)
        .then(data => {
            return data
        });


};

