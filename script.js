const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const contadorElemento = document.getElementById('contador');

const btnStart = document.getElementById('btnStart');
const startScreen = document.getElementById('startScreen');
const instructionsHud = document.getElementById('instructionsHud');
const counterHud = document.getElementById('counterHud');

const NUM_OBJETOS = 25; // Requisito 1: 25 objetos
const RADIO = 30;
let objetos = [];
let particulas = [];
let clics = 0;
let juegoIniciado = false;

// Cargar imagen de fondo
const bgImage = new Image();
bgImage.src = 'assets/fondo.jpg';

// Audio Context (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playLaserSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

class Objeto {
    constructor() {
        this.radio = RADIO;
        this.resetPosition();
        
        this.velocidad = Math.random() * 2.0 + 1.2; 
        this.tipoDireccion = Math.floor(Math.random() * 4); 
        this.angulo = Math.random() * Math.PI * 2;
        
        this.dirY = this.tipoDireccion === 0 ? -1 : (this.tipoDireccion === 1 ? 1 : (Math.random() < 0.5 ? 1 : -1));
        this.dirX = Math.random() < 0.5 ? 1 : -1;

        this.img = new Image();
        this.img.src = `assets/objeto${Math.floor(Math.random() * 3) + 1}.png`; 
    }

    resetPosition() {
        const marginX = RADIO * 2;
        const marginY = RADIO * 2;
        this.x = Math.random() * (canvas.width - marginX * 2) + marginX;
        this.y = Math.random() * (canvas.height - marginY * 2) + marginY;
    }

    dibujar() {
        if (this.img.complete && this.img.naturalHeight !== 0) {
            ctx.drawImage(this.img, this.x - this.radio, this.y - this.radio, this.radio * 2, this.radio * 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
            ctx.fillStyle = '#00d2ff';
            ctx.fill();
        }
    }

    actualizar() {
        if (this.tipoDireccion === 0 || this.tipoDireccion === 1) { 
            this.y += this.dirY * this.velocidad;
        } else if (this.tipoDireccion === 2) { 
            this.x += this.dirX * this.velocidad;
            this.y += this.dirY * this.velocidad;
        } else if (this.tipoDireccion === 3) { 
            this.angulo += 0.03;
            this.x += Math.cos(this.angulo) * (this.velocidad * 1.5);
            this.y += Math.sin(this.angulo) * (this.velocidad * 1.5);
        }

        const minY = RADIO + 30;
        const maxY = canvas.height - RADIO - 15;
        const minX = RADIO + 20;
        const maxX = canvas.width - RADIO - 20;

        if (this.y <= minY) {
            this.y = minY;
            this.dirY = 1;
        } else if (this.y >= maxY) {
            this.y = maxY;
            this.dirY = -1;
        }

        if (this.x <= minX) {
            this.x = minX;
            this.dirX = 1;
        } else if (this.x >= maxX) {
            this.x = maxX;
            this.dirX = -1;
        }
    }
}

class Particula {
    constructor(x, y) {
        this.x = x; 
        this.y = y; 
        this.vida = 1.0;
        this.color = '#00d2ff';
        this.tamano = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
    }
    actualizar() { 
        this.x += this.vx; 
        this.y += this.vy; 
        this.vida -= 0.05; 
    }
    dibujar() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.vida);
        ctx.fillStyle = this.color;
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    objetos = [];
    for (let i = 0; i < NUM_OBJETOS; i++) {
        objetos.push(new Objeto());
    }
}

function resolverColisiones() {
    for (let i = 0; i < objetos.length; i++) {
        for (let j = i + 1; j < objetos.length; j++) {
            let obj1 = objetos[i];
            let obj2 = objetos[j];

            let dx = obj2.x - obj1.x;
            let dy = obj2.y - obj1.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            let minDistancia = obj1.radio + obj2.radio;

            if (distancia < minDistancia) {
                let solapamiento = minDistancia - distancia;
                let nx = dx / (distancia || 1);
                let ny = dy / (distancia || 1);

                obj1.x -= nx * (solapamiento / 2);
                obj1.y -= ny * (solapamiento / 2);
                obj2.x += nx * (solapamiento / 2);
                obj2.y += ny * (solapamiento / 2);

                obj1.dirX *= -1; obj1.dirY *= -1;
                obj2.dirX *= -1; obj2.dirY *= -1;

                let px = (obj1.x + obj2.x) / 2;
                let py = (obj1.y + obj2.y) / 2;
                for (let k = 0; k < 4; k++) {
                    particulas.push(new Particula(px, py));
                }
            }
        }
    }
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (bgImage.complete && bgImage.naturalHeight !== 0) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else { 
        ctx.fillStyle = '#020710'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }

    if (juegoIniciado) {
        objetos.forEach(obj => { 
            obj.actualizar(); 
            obj.dibujar(); 
        });

        resolverColisiones();

        for (let i = particulas.length - 1; i >= 0; i--) {
            particulas[i].actualizar();
            particulas[i].dibujar();
            if (particulas[i].vida <= 0) {
                particulas.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(animar);
}

// LÓGICA DE INICIO DE JUEGO (Menú Principal)
btnStart.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    // Iniciar Música de fondo (Requisito 4)
    const music = document.getElementById('bgMusic');
    if (music) {
        music.play().catch(e => console.log("Música iniciada por botón"));
    }

    // Ocultar pantalla de inicio y mostrar HUD del juego
    startScreen.classList.add('d-none');
    instructionsHud.classList.remove('d-none');
    counterHud.classList.remove('d-none');
    
    juegoIniciado = true;
});

// Evento Clic para destruir Kaijus
canvas.addEventListener('click', (e) => {
    if (!juegoIniciado) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (let i = objetos.length - 1; i >= 0; i--) {
        const obj = objetos[i];
        const dist = Math.sqrt((clickX - obj.x) ** 2 + (clickY - obj.y) ** 2);
        
        if (dist < obj.radio) {
            playLaserSound();

            obj.resetPosition();
            clics++;
            contadorElemento.innerText = clics;
            
            for (let k = 0; k < 10; k++) {
                particulas.push(new Particula(clickX, clickY));
            }
            break;
        }
    }
});

init();
animar();