/**
 * YUKIS KIKIS - Experiencia 3D Multi-Producto & Tienda Web Interactiva
 * Powered by Three.js WebGL & Vanilla JS
 * Colores de marca: Fondo Obscuro, Rosa Fresa (#ff2a7a), Verde Kiwi (#84cc16), Amarillo Mango (#eab308)
 */

const WHATSAPP_NUMBER = "528112345678"; // Número de WhatsApp para pedidos
const BRAND_NAME = "Yukis Kikis";

/* ==========================================================================
   CONFIGURACIÓN DE PRODUCTOS Y VARIACIONES 3D
   ========================================================================== */
const PRODUCTS_DATA = {
  yuki: {
    id: "yuki",
    name: "Yuki Artesanal",
    categoryTitle: "Vaso de Yuki de Hielo Nieve",
    badge: "Estrella de la Casa",
    defaultVariant: "limon",
    variants: {
      limon: {
        id: "limon",
        name: "Limón de Colima & Kiwi",
        shortName: "Limón",
        colorHex: "#22c55e",
        syrupHex: "#15803d",
        innerHex: "#4ade80",
        lightHex: "#22c55e",
        particleHex: "#86efac",
        price: "$45 MXN",
        description: "Hielo ultra-fino tipo nieve bañado en jarabe 100% natural de limón recién exprimido y rodaja fresca.",
        garnish: "lemon"
      },
      vainilla: {
        id: "vainilla",
        name: "Vainilla Cremosa & Barquillo",
        shortName: "Vainilla",
        colorHex: "#fef08a",
        syrupHex: "#fde047",
        innerHex: "#fffbeb",
        lightHex: "#fef9c3",
        particleHex: "#fde047",
        price: "$45 MXN",
        description: "Receta tradicional con leche condensada, vainilla pura de Papantla y barquillo tostado crujiente.",
        garnish: "wafer"
      },
      tamarindo: {
        id: "tamarindo",
        name: "Tamarindo & Chamoy Casero",
        shortName: "Tamarindo",
        colorHex: "#92400e",
        syrupHex: "#78350f",
        innerHex: "#b45309",
        lightHex: "#d97706",
        particleHex: "#f59e0b",
        price: "$50 MXN",
        description: "Pulpa concentrada de tamarindo agridulce, chamoy especial de la casa y banderilla con chilito.",
        garnish: "tamarind"
      },
      fresa: {
        id: "fresa",
        name: "Fresa Silvestre Natural",
        shortName: "Fresa",
        colorHex: "#ef4444",
        syrupHex: "#b91c1c",
        innerHex: "#f87171",
        lightHex: "#ef4444",
        particleHex: "#fca5a5",
        price: "$50 MXN",
        description: "Pulpa de fresas frescas maceradas con un toque dulce y una fresa entera coronando el hielo.",
        garnish: "strawberry"
      },
      mango: {
        id: "mango",
        name: "Mango Paraíso Tropical",
        shortName: "Mango",
        colorHex: "#f59e0b",
        syrupHex: "#b45309",
        innerHex: "#fbbf24",
        lightHex: "#f59e0b",
        particleHex: "#fde68a",
        price: "$50 MXN",
        description: "Puro mango Manila maduro convertido en néctar refrescante servido sobre nieve helada.",
        garnish: "mango"
      }
    }
  },

  crepa: {
    id: "crepa",
    name: "Crepa Gourmet",
    categoryTitle: "Crepa Francesa Artesanal",
    badge: "Receta Dorada",
    defaultVariant: "nutella",
    variants: {
      nutella: {
        id: "nutella",
        name: "Crepa París (Nutella & Fresa)",
        shortName: "Nutella & Fresa",
        colorHex: "#29150d", // Chocolate oscuro
        sauceHex: "#3e1c0d",
        accentHex: "#ff2a7a", // Fresa
        lightHex: "#f43f5e",
        price: "$85 MXN",
        description: "Crepa delgada y suave rellena de abundante Nutella, fresas frescas de temporada y azúcar glass.",
        topping: "strawberry"
      },
      cajeta: {
        id: "cajeta",
        name: "Crepa Celaya (Cajeta & Nuez)",
        shortName: "Cajeta & Nuez",
        colorHex: "#b45309", // Caramelo quemado
        sauceHex: "#78350f",
        accentHex: "#d97706",
        lightHex: "#f59e0b",
        price: "$90 MXN",
        description: "Bañada en auténtica cajeta quemada de leche de cabra, trocitos de nuez tostada y plátano.",
        topping: "walnut"
      },
      frutos: {
        id: "frutos",
        name: "Crepa Bosque (Cheesecake & Zarzamora)",
        shortName: "Frutos del Bosque",
        colorHex: "#6b21a8", // Morado zarzamora
        sauceHex: "#581c87",
        accentHex: "#c084fc",
        lightHex: "#a855f7",
        price: "$95 MXN",
        description: "Rellena de suave crema cheesecake casera y coronada con compota de zarzamoras y arándanos.",
        topping: "berry"
      }
    }
  },

  waffle: {
    id: "waffle",
    name: "Waffle Belga",
    categoryTitle: "Waffle Crujiente con Relieve",
    badge: "Súper Crujiente",
    defaultVariant: "frutos_rojos",
    variants: {
      frutos_rojos: {
        id: "frutos_rojos",
        name: "Waffle Frutos Rojos & Nieve",
        shortName: "Frutos Rojos",
        colorHex: "#f43f5e",
        syrupHex: "#b91c1c",
        scoopHex: "#fffbeb", // Nieve de vainilla
        lightHex: "#ff2a7a",
        price: "$95 MXN",
        description: "Cuadrícula belga crujiente con bola de nieve artesanal, fresas, zarzamoras y sirope de maple.",
        topping: "berries"
      },
      kinder: {
        id: "kinder",
        name: "Waffle Kinder Bueno & Avellana",
        shortName: "Kinder & Nutella",
        colorHex: "#3e1c0d",
        syrupHex: "#271207",
        scoopHex: "#78350f", // Helado de chocolate
        lightHex: "#f59e0b",
        price: "$110 MXN",
        description: "Cubierto en cremosa salsa de chocolate avellanado, barrita Kinder Bueno crujiente y nuez.",
        topping: "kinder"
      },
      caramelo: {
        id: "caramelo",
        name: "Waffle Caramelo Salado & Plátano",
        shortName: "Caramelo & Banana",
        colorHex: "#d97706",
        syrupHex: "#92400e",
        scoopHex: "#fef3c7",
        lightHex: "#fbbf24",
        price: "$90 MXN",
        description: "Bañado en salsa de caramelo caliente con mantequilla, rodajas de plátano fresco y canela.",
        topping: "banana"
      }
    }
  },

  fresas: {
    id: "fresas",
    name: "Fresas con Crema",
    categoryTitle: "Vaso Royal de Fresas y Crema",
    badge: "Firma Kikis",
    defaultVariant: "clasica",
    variants: {
      clasica: {
        id: "clasica",
        name: "Fresas Kikis Tres Leches Clásica",
        shortName: "Tres Leches Clásica",
        colorHex: "#ffffff",
        drizzleHex: "#ef4444",
        creamHex: "#fffbeb",
        lightHex: "#ff2a7a",
        price: "$85 MXN",
        description: "Capas infinitas de fresas frescas con nuestra crema secreta artesanal, granola dorada y barquillo.",
        topping: "classic"
      },
      nutella_oreo: {
        id: "nutella_oreo",
        name: "Fresas Royal Nutella & Oreo",
        shortName: "Nutella & Oreo",
        colorHex: "#1e1e24",
        drizzleHex: "#3e1c0d",
        creamHex: "#f8fafc",
        lightHex: "#ec4899",
        price: "$100 MXN",
        description: "Doble porción de crema dulce, trozos crocantes de galleta Oreo, fresas y salsa espesa de Nutella.",
        topping: "oreo"
      },
      fit: {
        id: "fit",
        name: "Fresas Balance Yogurt Griego & Miel",
        shortName: "Yogurt & Miel Fit",
        colorHex: "#f59e0b",
        drizzleHex: "#d97706",
        creamHex: "#fff7ed",
        lightHex: "#84cc16",
        price: "$90 MXN",
        description: "Opción ligera con yogurt griego endulzado con miel de abeja pura de flor de azahar y almendras.",
        topping: "fit"
      }
    }
  }
};

let currentProductKey = "yuki";
let currentVariantKey = "limon";

/* ==========================================================================
   STUDIO 3D THREE.JS: MOTOR MULTI-PRODUCTO
   ========================================================================== */
class MultiProduct3DStudio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Grupos 3D para cada producto
    this.productGroups = {
      yuki: null,
      crepa: null,
      waffle: null,
      fresas: null
    };

    // Referencias a mallas reactivas
    this.reactiveMeshes = {};
    this.pointLight = null;
    this.particles = null;

    // Estados de animación
    this.isDragging = false;
    this.autoRotate = true;
    this.idleTimer = null;
    this.bounceTime = 0;

    // Targets de interpolación de color
    this.targetPrimaryColor = new THREE.Color("#22c55e");
    this.targetSecondaryColor = new THREE.Color("#15803d");
    this.targetLightColor = new THREE.Color("#22c55e");

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 520;

    // Escena
    this.scene = new THREE.Scene();

    // Cámara de perspectiva
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.4, 5.2);

    // Renderer de alto rendimiento con sombras suaves
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // OrbitControls con target centrado
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 0.75, 0);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.enableZoom = false; // Mantiene estabilidad en móviles
      this.controls.enablePan = false;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.15;
      this.controls.minPolarAngle = Math.PI / 5;
      this.controls.rotateSpeed = 0.85;

      this.controls.addEventListener("start", () => {
        this.isDragging = true;
        this.autoRotate = false;
        clearTimeout(this.idleTimer);
      });

      this.controls.addEventListener("end", () => {
        this.isDragging = false;
        this.idleTimer = setTimeout(() => {
          this.autoRotate = true;
        }, 2200);
      });
    }

    // Fallback táctil y mouse nativo
    this.setupPointerFallback();

    // Sistema de luces de estudio gastronómico
    this.setupLighting();

    // Construcción de todos los modelos 3D
    this.buildYuki3D();
    this.buildCrepa3D();
    this.buildWaffle3D();
    this.buildFresas3D();

    // Partículas ambientales de frutas
    this.buildAmbientParticles();

    // Manejo de redimensionamiento
    this.setupResizeListener();

    // Estado inicial: solo Yuki visible
    this.switchProduct("yuki", true);

    // Bucle de renderizado
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Luz ambiental suave pero envolvente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Luz principal cenital con sombra
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(4, 8, 4.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    // Luz de contorno cálida (rim light) para destacar texturas y brillo de jarabe
    const rimLight = new THREE.DirectionalLight(0xfff1e6, 0.9);
    rimLight.position.set(-4, 5, -4);
    this.scene.add(rimLight);

    // Luz puntual que adopta el color del sabor activo
    this.pointLight = new THREE.PointLight(0x22c55e, 1.4, 6);
    this.pointLight.position.set(0, 2.2, 1.8);
    this.scene.add(this.pointLight);
  }

  // Genera mapa de textura de hielo raspado procedural en Canvas
  createIceTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(256, 256);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      const v = Math.floor(Math.random() * 110 + 145);
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  // Genera textura del logotipo oficial 'Yukis Kikis' para el vaso
  createKikisLogoTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 512, 512);

    // Círculo negro de fondo idéntico al logotipo del negocio
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.fillStyle = "#121216";
    ctx.fill();

    // Borde neón exterior rosa
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#ff2a7a";
    ctx.stroke();

    // Texto superior arqueado / estilo divertido 'YUKIS KIKIS'
    ctx.font = "bold 64px Fredoka, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YUKIS", 256, 135);
    ctx.fillText("KIKIS", 256, 205);

    // Ilustración estilizada central: Vaso y frutas (Kiwi, Fresa, Mango)
    // Silueta de vaso central verde kiwi
    ctx.fillStyle = "#84cc16";
    ctx.beginPath();
    ctx.moveTo(210, 260);
    ctx.lineTo(302, 260);
    ctx.lineTo(285, 410);
    ctx.lineTo(227, 410);
    ctx.closePath();
    ctx.fill();

    // Domo de hielo rosa
    ctx.beginPath();
    ctx.arc(256, 260, 48, Math.PI, 0);
    ctx.fillStyle = "#ff2a7a";
    ctx.fill();

    // Popote
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(252, 185, 8, 80);

    // Fresa izquierda
    ctx.font = "40px sans-serif";
    ctx.fillText("🍓", 175, 340);

    // Mango derecho
    ctx.fillText("🥭", 335, 340);

    // Kiwi central en el vaso
    ctx.font = "26px sans-serif";
    ctx.fillText("🥝", 256, 335);

    // Texto inferior
    ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#eab308";
    ctx.fillText("★ 100% ARTESANAL ★", 256, 455);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /* -------------------------------------------------------------
     1. MODELADO 3D: EL VASO DE YUKI KIKIS
     ------------------------------------------------------------- */
  buildYuki3D() {
    const group = new THREE.Group();
    group.position.y = -0.4;
    this.productGroups.yuki = group;
    this.scene.add(group);

    const iceNoiseTex = this.createIceTexture();
    const cupHeight = 2.4;
    const cupTopR = 1.25;
    const cupBotR = 0.88;

    // Vaso cónico de polipropileno transparente
    const cupGeo = new THREE.CylinderGeometry(cupTopR, cupBotR, cupHeight, 36, 1, true);
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.38,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.88,
      ior: 1.48,
      depthWrite: false
    });
    const cupMesh = new THREE.Mesh(cupGeo, cupMat);
    cupMesh.position.y = cupHeight / 2;
    cupMesh.castShadow = true;
    group.add(cupMesh);

    // Reborde superior del vaso
    const lipGeo = new THREE.TorusGeometry(cupTopR + 0.015, 0.045, 16, 40);
    const lipMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.8 });
    const lipMesh = new THREE.Mesh(lipGeo, lipMat);
    lipMesh.rotation.x = Math.PI / 2;
    lipMesh.position.y = cupHeight;
    group.add(lipMesh);

    // Etiqueta oficial de Yukis Kikis
    const logoTex = this.createKikisLogoTexture();
    const labelGeo = new THREE.PlaneGeometry(1.15, 1.15);
    const labelMat = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, 1.25, cupTopR * 0.96);
    group.add(labelMesh);

    // Hielo interior del vaso
    const innerIceGeo = new THREE.CylinderGeometry(cupTopR - 0.04, cupBotR - 0.04, cupHeight - 0.1, 32);
    const innerIceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4ade80"),
      roughness: 0.45,
      bumpMap: iceNoiseTex,
      bumpScale: 0.06
    });
    const innerIceMesh = new THREE.Mesh(innerIceGeo, innerIceMat);
    innerIceMesh.position.y = cupHeight / 2 + 0.05;
    group.add(innerIceMesh);
    this.reactiveMeshes.yukiInner = innerIceMesh;

    // Domo de hielo superior orgánico deformado
    const domeGeo = new THREE.SphereGeometry(1.32, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const pos = domeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const n = (Math.sin(vx * 7) * Math.cos(vz * 7) + Math.sin(vy * 8)) * 0.04;
      pos.setXYZ(i, vx * (1 + n), vy * (1 + n * 0.8), vz * (1 + n));
    }
    domeGeo.computeVertexNormals();

    const domeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#22c55e"),
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.6,
      ior: 1.31,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      bumpMap: iceNoiseTex,
      bumpScale: 0.07
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = cupHeight - 0.08;
    domeMesh.castShadow = true;
    group.add(domeMesh);
    this.reactiveMeshes.yukiDome = domeMesh;

    // Siropes brillantes cayendo en la cúspide
    const syrupGeo = new THREE.SphereGeometry(1.34, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.32);
    const syrupMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#15803d"),
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.35,
      ior: 1.35
    });
    const syrupMesh = new THREE.Mesh(syrupGeo, syrupMat);
    syrupMesh.position.y = cupHeight + 0.15;
    group.add(syrupMesh);
    this.reactiveMeshes.yukiSyrup = syrupMesh;

    // Popote con rayas
    const strawGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 24);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xff2a7a, roughness: 0.2 });
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.position.set(0.38, 2.7, -0.15);
    strawMesh.rotation.set(-0.12, 0, -0.32);
    group.add(strawMesh);

    // Decoraciones (Garnishes) según sabor
    this.yukiGarnishes = {
      lemon: this.createLemonGarnish(),
      wafer: this.createWaferGarnish(),
      tamarind: this.createTamarindGarnish(),
      strawberry: this.createStrawberry3D(),
      mango: this.createMangoSlice3D()
    };

    this.yukiGarnishes.lemon.position.set(-0.95, cupHeight + 0.35, 0.45);
    this.yukiGarnishes.lemon.rotation.set(0.4, 0.6, -0.5);
    group.add(this.yukiGarnishes.lemon);

    this.yukiGarnishes.wafer.position.set(-0.4, cupHeight + 0.9, 0.2);
    this.yukiGarnishes.wafer.rotation.set(0.2, 0.4, 0.45);
    this.yukiGarnishes.wafer.scale.set(0.001, 0.001, 0.001);
    group.add(this.yukiGarnishes.wafer);

    this.yukiGarnishes.tamarind.position.set(-0.55, cupHeight + 0.85, 0.15);
    this.yukiGarnishes.tamarind.rotation.set(-0.15, 0.5, 0.38);
    this.yukiGarnishes.tamarind.scale.set(0.001, 0.001, 0.001);
    group.add(this.yukiGarnishes.tamarind);

    this.yukiGarnishes.strawberry.position.set(-0.6, cupHeight + 0.6, 0.6);
    this.yukiGarnishes.strawberry.scale.set(0.001, 0.001, 0.001);
    group.add(this.yukiGarnishes.strawberry);

    this.yukiGarnishes.mango.position.set(-0.7, cupHeight + 0.6, 0.5);
    this.yukiGarnishes.mango.rotation.set(0.3, 0.5, -0.3);
    this.yukiGarnishes.mango.scale.set(0.001, 0.001, 0.001);
    group.add(this.yukiGarnishes.mango);

    // Sombra de contacto
    this.addContactShadow(group);
  }

  /* -------------------------------------------------------------
     2. MODELADO 3D: LA CREPA GOURMET CON SALSA Y FRUTAS
     ------------------------------------------------------------- */
  buildCrepa3D() {
    const group = new THREE.Group();
    group.position.y = 0.1;
    this.productGroups.crepa = group;
    this.scene.add(group);

    // Plato cerámico oscuro elegante
    const plateGeo = new THREE.CylinderGeometry(2.3, 1.8, 0.18, 48);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x18181f, roughness: 0.25, metalness: 0.1 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.receiveShadow = true;
    group.add(plate);

    // Borde dorado en el plato
    const plateRimGeo = new THREE.TorusGeometry(2.32, 0.025, 12, 48);
    const plateRimMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 });
    const plateRim = new THREE.Mesh(plateRimGeo, plateRimMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.y = 0.09;
    group.add(plateRim);

    // Crepa doblada en abanico triangular (Cylinder sector / Shape extrude)
    const crepeShape = new THREE.Shape();
    crepeShape.moveTo(0, 0);
    crepeShape.lineTo(1.6, -0.9);
    crepeShape.quadraticCurveTo(1.8, 0, 1.5, 0.9);
    crepeShape.closePath();

    const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.03 };
    const crepeGeo = new THREE.ExtrudeGeometry(crepeShape, extrudeSettings);
    const crepeMat = new THREE.MeshStandardMaterial({
      color: 0xdfab67, // Tostado dorado de mantequilla
      roughness: 0.7,
      metalness: 0.05
    });
    const crepeMesh = new THREE.Mesh(crepeGeo, crepeMat);
    crepeMesh.rotation.x = -Math.PI / 2;
    crepeMesh.rotation.z = Math.PI / 6;
    crepeMesh.position.set(-0.6, 0.1, -0.3);
    crepeMesh.castShadow = true;
    group.add(crepeMesh);

    // Salsa líquida escurrida (Curva ondulada en 3D)
    const sauceCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.26, -0.8),
      new THREE.Vector3(-0.3, 0.26, -0.2),
      new THREE.Vector3(0.3, 0.26, 0.1),
      new THREE.Vector3(0.9, 0.26, -0.4),
      new THREE.Vector3(1.2, 0.26, 0.5)
    ]);
    const sauceGeo = new THREE.TubeGeometry(sauceCurve, 36, 0.09, 12, false);
    const sauceMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#29150d"), // Chocolate oscuro Nutella
      roughness: 0.15,
      clearcoat: 1.0,
      metalness: 0.1
    });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    group.add(sauceMesh);
    this.reactiveMeshes.crepaSauce = sauceMesh;

    // Toppings de fresas y plátanos
    const crepeStrawberries = new THREE.Group();
    for (let f = 0; f < 3; f++) {
      const berry = this.createStrawberry3D();
      berry.scale.set(0.65, 0.65, 0.65);
      berry.position.set(-0.2 + f * 0.45, 0.35, -0.1 + (f % 2) * 0.35);
      berry.rotation.set(0.3, f * 1.2, 0.2);
      crepeStrawberries.add(berry);
    }
    group.add(crepeStrawberries);
    this.reactiveMeshes.crepaToppings = crepeStrawberries;

    // Bola de nieve artesanal al lado de la crepa
    const scoopGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const scoopMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.45 });
    const scoopMesh = new THREE.Mesh(scoopGeo, scoopMat);
    scoopMesh.position.set(0.9, 0.45, 0.6);
    scoopMesh.castShadow = true;
    group.add(scoopMesh);
    this.reactiveMeshes.crepaScoop = scoopMesh;

    // Lluvia de azúcar glass / perlas
    this.addDessertDust(group, 0.15);
    this.addContactShadow(group);
  }

  /* -------------------------------------------------------------
     3. MODELADO 3D: EL WAFFLE BELGA TEXTURIZADO
     ------------------------------------------------------------- */
  buildWaffle3D() {
    const group = new THREE.Group();
    group.position.y = 0.1;
    this.productGroups.waffle = group;
    this.scene.add(group);

    // Plato cerámico
    const plateGeo = new THREE.CylinderGeometry(2.3, 1.8, 0.18, 48);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x18181f, roughness: 0.25 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.receiveShadow = true;
    group.add(plate);

    // Base del waffle belga grueso
    const waffleBaseGeo = new THREE.BoxGeometry(2.2, 0.35, 2.2);
    const waffleMat = new THREE.MeshStandardMaterial({
      color: 0xd49b52, // Masa dorada crujiente
      roughness: 0.7,
      metalness: 0.05
    });
    const waffleBase = new THREE.Mesh(waffleBaseGeo, waffleMat);
    waffleBase.position.y = 0.26;
    waffleBase.castShadow = true;
    group.add(waffleBase);

    // Relieve en cuadrícula característica del Waffle Belga (Huecos profundos)
    const gridSize = 4;
    const step = 0.45;
    const start = -((gridSize - 1) * step) / 2;

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gz = 0; gz < gridSize; gz++) {
        const pocketGeo = new THREE.BoxGeometry(0.32, 0.14, 0.32);
        const pocketMat = new THREE.MeshStandardMaterial({
          color: 0xab7332, // Tono más oscuro en el fondo del hueco
          roughness: 0.8
        });
        const pocket = new THREE.Mesh(pocketGeo, pocketMat);
        pocket.position.set(start + gx * step, 0.4, start + gz * step);
        group.add(pocket);
      }
    }

    // Baño de sirope brillante cayendo sobre el waffle
    const waffleSyrupGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.06, 24);
    const waffleSyrupMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#b91c1c"), // Frutos rojos por defecto
      roughness: 0.1,
      transmission: 0.45,
      clearcoat: 1.0
    });
    const waffleSyrup = new THREE.Mesh(waffleSyrupGeo, waffleSyrupMat);
    waffleSyrup.position.set(0, 0.46, 0);
    group.add(waffleSyrup);
    this.reactiveMeshes.waffleSyrup = waffleSyrup;

    // Gran bola de nieve artesanal al centro
    const scoopGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const scoopMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.5 });
    const scoop = new THREE.Mesh(scoopGeo, scoopMat);
    scoop.position.set(0, 0.85, 0);
    scoop.castShadow = true;
    group.add(scoop);
    this.reactiveMeshes.waffleScoop = scoop;

    // Fresas frescas alrededor de la bola
    const berryGroup = new THREE.Group();
    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2 + 0.3;
      const berry = this.createStrawberry3D();
      berry.scale.set(0.6, 0.6, 0.6);
      berry.position.set(Math.cos(angle) * 0.7, 0.55, Math.sin(angle) * 0.7);
      berry.rotation.set(0.2, angle, 0.3);
      berryGroup.add(berry);
    }
    group.add(berryGroup);
    this.reactiveMeshes.waffleBerries = berryGroup;

    this.addContactShadow(group);
  }

  /* -------------------------------------------------------------
     4. MODELADO 3D: VASO DE FRESAS CON CREMA ARTESANAL
     ------------------------------------------------------------- */
  buildFresas3D() {
    const group = new THREE.Group();
    group.position.y = -0.3;
    this.productGroups.fresas = group;
    this.scene.add(group);

    const cupH = 2.3;
    const cupTopR = 1.15;
    const cupBotR = 0.75;

    // Copa sundae de cristal
    const glassGeo = new THREE.CylinderGeometry(cupTopR, cupBotR, cupH, 36, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.5,
      depthWrite: false
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = cupH / 2;
    glassMesh.castShadow = true;
    group.add(glassMesh);

    // Base del cáliz
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 20);
    const stemMesh = new THREE.Mesh(stemGeo, glassMat);
    stemMesh.position.y = 0.2;
    group.add(stemMesh);

    const footGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 32);
    const footMesh = new THREE.Mesh(footGeo, glassMat);
    footMesh.position.y = 0.04;
    group.add(footMesh);

    // Capas interiores: Crema dulce espesa
    const creamGeo = new THREE.CylinderGeometry(cupTopR - 0.06, cupBotR - 0.06, cupH - 0.2, 32);
    const creamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#fffbeb"),
      roughness: 0.35,
      metalness: 0.02
    });
    const creamMesh = new THREE.Mesh(creamGeo, creamMat);
    creamMesh.position.y = cupH / 2 + 0.1;
    group.add(creamMesh);
    this.reactiveMeshes.fresasCream = creamMesh;

    // Trozos de fresas asomándose en el vaso
    for (let c = 0; c < 10; c++) {
      const pieceGeo = new THREE.DodecahedronGeometry(0.18);
      const pieceMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const piece = new THREE.Mesh(pieceGeo, pieceMat);
      const angle = (c / 10) * Math.PI * 2;
      const h = 0.5 + (c % 4) * 0.4;
      const r = cupBotR + (cupTopR - cupBotR) * (h / cupH) - 0.08;
      piece.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      group.add(piece);
    }

    // Corona superior de crema chantilly en espiral (Torus knot compacto)
    const chantillyGeo = new THREE.TorusKnotGeometry(0.55, 0.22, 64, 16, 2, 3);
    const chantillyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const chantilly = new THREE.Mesh(chantillyGeo, chantillyMat);
    chantilly.position.y = cupH + 0.25;
    chantilly.rotation.x = Math.PI / 2;
    chantilly.castShadow = true;
    group.add(chantilly);

    // Baño de jarabe de fresa o chocolate en la cima
    const fresasDrizzleGeo = new THREE.TorusGeometry(0.65, 0.07, 12, 32);
    const fresasDrizzleMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ef4444"),
      roughness: 0.1,
      clearcoat: 1.0
    });
    const fresasDrizzle = new THREE.Mesh(fresasDrizzleGeo, fresasDrizzleMat);
    fresasDrizzle.position.y = cupH + 0.38;
    fresasDrizzle.rotation.x = Math.PI / 2;
    group.add(fresasDrizzle);
    this.reactiveMeshes.fresasDrizzle = fresasDrizzle;

    // Fresa entera de corona
    const topBerry = this.createStrawberry3D();
    topBerry.scale.set(0.9, 0.9, 0.9);
    topBerry.position.set(0, cupH + 0.7, 0);
    group.add(topBerry);

    // Barquillo largo de galleta
    const wafer = this.createWaferGarnish();
    wafer.position.set(0.4, cupH + 0.6, -0.2);
    wafer.rotation.set(-0.2, 0.3, -0.35);
    group.add(wafer);

    this.addContactShadow(group);
  }

  /* -------------------------------------------------------------
     AYUDANTES 3D: FRUTAS Y ADORNOS INDIVIDUALES
     ------------------------------------------------------------- */
  createStrawberry3D() {
    const group = new THREE.Group();
    // Cuerpo cónico redondeado de fresa
    const berryGeo = new THREE.ConeGeometry(0.32, 0.65, 20);
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.05 });
    const berry = new THREE.Mesh(berryGeo, berryMat);
    berry.rotation.x = Math.PI;
    group.add(berry);

    // Semillitas doradas
    const seedGeo = new THREE.DodecahedronGeometry(0.02);
    const seedMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let s = 0; s < 18; s++) {
      const seed = new THREE.Mesh(seedGeo, seedMat);
      const theta = s * 1.2;
      const y = -0.2 + (s / 18) * 0.45;
      const rad = 0.28 * (1 - (y + 0.2) / 0.65);
      seed.position.set(Math.cos(theta) * rad, y, Math.sin(theta) * rad);
      group.add(seed);
    }

    // Hojas verdes de corona (Kiwi green #84cc16)
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5 });
    for (let h = 0; h < 5; h++) {
      const leafGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
      const leaf = new THREE.Mesh(leafGeo, crownMat);
      const a = (h * Math.PI * 2) / 5;
      leaf.position.set(Math.cos(a) * 0.16, 0.3, Math.sin(a) * 0.16);
      leaf.rotation.z = Math.cos(a) * 0.6;
      leaf.rotation.x = Math.sin(a) * 0.6;
      group.add(leaf);
    }
    return group;
  }

  createLemonGarnish() {
    const group = new THREE.Group();
    const peelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24);
    const peelMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.4 });
    const peel = new THREE.Mesh(peelGeo, peelMat);
    group.add(peel);

    const pulpGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.082, 24);
    const pulpMat = new THREE.MeshStandardMaterial({ color: 0xa3e635, roughness: 0.3 });
    const pulp = new THREE.Mesh(pulpGeo, pulpMat);
    group.add(pulp);

    for (let i = 0; i < 6; i++) {
      const spokeGeo = new THREE.BoxGeometry(0.04, 0.085, 0.4);
      const spokeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.y = (i * Math.PI) / 3;
      group.add(spoke);
    }
    return group;
  }

  createMangoSlice3D() {
    const group = new THREE.Group();
    const mangoGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16, 1, false, 0, Math.PI);
    const mangoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.05 });
    const mango = new THREE.Mesh(mangoGeo, mangoMat);
    mango.rotation.x = Math.PI / 2;
    group.add(mango);
    return group;
  }

  createWaferGarnish() {
    const group = new THREE.Group();
    const waferGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.0, 20);
    const waferMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    const wafer = new THREE.Mesh(waferGeo, waferMat);
    group.add(wafer);

    for (let j = 0; j < 5; j++) {
      const ringGeo = new THREE.TorusGeometry(0.095, 0.015, 8, 16);
      const chocoMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.3 });
      const ring = new THREE.Mesh(ringGeo, chocoMat);
      ring.position.y = -0.7 + j * 0.35;
      ring.rotation.x = Math.PI / 2 + 0.3;
      group.add(ring);
    }
    return group;
  }

  createTamarindGarnish() {
    const group = new THREE.Group();
    const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
    const stick = new THREE.Mesh(stickGeo, stickMat);
    group.add(stick);

    const candyGeo = new THREE.CylinderGeometry(0.16, 0.14, 1.4, 16);
    const candyMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const candy = new THREE.Mesh(candyGeo, candyMat);
    candy.position.y = 0.2;
    group.add(candy);

    const chiliGeo = new THREE.DodecahedronGeometry(0.02);
    const chiliMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    for (let c = 0; c < 20; c++) {
      const chili = new THREE.Mesh(chiliGeo, chiliMat);
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 1.2 + 0.2;
      chili.position.set(Math.cos(a) * 0.17, h, Math.sin(a) * 0.17);
      group.add(chili);
    }
    return group;
  }

  addContactShadow(parentGroup) {
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const rad = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
    rad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
    rad.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
    rad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.01;
    parentGroup.add(shadow);
  }

  addDessertDust(group, height) {
    const dustGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = height + Math.random() * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7 });
    const dust = new THREE.Points(dustGeo, dustMat);
    group.add(dust);
  }

  buildAmbientParticles() {
    const count = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      velocities.push({
        y: Math.random() * 0.006 + 0.002,
        angle: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.particleMat = new THREE.PointsMaterial({
      color: 0x84cc16,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    this.particles = new THREE.Points(geometry, this.particleMat);
    this.particlesVelocities = velocities;
    this.scene.add(this.particles);
  }

  setupPointerFallback() {
    const dom = this.renderer.domElement;
    let isDown = false;
    let lastX = 0;

    const onDown = (e) => {
      if (this.controls) return;
      isDown = true;
      this.isDragging = true;
      this.autoRotate = false;
      clearTimeout(this.idleTimer);
      lastX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onMove = (e) => {
      if (this.controls || !isDown) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const dx = x - lastX;
      lastX = x;
      const currentGroup = this.productGroups[currentProductKey];
      if (currentGroup) {
        currentGroup.rotation.y += dx * 0.009;
      }
    };

    const onUp = () => {
      if (this.controls || !isDown) return;
      isDown = false;
      this.isDragging = false;
      this.idleTimer = setTimeout(() => {
        this.autoRotate = true;
      }, 2200);
    };

    dom.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    dom.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
  }

  setupResizeListener() {
    window.addEventListener("resize", () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  /* -------------------------------------------------------------
     TRANSICIÓN FLUIDA ENTRE PRODUCTOS Y VARIACIONES
     ------------------------------------------------------------- */
  switchProduct(productKey, isInitial = false) {
    if (!PRODUCTS_DATA[productKey]) return;
    currentProductKey = productKey;
    const prod = PRODUCTS_DATA[productKey];

    // Cambiar visibilidad de los modelos 3D con escalado suave
    Object.keys(this.productGroups).forEach((key) => {
      const grp = this.productGroups[key];
      if (!grp) return;
      if (key === productKey) {
        grp.visible = true;
      }
    });

    // Cargar la variación por defecto de este producto
    currentVariantKey = prod.defaultVariant;
    this.setVariant(prod.defaultVariant, isInitial);
  }

  setVariant(variantKey, isInitial = false) {
    const prod = PRODUCTS_DATA[currentProductKey];
    if (!prod || !prod.variants[variantKey]) return;
    currentVariantKey = variantKey;
    const data = prod.variants[variantKey];

    // Objetivos de color para la animación lerp
    this.targetPrimaryColor.set(data.colorHex);
    this.targetSecondaryColor.set(data.syrupHex || data.sauceHex || data.drizzleHex || data.colorHex);
    this.targetLightColor.set(data.lightHex || "#ff2a7a");

    if (this.particleMat) {
      this.particleMat.color.set(data.particleHex || data.lightHex || "#84cc16");
    }

    // Efecto de rebote elástico (Squish & Bounce)
    this.bounceTime = Math.PI;

    // Actualizaciones específicas por tipo de producto 3D
    if (currentProductKey === "yuki") {
      this.updateYukiGarnishes(data.garnish);
    } else if (currentProductKey === "crepa") {
      if (this.reactiveMeshes.crepaSauce) {
        this.reactiveMeshes.crepaSauce.material.color.set(data.sauceHex);
      }
    } else if (currentProductKey === "waffle") {
      if (this.reactiveMeshes.waffleSyrup) {
        this.reactiveMeshes.waffleSyrup.material.color.set(data.syrupHex);
      }
      if (this.reactiveMeshes.waffleScoop) {
        this.reactiveMeshes.waffleScoop.material.color.set(data.scoopHex);
      }
    } else if (currentProductKey === "fresas") {
      if (this.reactiveMeshes.fresasDrizzle) {
        this.reactiveMeshes.fresasDrizzle.material.color.set(data.drizzleHex);
      }
      if (this.reactiveMeshes.fresasCream) {
        this.reactiveMeshes.fresasCream.material.color.set(data.creamHex);
      }
    }

    // Actualizar la interfaz de usuario con la información dinámica
    updateProductUI(prod, data);
  }

  updateYukiGarnishes(activeGarnish) {
    if (!this.yukiGarnishes) return;
    Object.keys(this.yukiGarnishes).forEach((k) => {
      const g = this.yukiGarnishes[k];
      if (k === activeGarnish) {
        g.visible = true;
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    const lerpSpeed = 0.08;

    // 1. Transición de escala de grupos (mostrar el producto activo, esconder los demás)
    Object.keys(this.productGroups).forEach((k) => {
      const grp = this.productGroups[k];
      if (!grp) return;
      const targetScale = (k === currentProductKey) ? 1.0 : 0.001;
      grp.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14);
      if (grp.scale.x < 0.02 && k !== currentProductKey) {
        grp.visible = false;
      }
    });

    // 2. Transiciones de color reactivas
    if (currentProductKey === "yuki") {
      if (this.reactiveMeshes.yukiDome) {
        this.reactiveMeshes.yukiDome.material.color.lerp(this.targetPrimaryColor, lerpSpeed);
      }
      if (this.reactiveMeshes.yukiSyrup) {
        this.reactiveMeshes.yukiSyrup.material.color.lerp(this.targetSecondaryColor, lerpSpeed);
      }
      if (this.reactiveMeshes.yukiInner) {
        this.reactiveMeshes.yukiInner.material.color.lerp(this.targetPrimaryColor, lerpSpeed);
      }

      // Adornos de Yuki escalado dinámico
      const activeGarnish = PRODUCTS_DATA.yuki.variants[currentVariantKey]?.garnish;
      if (this.yukiGarnishes) {
        Object.keys(this.yukiGarnishes).forEach((k) => {
          const g = this.yukiGarnishes[k];
          const target = (k === activeGarnish) ? 1.0 : 0.001;
          g.scale.lerp(new THREE.Vector3(target, target, target), 0.14);
          if (g.scale.x < 0.02 && k !== activeGarnish) {
            g.visible = false;
          }
        });
      }
    }

    if (this.pointLight) {
      this.pointLight.color.lerp(this.targetLightColor, lerpSpeed);
    }

    // 3. Rebote jugoso (Squish & Bounce)
    const activeGrp = this.productGroups[currentProductKey];
    if (this.bounceTime > 0 && activeGrp) {
      this.bounceTime -= 0.12;
      const offset = Math.sin(this.bounceTime) * 0.07;
      activeGrp.scale.set(1 + offset * 0.4, 1 - offset, 1 + offset * 0.4);
    }

    // 4. Rotación automática sutil en reposo
    if (this.autoRotate && activeGrp && !this.isDragging) {
      activeGrp.rotation.y += 0.008;
    }

    // 5. Partículas ambientales
    if (this.particles) {
      const arr = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particlesVelocities.length; i++) {
        const vel = this.particlesVelocities[i];
        arr[i * 3 + 1] += vel.y;
        arr[i * 3] += Math.sin(vel.angle) * 0.002;
        vel.angle += 0.02;
        if (arr[i * 3 + 1] > 4.5) {
          arr[i * 3 + 1] = 0;
          arr[i * 3] = (Math.random() - 0.5) * 4;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

let studioViewer = null;

/* ==========================================================================
   ACTUALIZACIÓN DINÁMICA DE LA INTERFAZ 3D
   ========================================================================== */
function renderVariantButtons(productKey) {
  const container = document.getElementById("variants-buttons-container");
  if (!container) return;

  container.innerHTML = "";
  const prod = PRODUCTS_DATA[productKey];
  const variants = Object.values(prod.variants);

  variants.forEach((v) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `variant-btn ${v.id === currentVariantKey ? "active" : ""} p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition-all bg-zinc-800/80 hover:bg-zinc-700/80 text-white`;
    btn.setAttribute("data-variant-id", v.id);

    // Color del indicador
    const dotColor = v.colorHex === "#ffffff" ? "#f8fafc" : v.colorHex;

    btn.innerHTML = `
      <span class="w-6 h-6 rounded-full flex items-center justify-center shadow-md text-xs" style="background-color: ${dotColor}; color: #000;">
        ●
      </span>
      <span class="font-heading font-extrabold text-xs sm:text-sm leading-tight">${v.shortName}</span>
      <span class="text-[10px] text-zinc-400 font-semibold">${v.price}</span>
    `;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (studioViewer) {
        studioViewer.setVariant(v.id);
      }
      showToast(`✨ Cambiado a: ${v.name}`);
    });

    container.appendChild(btn);
  });
}

function updateProductUI(product, variant) {
  const titleEl = document.getElementById("active-item-title");
  const descEl = document.getElementById("active-item-desc");
  const priceEl = document.getElementById("active-item-price");
  const badgeEl = document.getElementById("active-item-badge");
  const orderBtnText = document.getElementById("active-order-btn-text");

  if (titleEl) titleEl.textContent = variant.name;
  if (descEl) descEl.textContent = variant.description;
  if (priceEl) priceEl.textContent = variant.price;
  if (badgeEl) badgeEl.textContent = product.badge;
  if (orderBtnText) orderBtnText.textContent = `Pedir ${variant.shortName} por WhatsApp`;
}

function orderActive3DItem() {
  const prod = PRODUCTS_DATA[currentProductKey];
  const variant = prod.variants[currentVariantKey];
  const message = `¡Hola ${BRAND_NAME}! 🍧 Quiero ordenar:\n\n*1x ${variant.name}*\n- Categoría: *${prod.categoryTitle}*\n- Precio: *${variant.price}*\n\n¿Me confirman tiempo de entrega o para recoger? ¡Muchas gracias!`;
  triggerConfetti();
  showToast(`🍓 ¡Enviando pedido de ${variant.name}!`);
  openWhatsApp(message);
}

/* ==========================================================================
   MENÚ COMPLETO DE PRODUCTOS YIKIS KIKIS
   ========================================================================== */
const MENU_ITEMS = [
  // YUKIS
  {
    id: "yuki-limon",
    category: "yukis",
    title: "Yuki Limón & Kiwi Especial",
    badge: "Fresco & Cítrico",
    badgeColor: "bg-lime-500 text-zinc-950",
    price: 45,
    description: "Nieve ultra-fina con jugo natural de limones de Colima, rodajas de kiwi fresco y toque efervescente.",
    image: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "yuki-chamoyada",
    category: "yukis",
    title: "Yuki Chamoyada Mango-Tamarindo",
    badge: "Picocito & Dulce",
    badgeColor: "bg-amber-500 text-zinc-950",
    price: 55,
    description: "Hielo fino con pulpa natural de mango maduro, tamarindo agridulce, chamoy casero y banderilla.",
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "yuki-fresa",
    category: "yukis",
    title: "Yuki Fresa Silvestre",
    badge: "Favorito",
    badgeColor: "bg-rose-500 text-white",
    price: 45,
    description: "Jarabe artesanal de fresas maduras con trozos de fruta macerada y popote con chile o dulce.",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80"
  },

  // CREPAS
  {
    id: "crepa-kikis-paris",
    category: "crepas",
    title: "Crepa París Nutella & Fresas",
    badge: "Más Pedida",
    badgeColor: "bg-rose-500 text-white",
    price: 85,
    description: "Crepa delgadita y dorada a la mantequilla, abundante Nutella original, fresas de huerto y plátano.",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "crepa-cajeta",
    category: "crepas",
    title: "Crepa Celaya con Nuez Tostada",
    badge: "Tradicional",
    badgeColor: "bg-amber-600 text-white",
    price: 90,
    description: "Cajeta quemada auténtica de leche de cabra, nuez pecana finamente picada y bola de helado.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "crepa-frutos",
    category: "crepas",
    title: "Crepa Cheesecake & Zarzamora",
    badge: "Gourmet",
    badgeColor: "bg-purple-500 text-white",
    price: 95,
    description: "Rellena de suave crema cheesecake casera con salsa de zarzamoras y galleta Graham crujiente.",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop&q=80"
  },

  // WAFLES
  {
    id: "waffle-frutos",
    category: "wafles",
    title: "Waffle Belga Supremo Frutos Rojos",
    badge: "Crujiente",
    badgeColor: "bg-rose-500 text-white",
    price: 95,
    description: "Masa belga aireada con relieve profundo, fresas, zarzamoras, chocolate belga y helado artesanal.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "waffle-kinder",
    category: "wafles",
    title: "Waffle Kinder Bueno & Avellanas",
    badge: "Extremo",
    badgeColor: "bg-amber-500 text-zinc-950",
    price: 110,
    description: "Bañado en salsa de avellana tibia, barra crujiente Kinder Bueno, rebanadas de plátano y nuez tostada.",
    image: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "waffle-caramelo",
    category: "wafles",
    title: "Waffle Caramelo Salado & Nuez",
    badge: "Dulce & Salado",
    badgeColor: "bg-yellow-600 text-white",
    price: 90,
    description: "Caramelo de mantequilla salada, plátano caramelizado a la plancha y bola de nieve cremosa.",
    image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600&auto=format&fit=crop&q=80"
  },

  // FRESAS CON CREMA
  {
    id: "fresas-kikis",
    category: "fresas",
    title: "Fresas con Crema 'Yukis Kikis'",
    badge: "Firma de la Casa",
    badgeColor: "bg-rose-600 text-white",
    price: 85,
    description: "Fresas hidropónicas seleccionadas, crema especial tres leches de la casa, granola dorada y barquillo.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "fresas-royal",
    category: "fresas",
    title: "Fresas Royal Nutella & Oreo",
    badge: "Irresistible",
    badgeColor: "bg-zinc-800 text-white",
    price: 100,
    description: "Vaso rebosante de fresas naturales, crema dulce, abundante Nutella y crujientes galletas Oreo.",
    image: "https://images.unsplash.com/photo-1570749365839-2a9524584288?w=600&auto=format&fit=crop&q=80"
  },

  // BEBIDAS
  {
    id: "malteada-kikis",
    category: "bebidas",
    title: "Malteada Espesa de Fresa & Vainilla",
    badge: "100% Nieve",
    badgeColor: "bg-pink-500 text-white",
    price: 65,
    description: "Elaborada con nieve artesanal, fresas naturales batidas al momento, crema chantilly y cereza.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80"
  }
];

function renderMenuCards(category = "all") {
  const container = document.getElementById("menu-grid");
  if (!container) return;

  container.innerHTML = "";
  const filtered = category === "all" ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === category);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "dark-glass-card rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl transition-all duration-300";
    card.innerHTML = `
      <div class="relative overflow-hidden h-52">
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        <span class="absolute top-3 left-3 ${item.badgeColor} text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
          ${item.badge}
        </span>
        <span class="absolute bottom-3 right-3 bg-zinc-900/90 backdrop-blur-md text-rose-400 font-extrabold text-lg px-3 py-1 rounded-xl shadow-xl border border-zinc-700/50">
          $${item.price} <span class="text-xs font-semibold text-zinc-400">MXN</span>
        </span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="font-heading font-extrabold text-xl text-white group-hover:text-rose-400 transition-colors mb-2">
            ${item.title}
          </h3>
          <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5">
            ${item.description}
          </p>
        </div>
        <button 
          onclick="orderMenuItem('${item.title}', ${item.price})" 
          class="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span>Pedir este Antojo</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupMenuFilters() {
  const pills = document.querySelectorAll(".category-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const category = pill.getAttribute("data-category");
      renderMenuCards(category);
    });
  });
}

/* ==========================================================================
   INTEGRACIÓN CON WHATSAPP
   ========================================================================== */
function orderMenuItem(title, price) {
  const message = `¡Hola ${BRAND_NAME}! ✨ Quiero ordenar:\n\n*1x ${title}*\n- Precio: *$${price} MXN*\n\n¿Cuál es el tiempo aproximado para pasar por él o entrega a domicilio?`;
  triggerConfetti();
  showToast(`🍓 Agregando ${title} a tu pedido`);
  openWhatsApp(message);
}

function orderCustomDessert(e) {
  if (e) e.preventDefault();
  const base = document.querySelector('input[name="custom-base"]:checked')?.value || "Waffle Belga";
  const spread = document.querySelector('input[name="custom-spread"]:checked')?.value || "Nutella";
  
  const toppings = [];
  document.querySelectorAll('input[name="custom-topping"]:checked').forEach(cb => {
    toppings.push(cb.value);
  });
  const toppingsStr = toppings.length > 0 ? toppings.join(", ") : "Tradicional sin toppings extra";

  const message = `¡Hola ${BRAND_NAME}! 🧇 Armé mi postre personalizado:\n\n*Antojo Personalizado:*\n- Base: *${base}*\n- Untable: *${spread}*\n- Toppings & Frutas: *${toppingsStr}*\n\n¿Me confirman el costo total para ordenarlo? ¡Gracias!`;
  
  triggerConfetti();
  showToast(`🧇 ¡Tu ${base} personalizado está listo!`);
  openWhatsApp(message);
}

function openWhatsApp(text) {
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  setTimeout(() => {
    window.open(url, "_blank");
  }, 400);
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff2a7a", "#84cc16", "#eab308", "#22c55e", "#ffffff"]
    });
  }
}

function showToast(message) {
  let toast = document.getElementById("action-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "action-toast";
    toast.className = "toast-notice fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-3 shadow-2xl border border-rose-500/40";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ==========================================================================
   INICIALIZACIÓN AL CARGAR EL DOM
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Iniciar visor 3D Multi-Producto
  studioViewer = new MultiProduct3DStudio("canvas-3d-container");

  // 2. Control de pestañas de productos 3D (Yuki, Crepa, Waffle, Fresas)
  const productTabs = document.querySelectorAll(".product-tab-btn");
  productTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      productTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const productKey = tab.getAttribute("data-product");
      studioViewer.switchProduct(productKey);
      renderVariantButtons(productKey);
    });
  });

  // Renderizar botones iniciales para el Yuki
  renderVariantButtons("yuki");

  // Botón directo de orden del elemento 3D activo
  const activeOrderBtn = document.getElementById("active-order-btn");
  if (activeOrderBtn) {
    activeOrderBtn.addEventListener("click", orderActive3DItem);
  }

  // 3. Menú completo y filtros
  renderMenuCards("all");
  setupMenuFilters();

  // 4. Formulario de postre personalizado
  const customizerForm = document.getElementById("customizer-form");
  if (customizerForm) {
    customizerForm.addEventListener("submit", orderCustomDessert);
  }

  // 5. Botón flotante de WhatsApp
  const floatingWaBtn = document.getElementById("floating-wa-btn");
  if (floatingWaBtn) {
    floatingWaBtn.addEventListener("click", () => {
      const message = `¡Hola ${BRAND_NAME}! 🍓 Me gustaría ver el menú completo de hoy o pedir informes sobre el servicio a domicilio.`;
      openWhatsApp(message);
    });
  }

  // 6. Menú móvil
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // 7. Año dinámico
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
