// প্রথমে সব সেকশন হাইড করে শুধু 1D দেখানো হবে
function showSection(dim) {
    const sections = document.querySelectorAll(".d-section");
    sections.forEach(sec => sec.style.display = "none");
    document.getElementById(dim).style.display = "flex";
}

// প্রথমে 1D দেখাবে
showSection(1);

// Dynamic Animation Part
const sections = document.querySelectorAll(".d-section");

// 1D: Moving Line
function animate1D() {
    const sec = document.getElementById("1");
    let pos = 0;
    let direction = 1;
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.style.background = `linear-gradient(to right, #0ff ${pos}%, #111 ${pos}%)`;
        pos += direction;
        if(pos >= 100 || pos <= 0) direction *= -1;
    }, 20);
}

// 2D: Moving Gradient
function animate2D() {
    const sec = document.getElementById("2");
    let x = 0, y = 0, dx = 1, dy = 1;
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.style.background = `radial-gradient(circle at ${x}% ${y}%, #0ff, #111)`;
        x += dx;
        y += dy;
        if(x >= 100 || x <= 0) dx *= -1;
        if(y >= 100 || y <= 0) dy *= -1;
    }, 30);
}

// 3D: Rotating Cube Effect (CSS)
function animate3D() {
    const sec = document.getElementById("3");
    let angle = 0;
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.style.transform = `rotateX(${angle}deg) rotateY(${angle}deg)`;
        angle += 1;
    }, 30);
}

// 4D: Time Simulation
function animate4D() {
    const sec = document.getElementById("4");
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        const time = new Date();
        sec.innerHTML = `4D Universe: Time - ${time.toLocaleTimeString()}`;
    }, 1000);
}

// 5D: Possibilities (Random Shapes)
function animate5D() {
    const sec = document.getElementById("5");
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        const size = Math.floor(Math.random()*100 + 50);
        const color = `hsl(${Math.random()*360}, 100%, 50%)`;
        sec.innerHTML = `<div style="width:${size}px; height:${size}px; background:${color}; border-radius:50%; margin:auto;"></div>`;
    }, 500);
}

// 6D: Alternate Worlds (Background Color Shift)
function animate6D() {
    const sec = document.getElementById("6");
    let hue = 0;
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.style.background = `hsl(${hue}, 50%, 20%)`;
        hue += 2;
        if(hue > 360) hue = 0;
    }, 50);
}

// 7D: Multiverse (Moving Texts)
function animate7D() {
    const sec = document.getElementById("7");
    const texts = ["🌌", "✨", "🌠", "🪐", "☄️"];
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.innerHTML = texts[Math.floor(Math.random()*texts.length)].repeat(10);
    }, 300);
}

// 8D: Meta Realities (Flashing Colors)
function animate8D() {
    const sec = document.getElementById("8");
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        sec.style.color = `hsl(${Math.random()*360}, 100%, 50%)`;
        sec.style.background = `hsl(${Math.random()*360}, 20%, 10%)`;
    }, 200);
}

// 9D: Infinity Simulation
function animate9D() {
    const sec = document.getElementById("9");
    let dots = "";
    setInterval(() => {
        if(sec.style.display !== "flex") return;
        dots += "•";
        if(dots.length > 50) dots = "";
        sec.innerHTML = `9D Universe: Infinity ${dots}`;
    }, 100);
}

// Start all animations
animate1D();
animate2D();
animate3D();
animate4D();
animate5D();
animate6D();
animate7D();
animate8D();
animate9D();
