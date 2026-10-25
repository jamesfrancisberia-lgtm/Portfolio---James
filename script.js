document.addEventListener("DOMContentLoaded", () => {

    // --- Web Audio Synthesizer: Authentic Ben 10 Sound Effects ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBen10Sound(type) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        if (type === 'dial') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.08);

        } else if (type === 'activate') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.08);
            osc.frequency.setValueAtTime(783.99, now + 0.16);
            osc.frequency.setValueAtTime(1046.50, now + 0.24);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);

        } else if (type === 'transform') {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            
            osc1.frequency.setValueAtTime(150, now);
            osc1.frequency.exponentialRampToValueAtTime(800, now + 0.3);
            
            osc2.frequency.setValueAtTime(300, now);
            osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.3);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.5);
            osc2.stop(now + 0.5);

        } else if (type === 'terminal') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.setValueAtTime(450, now + 0.04);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    }

    // --- Navigation System ---
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".page-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            playBen10Sound('dial');
            const target = btn.getAttribute("data-target");

            navButtons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    });

    // --- Boot Transition & Voice Greeting ---
    const loader = document.getElementById("loader");
    const greetingText = document.getElementById("greetingText");

    setTimeout(() => {
        loader.classList.add("fade-out");
        playBen10Sound('activate');
        speakGreeting();
    }, 1500);

    function speakGreeting() {
        const hour = new Date().getHours();
        let timeGreeting = "Welcome back";
        if (hour < 12) timeGreeting = "Good morning";
        else if (hour < 18) timeGreeting = "Good afternoon";
        else timeGreeting = "Good evening";

        const text = `${timeGreeting}, User Identified. Accessing James Francis Beria's Omnitrix Portfolio.`;
        greetingText.textContent = text.toUpperCase();

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }

    // --- Particle Background Engine ---
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            const isAlbedo = document.body.classList.contains("albedo-mode");
            ctx.fillStyle = isAlbedo ? "rgba(255, 34, 51, 0.5)" : "rgba(0, 255, 102, 0.5)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- Theme Mode Toggle ---
    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("albedo-mode");
        playBen10Sound('activate');
    });

    // --- Alien Transformation Engine ---
    const aliens = [
        { name: "Heatblast", badge: "Pyronite", color: "#ff6600" },
        { name: "XLR8", badge: "Kineceleran", color: "#00ccff" },
        { name: "Four Arms", badge: "Tetramand", color: "#cc0000" },
        { name: "Grey Matter", badge: "Galvan", color: "#aaaaaa" },
        { name: "Upgrade", badge: "Galvanic Mechamorph", color: "#00ff66" },
        { name: "Diamondhead", badge: "Petrosapien", color: "#00ffcc" }
    ];

    document.getElementById("transformBtn").addEventListener("click", () => {
        playBen10Sound('transform');
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        document.getElementById("alienBadge").textContent = `${randomAlien.name} (${randomAlien.badge})`;
        document.querySelectorAll(".omni-color-fill").forEach(el => el.style.fill = randomAlien.color);
    });

    // --- Dynamic Typing Speed Test Modal ---
    const typingModal = document.getElementById("typingModal");
    const quoteInput = document.getElementById("quoteInput");
    const timerText = document.getElementById("timerText");
    const wpmText = document.getElementById("wpmText");
    
    let timer = 15;
    let totalTime = 15;
    let interval = null;
    let startTime = null;

    function calculateWPM() {
        const typedText = quoteInput.value.trim();
        if (typedText.length === 0) return 0;

        const elapsedMinutes = (totalTime - timer) / 60;
        if (elapsedMinutes <= 0) return 0;

        const typedWords = typedText.length / 5;
        return Math.round(typedWords / elapsedMinutes);
    }

    document.getElementById("typingGameBtn").addEventListener("click", () => {
        playBen10Sound('dial');
        typingModal.classList.remove("hidden");
        quoteInput.value = "";
        timer = 15;
        totalTime = 15;
        timerText.textContent = timer;
        wpmText.textContent = "0";
        startTime = null;
        if (interval) clearInterval(interval);
        interval = null;
        quoteInput.focus();
    });

    document.getElementById("closeTypingModal").addEventListener("click", () => {
        typingModal.classList.add("hidden");
        if (interval) clearInterval(interval);
        interval = null;
    });

    quoteInput.addEventListener("input", () => {
        if (interval) {
            wpmText.textContent = calculateWPM();
        }

        if (!interval) {
            startTime = Date.now();
            interval = setInterval(() => {
                timer--;
                timerText.textContent = timer;
                
                wpmText.textContent = calculateWPM();

                if (timer <= 0) {
                    clearInterval(interval);
                    interval = null;
                    playBen10Sound('activate');
                }
            }, 1000);
        }
    });

    // --- Plumber Terminal ---
    const terminalOverlay = document.getElementById("terminalOverlay");
    const terminalInput = document.getElementById("terminalInput");
    const terminalBody = document.getElementById("terminalBody");

    document.getElementById("openTerminalBtn").addEventListener("click", () => {
        playBen10Sound('terminal');
        terminalOverlay.classList.remove("hidden");
        terminalInput.focus();
    });

    document.getElementById("closeTerminal").addEventListener("click", () => {
        terminalOverlay.classList.add("hidden");
    });

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            playBen10Sound('terminal');
            const cmd = terminalInput.value.trim().toLowerCase();
            const line = document.createElement("div");
            line.textContent = `> ${cmd}`;
            terminalBody.appendChild(line);

            let resp = "Command not recognized. Type 'help'.";
            if (cmd === "help") resp = "Available commands: help, bio, skills, clear";
            else if (cmd === "bio") resp = "James Francis Beria: 3rd Year BSIT Student & Web Developer.";
            else if (cmd === "skills") resp = "Core Stack: HTML5, CSS3, JavaScript, C#, Java, SQL.";
            else if (cmd === "clear") { terminalBody.innerHTML = ""; terminalInput.value = ""; return; }

            const out = document.createElement("div");
            out.textContent = resp;
            terminalBody.appendChild(out);
            terminalInput.value = "";
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
});