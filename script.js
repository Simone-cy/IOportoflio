const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

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

// Inizializza EmailJS
(function() {
    emailjs.init('7buVZM9njzFCLOI73');
    console.log('✅ EmailJS inizializzato');
})();

// Rate limiting: massimo 2 email al giorno
const MAX_EMAILS_PER_DAY = 2;
const RATE_LIMIT_KEY = 'emailRateLimit';

function checkRateLimit() {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    
    // Reset se è un nuovo giorno
    if (storedData.date !== today) {
        storedData.date = today;
        storedData.count = 0;
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(storedData));
    }
    
    return storedData;
}

function incrementEmailCount() {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    storedData.date = today;
    storedData.count = (storedData.count || 0) + 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(storedData));
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Controlla il rate limit
    const rateLimit = checkRateLimit();
    if (rateLimit.count >= MAX_EMAILS_PER_DAY) {
        const remaining = new Date().setHours(23, 59, 59, 999) - new Date();
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        
        alert(`⏱️ Limite raggiunto!\n\nPuoi inviare massimo ${MAX_EMAILS_PER_DAY} messaggi al giorno.\n\nRiprova tra ${hours}h ${minutes}m`);
        return;
    }
    
    // Sanitizza i dati (rimuove eventuali HTML/script)
    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const message = this.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
        alert('Per favore, compila tutti i campi!');
        return;
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Per favore, inserisci un\'email valida!');
        return;
    }

    // Escape HTML per prevenire injections
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Invio in corso...';
    submitButton.disabled = true;

    try {
        // Invia l'email usando EmailJS (i dati sono già sanitizzati)
        const response = await emailjs.send(
            'service_q127bya',           // SERVICE_ID
            'template_3k2rduc',          // TEMPLATE_ID
            {
                from_name: escapeHtml(name),
                from_email: escapeHtml(email),
                message: escapeHtml(message),
                to_email: 'ruggierosimone05@gmail.com'
            }
        );

        if (response.status === 200) {
            // Incrementa il contatore solo se l'email è stata inviata con successo
            incrementEmailCount();
            
            const remaining = MAX_EMAILS_PER_DAY - (rateLimit.count + 1);
            alert(`✅ Messaggio inviato con successo!\n\nSimone riceverà il tuo messaggio e ti contatterà presto.\n\n(${remaining} messaggi rimasti oggi)`);
            contactForm.reset();
        } else {
            alert('❌ Errore nell\'invio. Riprova più tardi.');
        }
    } catch (error) {
        console.error('Errore EmailJS:', error);
        alert('❌ Errore nell\'invio del messaggio. Riprova più tardi.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

document.querySelectorAll('.stat').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.href = 'mailto:ruggierosimone05@gmail.com';
    }
});

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});
