export default function authHeader() {
  let user = JSON.parse(localstorage.getItem("user"));

  if (user && user.jwtToken) {
    return { Authorization: "Bearer" + user.jwtToken };
  } else {
    return {};
  }
}
