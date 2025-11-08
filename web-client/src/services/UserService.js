
const onLogin = (username) => {
  fetch("http://localhost:3002/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("Usuario creado:", data);
      if (data.status === "ok") {
        renderHomePage(username);
      } else {
        alert("Errorooooooooooooooor");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo crear el usuario.");
    });
};


export default onLogin;