// Manor Page JavaScript

// Adjust parchment height based on content
function adjustParchmentHeight() {
    const parchments = document.querySelectorAll('#parchment, #parchment-second');
    parchments.forEach(parchment => {
        if (parchment) {
            const content = parchment.scrollHeight;
            
            // Ensure minimum height but allow content to determine actual height
            if (content > parchment.offsetHeight) {
                parchment.style.minHeight = content + 'px';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Run parchment height adjustment
    adjustParchmentHeight();
    
    // Fade in animation for parchments with authentic aging effect
    const firstParchment = document.querySelector('#parchment');
    const secondParchment = document.querySelector('#parchment-second');
    
    if (firstParchment) {
        firstParchment.style.opacity = '0';
        firstParchment.style.transform = 'rotate(-0.5deg) scale(0.95)';
        
        setTimeout(() => {
            firstParchment.style.transition = 'opacity 1s ease, transform 1s ease';
            firstParchment.style.opacity = '1';
            firstParchment.style.transform = 'rotate(-0.5deg) scale(1)';
        }, 100);
    }
    
    if (secondParchment) {
        secondParchment.style.opacity = '0';
        secondParchment.style.transform = 'rotate(0.8deg) scale(0.95)';
        
        setTimeout(() => {
            secondParchment.style.transition = 'opacity 1s ease, transform 1s ease';
            secondParchment.style.opacity = '1';
            secondParchment.style.transform = 'rotate(0.8deg) scale(1)';
        }, 400);
    }

    // Staggered animation for story sections
    const storyElements = document.querySelectorAll('.story-continuation, .story-main');
    storyElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });

    // Parallax effect for background (desktop only)
    let ticking = false;
    
    function updateParallax() {
        // Only apply parallax on desktop (screens larger than 768px)
        if (window.innerWidth <= 768) {
            return;
        }
        
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.runes-image img, .portrait img');
        
        parallaxElements.forEach(element => {
            const speed = 0.3; // Reduced speed for subtlety
            const yPos = -(scrolled * speed);
            const rotation = element.parentElement.classList.contains('portrait') ? '0.5deg' : '-2deg';
            element.style.transform = `translateY(${yPos}px) rotate(${rotation})`;
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Throttle scroll events
    window.addEventListener('scroll', requestTick);
    
    // Reset transforms on window resize to handle orientation changes
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            const parallaxElements = document.querySelectorAll('.runes-image img, .portrait img');
            parallaxElements.forEach(element => {
                const rotation = element.parentElement.classList.contains('portrait') ? '0.5deg' : '-2deg';
                element.style.transform = `rotate(${rotation})`;
            });
        }
    });
    
    // Run parchment height adjustment on window resize
    window.addEventListener('resize', adjustParchmentHeight);

    // Add subtle hover effects to images
    const images = document.querySelectorAll('.portrait img, .runes-image img, .welcome-image img, .final-image img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.02)') || 'scale(1.02)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace('scale(1.02)', 'scale(1)');
            this.style.boxShadow = '';
        });
    });

    // Add typing effect to the welcome title
    const welcomeTitle = document.querySelector('.welcome-container h1');
    if (welcomeTitle) {
        const text = welcomeTitle.textContent;
        welcomeTitle.textContent = '';
        welcomeTitle.style.opacity = '1';
        
        let index = 0;
        function typeWriter() {
            if (index < text.length) {
                welcomeTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 80);
            }
        }
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(welcomeTitle);
    }

    // Add ink blot effects randomly
    function addInkBlots() {
        const textElements = document.querySelectorAll('.letter-content p, .story-text p');
        textElements.forEach(element => {
            if (Math.random() < 0.3) { // 30% chance
                const inkBlot = document.createElement('span');
                inkBlot.className = 'ink-blot';
                inkBlot.style.cssText = `
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    background: rgba(139,69,19,0.4);
                    border-radius: 50%;
                    margin: 0 2px;
                    vertical-align: middle;
                `;
                
                // Add to random position in text
                const textNodes = element.childNodes;
                if (textNodes.length > 0) {
                    const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
                    if (randomNode.nodeType === Node.TEXT_NODE && randomNode.textContent.length > 20) {
                        const text = randomNode.textContent;
                        const splitPoint = Math.floor(text.length * 0.7) + Math.floor(Math.random() * (text.length * 0.2));
                        
                        const before = text.substring(0, splitPoint);
                        const after = text.substring(splitPoint);
                        
                        randomNode.textContent = before;
                        randomNode.parentNode.insertBefore(inkBlot, randomNode.nextSibling);
                        randomNode.parentNode.insertBefore(document.createTextNode(after), inkBlot.nextSibling);
                    }
                }
            }
        });
    }

    // Add ink blots after a delay
    setTimeout(addInkBlots, 2000);

    // Smooth scroll for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});