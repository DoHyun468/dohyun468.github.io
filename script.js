const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});

const canvas = document.querySelector("#spatialCanvas");
const context = canvas.getContext("2d");
const points = Array.from({ length: 54 }, (_, index) => {
  const row = Math.floor(index / 9);
  const col = index % 9;
  return {
    x: 110 + col * 62 + (row % 2) * 18,
    y: 120 + row * 48,
    z: Math.sin(index * 0.7) * 18,
    phase: index * 0.24
  };
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawLabel(text, x, y, color) {
  context.fillStyle = color;
  context.font = "700 12px Inter, system-ui, sans-serif";
  context.fillText(text, x, y);
}

function drawFrame(x, y, angle, color, label) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(74, 0);
  context.moveTo(0, 0);
  context.lineTo(0, -74);
  context.stroke();
  context.fillStyle = color;
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2);
  context.fill();
  context.restore();
  drawLabel(label, x + 10, y - 82, color);
}

function render(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 253, 248, 0.82)";
  context.fillRect(0, 0, width, height);

  const t = time * 0.001;
  const scaleX = width / 840;
  const scaleY = height / 640;

  drawFrame(92 * scaleX, height - 84 * scaleY, -0.16, "#285c9f", "camera frame");
  drawFrame(width - 170 * scaleX, height - 118 * scaleY, 0.08, "#0b6b69", "robot base");

  context.strokeStyle = "rgba(23, 26, 31, 0.16)";
  context.lineWidth = 1;
  points.forEach((point, index) => {
    const wave = Math.sin(t + point.phase) * 9;
    const x = (point.x + wave + point.z) * scaleX;
    const y = (point.y + Math.cos(t * 0.8 + point.phase) * 8) * scaleY;
    const targetX = width - (260 + (index % 9) * 24) * scaleX;
    const targetY = height - (280 - Math.floor(index / 9) * 20) * scaleY;

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(targetX, targetY);
    context.stroke();
  });

  points.forEach((point, index) => {
    const wave = Math.sin(t + point.phase) * 9;
    const x = (point.x + wave + point.z) * scaleX;
    const y = (point.y + Math.cos(t * 0.8 + point.phase) * 8) * scaleY;
    const radius = 3 + (Math.sin(t + point.phase) + 1) * 1.2;
    context.fillStyle = index % 3 === 0 ? "#9b4639" : index % 3 === 1 ? "#285c9f" : "#0b6b69";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  });

  context.strokeStyle = "#171a1f";
  context.lineWidth = 2;
  context.strokeRect(width - 215 * scaleX, height - 255 * scaleY, 82 * scaleX, 82 * scaleY);
  drawLabel("object pose", width - 222 * scaleX, height - 270 * scaleY, "#9b4639");

  context.beginPath();
  context.moveTo(width - 134 * scaleX, height - 214 * scaleY);
  context.lineTo(width - 84 * scaleX, height - 174 * scaleY);
  context.lineTo(width - 58 * scaleX, height - 128 * scaleY);
  context.strokeStyle = "#0b6b69";
  context.lineWidth = 4;
  context.stroke();

  window.requestAnimationFrame(render);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.requestAnimationFrame(render);
