function joinLobby() {
  let lobbyCode = document.getElementById("lobbyCode").value;
  localStorage.setItem("lobbyCode", lobbyCode);
  db.collection("games").doc(lobbyCode)
    .get().then(
      doc => {
        if (doc.exists) {
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              currentUser = db.collection("users").doc(user.uid);
              //get the document for current user.
              currentUser.get()
                .then(userDoc => {
                  var userName = userDoc.data().name;
                  var userID = user.uid;
                  console.log(userName);
                  db.collection("games").doc(lobbyCode).set({
                    users: {
                      [userID]: {
                        ID: userID,
                        name: userName,
                        votes: 1,
                      }
                    },
                  }, { merge: true });
                }).then(function () {
                  window.location.replace("./lobby.html");
                });
            } else {
              // No user is signed in.
              console.log("no user signed in");
            }
          })
        } else {
          alert("There is no lobby with this code")
        }
      }
    )
}