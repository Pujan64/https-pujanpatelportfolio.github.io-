// Premium Portfolio Scripts - Pujan Patel

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initTypingEffect();
    initTiltEffect();
    initFocusTrackerWidget();
    initProjectFilters();
    initScrollReveal();
    initThemeToggler();
    initContactForm();
    initSkillsConsole();
    initTimelineRocket();
    initOscilloscope();
});

/* =========================================================================
   1. Canvas Particle Network (Neural Grid)
   ========================================================================= */
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let shootingStars = [];
    let mouse = { x: null, y: null, radius: 160 };

    // Handle resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        initShootingStars();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = Math.random() * 2.5 + 0.5;
            this.density = (Math.random() * 25) + 5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.angle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.03 + 0.008;
        }

        draw() {
            const isLight = document.body.classList.contains('light-mode');
            let opacity = 0.2 + Math.abs(Math.sin(this.angle)) * 0.65;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            
            if (isLight) {
                ctx.fillStyle = `rgba(230, 57, 70, ${opacity})`;
            } else {
                // Occasional orange or gold twinkling star
                if (this.density > 25) {
                    ctx.fillStyle = `rgba(255, 140, 0, ${opacity})`;
                } else if (this.density < 8) {
                    ctx.fillStyle = `rgba(255, 31, 113, ${opacity})`;
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                }
            }
            ctx.fill();
        }

        update() {
            // Star twinkle angle update
            this.angle += this.twinkleSpeed;

            // Mouse gravity well interaction (bend space-time)
            let forceX = 0;
            let forceY = 0;
            
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    // Gravitational pull towards mouse cursor
                    forceX = (dx / distance) * force * 1.5;
                    forceY = (dy / distance) * force * 1.5;
                }
            }

            // Slowly spring back to base path coordinates
            let springX = (this.baseX - this.x) * 0.04;
            let springY = (this.baseY - this.y) * 0.04;

            this.x += forceX + springX;
            this.y += forceY + springY;

            // Continuous drift on base position
            this.baseX += this.vx;
            this.baseY += this.vy;

            // Boundary collision bounce
            if (this.baseX < 0 || this.baseX > canvas.width) this.vx = -this.vx;
            if (this.baseY < 0 || this.baseY > canvas.height) this.vy = -this.vy;
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * (canvas.height * 0.4); // Spawn in upper skies
            this.len = Math.random() * 90 + 40;
            this.speed = Math.random() * 12 + 8;
            this.angle = Math.PI / 6 + (Math.random() - 0.5) * 0.08; // Diagonal angle
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.opacity = 1.0;
            this.active = false;
            this.delay = Math.random() * 400 + 100; // Random frame delay
        }

        update() {
            if (!this.active) {
                this.delay--;
                if (this.delay <= 0) {
                    this.active = true;
                }
                return;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= 0.015; // Slowly fade out

            if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            if (!this.active) return;

            const isLight = document.body.classList.contains('light-mode');
            let colorStr = isLight ? '230, 57, 70' : '255, 140, 0';
            
            ctx.beginPath();
            let grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - this.vx * 3.5, this.y - this.vy * 3.5
            );
            grad.addColorStop(0, `rgba(${colorStr}, ${this.opacity})`);
            grad.addColorStop(1, `rgba(${colorStr}, 0)`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 3.5, this.y - this.vy * 3.5);
            ctx.stroke();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 85);
        for (let i = 0; i < count; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }

    function initShootingStars() {
        shootingStars = [new ShootingStar(), new ShootingStar()];
    }

    function connectParticles() {
        const isLight = document.body.classList.contains('light-mode');
        const maxDist = 95; // Finer constellation paths
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    let alpha = (1 - (dist / maxDist)) * 0.12;
                    ctx.strokeStyle = isLight 
                        ? `rgba(230, 57, 70, ${alpha})` 
                        : `rgba(255, 140, 0, ${alpha})`;
                    ctx.lineWidth = 0.65;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update & Draw twinkling constellation stars
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connectParticles();

        // Update & Draw shooting stars
        for (let i = 0; i < shootingStars.length; i++) {
            shootingStars[i].update();
            shootingStars[i].draw();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    animate();
}

/* =========================================================================
   2. Typing Effect (Hero Titles)
   ========================================================================= */
function initTypingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const words = ["AI/ML Developer Intern", "Computer Vision Enthusiast", "Python Programmer", "Data Analyst"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 150;

    function type() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            delay = 50;
        } else {
            el.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            delay = 120;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            delay = 2000; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            delay = 500; // Pause before typing next word
        }

        setTimeout(type, delay);
    }

    type();
}

/* =========================================================================
   3. 3D Tilt Effect
   ========================================================================= */
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotational values
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 10; // Adjust division for severity
            const rotateY = (x - centerX) / 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

/* =========================================================================
   4. Interactive FocusVision Radar Widget
   ========================================================================= */
function initFocusTrackerWidget() {
    const radar = document.getElementById('focus-radar');
    const reticle = document.getElementById('focus-reticle');
    const xCoordVal = document.getElementById('coord-x-val');
    const yCoordVal = document.getElementById('coord-y-val');
    const scoreVal = document.getElementById('focus-score-val');
    const statusVal = document.getElementById('status-val');
    const inferenceVal = document.getElementById('inference-val');

    if (!radar || !reticle) return;

    radar.addEventListener('mousemove', (e) => {
        const rect = radar.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);

        // Position reticle
        reticle.style.left = `${x}px`;
        reticle.style.top = `${y}px`;

        // Update coordinates
        xCoordVal.textContent = x;
        yCoordVal.textContent = y;

        // Calculate focus score: higher when closer to center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxDistance = Math.hypot(centerX, centerY);
        const distance = Math.hypot(x - centerX, y - centerY);
        const score = Math.max(0, Math.min(100, Math.round(((maxDistance - distance) / maxDistance) * 100)));
        scoreVal.textContent = `${score}%`;

        // Update status text
        if (score > 80) {
            statusVal.textContent = "OPTIMAL_FOCUS";
            statusVal.style.color = "#10b981";
        } else if (score > 40) {
            statusVal.textContent = "DISTRACTED_STATE";
            statusVal.style.color = "#f59e0b";
        } else {
            statusVal.textContent = "ABSENCE_DETECTED";
            statusVal.style.color = "#ef4444";
        }

        // Mock inference latency oscillation
        const latency = (Math.random() * 4 + 8).toFixed(1);
        inferenceVal.textContent = `${latency}ms`;
    });

    radar.addEventListener('mouseleave', () => {
        // Reset reticle position to center
        reticle.style.left = `50%`;
        reticle.style.top = `50%`;

        xCoordVal.textContent = "---";
        yCoordVal.textContent = "---";
        scoreVal.textContent = "0%";
        statusVal.textContent = "STANDBY (NO_FACE)";
        statusVal.style.color = "#64748b";
        inferenceVal.textContent = "---ms";
    });
}

/* =========================================================================
   5. Project Filtering
   ========================================================================= */
function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.project-item');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active filter state
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            items.forEach(item => {
                const card = item.querySelector('.project-card');
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Trigger reflow & fade in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* =========================================================================
   6. Scroll Reveal Animations (Intersection Observer)
   ========================================================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));

    // Active navigation highlight on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Header scrolled class
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

/* =========================================================================
   7. Theme Switcher (Light / Dark Mode)
   ========================================================================= */
function initThemeToggler() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Load saved preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateTogglerIcon('light');
    } else {
        updateTogglerIcon('dark');
    }

    toggleBtn.addEventListener('click', () => {
        const body = document.body;
        body.classList.toggle('light-mode');

        if (body.classList.contains('light-mode')) {
            localStorage.setItem('portfolio-theme', 'light');
            updateTogglerIcon('light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
            updateTogglerIcon('dark');
        }
    });

    function updateTogglerIcon(theme) {
        if (theme === 'light') {
            // Set Sun icon SVG inside the button
            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7(6,6S15.3,18,12,18z M12,8c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,8,12,8z M11,1v3h2V1H11z M11,20v3h2v-3H11z M4.2,2.8l2.1,2.1L4.9,6.3L2.8,4.2L4.2,2.8z M19.1,17.7l2.1,2.1l-1.4,1.4l-2.1-2.1L19.1,17.7z M20,11h3v2h-3V11z M1,11h3v2H1V11z M17.7,4.2l2.1-2.1l1.4,1.4l-2.1,2.1L17.7,4.2z M2.8,19.8l2.1-2.1l1.4,1.4l-2.1,2.1L2.8,19.8z"/></svg>`;
        } else {
            // Set Moon icon SVG inside the button
            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,22C6.49,22,2,17.51,2,12C2,7.01,5.65,2.83,10.45,2.1c0.49-0.07,0.95,0.22,1.09,0.69c0.14,0.47-0.08,0.98-0.51,1.21C9.17,5.08,8,7.39,8,10c0,3.86,3.14,7,7,7c2.61,0,4.92-1.17,6-3.03c0.23-0.42,0.73-0.65,1.21-0.51c0.47,0.14,0.77,0.6,0.69,1.09C21.17,19.35,16.99,22,12,22z"/></svg>`;
        }
    }
}

/* =========================================================================
   8. Cyberpunk Contact Form Submission
   ========================================================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn-wrap button');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span style="letter-spacing: 1px;">TRANSMITTING SECURE DATA...</span>`;
        submitBtn.style.boxShadow = `0 0 20px #ff8c00`;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        fetch("https://formsubmit.co/ajax/patelpujan2564@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.innerHTML = `<span style="letter-spacing: 1px; color: #10b981;">DATA INGESTED ✓</span>`;
            submitBtn.style.boxShadow = `0 0 20px #10b981`;
            submitBtn.style.border = `1px solid #10b981`;
            submitBtn.style.background = `rgba(16, 185, 129, 0.1)`;

            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.boxShadow = '';
                submitBtn.style.border = '';
                submitBtn.style.background = '';
            }, 3000);
        })
        .catch(err => {
            console.error(err);
            submitBtn.innerHTML = `<span style="letter-spacing: 1px; color: #ef4444;">TRANSMISSION FAIL ✗</span>`;
            submitBtn.style.boxShadow = `0 0 20px #ef4444`;
            submitBtn.style.border = `1px solid #ef4444`;
            submitBtn.style.background = `rgba(239, 68, 68, 0.1)`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.boxShadow = '';
                submitBtn.style.border = '';
                submitBtn.style.background = '';
            }, 3000);
        });
    });
}

/* =========================================================================
   10. Interactive Rocket Timeline Glider
   ========================================================================= */
function initTimelineRocket() {
    const timelineContainers = document.querySelectorAll('.timeline-container');
    if (!timelineContainers.length) return;

    function updateRockets() {
        timelineContainers.forEach(container => {
            const rocket = container.querySelector('.timeline-rocket');
            if (!rocket) return;

            const rect = container.getBoundingClientRect();
            const containerHeight = rect.height;
            
            // Calculate rocket position based on viewport vertical center
            const viewportCenter = window.innerHeight * 0.6;
            const scrolled = viewportCenter - rect.top;
            
            // Clamp progress between 0% and 100%
            let percentage = scrolled / containerHeight;
            percentage = Math.max(0, Math.min(1, percentage));
            
            const topOffset = percentage * containerHeight;
            rocket.style.top = `${topOffset}px`;
        });
    }

    window.addEventListener('scroll', updateRockets);
    window.addEventListener('resize', updateRockets);
    // Initial run
    setTimeout(updateRockets, 200);
}

/* =========================================================================
   11. Interactive Cosmic Oscilloscope Wave
   ========================================================================= */
function initOscilloscope() {
    const path = document.getElementById('osc-path');
    const form = document.getElementById('contact-form');
    if (!path || !form) return;

    let phase = 0;
    let targetAmplitude = 4;
    let currentAmplitude = 4;
    let targetFrequency = 0.04;
    let currentFrequency = 0.04;
    let typingTimeout;

    // Trigger wave spikes when typing in form inputs
    form.addEventListener('input', () => {
        targetAmplitude = 24;
        targetFrequency = 0.18;
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            // Calm down to baseline heartbeat wave
            targetAmplitude = 4;
            targetFrequency = 0.04;
        }, 800);
    });

    function drawWave() {
        phase += 0.12;
        
        // Fluid transition interpolation
        currentAmplitude += (targetAmplitude - currentAmplitude) * 0.07;
        currentFrequency += (targetFrequency - currentFrequency) * 0.07;
        
        const segments = 45;
        const width = 400;
        const centerY = 35;
        let points = [];
        
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * width;
            // Edge damping ensures wave snaps smoothly to boundaries (M 0 35 and L 400 35)
            const edgeDamping = Math.sin((i / segments) * Math.PI);
            const y = centerY + Math.sin(i * currentFrequency * 10 + phase) * currentAmplitude * edgeDamping;
            
            points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        
        path.setAttribute('d', points.join(' '));
        requestAnimationFrame(drawWave);
    }

    drawWave();
}

/* =========================================================================
   12. Centered Skills Planetarium Core Telemetry Display
   ========================================================================= */
function initSkillsConsole() {
    const nodes = document.querySelectorAll('.skill-planet');
    const sun = document.getElementById('skills-sun');
    const telTitleEl = document.getElementById('tel-title');
    const telStatusEl = document.getElementById('tel-status');
    const telDescEl = document.getElementById('tel-desc');
    const telBarEl = document.getElementById('tel-bar');
    const telBarPctEl = document.getElementById('tel-bar-pct');
    const telLogoEl = document.getElementById('tel-logo');
    const rocketAreaEl = document.getElementById('rocket-launch-area');

    if (!nodes.length || !sun || !telTitleEl) return;

    // Skill telemetry data with original logo colors
    const skillData = {
        python: {
            title: "Python Engine",
            status: "OPTIMAL",
            integrity: "95%",
            desc: "Core Python developer engine for high-throughput image processing, data structures, OpenCV vision loops, and back-end integration pipelines.",
            libs: ["PyTorch", "TensorFlow", "OpenCV", "NumPy", "Scikit-Learn"],
            logo: `<svg viewBox="0 0 24 24">
                <path fill="#3776AB" d="M14.25.18c.9 0 1.66.73 1.66 1.63v2.85h-2.92c-.88 0-1.6.71-1.6 1.6v1.45H8.38c-.89 0-1.6.72-1.6 1.6v2.9h-2.9C2.97 12.21 2.25 11.48 2.25 10.58V8.34c0-.9.73-1.63 1.63-1.63H6.8V3.8c0-.9.72-1.62 1.62-1.62h2.89C11.31.75 12.04.18 12.94.18h1.31zm.54 1.35a.54.54 0 1 0 0 1.08.54.54 0 0 0 0-1.08z"/>
                <path fill="#FFD343" d="M9.75 23.82c-.9 0-1.66-.73-1.66-1.63v-2.85h2.92c.88 0 1.6-.71 1.6-1.6v-1.45h3.01c.89 0 1.6-.72 1.6-1.6v-2.9h-2.9C2.97 12.21 2.25 11.48 2.25 10.58V8.34c0-.9.73-1.63 1.63-1.63H6.8V3.8c0-.9.72-1.62 1.62-1.62h2.89C11.31.75 12.04.18 12.94.18h1.31zm.54 1.35a.54.54 0 1 0 0 1.08.54.54 0 0 0 0-1.08z"/>
            </svg>`
        },
        dl: {
            title: "Deep Learning",
            status: "STABLE",
            integrity: "88%",
            desc: "Neural network configurations, convolutional architectures (CNNs), MobileNet layers, hyperparameters tuning, and deep learning model weights deployment.",
            libs: ["CNNs", "TensorFlow", "MobileNetV2", "Quantization", "Hyperparameters"],
            logo: `<svg viewBox="0 0 24 24">
                <path fill="#EE4C2C" d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm0 18.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"/>
                <path fill="#EE4C2C" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
            </svg>`
        },
        cv: {
            title: "Computer Vision",
            status: "OPTIMAL",
            integrity: "92%",
            desc: "Object detection loops using YOLO networks, image manipulations with OpenCV, facial landmarks mapping (MediaPipe), and text extractions (OCR).",
            libs: ["YOLOv5 & v8", "OpenCV", "PaddleOCR", "MediaPipe", "Object Tracking"],
            logo: `<svg viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4.5" fill="none" stroke="#E11E26" stroke-width="2.5" />
                <circle cx="7.5" cy="15" r="4.5" fill="none" stroke="#009E47" stroke-width="2.5" />
                <circle cx="16.5" cy="15" r="4.5" fill="none" stroke="#007CC0" stroke-width="2.5" />
            </svg>`
        },
        js: {
            title: "JavaScript / ES6+",
            status: "ACTIVE",
            integrity: "85%",
            desc: "Event-driven asynchronous controllers, DOM interactions, Canvas rendering loops, responsive dashboard components, and socket configurations.",
            libs: ["ES6+ Core", "DOM APIs", "Canvas API", "Event Loops", "WebSockets"],
            logo: `<svg viewBox="0 0 24 24">
                <rect width="24" height="24" fill="#F7DF1E" rx="3" />
                <path fill="#000000" d="M18.8 18.2c-.3.5-.8.9-1.5.9-.7 0-1.2-.4-1.5-.9-.2-.3-.3-.7-.3-1.2h1.6c0 .3.1.5.2.7s.3.2.5.2c.2 0 .4-.1.5-.2s.2-.3.2-.5v-4.5h1.7v4.5c0 .7-.3 1.2-.9 1.5zm-5.3-2.1c-.2.5-.5.9-.9 1.2s-1 .4-1.6.4c-1.1 0-1.9-.6-2.2-1.7h1.7c.2.4.5.6.9.6.4 0 .7-.2.8-.5s.2-.6.2-.9c0-.4-.1-.7-.3-.8s-.6-.3-1.1-.5c-.7-.2-1.2-.5-1.5-.8s-.5-.8-.5-1.4c0-.6.2-1.1.7-1.4s1.1-.5 1.8-.5c.8 0 1.4.2 1.8.6s.6 1 .7 1.7H12c-.1-.3-.3-.6-.6-.7s-.6-.2-.8-.2c-.3 0-.5.1-.6.2s-.2.3-.2.5c0 .2.1.4.3.5.2.1.5.2.9.4.7.2 1.2.5 1.5.9s.4.9.4 1.5c.1.4 0 .9-.2 1.3z"/>
            </svg>`
        },
        web: {
            title: "Full Stack Core",
            status: "OPTIMAL",
            integrity: "90%",
            desc: "Responsive frontend components using React, scalable server architectures with Node/Express, and schema modeling in non-relational databases (MongoDB).",
            libs: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs"],
            logo: `<svg viewBox="0 0 24 24" class="react-logo-svg" style="animation: spinReact 12s linear infinite;">
                <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#00d8ff" stroke-width="1.5" transform="rotate(30,12,12)"/>
                <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#00d8ff" stroke-width="1.5" transform="rotate(90,12,12)"/>
                <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#00d8ff" stroke-width="1.5" transform="rotate(150,12,12)"/>
                <circle cx="12" cy="12" r="1.8" fill="#00d8ff"/>
            </svg>`
        },
        git: {
            title: "Engineering Tools",
            status: "ACTIVE",
            integrity: "80%",
            desc: "Version control platforms, deployment runners, relational databases, object-oriented concepts, and workspace extensions.",
            libs: ["Git & GitHub", "GitHub Actions", "DBMS / SQL", "OOP Patterns", "VS Code"],
            logo: `<svg viewBox="0 0 24 24">
                <path fill="#F05032" d="M23.3 10.9L13.1.7c-.9-.9-2.5-.9-3.4 0L7.9 2.5l2.8 2.8c.8-.3 1.8-.1 2.4.6.6.6.8 1.5.5 2.3l2.8 2.8c.8-.3 1.7-.1 2.3.5.9.9.9 2.5 0 3.4s-2.5.9-3.4 0c-.6-.6-.8-1.5-.5-2.3L12 9.8c-.3.3-.7.5-1.1.5v5.8c.3.2.5.5.6.8.9.9.9 2.5 0 3.4s-2.5.9-3.4 0c-.9-.9-.9-2.5 0-3.4.3-.3.7-.5 1.1-.6v-5.8c-.4-.1-.8-.3-1.1-.6-.6-.6-.8-1.5-.5-2.3L4.9 5.3 1.1 9.1c-.9.9-.9 2.5 0 3.4l10.2 10.2c.9.9 2.5.9 3.4 0l8.6-8.6c.9-.7.9-2.3 0-3.2z"/>
            </svg>`
        }
    };

    let activeSkill = 'python';

    // Helper to display skill in the side panels
    function updateSun(skillKey, isFlicker = false) {
        const data = skillData[skillKey];
        if (!data) return;

        // Apply a visual flicker trigger to the telemetry panel
        if (isFlicker && telTitleEl.parentElement) {
            const container = telTitleEl.closest('.skills-side-panel');
            if (container) {
                container.classList.remove('reveal');
                void container.offsetWidth; // Trigger reflow
                container.classList.add('reveal');
            }
        }

        // Update textual telemetry fields
        telTitleEl.textContent = data.title;
        telStatusEl.textContent = data.status;
        telDescEl.textContent = data.desc;
        telBarEl.style.width = data.integrity;
        telBarPctEl.textContent = data.integrity;
        telLogoEl.innerHTML = data.logo;

        // Status color mapping
        if (data.status === "OPTIMAL") {
            telStatusEl.className = "value status-ok";
        } else {
            telStatusEl.className = "value";
            telStatusEl.style.color = "var(--accent-secondary)";
        }

        // Trigger Sub-skill Rocket Blast-off animations
        rocketAreaEl.innerHTML = "";
        data.libs.forEach((lib, index) => {
            const rocketCard = document.createElement('div');
            rocketCard.className = 'sub-skill-rocket';
            // Stagger animation delays for a sequential launching sequence
            rocketCard.style.animationDelay = `${index * 0.12}s`;
            rocketCard.innerHTML = `
                <div class="mini-rocket">
                    <div class="rocket-nose"></div>
                    <div class="rocket-body"></div>
                    <div class="rocket-fins"></div>
                    <div class="rocket-fire"></div>
                </div>
                <span class="rocket-name">${lib}</span>
            `;
            rocketAreaEl.appendChild(rocketCard);
            
            // Force browser layout recalculation and trigger launch sequence
            void rocketCard.offsetWidth;
            rocketCard.classList.add('animate-launch');
        });
    }

    // Initialize with active python skill
    updateSun(activeSkill);

    nodes.forEach(node => {
        const skillKey = node.getAttribute('data-skill');

        // On Click
        node.addEventListener('click', () => {
            activeSkill = skillKey;
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            updateSun(skillKey, true);
        });

        // On Mouse Enter
        node.addEventListener('mouseenter', () => {
            updateSun(skillKey, false);
        });

        // On Mouse Leave
        node.addEventListener('mouseleave', () => {
            updateSun(activeSkill, false);
        });
    });
}
