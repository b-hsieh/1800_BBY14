
var lobbyCode = localStorage.getItem("lobbyCode");
console.log(lobbyCode);
document.getElementById("codeNumber").innerHTML = lobbyCode;
var restarauntsDisplayed = false;


function displayCards(collection) {
  let CardTemplate = document.getElementById("CardTemplate");

  if (!restarauntsDisplayed) {
    restarauntsDisplayed = true;
    db.collection(collection).get()
    .then(snap => {
      var i = 1;
      snap.forEach(doc => {    //iterate thru each doc
        var title = doc.data().name;
        var details = doc.data().description;
        var image = doc.data().image;
        var code = doc.data().code;
        let newcard = CardTemplate.content.cloneNode(true);

        //update title and text and image
        newcard.querySelector('.card-title').innerHTML = title;
        newcard.querySelector('.card-text').innerHTML = details;
        newcard.querySelector('.card-image').src = image;

        //give unique ids to all elements for future use
        newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
        newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
        newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

        newcard.querySelector(".card-add").setAttribute("onclick", `setData('${code}'); addRestaurant(); hideList()`);
        //attach to gallery
        document.getElementById(collection + "-go-here").appendChild(newcard);
        i++;
      })
    })
  }
}

function displayGameList(collection) {
  let CardTemplate = document.getElementById("CardTemplate2");
  db.collection(collection).doc(lobbyCode).collection('gameList')
    .get()
    .then(snap => {
      var i = 1;
      snap.forEach(doc => {    //iterate thru each doc
        var title = doc.data().name;
        console.log(title);
        var details = doc.data().description;
        var image = doc.data().image;
        var code = doc.data().code;
        let newcard = CardTemplate.content.cloneNode(true);

        //update title and text and image
        newcard.querySelector('.card-title').innerHTML = title;
        newcard.querySelector('.card-text').innerHTML = details;
        newcard.querySelector('.card-image').src = image;

        //give unique ids to all elements for future use
        newcard.querySelector('.card-title').setAttribute("id", "vtitle" + i);
        newcard.querySelector('.card-text').setAttribute("id", "vtext" + i);
        newcard.querySelector('.card-image').setAttribute("id", "vimage" + i);

        newcard.querySelector(".card-vote").setAttribute("onclick", `setData('${code}'); voteRest(); hideVoteList()`);
        //attach to gallery
        document.getElementById(collection + "-go-here").appendChild(newcard);
        i++;
      })
    })
}

function displayWinner(collection) {

  let CardTemplate = document.getElementById("CardTemplate3");
  db.collection(collection).doc(lobbyCode).collection('gameList')
    .get()
    .then(snap => {
      var i = 1;
      setCount(0);
      snap.forEach(doc => {    //iterate thru each doc
        var title = doc.data().name;
        // console.log(title);
        var details = doc.data().description;
        var image = doc.data().image;
        var code = doc.data().code;
        var count = doc.data().count;
        let voteCount = localStorage.getItem("count")

        if (count > voteCount) {
          setCount(count);
          setData(code);
        }

      })
    })
  let resID = localStorage.getItem("code");
  db.collection("games").doc(lobbyCode).collection('gameList').where("code", "==", resID)
    .get()
    .then(queryRest => {
      Rests = queryRest.docs;
      var thisRest = Rests[0].data();
      // console.log(thisRest);
      var title = thisRest.name;
      // console.log(title);
      var code = thisRest.code;
      var details = thisRest.description;
      var image = thisRest.image;
      let newcard = CardTemplate.content.cloneNode(true);
      //update title and text and image
      newcard.querySelector('.card-title').innerHTML = title;
      newcard.querySelector('.card-text').innerHTML = details;
      newcard.querySelector('.card-image').src = image;

      //give unique ids to all elements for future use
      newcard.querySelector('.card-title').setAttribute("id", "winnerTitle");
      newcard.querySelector('.card-text').setAttribute("id", "winnerText");
      newcard.querySelector('.card-image').setAttribute("id", "winnerImage");

      //attach to gallery
      document.getElementById(collection + "-go-here").appendChild(newcard);
      i++;
    })
}



function listRest() {
  displayCards("restaurants");
}

function gameList() {
  displayGameList("games");
}



function hideList() {

  var displayState = document.getElementById('restList');

  if (displayState.style.display != "block") {
    displayState.style.display = "block";
    document.getElementById("listOf").innerText = "Close List";
  } else {
    displayState.style.display = "none";
    document.getElementById("listOf").innerText = "Add Restaurant";
  }
}

function hideVoteList() {
  var displayState = document.getElementById('voteList');
  if (displayState.style.display != "block") {
    displayState.style.visibility = "hidden";
  } else {
    displayState.style.display = "none";
  }
}



function setData(id) {
  localStorage.setItem('code', id);
}

function setCount(count) {
  localStorage.setItem('count', count);
}

function addRestaurant() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let resID = localStorage.getItem("code");
      db.collection("restaurants").where("code", "==", resID)
        .get()
        .then(queryRest => {

          Rests = queryRest.docs;
          var thisRest = Rests[0].data();
          // console.log(thisRest);
          var title = thisRest.name;
          // console.log(title);
          var code = thisRest.code;
          var details = thisRest.description;
          var image = thisRest.image;
          // var currentUser = db.collection("users").doc(user.uid)
          var currentGame = db.collection("games").doc(lobbyCode)
          // var restaurant = db.collection("restaurants").doc(user.uid)
          currentGame.collection("gameList").doc(code).set({
            name: title,
            code: code,
            description: details,
            image: image,
            count: 0

          });
        })


    } else {
      console.log("no user signed in");
    }
  })
}

function voteRest() {
  let resID = localStorage.getItem("code");

  db.collection("games").doc(lobbyCode).collection("gameList").where("code", "==", resID)
    .get()
    .then(queryRest2 => {
      db.collection("games").doc(lobbyCode).collection("gameList").doc(resID).update({
        count: firebase.firestore.FieldValue.increment(1)
      })
    })

}

function showTimer() {
  db.collection("games").doc(lobbyCode)
    .onSnapshot(lobbyCodeDoc => {
      var time = lobbyCodeDoc.data().window;
      console.log(time);
      document.getElementById("timer").innerHTML = time;
      if (time < 0) {
        document.getElementById("timer").innerHTML = "Time Over";
      }
    })
}
showTimer();

function startGame() {
  document.getElementById("vote").disabled = false;
  document.getElementById("start").disabled = true;
  document.getElementById("start").style.visibility = "hidden";
  db.collection("games").doc(lobbyCode).update({
    enableVote: true,
    status: "inProgress"
  })
  for (let i = 0; i < 15; i++) {
    setTimeout(increment, i * 1000);
  }
  setTimeout(
    () => {
      db.collection("games").doc(lobbyCode).update({
        status: "finished"
      })
    },
    15 * 1000
  );
}

function increment() {
  db.collection("games").doc(lobbyCode).update({
    window: firebase.firestore.FieldValue.increment(-1)
  })
}

function disableVote() {
  db.collection("games").doc(lobbyCode)
    .onSnapshot(lobbyCodeDoc => {
      if (lobbyCodeDoc.data().window <= 0 || lobbyCodeDoc.data().status == "creating") {
        document.getElementById("vote").disabled = true;
      }

      if (lobbyCodeDoc.data().status == "inProgress") {
        document.getElementById("start").style.visibility = "hidden";
      }

      if (lobbyCodeDoc.data().status == "inProgress") {
        document.getElementById("vote").disabled = false;
        document.getElementById("vote").innerHTML = "vote in progress..."
      }

      if (lobbyCodeDoc.data().status == "finished") {
        document.getElementById("vote").innerHTML = "vote completed"
        displayWinner("games");
      }

    })
}
disableVote();