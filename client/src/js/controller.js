const login = document.querySelector(".login");
const register = document.querySelector(".register");
const homepage = document.querySelector(".homepage");
const face = document.querySelector(".face");
const addbtn = document.querySelector(".add");
const pwTable = document.querySelector(".pwTable");

if (homepage) {
  homepage.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.assign("http://localhost:3000");
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

if (addbtn) {
  let max;
  let iid;
  fetch("http://localhost:3000/_id")
    .then((res) => res.json())
    .then((data) => {
      iid = data[0].ID;
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
        c2.innerHTML = `<button class='copy${i}' >Copy to Clipboard</button>
        <button class='delete${i}' >Detele</button>`;
        document
          .querySelector(`.copy${i}`)
          .addEventListener("click", function (ev) {
            ev.preventDefault();
            navigator.clipboard.writeText(e.password);
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
            console.log(confirm);
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
          const pt = max + 1;
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
          c2.innerHTML = `<button class='copy${pt}' >Copy to Clipboard</button>
        <button class='delete${pt}' >Detele</button>`;
          console.log(data);
          document
            .querySelector(`.copy${pt}`)
            .addEventListener("click", function (ev) {
              ev.preventDefault();
              navigator.clipboard.writeText(pwitem.password);
            });
          document
            .querySelector(`.delete${pt}`)
            .addEventListener("click", function (ev) {
              ev.preventDefault();
              const confirm = prompt(
                `Input "DELETE" to confirm this deletion\n Case Sensitive`
              );
              console.log(confirm);
            });
        });
    });
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
