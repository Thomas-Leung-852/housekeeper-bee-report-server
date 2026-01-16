import Datastore from '@seald-io/nedb';
import { fileURLToPath } from 'url';
import path from 'path';

class NosqlDbTools {
    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.DB_DIR = path.join(__dirname, '../resources');

        // Create a NeDB instance
        this.db = new Datastore({ filename: path.join(this.DB_DIR, 'housekeeper_bee_rpt_srv.db'), autoload: true });
    }

    // Function to check if a document exists
    checkExists = (query, callback) => {
        this.db.find(query, (err, docs) => {
            if (err) {
                console.error('Error checking existence of document:', err);
                callback(err, false); // Pass error to the callback
            } else {
                callback(null, docs.length > 0); // Return true if document exists, otherwise false
            }
        });
    };

    createCompositeQuery = (data, keys) => {
        const query = {};
        keys.forEach(key => {
            if (data[key] !== undefined) {
                query[key] = data[key];
            }
        });
        return query;
    };

    insertIfNotExists = (data, keys) => {
        const query = this.createCompositeQuery(data, keys);
        this.checkExists(query, (err, exists) => {
            if (err) {
                console.error('Error finding document:', err);
                return;
            }

            if (!exists) {
                // Document does not exist, insert new document
                this.insertDocument(data);
            } else {
                console.log('Document already exists:', data);
            }
        });
    };

    // Insert a document
    insertDocument = (data) => {
        this.db.insert(data, (err, newDoc) => {
            if (err) {
                console.error('Error inserting document:', err);
            } 
        });
    };

    // Find documents
    findDocuments = () => {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                if (err) {
                    console.error('Find error:', err);
                    return reject(err);
                }
                resolve(docs); // Resolving with retrieved documents
            });
        });
    };

    // Edit a document by criteria
    editDocument = (criteria, updateData) => {
        this.db.update(criteria, { $set: updateData }, {}, (err, numAffected) => {
            if (err) {
                console.error('Error editing document:', err);
            } 
        });
    };

    // Edit or Add if Not Exist
    editOrAddDocument = (criteria, updateData) => {
        this.db.update(criteria, { $set: updateData }, { upsert: true }, (err, numAffected) => {
            if (err) {
                console.error('Error editing or adding document:', err);
            } else if (numAffected === 1) {
                //console.log('Document updated or added:', updateData);
            } else {
                console.log('No document updated, but it may have existed already.');
            }
        });
    };

    // Delete a document by criteria
    deleteDocument = (criteria) => {
        this.db.remove(criteria, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error('Error deleting document:', err);
            } 
        });
    };

    //********************************************************************* */
    // Data joining
    //********************************************************************* */

    // Generic Left Join
    leftJoin = (arr1, arr2, joinKeys) => {
        return arr1.map(item1 => {
            const match = arr2.find(item2 =>
                joinKeys.every(key => item1[key] === item2[key])
            );

            return {
                ...item1,
                ...(match || {}) // Merge match or empty object if no match
            };
        });
    };

    // Generic Right Join
    rightJoin = (arr1, arr2, joinKeys) => {
        return arr2.map(item2 => {
            const match = arr1.find(item1 =>
                joinKeys.every(key => item1[key] === item2[key])
            );

            return {
                ...item2,
                ...(match || {}) // Merge match or empty object if no match
            };
        }).filter(item => item[joinKeys[0]] != null); // Filter out unmatched items from arr1
    };

    // Generic Inner Join
    innerJoin = (arr1, arr2, joinKeys) => {
        return arr1.reduce((acc, item1) => {
            const match = arr2.find(item2 =>
                joinKeys.every(key => item1[key] === item2[key])
            );

            if (match) {
                acc.push({
                    ...item1,
                    ...match // Merge the matched object
                });
            }
            return acc;
        }, []);
    };
}

export default NosqlDbTools;