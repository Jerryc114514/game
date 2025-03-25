// 初始化 Three.js 场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加环境光
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// 设置第一人称视角（可以进一步加载枪支模型，此处为简化示例）
camera.position.set(0, 1.6, 0); // 眼睛高度

// 变量初始化
let score = 0;
let timeLeft = 60;
const scoreDiv = document.getElementById('score');
const timerDiv = document.getElementById('timer');
let balloons = [];

// 创建气球函数（可以扩展多种运动模式）
function createBalloon() {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const balloon = new THREE.Mesh(geometry, material);
  // 随机生成位置，确保气球出现在视野内
  balloon.position.set(
    (Math.random() - 0.5) * 20,
    Math.random() * 5 + 2,
    -Math.random() * 10 - 5
  );
  scene.add(balloon);
  balloons.push(balloon);
}

// 初始创建几个气球
for (let i = 0; i < 5; i++) {
  createBalloon();
}

// 倒计时计时器
setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
    timerDiv.textContent = 'Time: ' + timeLeft;
  } else {
    alert('Time is up! Your score: ' + score);
    window.location.reload();
  }
}, 1000);

// 更新气球位置（示例为简单的向上移动，后续可扩展多种轨迹）
function updateBalloons() {
  for (let i = balloons.length - 1; i >= 0; i--) {
    let balloon = balloons[i];
    // 示例：向上飘动
    balloon.position.y += 0.02;
    // 超出一定高度则重置（移除并创建新气球）
    if (balloon.position.y > 10) {
      scene.remove(balloon);
      balloons.splice(i, 1);
      createBalloon();
    }
  }
}

// 射击检测：使用 Raycaster 检测鼠标点击是否击中气球
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // 转换鼠标坐标至归一化设备坐标
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(balloons);
  if (intersects.length > 0) {
    // 击中第一个气球
    const popped = intersects[0].object;
    scene.remove(popped);
    balloons.splice(balloons.indexOf(popped), 1);
    score++;
    scoreDiv.textContent = 'Score: ' + score;
    // 生成新的气球
    createBalloon();
  }
}
window.addEventListener('click', onMouseClick, false);

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  updateBalloons();
  renderer.render(scene, camera);
}
animate();
