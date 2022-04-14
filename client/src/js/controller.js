const login = document.querySelector(".login");
const register = document.querySelector(".register");
const homepage = document.querySelector(".homepage");
const face = document.querySelector(".face");
const addbtn = document.querySelector(".add");
const pwTable = document.querySelector(".pwTable");
const loginPage = document.querySelector(".login-it");
const registerPage = document.querySelector(".register-it");

if (homepage) {
  homepage.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.assign("/");
  });
}

if (login) {
  login.addEventListener("click", function (e) {
    e.preventDefault();
    window.history.pushState(null, "", "/login");
    location.reload();
  });
}
if (register) {
  register.addEventListener("click", function (e) {
    e.preventDefault();
    window.history.pushState(null, "", "/register");
    location.reload();
  });
}

if (loginPage) {
  function takeFacePic() {
    const br = document.querySelector(".br");
    br.insertAdjacentHTML(
      "afterend",
      `<div class="face">
      <video id="webcam" autoplay playsinline width="640" height="480"></video>
      <canvas id="canvas" class="d-none"></canvas>
      <button class="facePic btn btn-primary">Take picture when you ready</button>
    </div>`
    );
    if (document.querySelector(".non-face")) {
      document.querySelector(".non-face").remove();
    }
    const webcamElement = document.getElementById("webcam");
    const canvasElement = document.getElementById("canvas");
    const faceBtn = document.querySelector(".facePic");
    const webcam = new Webcam(webcamElement, "user", canvasElement, null);
    webcam.start();
    faceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const face = webcam.snap();
      webcam.stop();
      webcamElement.remove();
      faceBtn.remove();
      const formdata = new FormData();
      formdata.append("loginface", face);
      fetch("/loginface", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === 3000) {
            canvasElement.remove();
            alert(
              "We detect more than one face in the picture.\nPlease take another picture and make sure you are the only person in the picture"
            );
            takeFacePic();
          } else if (data === 200) {
            canvasElement.remove();
            alert(
              "We are not able to detect your face from the picture you just took.\nPlease take another picture"
            );
            takeFacePic();
          } else if (data) {
            alert("Login Success");
            window.location.assign("/user");
          } else {
            canvasElement.remove();
            localStorage.clear();
            console.log(1);
            alert(
              "We are not able to match your face from the picture you just took with the picture in our database.\nPlease take another picture"
            );
            takeFacePic();
          }
        });
    });
  }
  const form = document.querySelector(".key-image");
  form.addEventListener("submit", (e) => {
    let loginID;
    fetch("/loginimage", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        loginID = data.ID;
        if (loginID) {
          takeFacePic();
        } else {
          alert("This picture is not found, please submit the correct image.");
        }
      });
  });
}

if (registerPage) {
  function takeFacePic() {
    const br = document.querySelector(".br");
    br.insertAdjacentHTML(
      "afterend",
      `<div class="face">
      <video id="webcam" autoplay playsinline width="640" height="480"></video>
      <canvas id="canvas" class="d-none"></canvas>
      <button class="facePic btn btn-primary">Take picture when you ready</button>
    </div>`
    );
    if (document.querySelector(".non-face")) {
      document.querySelector(".non-face").remove();
    }
    const webcamElement = document.getElementById("webcam");
    const canvasElement = document.getElementById("canvas");
    const faceBtn = document.querySelector(".facePic");
    const webcam = new Webcam(webcamElement, "user", canvasElement, null);
    webcam.start();
    faceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const face = webcam.snap();
      webcam.stop();
      webcamElement.remove();
      faceBtn.remove();
      const formdata = new FormData();
      formdata.append("registerface", face);
      fetch("/registerface", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === 3000) {
            canvasElement.remove();
            alert(
              "We detect more than one face in the picture.\nPlease take another picture and make sure you are the only person in the picture"
            );
            takeFacePic();
          } else if (data) {
            alert("Register Success");
            window.location.assign("/user");
          } else {
            canvasElement.remove();
            alert(
              "We are not able to detect your face from the picture you just took.\nPlease take another picture"
            );
            takeFacePic();
          }
        });
    });
  }
  const form = document.querySelector(".key-image");
  form.addEventListener("submit", (e) => {
    let regID;
    fetch("/registerimage", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        regID = data;
        if (regID) {
          takeFacePic();
        } else {
          alert("This image is invalid, please submit another image");
        }
      });
  });
}

if (addbtn) {
  let max;
  let iid;
  fetch("http://localhost:3000/_id")
    .then((res) => res.json())
    .then((data) => {
      iid = data[0];
      const pwSet = data[1];
      pwSet.forEach((e, i) => {
        max = i;
        const row = pwTable.insertRow(-1);
        const c1 = row.insertCell(0);
        const c2 = row.insertCell(1);
        const httpsPre = "https://";
        let ehref;
        if (!e.url?.includes("https://")) {
          ehref = `href="${httpsPre + e.url}"`;
        } else {
          ehref = e.url;
        }
        c1.innerHTML = `<a ${e.url ? ehref : ""} >${e.Title}</a>`;
        c2.innerHTML = `<button class='copy${i} btn btn-primary' >Copy to Clipboard</button>
        <button class='delete${i} btn btn-danger' >Delete</button>`;
        document
          .querySelector(`.copy${i}`)
          .addEventListener("click", function (ev) {
            ev.preventDefault();
            navigator.clipboard.writeText(e.password);
            alert("Copy Complete");
          });
        document
          .querySelector(`.delete${i}`)
          .addEventListener("click", function (ev) {
            const deleteitem = {
              ID: iid,
              Title: e.Title,
              password: e.password,
              url: e.url,
            };
            ev.preventDefault();
            const confirm = prompt(
              `Input "DELETE" to confirm this deletion\n Case Sensitive`
            );
            if (confirm === "DELETE") {
              fetch("http://localhost:3000/delete", {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(deleteitem),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  row.remove();
                });
            } else {
              alert("Input Incorrect, deletion canceled");
            }
          });
      });
    });
  addbtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".addModal").style.opacity = 1;
    document.querySelector(".closeAddBtn").addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".addModal").style.opacity = 0;
    });
  });
  const randompw = document.querySelector(".btn--randompw");
  randompw.addEventListener("click", (e) => {
    e.preventDefault();
    const pw = document.querySelector(".input--password");
    pw.value = randomPassword();
  });
  //Start over here
  const subtn = document.querySelector(".btn--submit");
  subtn.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.querySelector(".input--title").value;
    const pw = document.querySelector(".input--password").value;
    const uurl = document.querySelector(".input--url").value;
    if (!title) {
      alert("Title can't be empty");
      return;
    }
    if (!pw) {
      alert("Password can't be empty");
      return;
    }
    const pwitem = { iID: iid, Title: title, password: pw, url: uurl };
    fetch("http://localhost:3000/add", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POSt",
      body: JSON.stringify(pwitem),
    })
      .then((res) => res.json())
      .then((data) => {
        max++;
        let pt = max;
        document.querySelector(".addModal").style.opacity = 0;
        const row = pwTable.insertRow(-1);
        const c1 = row.insertCell(0);
        const c2 = row.insertCell(1);
        const httpsPre = "https://";
        let ehref;
        if (!pwitem.url?.includes("https://")) {
          ehref = `href="${httpsPre + pwitem.url}"`;
        } else {
          ehref = `herf="${pwitem.url}"`;
        }
        c1.innerHTML = `<a ${pwitem.url ? ehref : null} >${pwitem.Title}</a>`;
        c2.innerHTML = `<button class='copy${pt} btn btn-primary' >Copy to Clipboard</button>
        <button class='delete${pt} btn btn-danger' >Delete</button>`;
        console.log(data);
        document
          .querySelector(`.copy${pt}`)
          .addEventListener("click", function (ev) {
            ev.preventDefault();
            navigator.clipboard.writeText(pwitem.password);
            alert("Copy Complete");
          });
        document
          .querySelector(`.delete${pt}`)
          .addEventListener("click", function (ev) {
            const deleteitem = {
              ID: iid,
              Title: pwitem.Title,
              password: pwitem.password,
              url: pwitem.url,
            };
            ev.preventDefault();
            const confirm = prompt(
              `Input "DELETE" to confirm this deletion\n Case Sensitive`
            );
            if (confirm === "DELETE") {
              fetch("http://localhost:3000/delete", {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(deleteitem),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  row.remove();
                });
            } else {
              alert("Input Incorrect, deletion canceled");
            }
          });
      });
    document.querySelector(".input--title").value = "";
    document.querySelector(".input--password").value = "";
    document.querySelector(".input--url").value = "";
  });
}

function randomPassword() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 25;
  let out = "";
  for (let i = 0; i <= length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    out += chars[index];
  }
  return out;
}
