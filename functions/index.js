const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../fire-admin-campfire.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://campfire-2cd78.firebaseio.com"
  });
const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.setupSessionTable = functions.https.onRequest((request, response) => {

    admin.firestore().collection("users").get()
    .then(data => {
        var session = []
        data.forEach(doc => {
            if (doc.id != request.body.uid) {
                session.push(doc.id)
            }
        })
        admin.firestore().collection("sessions").doc(request.body.uid)
            .set({userlist: session})
            .then(data => {
                return response.send(session)
            })
            .catch(err => {
                console.log(err)
                return response.sendStatus(500)
            })
    })
    .catch (err => {
        console.log(err)
        return response.sendStatus(500)
    })

});

exports.leaveSessionTable = functions.https.onRequest((req, res) => {

    admin.firestore().collection("session").get()
    .then(data => {
        
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })

})