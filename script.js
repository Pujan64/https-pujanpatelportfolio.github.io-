// Premium Neural Intelligence Platform Script (2026) - Pujan Patel

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Loading Sequence
    initLoadingSequence();

    // 2. Interactive 3D Living Neural Brain Background (WebGL Canvas)
    initNeuralBrainCanvas();

    // 3. Navigation Scrolling & Thinking Mode Transitions
    initRegionTrackingAndThinking();

    // 4. Skills Telemetry & Knowledge Graph Hookups
    initSkillsTelemetryAndGraph();

    // 5. Command Palette (Ctrl+K) Console
    initCommandPalette();

    // 6. Embedding Space Mapping
    initEmbeddingSpace();

    // 7. System Diagnostics Theme Toggle
    initDiagnosticsToggle();

    // 8. Signal Transmission Form Handling
    initContactTransmission();

    // 9. Interactive Scroll Reveal Actions
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
        { progress: 20, text: "Initializing Cognitive Engine..." },
        { progress: 45, text: "Resolving Synapse Coordinates..." },
        { progress: 75, text: "Loading Knowledge Graph Vectors..." },
        { progress: 90, text: "Calibrating Agent Swarms..." },
        { progress: 100, text: "System ONLINE." }
    ];

    let currentStageIndex = 0;
    let progress = 0;

    function runLoader() {
        const stage = stages[currentStageIndex];
        loaderText.textContent = stage.text;
        
        const step = Math.random() * 12 + 4;
        progress = Math.min(stage.progress, progress + step);
        bar.style.width = `${progress}%`;

        if (progress >= stage.progress) {
            currentStageIndex++;
        }

        if (currentStageIndex < stages.length) {
            setTimeout(runLoader, Math.random() * 60 + 30);
        } else {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                
                // Trigger camera pull-back zoom out event in canvas
                triggerCanvasZoomOut();
            }, 600);
        }
    }

    setTimeout(runLoader, 100);
}

/* =========================================================================
   2. Interactive 3D Living Neural Brain Background (WebGL Canvas)
   ========================================================================= */
let triggerCanvasZoomOut = () => {}; 
let setCanvasHighlightGroup = () => {}; 

function initNeuralBrainCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    let signals = [];
    let swarms = [];
    let highlightClusterId = null;

    // 3D Camera settings
    let camera = { x: 0, y: 0, z: -100, rotX: 0, rotY: 0 }; 
    let targetCamera = { x: 0, y: 0, z: 850, rotX: 0, rotY: 0 }; 
    const focalLength = 380;
    let maxConnectionDist = 180; // Progression scroll dynamic connection limit

    let mouse = { x: null, y: null, radius: 220 };

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

    // Camera pullback trigger
    triggerCanvasZoomOut = () => {
        targetCamera.z = 850;
    };

    // Callback to highlight specific cluster nodes on skill hovers
    setCanvasHighlightGroup = (clusterId) => {
        highlightClusterId = clusterId;
        particles.forEach((p, idx) => {
            // Assign some matching nodes to highlights
            if (clusterId && idx % 3 === 0) {
                p.isHighlighted = true;
            } else {
                p.isHighlighted = false;
            }
        });
    };

    // Node class: Hemisphere brain coordinates mapping
    class NeuralNode {
        constructor(isLeftHemisphere) {
            // Hemisphere clusters
            const centerX = isLeftHemisphere ? -250 : 250;
            this.x = centerX + (Math.random() - 0.5) * 550;
            this.y = (Math.random() - 0.5) * 650;
            this.z = (Math.random() - 0.5) * 600;
            
            this.baseX = this.x;
            this.baseY = this.y;
            this.baseZ = this.z;
            
            this.size = Math.random() * 2 + 1.25;
            this.vx = (Math.random() - 0.5) * 0.12;
            this.vy = (Math.random() - 0.5) * 0.12;
            this.vz = (Math.random() - 0.5) * 0.12;
            
            this.isHighlighted = false;
        }

        update() {
            // Drift slightly
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;

            // Constrain
            if (Math.abs(this.x - this.baseX) > 40) this.vx = -this.vx;
            if (Math.abs(this.y - this.baseY) > 40) this.vy = -this.vy;
            if (Math.abs(this.z - this.baseZ) > 40) this.vz = -this.vz;
        }
    }

    // Populate double-hemisphere nodes
    for (let i = 0; i < 350; i++) {
        particles.push(new NeuralNode(i % 2 === 0));
    }

    // Agent Swarms: Independent micro-satellites
    class SwarmAgent {
        constructor() {
            this.x = (Math.random() - 0.5) * 800;
            this.y = (Math.random() - 0.5) * 800;
            this.z = (Math.random() - 0.5) * 800;
            this.speed = Math.random() * 1.5 + 1.0;
            this.targetNode = this.pickTarget();
            this.trail = [];
        }

        pickTarget() {
            return particles[Math.floor(Math.random() * particles.length)];
        }

        update() {
            // Vector calculation towards node target
            let dx = this.targetNode.x - this.x;
            let dy = this.targetNode.y - this.y;
            let dz = this.targetNode.z - this.z;
            let dist = Math.hypot(dx, dy, dz);

            if (dist < 15) {
                this.targetNode = this.pickTarget();
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
                this.z += (dz / dist) * this.speed;
            }

            // Push trails
            this.trail.push({ x: this.x, y: this.y, z: this.z });
            if (this.trail.length > 8) this.trail.shift();
        }
    }

    // Populate 45 swarm agents
    for (let i = 0; i < 45; i++) {
        swarms.push(new SwarmAgent());
    }

    // Signals along connection lines
    class NeuralSignal {
        constructor(startNode, endNode) {
            this.start = startNode;
            this.end = endNode;
            this.progress = 0;
            this.speed = Math.random() * 0.015 + 0.01;
        }

        update() {
            this.progress += this.speed;
            return this.progress >= 1;
        }
    }

    // 3D Matrix Projection
    function projectNode(node) {
        let dx = node.x - camera.x;
        let dy = node.y - camera.y;
        let dz = node.z - camera.z;

        // Apply Y rotation
        let cosY = Math.cos(camera.rotY);
        let sinY = Math.sin(camera.rotY);
        let rx = dx * cosY - dz * sinY;
        let rz = dx * sinY + dz * cosY;

        // Apply X rotation
        let cosX = Math.cos(camera.rotX);
        let sinX = Math.sin(camera.rotX);
        let ry = dy * cosX - rz * sinX;
        let finalZ = dy * sinX + rz * cosX;

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

    // Main Canvas Render
    function renderCanvas() {
        ctx.clearRect(0, 0, width, height);

        // Lerp camera settings
        camera.x += (targetCamera.x - camera.x) * 0.07;
        camera.y += (targetCamera.y - camera.y) * 0.07;
        camera.z += (targetCamera.z - camera.z) * 0.07;
        camera.rotX += (targetCamera.rotX - camera.rotX) * 0.07;
        camera.rotY += (targetCamera.rotY - camera.rotY) * 0.07;

        // Space drift
        targetCamera.rotY += 0.00035;

        let isDiag = document.body.classList.contains('light-mode') || document.body.classList.contains('diagnostics-active');
        let accentColor = isDiag ? '255, 82, 82' : '79, 157, 255';

        // Project particles
        let renderNodes = [];
        particles.forEach((p, idx) => {
            p.update();
            let proj = projectNode(p);
            if (proj) {
                renderNodes.push({ node: p, proj: proj, index: idx });
            }
        });
        // Sort
        renderNodes.sort((a, b) => b.proj.depth - a.proj.depth);

        // Update swarms
        swarms.forEach(s => s.update());

        // Spawn signals
        if (Math.random() < 0.15 && signals.length < 50) {
            let idx = Math.floor(Math.random() * particles.length);
            let start = particles[idx];
            let close = particles.filter((o, i) => {
                if (i === idx) return false;
                let dist = Math.hypot(start.x - o.x, start.y - o.y, start.z - o.z);
                return dist < maxConnectionDist;
            });
            if (close.length > 0) {
                let end = close[Math.floor(Math.random() * close.length)];
                signals.push(new NeuralSignal(start, end));
            }
        }
        signals = signals.filter(s => !s.update());

        // 1. Render Connections
        for (let i = 0; i < renderNodes.length; i++) {
            let nA = renderNodes[i];
            for (let j = i + 1; j < renderNodes.length; j++) {
                let nB = renderNodes[j];
                let dist = Math.hypot(nA.node.x - nB.node.x, nA.node.y - nB.node.y, nA.node.z - nB.node.z);

                if (dist < maxConnectionDist) {
                    let opacity = (1 - (dist / maxConnectionDist)) * 0.18;

                    // Mouse proximity glow multiplier
                    if (mouse.x && mouse.y) {
                        let avgX = (nA.proj.x + nB.proj.x) / 2;
                        let avgY = (nA.proj.y + nB.proj.y) / 2;
                        let mDist = Math.hypot(mouse.x - avgX, mouse.y - avgY);
                        if (mDist < mouse.radius) {
                            opacity += (1 - (mDist / mouse.radius)) * 0.2;
                        }
                    }

                    // Highlight connections if node is part of highlighted skill weights
                    if (nA.node.isHighlighted && nB.node.isHighlighted) {
                        opacity *= 2.5;
                    }

                    ctx.strokeStyle = `rgba(${accentColor}, ${Math.min(1.0, opacity)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nA.proj.x, nA.proj.y);
                    ctx.lineTo(nB.proj.x, nB.proj.y);
                    ctx.stroke();
                }
            }
        }

        // 2. Render Active Skill Graph lines (Projecting lines from cursor/tag to highlighted nodes)
        if (highlightClusterId && mouse.x && mouse.y) {
            renderNodes.forEach(rn => {
                if (rn.node.isHighlighted) {
                    let dist = Math.hypot(mouse.x - rn.proj.x, mouse.y - rn.proj.y);
                    if (dist < 400) {
                        ctx.strokeStyle = `rgba(${accentColor}, ${(1 - (dist / 400)) * 0.35})`;
                        ctx.lineWidth = 0.75;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(rn.proj.x, rn.proj.y);
                        ctx.stroke();
                    }
                }
            });
        }

        // 3. Render Neural Signals
        signals.forEach(s => {
            let startProj = projectNode(s.start);
            let endProj = projectNode(s.end);
            if (startProj && endProj) {
                let x = startProj.x + (endProj.x - startProj.x) * s.progress;
                let y = startProj.y + (endProj.y - startProj.y) * s.progress;
                let size = (startProj.scale + (endProj.scale - startProj.scale) * s.progress) * 2;

                ctx.fillStyle = isDiag ? '#ff5252' : '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, Math.max(1, size), 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowColor = `rgba(${accentColor}, 0.8)`;
                ctx.shadowBlur = 8;
                ctx.fillStyle = `rgba(${accentColor}, 0.8)`;
                ctx.beginPath();
                ctx.arc(x, y, Math.max(1.5, size * 1.5), 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        // 4. Render Agent Swarms
        swarms.forEach(s => {
            // Draw trail connecting projected coordinates
            ctx.strokeStyle = `rgba(${accentColor}, 0.25)`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            let first = true;
            s.trail.forEach(pt => {
                let proj = projectNode(pt);
                if (proj) {
                    if (first) {
                        ctx.moveTo(proj.x, proj.y);
                        first = false;
                    } else {
                        ctx.lineTo(proj.x, proj.y);
                    }
                }
            });
            ctx.stroke();

            // Head node
            let headProj = projectNode(s);
            if (headProj) {
                ctx.fillStyle = isDiag ? '#ff5252' : '#ffffff';
                ctx.beginPath();
                ctx.arc(headProj.x, headProj.y, headProj.scale * 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // 5. Render Node cores
        renderNodes.forEach(rn => {
            let radius = rn.proj.scale * rn.node.size;
            let opacity = 0.35 + (rn.proj.scale * 0.4);

            if (mouse.x && mouse.y) {
                let dist = Math.hypot(rn.proj.x - mouse.x, rn.proj.y - mouse.y);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    opacity += force * 0.45;
                    radius *= (1 + force * 0.25);
                }
            }

            ctx.fillStyle = isDiag ? `rgba(255, 82, 82, ${Math.min(1.0, opacity)})` : `rgba(255, 255, 255, ${Math.min(1.0, opacity)})`;
            ctx.beginPath();
            ctx.arc(rn.proj.x, rn.proj.y, Math.max(1, radius), 0, Math.PI * 2);
            ctx.fill();

            // Active weight node ring
            if (rn.node.isHighlighted) {
                ctx.strokeStyle = `rgba(${accentColor}, 0.95)`;
                ctx.lineWidth = 1.25;
                ctx.beginPath();
                ctx.arc(rn.proj.x, rn.proj.y, radius * 2.2, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        animateMetrics();
        requestAnimationFrame(renderCanvas);
    }

    // Scroll mapping linking camera & Neural Progression density
    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = window.scrollY / (maxScroll || 1);

        targetCamera.z = 850 - scrollPct * 1150;
        targetCamera.y = scrollPct * 320;
        targetCamera.x = Math.sin(scrollPct * Math.PI) * 200;
        targetCamera.rotX = -scrollPct * 0.32;

        // Neural Progression: connections density grows as visitor explores deeper
        maxConnectionDist = 180 + scrollPct * 90;
    });

    requestAnimationFrame(renderCanvas);
}

/* =========================================================================
   3. Navigation Scrolling & Thinking Mode Transitions
   ========================================================================= */
function initRegionTrackingAndThinking() {
    const navLinks = document.querySelectorAll('.cognitive-regions a');
    const sections = document.querySelectorAll('.dashboard-section');
    const overlay = document.getElementById('thinking-overlay');
    const logs = document.getElementById('thinking-logs');

    if (!overlay || !logs) return;

    // AI Thinking Console Lines Types
    function triggerThinkingTransition(targetId, label) {
        overlay.classList.add('active');
        
        logs.innerHTML = `
            <div>> INITIATING DYNAMIC MEMORY SECTOR SWEEP...</div>
            <div class="thinking-delay-1">> RESOLVING SPATIAL VECTORS FOR [${label.toUpperCase()}]...</div>
            <div class="thinking-delay-2">> ALIGNING HEMISPHERIC WEIGHTS...</div>
            <div class="thinking-delay-3">> SECTOR ACCESS STABILIZED.</div>
        `;

        // 750ms console calculation timeout, then scroll
        setTimeout(() => {
            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                targetSec.scrollIntoView({ behavior: 'auto' });
            }
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 250);
        }, 750);
    }

    // Attach click triggers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const label = link.textContent;
            triggerThinkingTransition(targetId, label);
        });
    });

    // Highlights navigation item on scroll
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

    // Export thinking function for use in command palette
    window.triggerThinkingTransition = triggerThinkingTransition;
}

/* =========================================================================
   4. Skills Telemetry & Knowledge Graph Hookups
   ========================================================================= */
function initSkillsTelemetryAndGraph() {
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

            telNode.textContent = name.toUpperCase();
            telExp.textContent = exp;
            telTools.textContent = tools;
            telDesc.textContent = desc;

            tag.classList.add('selected-weight');

            // Draw line vectors from mouse cursor to highlight specific nodes
            const clusterType = tag.parentElement.parentElement.getAttribute('data-cluster');
            setCanvasHighlightGroup(clusterType);
        });

        tag.addEventListener('mouseleave', () => {
            tag.classList.remove('selected-weight');
            // Remove canvas highlights
            setCanvasHighlightGroup(null);
        });
    });
}

/* =========================================================================
   5. Command Palette Console (Ctrl+K)
   ========================================================================= */
function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const search = document.getElementById('palette-search');
    const results = document.getElementById('palette-results');
    const trigger = document.getElementById('palette-trigger');

    if (!palette || !search || !results) return;

    // Search Database
    const commands = [
        { title: "System Identity (Perception)", target: "#hero", category: "Region" },
        { title: "System Profile (Memory)", target: "#profile", category: "Region" },
        { title: "Core Expertise (Reasoning)", target: "#expertise", category: "Region" },
        { title: "Technical Capabilities (Skills)", target: "#expertise", category: "Console" },
        { title: "Active Pathways (Projects)", target: "#projects", category: "Region" },
        { title: "Project: FocusVision Reticle", target: "#projects", category: "Pathway" },
        { title: "Project: License Plate ANPR", target: "#projects", category: "Pathway" },
        { title: "Project: Traffic Tracker", target: "#projects", category: "Pathway" },
        { title: "Project: Mask Detector", target: "#projects", category: "Pathway" },
        { title: "Project Embedding Space Map", target: "#projects", category: "Mapping" },
        { title: "Experience Timeline (Memory Formation)", target: "#experience", category: "Region" },
        { title: "Achievements & Credentials", target: "#achievements", category: "Region" },
        { title: "Transmission Control (Contact)", target: "#contact", category: "Region" },
    ];

    let highlightedIndex = 0;
    let filteredList = [];

    // Trigger overlay
    function openPalette() {
        palette.classList.add('active');
        search.value = "";
        search.focus();
        renderResults("");
    }

    function closePalette() {
        palette.classList.remove('active');
    }

    if (trigger) {
        trigger.addEventListener('click', openPalette);
    }

    // Ctrl+K key binding
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openPalette();
        }
        if (e.key === 'Escape') {
            closePalette();
        }
    });

    // Close on backdrop clicking
    palette.addEventListener('click', (e) => {
        if (e.target === palette) {
            closePalette();
        }
    });

    // Keyboard list indexing (Up, Down, Enter)
    search.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('.palette-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = (highlightedIndex + 1) % items.length;
            updateItemSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
            updateItemSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const activeItem = items[highlightedIndex];
            if (activeItem) {
                const target = activeItem.getAttribute('data-target');
                const title = activeItem.querySelector('.item-title').textContent;
                closePalette();
                if (window.triggerThinkingTransition) {
                    window.triggerThinkingTransition(target, title);
                } else {
                    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    search.addEventListener('input', () => {
        renderResults(search.value);
    });

    function renderResults(query) {
        results.innerHTML = "";
        highlightedIndex = 0;
        filteredList = commands.filter(cmd => 
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredList.length === 0) {
            results.innerHTML = `<li class="palette-item" style="cursor:default; opacity:0.5;">No node matches found</li>`;
            return;
        }

        filteredList.forEach((cmd, idx) => {
            const li = document.createElement('li');
            li.className = `palette-item ${idx === 0 ? 'active-item' : ''}`;
            li.setAttribute('data-target', cmd.target);
            li.innerHTML = `
                <span class="item-title">${cmd.title}</span>
                <span class="item-category">${cmd.category}</span>
            `;
            li.addEventListener('click', () => {
                closePalette();
                if (window.triggerThinkingTransition) {
                    window.triggerThinkingTransition(cmd.target, cmd.title);
                } else {
                    document.querySelector(cmd.target).scrollIntoView({ behavior: 'smooth' });
                }
            });
            results.appendChild(li);
        });
    }

    function updateItemSelection(items) {
        items.forEach((item, idx) => {
            if (idx === highlightedIndex) {
                item.classList.add('active-item');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active-item');
            }
        });
    }
}

/* =========================================================================
   6. Embedding Space Mapping
   ========================================================================= */
function initEmbeddingSpace() {
    const nodes = document.querySelectorAll('.embedding-vector-node');
    const pathways = document.querySelectorAll('.project-pathway');

    if (nodes.length === 0) return;

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const pId = node.getAttribute('data-project');
            node.classList.add('active-vector');

            // Find and highlight corresponding project pathway
            pathways.forEach(p => {
                if (p.getAttribute('data-project') === pId) {
                    p.style.borderColor = 'var(--accent-primary)';
                    p.style.background = 'rgba(79, 157, 255, 0.05)';
                    p.style.boxShadow = '0 0 15px rgba(79, 157, 255, 0.15)';
                }
            });
        });

        node.addEventListener('mouseleave', () => {
            const pId = node.getAttribute('data-project');
            node.classList.remove('active-vector');

            pathways.forEach(p => {
                if (p.getAttribute('data-project') === pId) {
                    p.style.borderColor = '';
                    p.style.background = '';
                    p.style.boxShadow = '';
                }
            });
        });

        // Clicking vector flies directly to project section
        node.addEventListener('click', () => {
            const pId = node.getAttribute('data-project');
            const pathway = document.querySelector(`.project-pathway[data-project="${pId}"]`);
            if (pathway) {
                pathway.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Double pulse trigger
                pathway.style.transform = 'scale(1.02)';
                setTimeout(() => { pathway.style.transform = ''; }, 300);
            }
        });
    });

    // Hover clusters lights up groups
    const clusters = document.querySelectorAll('.embedding-cluster-indicator');
    clusters.forEach(c => {
        c.addEventListener('mouseenter', () => {
            const group = c.getAttribute('data-group');
            if (group === 'cv') {
                nodes.forEach(n => {
                    const p = n.getAttribute('data-project');
                    if (['anpr', 'traffic', 'focusvision', 'mask'].includes(p)) {
                        n.classList.add('active-vector');
                    }
                });
            } else if (group === 'web') {
                nodes.forEach(n => {
                    const p = n.getAttribute('data-project');
                    if (['finance', 'utility'].includes(p)) {
                        n.classList.add('active-vector');
                    }
                });
            }
        });

        c.addEventListener('mouseleave', () => {
            nodes.forEach(n => n.classList.remove('active-vector'));
        });
    });
}

/* =========================================================================
   7. System Diagnostics Theme Toggle (Diagnostics Alert Mode)
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
   8. Signal Transmission Form Handling
   ========================================================================= */
function initContactTransmission() {
    const form = document.getElementById('dashboard-transmission-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        feedback.className = "form-feedback-hud";
        feedback.innerHTML = `<span class="cmd-prompt">></span> Transmitting packet logs... [WAIT]`;

        setTimeout(() => {
            feedback.className = "form-feedback-hud success";
            feedback.innerHTML = `<span class="cmd-prompt">></span> Packet logs transmitted successfully. System ONLINE.`;
            form.reset();
        }, 1500);
    });
}

/* =========================================================================
   9. Interactive Scroll Reveal Actions
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
                rev.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', revealCheck);
    revealCheck();
}
