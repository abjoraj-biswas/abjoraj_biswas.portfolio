document.addEventListener('DOMContentLoaded', () => {
    // --- Plaid Loading Effect ---
    const plaidCanvas = document.getElementById("plaid-canvas");
    if (plaidCanvas) {
        const pCtx = plaidCanvas.getContext("2d");
        let pWidth = plaidCanvas.width = window.innerWidth;
        let pHeight = plaidCanvas.height = window.innerHeight;
        
        const stars = [];
        const numStars = 400;
        let speed = 25; // Ludicrous speed
        
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * pWidth - pWidth / 2,
                y: Math.random() * pHeight - pHeight / 2,
                z: Math.random() * 1000,
                pz: Math.random() * 1000
            });
        }
        
        document.body.style.overflow = 'hidden';
        
        let plaidFrame;
        function drawPlaid() {
            pCtx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Fade effect for light trails
            pCtx.fillRect(0, 0, pWidth, pHeight);
            
            const cx = pWidth / 2;
            const cy = pHeight / 2;
            
            for (let i = 0; i < numStars; i++) {
                const star = stars[i];
                star.z -= speed;
                
                if (star.z < 1) {
                    star.z = 1000;
                    star.pz = 1000;
                    star.x = Math.random() * pWidth - pWidth / 2;
                    star.y = Math.random() * pHeight - pHeight / 2;
                }
                
                const sx = (star.x / star.z) * 500 + cx;
                const sy = (star.y / star.z) * 500 + cy;
                
                const px = (star.x / star.pz) * 500 + cx;
                const py = (star.y / star.pz) * 500 + cy;
                
                star.pz = star.z;
                
                // Color ranging between blue and purple, turning white as speed drops
                const dist = Math.sqrt(star.x*star.x + star.y*star.y);
                let hue = (dist % 60) + 200; 
                let sat = (speed / 25) * 100;
                let light = 100 - ((speed / 25) * 30);
                
                pCtx.beginPath();
                pCtx.moveTo(px, py);
                pCtx.lineTo(sx, sy);
                pCtx.lineWidth = (1000 - star.z) / 400; // Thinner lines
                pCtx.strokeStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
                pCtx.stroke();
            }
            
            plaidFrame = requestAnimationFrame(drawPlaid);
        }
        drawPlaid();
        
        window.addEventListener("resize", () => {
            pWidth = plaidCanvas.width = window.innerWidth;
            pHeight = plaidCanvas.height = window.innerHeight;
        });
        
        // Sequence: Run fast -> decelerate to 0 (turning white) -> dissolve -> show content
        setTimeout(() => {
            // Decelerate the speed over 1 second
            let slowDownInterval = setInterval(() => {
                speed -= 1;
                if (speed <= 0) {
                    speed = 0;
                    clearInterval(slowDownInterval);
                }
            }, 40);

            // Once speed is 0 (after 1s), start dissolving the loader to reveal the neural background
            setTimeout(() => {
                document.body.classList.add('loaded');
                document.body.style.overflow = '';
                
                // After the loader dissolves (1.5s), fade in the main content
                setTimeout(() => {
                    document.body.classList.add('content-loaded');
                    
                    // Cleanup
                    cancelAnimationFrame(plaidFrame);
                    const loader = document.getElementById('plaid-loader');
                    if (loader) loader.remove();
                }, 1500); 
            }, 1000);
        }, 1500); // 1.5 seconds of full speed
    }
    // ----------------------------
    // 1. Fetch GitHub Projects
    const GITHUB_USERNAME = 'abjoraj-biswas';
    const projectsContainer = document.getElementById('github-projects');
    const githubLink = document.getElementById('github-link');

    // 0. Dynamic Typing Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const roles = ["Software Engineer", "AIML Engineer", "Backend Engineer", "Database Engineer", "App Developer", "IOT/Hardware Engineer"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 40 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000); // Start delay
    }

    // 4. Set up Intersection Observer for Apple-style scroll reveal
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    // Observe static elements
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    if (githubLink) {
        githubLink.href = `https://github.com/${GITHUB_USERNAME}`;
    }
    fetchProjects(GITHUB_USERNAME);

    async function fetchProjects(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const repos = await response.json();

            projectsContainer.innerHTML = ''; // clear loading text

            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p class="loading">No public repositories found.</p>';
                return;
            }

            repos.forEach(repo => {
                // Filter out forks if desired, or keep them. Here we keep all.
                const repoCard = document.createElement('div');
                repoCard.className = 'project-card reveal';

                // If repo has no description, provide a fallback
                const description = repo.description || 'No description provided for this repository.';

                // Get primary language
                const language = repo.language ? `<li>${repo.language}</li>` : '';

                // Create homepage link if exists
                const demoLink = repo.homepage
                    ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`
                    : '';

                repoCard.innerHTML = `
                    <div class="project-header">
                        <i class="far fa-folder project-icon"></i>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" title="GitHub Repo"><i class="fab fa-github"></i></a>
                            ${demoLink}
                        </div>
                    </div>
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">${description}</p>
                    <ul class="project-tech-list">
                        ${language}
                        ${repo.stargazers_count > 0 ? `<li><i class="far fa-star"></i> ${repo.stargazers_count}</li>` : ''}
                        ${repo.forks_count > 0 ? `<li><i class="fas fa-code-branch"></i> ${repo.forks_count}</li>` : ''}
                    </ul>
                `;

                projectsContainer.appendChild(repoCard);
                revealObserver.observe(repoCard);

                // 3D Tilt Effect
                repoCard.addEventListener('mousemove', (e) => {
                    const rect = repoCard.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -8;
                    const rotateY = ((x - centerX) / centerX) * 8;

                    repoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });

                repoCard.addEventListener('mouseleave', () => {
                    repoCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                });
            });

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            projectsContainer.innerHTML = '<p class="loading">Error loading projects. Please check your GitHub username.</p>';
        }
    }

    // 2. Add subtle scroll effect for navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.5)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 3. Initialize Lenis for fluid smooth scrolling
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            lerp: 0.06, // Lower value creates a much more fluid, buttery smooth scroll
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: true,
            touchMultiplier: 1.5,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Intercept anchor clicks to use Lenis smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    lenis.scrollTo(targetElement, { offset: -50 });
                }
            });
        });
    }

    // 5. Apple-style hero scale & fade effect
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-image-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // The hero section is now 200vh tall, so we animate over the first window.innerHeight of scroll
        if (scrollY <= window.innerHeight) {
            // Scale up dramatically from 1 to 1.8
            const scale = 1 + (scrollY / window.innerHeight) * 0.8;
            // Fade out completely by the time we scroll 1 window height
            const opacity = 1 - (scrollY / window.innerHeight);

            if (heroContent) {
                // Let the content translate up slightly as it scales and fades
                const translateY = (scrollY / window.innerHeight) * -100;
                heroContent.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                heroContent.style.opacity = Math.max(0, opacity);
            }
            if (heroBg) {
                // Background scales even faster for parallax depth
                const bgScale = 1 + (scrollY / window.innerHeight) * 0.4;
                heroBg.style.transform = `scale(${bgScale})`;
                heroBg.style.opacity = Math.max(0, opacity);
            }
        }
    });

    // 6. Professional Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // Update spotlight on hero image
            if (heroBg) {
                const rect = heroBg.getBoundingClientRect();
                const x = mouseX - rect.left;
                const y = mouseY - rect.top;
                heroBg.style.setProperty('--mouse-x', `${x}px`);
                heroBg.style.setProperty('--mouse-y', `${y}px`);
            }
        });

        // Hide cursor when leaving the window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        // Show cursor when entering the window
        document.addEventListener('mouseenter', () => {
            // Check if it's currently hovering a link so we don't accidentally show the dot when it should be hidden
            if (!document.body.classList.contains('cursor-hover')) {
                cursorDot.style.opacity = '1';
            }
            cursorRing.style.opacity = '1';
        });

        // Ring follows with easing using requestAnimationFrame
        const render = () => {
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 7. Dynamic Animated Background (Canvas Particles/Neural Net)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            // Responsive amount of particles based on screen size
            const numParticles = Math.floor(width * height / 15000);
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 1.5 + 0.5
                });
            }
        }

        function drawCanvas() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges seamlessly
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Draw particle node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Connect close particles with lines (Neural net effect)
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = dx * dx + dy * dy;
                    if (dist < 12000) { // Connect if distance is short enough
                        ctx.globalAlpha = 1 - (dist / 12000);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            requestAnimationFrame(drawCanvas);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        drawCanvas();
    }
    // 8. Adjust timeline central line height
    function updateTimelineLine() {
        const timeline = document.querySelector('.timeline-centered');
        if (timeline) {
            // Progress bar distance (up to the active dot)
            const activeDot = document.querySelector('.timeline-dot-centered.active-dot');
            if (activeDot) {
                const activeItem = activeDot.closest('.timeline-item-centered');
                // Use offsetTop to avoid issues with CSS transforms, scroll positions, or Lenis smooth scroll
                const dotCenterY = activeItem.offsetTop + activeDot.offsetTop + (activeDot.offsetHeight / 2);
                const progressHeight = dotCenterY - 30; // Line starts at top: 30px
                timeline.style.setProperty('--progress-height', `${progressHeight}px`);
            }

            // Total timeline distance (up to the last dot)
            const lastDot = document.querySelector('.timeline-item-centered:last-child .timeline-dot-centered');
            if (lastDot) {
                const lastItem = lastDot.closest('.timeline-item-centered');
                const lastDotCenterY = lastItem.offsetTop + lastDot.offsetTop + (lastDot.offsetHeight / 2);
                const totalHeight = lastDotCenterY - 30;
                timeline.style.setProperty('--total-height', `${totalHeight}px`);
            }
        }
    }
    
    // Use ResizeObserver to detect changes in container height (e.g. image loads)
    const timeline = document.querySelector('.timeline-centered');
    if (timeline) {
        const resizeObserver = new ResizeObserver(() => {
            updateTimelineLine();
        });
        resizeObserver.observe(timeline);
    }

    setTimeout(updateTimelineLine, 100);
    window.addEventListener('load', updateTimelineLine);
    window.addEventListener('resize', updateTimelineLine);
});
