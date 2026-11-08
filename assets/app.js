// ============================================================================
// ۰. کنترل منوی همبرگری در نسخه موبایل
// ============================================================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeMenuIcon = document.getElementById('close-menu-icon');

if (mobileMenuBtn && mobileMenu) {
  const toggleMobileMenu = (forceClose = false) => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (forceClose || !isHidden) {
      mobileMenu.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeMenuIcon.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('hidden');
      hamburgerIcon.classList.add('hidden');
      closeMenuIcon.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  };

  mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });
}

// ============================================================================
// ۱. پس‌زمینه سه‌بعدی کهکشان و ستارگان (Three.js Starfield & Nebula)
// ============================================================================
const starCanvas = document.getElementById('starfield-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03040b, 0.0008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ canvas: starCanvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const starCount = window.innerWidth < 640 ? 2500 : 4500;
const starGeo = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);

const colorPalette = [
  new THREE.Color(0xffffff),
  new THREE.Color(0x38bdf8),
  new THREE.Color(0x818cf8),
  new THREE.Color(0xc084fc),
  new THREE.Color(0xfbbf24)
];

for (let i = 0; i < starCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 1600;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 1600;

  const pickedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  colors[i * 3] = pickedColor.r;
  colors[i * 3 + 1] = pickedColor.g;
  colors[i * 3 + 2] = pickedColor.b;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const createCircleTexture = () => {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
};

const starMaterial = new THREE.PointsMaterial({
  size: 2.8,
  vertexColors: true,
  map: createCircleTexture(),
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const starField = new THREE.Points(starGeo, starMaterial);
scene.add(starField);

let mouseX = 0;
let mouseY = 0;
let warpSpeed = false;
let baseSpeed = 0.7;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
});

const warpBtn = document.getElementById('warp-btn');
if (warpBtn) {
  warpBtn.addEventListener('click', () => {
    warpSpeed = !warpSpeed;
    if (warpSpeed) {
      warpBtn.classList.add('bg-cyan-500/20', 'border-cyan-400', 'text-white');
    } else {
      warpBtn.classList.remove('bg-cyan-500/20', 'border-cyan-400', 'text-white');
    }
  });
}

function animateStars() {
  requestAnimationFrame(animateStars);

  const posArray = starGeo.attributes.position.array;
  const currentSpeed = warpSpeed ? 14 : baseSpeed;

  for (let i = 0; i < starCount; i++) {
    posArray[i * 3 + 2] += currentSpeed;
    if (posArray[i * 3 + 2] > 800) {
      posArray[i * 3 + 2] = -800;
    }
  }
  starGeo.attributes.position.needsUpdate = true;

  starField.rotation.y += (mouseX - starField.rotation.y) * 0.04;
  starField.rotation.x += (mouseY - starField.rotation.x) * 0.04;
  starField.rotation.z += 0.0005;

  renderer.render(scene, camera);
}
animateStars();

// ============================================================================
// ۲. سیاره سه‌بعدی تعاملی در بخش Hero
// ============================================================================
const planetContainer = document.getElementById('planet-container');
let pRenderer;
if (planetContainer) {
  const pScene = new THREE.Scene();
  const pCamera = new THREE.PerspectiveCamera(45, planetContainer.clientWidth / planetContainer.clientHeight, 0.1, 1000);
  pCamera.position.z = 6.2;

  pRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  pRenderer.setSize(planetContainer.clientWidth, planetContainer.clientHeight);
  pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  planetContainer.appendChild(pRenderer.domElement);

  const planetGroup = new THREE.Group();
  pScene.add(planetGroup);

  const coreGeo = new THREE.IcosahedronGeometry(1.35, 3);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    emissive: 0x1e1b4b,
    roughness: 0.3,
    metalness: 0.7,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  planetGroup.add(coreMesh);

  const wireGeo = new THREE.IcosahedronGeometry(1.42, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  planetGroup.add(wireMesh);

  const ring1Geo = new THREE.TorusGeometry(2.05, 0.02, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.75 });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.4;
  ring1.rotation.y = 0.3;
  planetGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.35, 0.015, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = -0.4;
  planetGroup.add(ring2);

  const moonGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  planetGroup.add(moonMesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  pScene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x38bdf8, 2.5, 20);
  pointLight1.position.set(4, 3, 4);
  pScene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xc084fc, 2.5, 20);
  pointLight2.position.set(-4, -3, 3);
  pScene.add(pointLight2);

  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let rotVelX = 0.004;
  let rotVelY = 0.008;

  planetContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    planetGroup.rotation.y += dx * 0.01;
    planetGroup.rotation.x += dy * 0.01;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  planetContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    planetGroup.rotation.y += dx * 0.01;
    planetGroup.rotation.x += dy * 0.01;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  }, { passive: true });

  let clockAngle = 0;
  function animatePlanet() {
    requestAnimationFrame(animatePlanet);
    if (!isDragging) {
      planetGroup.rotation.y += rotVelY;
      planetGroup.rotation.x += rotVelX * 0.3;
    }
    wireMesh.rotation.y -= 0.003;
    ring1.rotation.z += 0.006;
    ring2.rotation.z -= 0.004;

    clockAngle += 0.025;
    moonMesh.position.x = Math.cos(clockAngle) * 2.1;
    moonMesh.position.z = Math.sin(clockAngle) * 2.1;
    moonMesh.position.y = Math.sin(clockAngle * 2) * 0.5;

    pRenderer.render(pScene, pCamera);
  }
  animatePlanet();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (planetContainer && pRenderer) {
    pCamera.aspect = planetContainer.clientWidth / planetContainer.clientHeight;
    pCamera.updateProjectionMatrix();
    pRenderer.setSize(planetContainer.clientWidth, planetContainer.clientHeight);
  }
});

// ============================================================================
// ۳. افکت سه‌بعدی کارت‌ها (3D Tilt Effect - فقط در دسکتاپ)
// ============================================================================
function initTiltCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}
initTiltCards();

// ============================================================================
// ۴. مدیریت خودکار پوشه customers/ و پنل ادمین محافظت‌شده
// ============================================================================
const STORAGE_KEY = 'branex_customers_manifest_v2';
let isAdminAuthenticated = false;

let customersData = [];

function extractNameFromFilename(filename) {
  return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
}

async function loadCustomers() {
  const savedLocal = localStorage.getItem(STORAGE_KEY);
  if (savedLocal) {
    try {
      customersData = JSON.parse(savedLocal);
      renderCustomersGrid();
      return;
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const res = await fetch('customers/manifest.json', { cache: 'no-store' });
    if (res.ok) {
      const manifest = await res.json();
      if (Array.isArray(manifest) && manifest.length > 0) {
        customersData = manifest.map((item) => {
          if (typeof item === 'string') {
            return {
              file: item,
              name: extractNameFromFilename(item),
              description: 'طراحی، توسعه و پشتیبانی فنی توسط برانکس'
            };
          }
          return {
            file: item.file,
            name: item.name || extractNameFromFilename(item.file),
            description: item.description || 'طراحی، توسعه و پشتیبانی فنی توسط برانکس'
          };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customersData));
        renderCustomersGrid();
        return;
      }
    }
  } catch (err) {
    // خطا در بارگذاری manifest
  }

  renderCustomersGrid();
}

function renderCustomersGrid() {
  const grid = document.getElementById('customers-grid');
  if (!grid) return;

  const cardsHtml = customersData.map((cust, index) => {
    const cleanName = cust.name || extractNameFromFilename(cust.file);
    const firstChar = cleanName.charAt(0) || 'B';
    const imgPath = `customers/${cust.file}`;
    const isEven = index % 2 === 0;
    const borderHover = isEven ? 'hover:border-indigo-500/40' : 'hover:border-cyan-500/40';

    return `
      <div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex items-center gap-4 ${borderHover} transition-all group">
        <div class="customer-logo-box">
          <img src="${imgPath}" alt="${cleanName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <span style="display:none;" class="w-full h-full bg-slate-900 text-cyan-400 flex items-center justify-center font-black text-xl">${firstChar}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-extrabold text-white text-base sm:text-lg truncate group-hover:text-cyan-300 transition-colors">${cleanName}</div>
          <div class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">${cust.description || 'همراه خانواده برانکس'}</div>
        </div>
      </div>
    `;
  }).join('');

  const summaryCard = `
    <div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
      <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-2xl shrink-0">
        +۳۰۰
      </div>
      <div>
        <div class="font-extrabold text-white text-base sm:text-lg">پروژه‌های سازمانی و وب</div>
        <div class="text-xs sm:text-sm text-slate-400 mt-1">خانواده بزرگ مشتریان برانکس از سال ۹۷</div>
      </div>
    </div>
  `;

  grid.innerHTML = cardsHtml + summaryCard;
}

const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.getElementById('close-login-btn');
const adminLoginForm = document.getElementById('admin-login-form');
const loginErrorMsg = document.getElementById('login-error-msg');
const loginSubmitBtn = document.getElementById('login-submit-btn');

const adminModal = document.getElementById('admin-modal');
const openAdminBtn = document.getElementById('open-admin-btn');
const closeAdminBtn = document.getElementById('close-admin-btn');
const saveAdminBtn = document.getElementById('save-admin-btn');
const adminList = document.getElementById('admin-customers-list');
const addCustomerBtn = document.getElementById('add-customer-btn');
const exportManifestBtn = document.getElementById('export-manifest-btn');

function renderAdminList() {
  if (!adminList) return;
  adminList.innerHTML = customersData.map((cust, idx) => `
    <div class="bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
      <div class="sm:col-span-3 flex items-center gap-2.5">
        <div class="w-12 h-12 rounded-xl bg-white border border-white/10 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
          <img src="customers/${cust.file}" alt="${cust.name}" class="w-full h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <span style="display:none;" class="text-xs font-bold text-slate-900">🖼️</span>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-bold text-white truncate" dir="ltr">${cust.file}</div>
          <div class="text-[10px] text-slate-400">customers/${cust.file}</div>
        </div>
      </div>
      <div class="sm:col-span-3">
        <input type="text" data-idx="${idx}" data-field="name" value="${cust.name || ''}" placeholder="نام برند" class="admin-input w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400" />
      </div>
      <div class="sm:col-span-5">
        <input type="text" data-idx="${idx}" data-field="description" value="${cust.description || ''}" placeholder="توضیح فعالیت برند..." class="admin-input w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400" />
      </div>
      <div class="sm:col-span-1 flex justify-end">
        <button data-remove="${idx}" class="remove-cust-btn p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 text-xs transition-colors cursor-pointer" title="حذف">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.admin-input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = parseInt(e.target.getAttribute('data-idx'), 10);
      const field = e.target.getAttribute('data-field');
      customersData[i][field] = e.target.value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customersData));
      renderCustomersGrid();
    });
  });

  document.querySelectorAll('.remove-cust-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.getAttribute('data-remove'), 10);
      customersData.splice(i, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customersData));
      renderAdminList();
      renderCustomersGrid();
    });
  });
}

if (openAdminBtn) {
  openAdminBtn.addEventListener('click', () => {
    if (isAdminAuthenticated) {
      renderAdminList();
      adminModal.classList.remove('hidden');
      adminModal.classList.add('flex');
    } else {
      if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
      loginModal.classList.remove('hidden');
      loginModal.classList.add('flex');
    }
  });
}

if (closeLoginBtn) {
  closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
    if (loginSubmitBtn) {
      loginSubmitBtn.disabled = true;
      loginSubmitBtn.textContent = 'در حال بررسی اعتبار در Cloudflare...';
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        isAdminAuthenticated = true;
        loginModal.classList.add('hidden');
        loginModal.classList.remove('flex');
        renderAdminList();
        adminModal.classList.remove('hidden');
        adminModal.classList.add('flex');
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = result.error || 'نام کاربری یا رمز عبور اشتباه است.';
          loginErrorMsg.classList.remove('hidden');
        }
      }
    } catch (err) {
      if (loginErrorMsg) {
        loginErrorMsg.textContent = 'خطا در ارتباط با سرور احراز هویت (/api/auth).';
        loginErrorMsg.classList.remove('hidden');
      }
    } finally {
      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = 'ورود به داشبورد مدیریت برندها';
      }
    }
  });
}

const closeAdmin = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customersData));
  renderCustomersGrid();
  if (adminModal) {
    adminModal.classList.add('hidden');
    adminModal.classList.remove('flex');
  }
};

if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdmin);
if (saveAdminBtn) saveAdminBtn.addEventListener('click', closeAdmin);

if (addCustomerBtn) {
  addCustomerBtn.addEventListener('click', () => {
    const fileInp = document.getElementById('new-customer-file');
    const nameInp = document.getElementById('new-customer-name');
    const descInp = document.getElementById('new-customer-desc');

    const fileVal = fileInp.value.trim();
    if (!fileVal) return;

    const finalName = nameInp.value.trim() || extractNameFromFilename(fileVal);
    const finalDesc = descInp.value.trim() || 'همراه خانواده برانکس';

    customersData.push({
      file: fileVal,
      name: finalName,
      description: finalDesc
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customersData));

    fileInp.value = '';
    nameInp.value = '';
    descInp.value = '';

    renderAdminList();
    renderCustomersGrid();
  });
}

if (exportManifestBtn) {
  exportManifestBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customersData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'manifest.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });
}

loadCustomers();
