//state
const moods = {};
let moodNames = [];

function formatData(data) {
  const { happy, sad, ok, angry } = moods;

  return [
    { label: "happy", value: happy },
    { label: "ok", value: ok },
    { label: "sad", value: sad },
    { label: "angry", value: angry },
  ];
}

function drawGraph(data) {
  nv.addGraph(function () {
    const chart = nv.models
      .pieChart()
      .x((d) => d.label)
      .y((d) => d.value)
      .showLabels(true);
    d3.select("#chart svg").datum(data).transition().duration(500).call(chart);
    return chart;
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyBvFiHUP7ipueUoOwF2XGUbRkwDhfdmOxk",
  authDomain: "moods-f22c6.firebaseapp.com",
  databaseURL:
    "https://moods-f22c6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moods-f22c6",
  storageBucket: "moods-f22c6.appspot.com",
  messagingSenderId: "176702621374",
  appId: "1:176702621374:web:b295c78a3e9567715600ef",
};

//connect to firebase
firebase.initializeApp(firebaseConfig);

//connect to firestore
const db = firebase.firestore();

//connect to the correct database
const moodsCollectionRef = db.collection("moods");

//get the data from firestore
moodsCollectionRef.get().then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const { id } = childSnapshot;
    moodNames.push(id);
    const { value } = childSnapshot.data();
    moods[id] = value;
  });

  drawGraph(formatData(moods));
});

moodsCollectionRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") {
      moods[change.doc.id] = change.doc.data().value;
    }

    drawGraph(formatData(moods));
  });
});

function incrementField(field) {
  moodsCollectionRef.doc(field).update({
    value: moods[field] + 1,
  });
}

const happyButton = document.getElementById("happy");
const sadButton = document.getElementById("sad");
const okButton = document.getElementById("ok");
const angryButton = document.getElementById("angry");

happyButton.addEventListener("click", () => {
  incrementField("happy");
});
sadButton.addEventListener("click", () => {
  incrementField("sad");
});
okButton.addEventListener("click", () => {
  incrementField("ok");
});
angryButton.addEventListener("click", () => {
  incrementField("angry");
});
