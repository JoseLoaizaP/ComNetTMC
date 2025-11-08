const onLogin = async (username) => {
  try {
    const response = await fetch("http://localhost:3002/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    console.log("Usuario creado:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("No se pudo crear el usuario.");
  }
};

export default onLogin;
