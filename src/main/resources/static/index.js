var conn = null;

const button = document.querySelector("#send");
const messageBox = document.querySelector("#messages");
const input = document.querySelector("#message");
const alertBox = document.querySelector(".alerts");
const connectButton = document.querySelector("#connect");
const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
const nameField = document.querySelector("#name-field");

page2.style.display = "none";

const establishConnection = (name) => {
  conn = new WebSocket(`ws:${window.location.href.slice(5)}/socket`);

  conn.onmessage = (message) => {
    console.log(message);
    setMessage(message?.data, "left");
  };

  conn.onopen = (data) => {
    conn.send(name);
    console.log(data);
    setAlert("connection established");
  };
  conn.onclose = (data) => {
    console.log(data);
    setAlert("connection failed");
  };
};

const setConnection = () => {
  let name = nameField.value;
  nameField.value = "";
  if (name === "") {
    setAlert("enter name");
    return;
  }
  establishConnection(name);

  page1.style.display = "none";
  page2.style.display = "block";
};

const setAlert = (alert) => {
  if (alertBox.children.length === 3) {
    alertBox.removeChild(alertBox.children[0]);
  }

  let div = document.createElement("div");
  let text = document.createTextNode(alert);
  div.appendChild(text);
  // let close =document.createElement('span')
  // close.innerHTML='X'
  // close.classList.add('close');
  // div.appendChild(close);
  div.classList.add("alert");
  alertBox.insertBefore(div, alertBox.children[0]);
};

const setMessage = (message, type) => {
  let coverDiv = document.createElement("div");
  let div = document.createElement("div");
  if (message.includes(":")) {
    let [who, ...m] = message.split(":");
    let sender = document.createElement("div");
    sender.innerHTML = who;

    let text = document.createElement("div");
    let textNode = document.createTextNode(m.join(":"));
    text.appendChild(textNode);
    sender.classList.add("username");
    text.classList.add("message-text");
    div.appendChild(sender);

    div.appendChild(text);
    div.classList.add("message-div");
    coverDiv.classList.add(type);
  } else {
    let text = document.createElement("div");
    text.innerHTML = message;
    text.classList.add("message-text");

    div.appendChild(text);
    div.classList.add("message-alert");
    coverDiv.classList.add("center");
  }
  coverDiv.appendChild(div);
  coverDiv.classList.add("cover");
  messageBox.appendChild(coverDiv);
  messageBox.scrollTo(0, messageBox.scrollHeight);
};

function send() {
  let message = input.value;
  input.value = "";
  if (message === "") {
    setAlert("enter some message");
    return;
  }
  conn.send(message);
  setMessage("you : " + message, "right");
}

button.addEventListener("click", send);

connectButton.addEventListener("click", setConnection);

// configuration = null;
// var peerConnection = new RTCPeerConnection(configuration);

// var dataChannel = peerConnection.createDataChannel("dataChannel", { reliable: true });

// dataChannel.onerror = function(error) {
//     console.log("Error:", error);
// };
// dataChannel.onclose = function() {
//     console.log("Data channel is closed");
// };


document.getElementById("dont")
