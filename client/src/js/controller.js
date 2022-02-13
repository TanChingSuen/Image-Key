const login = document.querySelector(".login");
const register = document.querySelector(".register");
const face = document.querySelector(".face");

if (login) {
  login.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(1);
    window.history.pushState(null, "", "/login");
    location.reload();
  });
}
if (register) {
  register.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(1);
    window.history.pushState(null, "", "/register");
    location.reload();
  });
}
