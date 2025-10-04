const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let humans = [];
let startTime = Date.now();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Human {
  constructor(x, y, gender, generation, traits) {
    this.x = x;
    this.y = y;
    this.gender = gender;
    this.generation = generation;
    this.age = 0;
    this.traits = traits;
    this.lifespan = 25 + Math.random() * 10;
    this.speed = traits.speed;
    this.color = traits.color;
    this.cooldown = 0;
  }

  update(dt) {
    this.x += (Math.random() - 0.5) * this.speed * 2;
    this.y += (Math.random() - 0.5) * this.speed * 2;
    this.x = (this.x + canvas.width) % canvas.width;
    this.y = (this.y + canvas.height) % canvas.height;

    this.age += dt;
    this.cooldown -= dt;
  }

  draw() {
    ctx.beginPath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function evolveTraits(t1, t2) {
  const mutate = (val, rate = 0.15) => val * (1 + (Math.random() - 0.5) * rate);
  const mixColor = (c1, c2) => {
    const avg = (a, b) => Math.floor((a + b) / 2);
    const r = avg(parseInt(c1.slice(1,3),16), parseInt(c2.slice(1,3),16));
    const g = avg(parseInt(c1.slice(3,5),16), parseInt(c2.slice(3,5),16));
    const b = avg(parseInt(c1.slice(5,7),16), parseInt(c2.slice(5,7),16));
    return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  };
  return {
    speed: mutate((t1.speed + t2.speed) / 2),
    color: mixColor(t1.color, t2.color)
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function reproduce(m, f) {
  const traits = evolveTraits(m.traits, f.traits);
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const child = new Human(m.x, m.y, gender, Math.max(m.generation, f.generation) + 1, traits);
  humans.push(child);
  m.cooldown = f.cooldown = 2;
}

function initialize(n = 20) {
  for (let i = 0; i < n; i++) {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const traits = {
      speed: rand(0.5, 1.5),
      color: gender === "male" ? "#3ba7ff" : "#ff4fa3"
    };
    humans.push(new Human(rand(0, canvas.width), rand(0, canvas.height), gender, 1, traits));
  }
}

initialize();

function loop() {
  ctx.fillStyle = "rgba(10, 10, 25, 0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  humans.forEach(h => {
    h.update(0.016);
    h.draw();
  });

  // reproduction
  for (let i = 0; i < humans.length; i++) {
    for (let j = i + 1; j < humans.length; j++) {
      const a = humans[i], b = humans[j];
      if (a.gender !== b.gender && distance(a, b) < 15 && a.cooldown < 0 && b.cooldown < 0) {
        reproduce(a, b);
      }
    }
  }

  // remove dead
  humans = humans.filter(h => h.age < h.lifespan);

  // dashboard update
  const maxGen = humans.reduce((m, h) => Math.max(m, h.generation), 0);
  document.getElementById("popCount").textContent = humans.length;
  document.getElementById("genCount").textContent = maxGen;
  document.getElementById("timeCount").textContent = ((Date.now() - startTime) / 1000).toFixed(0);

  requestAnimationFrame(loop);
}

loop();
