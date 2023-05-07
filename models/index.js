const get_connection = require('./connection');

function get_collection(collection_name) {
    return get_connection()
        .then(function (client) {
            return client.db('github').collection(collection_name);
        });
}

function update_log(issue) {
    return get_collection('issues')
        .then(async function (issues_collection) {
            await issues_collection.insertOne(issue);
        });
}

function is_posted(issue) {
    return get_collection('issues')
        .then(async function (issues_collection) {
            const query = { id: issue.id };
            const issue_db =  await issues_collection.findOne(query);

            if(issue_db) return true;

            return false;
        });
}

module.exports = {update_log, is_posted};
