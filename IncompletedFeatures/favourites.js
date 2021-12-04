function writeRest() {
  //define a variable for the collection you want to create in Firestore to populate data
  var restRef = db.collection("restaurants");

  restRef.add({
    code: "ELT",
    description: "Fantastic food, service, friendly staff and reasonable prices, make this the best place to eat!! Did I mention the food?!!? You don’t usually get what you pay for. At this great place, you definitely do!!",
    location: "bby",
    name: "El Loco Taco"
  });
  restRef.add({
    code: "LPH",
    description: "The finest ingredients are brought together with love and care, then slow cooked to perfection. Yes, the old ways are still best at Los Pollos Hermanos. But don't take my word for it. One taste, and you'll know.",
    location: "bby",
    name: "Los Pollos Hermanos"
  });
  restRef.add({
    code: "NOK",
    description: "Casual, modern locale with bar & al fresco seating, furnishing pizza, housemade pasta & drinks.",
    location: "van",
    name: "Nook"
  });
  restRef.add({
    code: "PHC",
    description: "Relaxed spot for noodle soups & other Vietnamese comfort foods in a contemporary atmosphere.",
    location: "bby",
    name: "Pho Century"
  });
  restRef.add({
    code: "TEN",
    description: "Eastern European specialties are presented in a cozy antiques-filled room with a back patio.",
    location: "bby",
    name: "Tenen Restaurant"
  });
  restRef.add({
    code: "NAR",
    description: "Fusion style Korean food with flavorful sauces and good to share plates.",
    location: "bby",
    name: "Na-Re Korean Kitchen"
  });
  restRef.add({
    code: "MDS",
    description: "Low-key eatery offering familiar Indian dishes & vegetarian fare plus dosas in a modest setup.",
    location: "van",
    name: "Medras Spice"
  });
  restRef.add({
    code: "NBN",
    description: "Relaxed cafe offering Taiwanese fare & a dim sum menu, plus teas & smoothies, with delivery.",
    location: "bby",
    name: "No. 1 Beef Noodle"
  });
}


function displayFavRests() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)
      var userID = user.uid;
      currentUser.collection("favourites").get()
        .then(allRests => {
          allRests.forEach(doc => {
            var restName = doc.data().name; //gets the name field
            var restID = doc.data().code; //gets the unique ID field
            console.log(restID);
            document.getElementById(restID).innerText = restName;
          })

        })
    } else {
      console.log("no user signed in");
    }
  })
}
displayFavRests();

