const login = document.querySelector(".login");
const register = document.querySelector(".register");
const homepage = document.querySelector(".homepage");
const face = document.querySelector(".face");

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
