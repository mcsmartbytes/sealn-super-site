// Smooth scrolling for navigation links
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

// Portfolio Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// CAPTCHA functionality
let captchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question, answer;
    
    switch(operation) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            // Ensure positive result
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            question = `${larger} - ${smaller}`;
            answer = larger - smaller;
            break;
        case '×':
            const smallNum1 = Math.floor(Math.random() * 10) + 1;
            const smallNum2 = Math.floor(Math.random() * 10) + 1;
            question = `${smallNum1} × ${smallNum2}`;
            answer = smallNum1 * smallNum2;
            break;
    }
    
    const questionEl = document.getElementById('captcha-question');
    const answerEl = document.getElementById('captcha-answer');
    
    if (questionEl && answerEl) {
        questionEl.textContent = question;
        answerEl.value = answer;
        captchaAnswer = answer;
        
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            captchaInput.value = '';
        }
    }
}

// Input protection - encrypt data as user types
function protectInput(inputElement) {
    if (!inputElement) return;
    
    let originalValue = '';
    let isProtected = false;
    
    console.log('Setting up protection for:', inputElement.id);
    
    inputElement.addEventListener('input', function(e) {
        originalValue = e.target.value;
        // Store encrypted version
        e.target.setAttribute('data-protected', btoa(originalValue));
        console.log('Input protected for:', inputElement.id, 'Length:', originalValue.length);
    });
    
    // Clear visible value after a delay to protect from screen scraping
    inputElement.addEventListener('blur', function(e) {
        setTimeout(() => {
            if (originalValue && originalValue.length > 0 && document.activeElement !== e.target) {
                const placeholder = '•'.repeat(Math.min(originalValue.length, 25));
                e.target.value = placeholder;
                e.target.style.color = '#999';
                e.target.style.letterSpacing = '2px';
                isProtected = true;
                console.log('Input masked for:', inputElement.id);
            }
        }, 2000); // Increased delay to 2 seconds
    });
    
    inputElement.addEventListener('focus', function(e) {
        if (isProtected) {
            const protected = e.target.getAttribute('data-protected');
            if (protected) {
                try {
                    e.target.value = atob(protected);
                    e.target.style.color = '#333';
                    e.target.style.letterSpacing = 'normal';
                    isProtected = false;
                    console.log('Input restored for:', inputElement.id);
                } catch (error) {
                    console.log('Error restoring input:', error);
                }
            }
        }
    });
    
    // Handle form submission - restore original values
    const form = inputElement.closest('form');
    if (form) {
        form.addEventListener('submit', function() {
            if (isProtected) {
                const protected = inputElement.getAttribute('data-protected');
                if (protected) {
                    try {
                        inputElement.value = atob(protected);
                        console.log('Input restored for submission:', inputElement.id);
                    } catch (error) {
                        console.log('Error restoring input for submission:', error);
                    }
                }
            }
        });
    }
}

// Contact alias reveal functionality
function setupContactReveal() {
    const contactAliases = document.querySelectorAll('.contact-alias');
    console.log('Found contact aliases:', contactAliases.length);
    
    contactAliases.forEach((alias, index) => {
        alias.style.cursor = 'pointer';
        alias.style.textDecoration = 'underline';
        alias.style.color = '#ffd700';
        
        alias.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Alias clicked:', index);
            
            const contactItem = this.closest('.contact-item');
            const realContact = contactItem.querySelector('.real-contact');
            const note = contactItem.querySelector('.contact-note');
            
            console.log('Real contact element:', realContact);
            console.log('Note element:', note);
            
            if (realContact && note) {
                // Hide alias and note
                this.style.display = 'none';
                if (note) note.style.display = 'none';
                
                // Show real contact info with animation
                realContact.style.display = 'block';
                realContact.style.opacity = '0';
                realContact.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    realContact.style.opacity = '1';
                }, 50);
                
                console.log('Contact revealed successfully');
            } else {
                console.log('Could not find real contact or note elements');
            }
        });
    });
}

// Anti-bot protection for contact info
function deobfuscateContact() {
    // Decode email addresses
    const emailElements = document.querySelectorAll('[data-email]');
    emailElements.forEach(el => {
        const encoded = el.getAttribute('data-email');
        if (encoded) {
            try {
                const decoded = atob(encoded); // Base64 decode
                el.textContent = decoded;
                if (el.tagName.toLowerCase() === 'a') {
                    el.href = 'mailto:' + decoded;
                }
            } catch (error) {
                console.log('Error decoding email:', error);
            }
        }
    });
    
    // Decode phone numbers
    const phoneElements = document.querySelectorAll('[data-phone]');
    phoneElements.forEach(el => {
        const encoded = el.getAttribute('data-phone');
        if (encoded) {
            try {
                const decoded = encoded.split('').reverse().join('').replace(/[^0-9]/g, '');
                const formatted = decoded.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
                el.textContent = formatted;
                if (el.tagName.toLowerCase() === 'a') {
                    el.href = 'tel:' + decoded.replace(/\./g, '');
                }
            } catch (error) {
                console.log('Error decoding phone:', error);
            }
        }
    });
}

// Contact Form Handling with enhanced security
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }

    let formStartTime = Date.now();
    let formInteractionCount = 0;

    // Track user interactions to detect bots
    contactForm.addEventListener('input', () => {
        formInteractionCount++;
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // CAPTCHA validation
        const captchaInput = document.getElementById('captcha');
        const captchaAnswer = document.getElementById('captcha-answer');
        
        if (captchaInput && captchaAnswer) {
            if (parseInt(captchaInput.value) !== parseInt(captchaAnswer.value)) {
                showNotification('Incorrect security answer. Please try again.', 'error');
                generateCaptcha(); // Generate new CAPTCHA
                return;
            }
        }
        
        // Anti-bot checks
        const timeTaken = Date.now() - formStartTime;
        if (timeTaken < 5000) { // Form filled too quickly (less than 5 seconds)
            showNotification('Please take your time filling out the form.', 'error');
            return;
        }
        
        if (formInteractionCount < 4) { // Too few interactions (including CAPTCHA)
            showNotification('Please fill out all required fields.', 'error');
            return;
        }
        
        // Check honeypot field (invisible to users)
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value !== '') {
            // Bot detected - fail silently
            showNotification('Thank you! We will be in touch soon.', 'success');
            return;
        }
        
        const formData = new FormData(contactForm);
        
        // Add timestamp for server-side validation
        formData.append('form_timestamp', formStartTime);
        formData.append('interaction_count', formInteractionCount);
        
        try {
            const response = await fetch('/submit_contact', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                showNotification('Thank you! Your inquiry has been submitted successfully. We\'ll contact you soon.', 'success');
                
                // Clear form fields completely
                contactForm.reset();
                
                // Clear any protected data attributes
                const protectedFields = contactForm.querySelectorAll('[data-protected]');
                protectedFields.forEach(field => {
                    field.removeAttribute('data-protected');
                    field.style.color = '#333';
                    field.style.letterSpacing = 'normal';
                    field.value = '';
                });
                
                // Reset anti-bot counters
                formStartTime = Date.now();
                formInteractionCount = 0;
                
                // Generate new CAPTCHA
                generateCaptcha();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            showNotification('There was an error submitting your inquiry. Please try again.', 'error');
            console.error('Form submission error:', error);
        }
    });
}

// Mobile Navigation Menu
function setupMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Service CTA functionality
function setupServiceCTAs() {
    const serviceCTAs = document.querySelectorAll('.service-cta');
    console.log('Found service CTAs:', serviceCTAs.length);
    
    serviceCTAs.forEach((cta, index) => {
        cta.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Service CTA clicked:', index);
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            console.log('Contact section found:', contactSection);
            
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                console.log('Scrolling to contact section...');
                
                // Focus on the service selection dropdown after scroll
                setTimeout(() => {
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        serviceSelect.focus();
                        console.log('Service dropdown focused');
                    }
                }, 1000);
            } else {
                console.log('Contact section not found!');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Seal\'n & Stripe\'n Specialist website loaded');
    
    // First decode contact information
    deobfuscateContact();
    
    // Then setup contact alias reveal after a small delay to ensure decoding is complete
    setTimeout(() => {
        setupContactReveal();
    }, 100);
    
    // Setup other components
    setupContactForm();
    setupServiceCTAs();
    setupMobileNavigation();
    generateCaptcha();
    
    // Apply input protection to sensitive fields
    const sensitiveFields = ['name', 'email', 'phone'];
    sensitiveFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            protectInput(field);
        }
    });
});