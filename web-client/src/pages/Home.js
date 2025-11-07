const Welcome = () => {
    const comp = document.createElement("div");
    comp.className = "options";
    const h1 = document.createElement("h1");
    h1.textContent = "O WhatsApp mais incrível do mundo";

    const button = document.createElement("button");
    button.textContent = "Hola";

    comp.appendChild(h1);
    comp.appendChild(button);

    return comp;
}

export default Welcome;