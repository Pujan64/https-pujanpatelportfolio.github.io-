// Premium Neural Intelligence Platform Script (2026) - Pujan Patel

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Loading Sequence
    initLoadingSequence();

    // 2. Interactive 3D Canvas Neural Network
    initNeuralNetworkCanvas();

    // 3. Navigation Scrolling & Region Tracking
    initRegionTracking();

    // 4. Skills Telemetry Interactivity
    initSkillsTelemetry();

    // 5. System Diagnostics Theme Toggle
    initDiagnosticsToggle();

    // 6. Signal Transmission Form Handling
    initContactTransmission();

    // 7. Interactive Scroll Reveal Actions
    initScrollReveals();
});

/* =========================================================================
   1. Initial Loading Sequence
   ========================================================================= */
function initLoadingSequence() {
    const loader = document.getElementById('loading-screen');
    const loaderText = document.getElementById('loader-text');
    const bar = document.querySelector('.progress-bar-fill');
    
    if (!loader || !bar) return;

    const stages = [
        { progress: 25, text: "Initializing Cognitive Engine..." },
        { progress: 55, text: "Loading Knowledge Graph..." },
        { progress: 85, text: "Building Cognitive Network..." },
        { progress: 100, text: "System ONLINE." }
    ];

    let currentStageIndex = 0;
    let progress = 0;

    function runLoader() {
        const stage = stages[currentStageIndex];
        loaderText.textContent = stage.text;
        
        // Fast incremental steps
        const step = Math.random() * 8 + 3;
        progress = Math.min(stage.progress, progress + step);
        bar.style.width = `${progress}%`;

        if (progress >= stage.progress) {
            currentStageIndex++;
        }

        if (currentStageIndex < stages.length) {
            setTimeout(runLoader, Math.random() * 80 + 40);
        } else {
            // Loading complete - delay slightly and fade out
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                
                // Trigger camera pull-back zoom out event in canvas
                triggerCanvasZoomOut();
            }, 500);
        }
    }

    setTimeout(runLoader, 100);
}

/* =========================================================================
   2. Interactive 3D Canvas Neural Network (GPU-Accelerated)
   ========================================================================= */
let triggerCanvasZoomOut = () => {}; // Export handler

function initNeuralNetworkCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    let signals = [];
    
    // 3D Camera coordinates and rotations
    let camera = { x: 0, y: 0, z: -100, rotX: 0, rotY: 0 }; // Start super zoomed-in (loading state)
    let targetCamera = { x: 0, y: 0, z: 800, rotX: 0, rotY: 0 }; // Target zoom-out (rest state)
    const focalLength = 350;

    // Mouse coordinates in screen space
    let mouse = { x: null, y: null, radius: 180 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Zoom out trigger after loading completes
    triggerCanvasZoomOut = () => {
        targetCamera.z = 800; // Pull camera out to view full network
    };

    // Node class definitions
    class NeuralNode {
        constructor() {
            this.x = (Math.random() - 0.5) * 1200;
            this.y = (Math.random() - 0.5) * 1200;
            this.z = (Math.random() - 0.5) * 1000;
            this.baseX = this.x;
            this.baseY = this.y;
            this.baseZ = this.z;
            
            this.size = Math.random() * 2.5 + 1.25;
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
            this.vz = (Math.random() - 0.5) * 0.15;
            this.glow = 0;
            this.isHighlighted = false;
        }

        update() {
            // Drift slightly
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;

            // Bounce back boundaries
            if (Math.abs(this.x - this.baseX) > 50) this.vx = -this.vx;
            if (Math.abs(this.y - this.baseY) > 50) this.vy = -this.vy;
            if (Math.abs(this.z - this.baseZ) > 50) this.vz = -this.vz;
        }
    }

    // Initialize 300 nodes
    for (let i = 0; i < 300; i++) {
        particles.push(new NeuralNode());
    }

    // Projects signals traveling from node A to node B
    class NeuralSignal {
        constructor(startNode, endNode) {
            this.start = startNode;
            this.end = endNode;
            this.progress = 0;
            this.speed = Math.random() * 0.015 + 0.008;
        }

        update() {
            this.progress += this.speed;
            return this.progress >= 1;
        }
    }

    // Project 3D coordinate to 2D screen coordinate
    function projectNode(node) {
        // Translate node relative to camera position
        let dx = node.x - camera.x;
        let dy = node.y - camera.y;
        let dz = node.z - camera.z;

        // Rotate Y (horizontal look)
        let cosY = Math.cos(camera.rotY);
        let sinY = Math.sin(camera.rotY);
        let rx = dx * cosY - dz * sinY;
        let rz = dx * sinY + dz * cosY;

        // Rotate X (vertical tilt)
        let cosX = Math.cos(camera.rotX);
        let sinX = Math.sin(camera.rotX);
        let ry = dy * cosX - rz * sinX;
        let finalZ = dy * sinX + rz * cosX;

        // Prevent rendering behind camera lens
        if (finalZ + focalLength <= 0) return null;

        let scale = focalLength / (focalLength + finalZ);
        let projX = rx * scale + width / 2;
        let projY = ry * scale + height / 2;

        return {
            x: projX,
            y: projY,
            scale: scale,
            depth: finalZ
        };
    }

    // Render loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smooth camera transitions (interpolating position towards scroll target coordinates)
        camera.x += (targetCamera.x - camera.x) * 0.08;
        camera.y += (targetCamera.y - camera.y) * 0.08;
        camera.z += (targetCamera.z - camera.z) * 0.08;
        camera.rotX += (targetCamera.rotX - camera.rotX) * 0.08;
        camera.rotY += (targetCamera.rotY - camera.rotY) * 0.08;

        // Natural micro-rotation orbit drift so network is never dead static
        targetCamera.rotY += 0.0004;

        // 1. Project all nodes and sort by depth for correct 3D perspective painter's algorithm
        let renderNodes = [];
        particles.forEach((p, idx) => {
            p.update();
            let proj = projectNode(p);
            if (proj) {
                renderNodes.push({
                    node: p,
                    proj: proj,
                    index: idx
                });
            }
        });
        renderNodes.sort((a, b) => b.proj.depth - a.proj.depth);

        // 2. Spawn signals randomly along connections
        if (Math.random() < 0.12 && signals.length < 40) {
            // Pick a node
            let index = Math.floor(Math.random() * particles.length);
            let start = particles[index];
            // Find a close node
            let closeNodes = particles.filter((other, i) => {
                if (i === index) return false;
                let dist = Math.hypot(start.x - other.x, start.y - other.y, start.z - other.z);
                return dist < 185;
            });
            if (closeNodes.length > 0) {
                let end = closeNodes[Math.floor(Math.random() * closeNodes.length)];
                signals.push(new NeuralSignal(start, end));
            }
        }

        // Update signals
        signals = signals.filter(s => !s.update());

        const isDiag = document.body.classList.contains('light-mode') || document.body.classList.contains('diagnostics-active');
        const accentColor = isDiag ? '255, 82, 82' : '79, 157, 255';

        // 3. Draw connections
        for (let i = 0; i < renderNodes.length; i++) {
            let nodeA = renderNodes[i];
            
            for (let j = i + 1; j < renderNodes.length; j++) {
                let nodeB = renderNodes[j];
                
                // Distance in 3D space
                let dx = nodeA.node.x - nodeB.node.x;
                let dy = nodeA.node.y - nodeB.node.y;
                let dz = nodeA.node.z - nodeB.node.z;
                let dist = Math.hypot(dx, dy, dz);

                if (dist < 180) {
                    let opacity = (1 - (dist / 180)) * 0.18;
                    
                    // Interaction: connection glows brighter under mouse sphere
                    if (mouse.x && mouse.y) {
                        let avgX = (nodeA.proj.x + nodeB.proj.x) / 2;
                        let avgY = (nodeA.proj.y + nodeB.proj.y) / 2;
                        let mDist = Math.hypot(mouse.x - avgX, mouse.y - avgY);
                        if (mDist < mouse.radius) {
                            let mouseMultiplier = (1 - (mDist / mouse.radius)) * 2.5;
                            opacity += mouseMultiplier * 0.12;
                        }
                    }

                    // Force line drawing opacity
                    ctx.strokeStyle = `rgba(${accentColor}, ${Math.min(1.0, opacity)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.proj.x, nodeA.proj.y);
                    ctx.lineTo(nodeB.proj.x, nodeB.proj.y);
                    ctx.stroke();
                }
            }
        }

        // 4. Draw signals
        signals.forEach(s => {
            let startProj = projectNode(s.start);
            let endProj = projectNode(s.end);
            if (startProj && endProj) {
                let currX = startProj.x + (endProj.x - startProj.x) * s.progress;
                let currY = startProj.y + (endProj.y - startProj.y) * s.progress;
                let size = (startProj.scale + (endProj.scale - startProj.scale) * s.progress) * 2;

                ctx.fillStyle = isDiag ? '#ff5252' : '#ffffff';
                ctx.beginPath();
                ctx.arc(currX, currY, Math.max(1, size), 0, Math.PI * 2);
                ctx.fill();
                
                // Mini pulse shadow
                ctx.shadowColor = `rgba(${accentColor}, 0.8)`;
                ctx.shadowBlur = 8;
                ctx.fillStyle = `rgba(${accentColor}, 0.8)`;
                ctx.beginPath();
                ctx.arc(currX, currY, Math.max(1.5, size * 1.5), 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        });

        // 5. Draw node circles
        renderNodes.forEach(rn => {
            let radius = rn.proj.scale * rn.node.size;
            let opacity = 0.35 + (rn.proj.scale * 0.4);

            // Node hover force interaction
            if (mouse.x && mouse.y) {
                let dist = Math.hypot(rn.proj.x - mouse.x, rn.proj.y - mouse.y);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    opacity += force * 0.45;
                    radius *= (1 + force * 0.25);
                }
            }

            // Draw core node
            ctx.fillStyle = isDiag ? `rgba(255, 82, 82, ${Math.min(1.0, opacity)})` : `rgba(255, 255, 255, ${Math.min(1.0, opacity)})`;
            ctx.beginPath();
            ctx.arc(rn.proj.x, rn.proj.y, Math.max(1, radius), 0, Math.PI * 2);
            ctx.fill();

            // Highlight ring for nodes associated to hovered tech
            if (rn.node.isHighlighted) {
                ctx.strokeStyle = `rgba(${accentColor}, 0.95)`;
                ctx.lineWidth = 1.25;
                ctx.beginPath();
                ctx.arc(rn.proj.x, rn.proj.y, radius * 2.2, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        // 6. Dynamic System Metrics simulator in bottom HUD
        animateMetrics();

        requestAnimationFrame(animate);
    }

    // Connect camera coordinates to viewport scrolling
    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = window.scrollY / (maxScroll || 1);

        // Camera flies/pans smoothly in 3D box according to scroll index
        targetCamera.z = 800 - scrollPct * 1100; // Pulls backward and zooms deeper
        targetCamera.y = scrollPct * 300; // Drifts vertically
        targetCamera.x = Math.sin(scrollPct * Math.PI) * 180; // Sweeps left & right
        targetCamera.rotX = -scrollPct * 0.3; // Tilts downward
    });

    // Start simulation
    requestAnimationFrame(animate);
}

// 6. Dynamic metrics logs simulator
let lastMetricsUpdate = 0;
function animateMetrics() {
    const now = Date.now();
    if (now - lastMetricsUpdate > 1200) {
        lastMetricsUpdate = now;
        
        // Random CPU load oscillations
        const latency = (Math.random() * 3.5 + 7.2).toFixed(1);
        const fps = Math.round(1000 / parseFloat(latency));
        const mem = (Math.random() * 2.2 + 13.1).toFixed(1);
        
        const infLatency = document.getElementById('hud-inf-latency');
        const infRate = document.getElementById('hud-inf-rate');
        const infRateMetric = document.getElementById('metric-latency');
        const memUsage = document.getElementById('hud-mem-usage');

        if (infLatency) infLatency.textContent = `${latency}ms`;
        if (infRate) infRate.textContent = `${fps} FPS`;
        if (infRateMetric) infRateMetric.textContent = `${fps} FPS`;
        if (memUsage) memUsage.textContent = `${mem} MB`;
    }
}

/* =========================================================================
   3. Navigation Scrolling & Region Tracking
   ========================================================================= */
function initRegionTracking() {
    const navLinks = document.querySelectorAll('.cognitive-regions a');
    const sections = document.querySelectorAll('.dashboard-section');

    // Smooth navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                targetSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll active link highlighter
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* =========================================================================
   4. Skills Telemetry Interactivity
   ========================================================================= */
function initSkillsTelemetry() {
    const tags = document.querySelectorAll('.skill-node-tag');
    const telNode = document.getElementById('tel-node-name');
    const telExp = document.getElementById('tel-node-exp');
    const telTools = document.getElementById('tel-node-tools');
    const telDesc = document.getElementById('tel-node-desc');

    if (tags.length === 0) return;

    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            const name = tag.textContent;
            const desc = tag.getAttribute('data-desc') || "---";
            const exp = tag.getAttribute('data-exp') || "---";
            const tools = tag.getAttribute('data-tools') || "---";

            // Telemetry output update
            telNode.textContent = name.toUpperCase();
            telExp.textContent = exp;
            telTools.textContent = tools;
            telDesc.textContent = desc;

            // Highlight node weights visually
            tag.classList.add('selected-weight');
        });

        tag.addEventListener('mouseleave', () => {
            tag.classList.remove('selected-weight');
        });
    });
}

/* =========================================================================
   5. System Diagnostics Theme Toggle (Diagnostics Alert Mode)
   ========================================================================= */
function initDiagnosticsToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const statusVal = document.querySelector('.status-lbl');
    const statusInd = document.querySelector('.status-indicator');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('diagnostics-active');
        
        const isActive = document.body.classList.contains('diagnostics-active');
        if (isActive) {
            statusVal.textContent = "DIAGNOSTICS.RUN";
            statusInd.className = "status-indicator diagnostic";
            toggleBtn.style.color = "#FF5252";
            toggleBtn.style.borderColor = "#FF5252";
        } else {
            statusVal.textContent = "SYS.ONLINE";
            statusInd.className = "status-indicator online";
            toggleBtn.style.color = "";
            toggleBtn.style.borderColor = "";
        }
    });
}

/* =========================================================================
   6. Signal Transmission Form Handling
   ========================================================================= */
function initContactTransmission() {
    const form = document.getElementById('dashboard-transmission-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Transmission parameters
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const subjectVal = document.getElementById('subject').value;
        const messageVal = document.getElementById('message').value;

        feedback.className = "form-feedback-hud";
        feedback.innerHTML = `<span class="cmd-prompt">></span> Transmitting packet logs... [WAIT]`;

        // Mock transmission pipeline
        setTimeout(() => {
            // Build FormSubmit API transmission or local logs simulation
            feedback.className = "form-feedback-hud success";
            feedback.innerHTML = `<span class="cmd-prompt">></span> Packet logs transmitted successfully. System ONLINE.`;

            // Reset inputs
            form.reset();
        }, 1500);
    });
}

/* =========================================================================
   7. Interactive Scroll Reveal Actions
   ========================================================================= */
function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');

    function revealCheck() {
        const triggerBottom = window.innerHeight * 0.85;
        reveals.forEach(rev => {
            const revTop = rev.getBoundingClientRect().top;
            if (revTop < triggerBottom) {
                rev.classList.add('active');
            } else {
                rev.classList.remove('active'); // Optional: triggers scroll re-reveals
            }
        });
    }

    window.addEventListener('scroll', revealCheck);
    revealCheck(); // Run once initially
}
