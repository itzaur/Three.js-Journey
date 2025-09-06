export const metadata = {
  title: 'Vanilla Three.js - Основы',
  description: 'Первый урок по vanilla Three.js',
};

export default function init(container) {
  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth || 800;
  canvas.height = container.clientHeight || 600;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.fillStyle = 'tomato';
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();

    angle += 0.01;
    requestAnimationFrame(draw);
  }

  draw();
}
