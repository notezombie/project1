const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let character = {
  color: "red", // สีตัวละครกำหนดไว้ล่วงหน้า
  x: canvas.width / 2,
  y: canvas.height / 2,
  hp: 100,
  str: 1,
  agi: 1,
  cri: 1,
  exp: 0,
  level: 1
};

let monsters = [];
let monsterCount = 5;

// สุ่มตำแหน่งมอนสเตอร์
function spawnMonsters() {
  for (let i = 0; i < monsterCount; i++) {
    monsters.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      hp: 10
    });
  }
}

// วาดตัวละคร
function drawCharacter() {
  ctx.fillStyle = character.color;
  ctx.beginPath();
  ctx.arc(character.x, character.y, 20, 0, Math.PI * 2);
  ctx.fill();
}

// วาดมอนสเตอร์
function drawMonsters() {
  monsters.forEach(monster => {
    if (monster.hp > 0) {
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(monster.x, monster.y, 15, 0, Math.PI * 2);
      ctx.fill();
      // แถบ HP มอนสเตอร์
      ctx.fillStyle = "red";
      ctx.fillRect(monster.x - 10, monster.y - 20, (monster.hp / 10) * 20, 5);
    }
  });
}

// อัปเดตเกม
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCharacter();
  drawMonsters();

  monsters.forEach((monster, index) => {
    let dist = Math.hypot(character.x - monster.x, character.y - monster.y);
    if (dist < 35 && monster.hp > 0) {
      monster.hp -= character.str;
      character.hp -= 1;
      if (monster.hp <= 0) {
        character.exp += 20;
        if (character.exp >= 100) {
          character.level++;
          character.exp = 0;
          character.str += 1; // เพิ่ม STR ทุกครั้งที่เลเวลอัป
        }
      }
    }
  });

  // วาด HP ตัวละคร
  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, (character.hp / 100) * 200, 20);

  // วาดเลเวลและ EXP
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Level: ${character.level}`, 10, 50);
  ctx.fillText(`EXP: ${character.exp}/100`, 10, 70);

  requestAnimationFrame(updateGame);
}

// เคลื่อนที่ตัวละคร
window.addEventListener("keydown", (e) => {
  const speed = 5; // ความเร็วในการเคลื่อนที่
  if (e.key === "ArrowUp" || e.key === "w") character.y -= speed;
  if (e.key === "ArrowDown" || e.key === "s") character.y += speed;
  if (e.key === "ArrowLeft" || e.key === "a") character.x -= speed;
  if (e.key === "ArrowRight" || e.key === "d") character.x += speed;
});

// เริ่มเกม
spawnMonsters();
updateGame();
