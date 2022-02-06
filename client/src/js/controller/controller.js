const login = document.querySelector(".login");
const register = document.querySelector(".register");

login.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(1);
  window.history.pushState(null, "", "/login");
  location.reload();
});

register.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(1);
  window.history.pushState(null, "", "/register");
  location.reload();
});
