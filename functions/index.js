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

exports.addToSessionInfo = functions.https.onRequest((req, res) => {

    var userID = req.body.uid;

    admin.firestore().collection("sessions").get()
    .then(sessions => {
        sessions.forEach(doc => {
            if (doc.id != userID) {
                var inf = doc.data().info
                console.log("collection: sessions /// doc: " + doc.id)
                if (inf.indexOf(userID) == -1) {
                    inf.push(userID)
                }
                admin.firestore().collection("sessions").doc(doc.id).set({info : inf})
                .then(added => {
                    console.log("added to list")
                })
                .catch(err => {
                    console.log(err)
                    return res.sendStatus(500)
                })
            }
        })

        return res.sendStatus(200)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
})
exports.removeFromSessionInfo = functions.https.onRequest((req, res) => {
    var userID = req.body.uid;

    admin.firestore().collection("sessions").get()
    .then(sessions => {
        sessions.forEach(doc => {
            if (doc.id != userID) {
                var inf = doc.data().info
                console.log("collection: sessions /// doc: " + doc.id)
                inf.splice(inf.indexOf(userID), 1)
                admin.firestore().collection("sessions").doc(doc.id).set({info : inf})
                .then(added => {
                    console.log("added to list")
                })
                .catch(err => {
                    console.log(err)
                    return res.sendStatus(500)
                })
            }
        })

        return res.sendStatus(200)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
})
exports.getFirst = functions.https.onRequest((req, res) => {
    var userID = req.body.uid
    var count = req.body.count
    admin.firestore().collection("sessions").doc(userID).get()
        .then(data => {
            if (count > data.data().info.length - 1) {
                return res.send(data.data().info)
            }
            console.log(data.data().info[index])
            return res.sendStatus(200)
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(500)
        })
})
exports.getNext = functions.https.onRequest((req, res) => {

    var userID = req.body.uid
    var index = req.body.index
    admin.firestore().collection("sessions").doc(userID).get()
        .then(data => {
            if (index > data.data().info.length - 1) {
                return res.sendStatus(201)
            }
            console.log(data.data().info[index])
            return res.sendStatus(200)
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(500)
        })

})

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