function renderUserBar(user) {
    const bar = document.createElement("div");
    bar.className = "UserBar";

    const title = document.createElement("span");
    title.className = "app-name";
    title.textContent = "Wassap"; 

    const name = document.createElement("span");
    name.className = "user-name";
    name.textContent = user.name;
y
    bar.appendChild(title);
    bar.appendChild(name);
    
    return bar;
}

export default renderUserBar;