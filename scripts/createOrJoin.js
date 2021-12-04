/**
 * Creates a lobby for people to join, uses 4 random capital letters as the room code.
 */
function createLobby() {
  const generateCode = length => {
    return Array(length).fill('x').join('').replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    })
  }

  let lobbyCode = generateCode(4);

  localStorage.setItem("lobbyCode", lobbyCode);

  /**
   * Creates the lobby in firestore
   */
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          var userName = userDoc.data().name;
          var userID = user.uid;
          db.collection("games").doc(lobbyCode).set({
            code: lobbyCode,
            status: "creating",
            enableVote: false,
            window: 15,
            users: {
              host: {
                ID: userID,
                name: userName,
                votes: 1,
              }
            },
          }).then(function () {
            window.location.replace("./lobby.html")
          })
        })


    } else {
      alert("No user is signed in. Please Sign in first.")

    }

  });
}

/**
 * Redirect to the join lobby page.
 */
function join() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.location.replace("./gameJoin.html");
    } else {
      alert("No user is signed in. Please Sign in first.")
    }
  })
}
