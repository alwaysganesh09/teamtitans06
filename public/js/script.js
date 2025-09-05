// Global Application Manager
const App = {
    // Theme Management
    ThemeManager: class {
        constructor() {
            this.theme = localStorage.getItem('theme') || 'dark';
            this.init();
        }

        init() {
            this.applyTheme();
            this.setupToggle();
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme);
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            }
        }

        setupToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        }

        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', this.theme);
            this.applyTheme();
        }
    },

    // Data Storage Manager
    StorageManager: class {
        static get(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            } catch (error) {
                console.error('Error getting data from storage:', error);
                return [];
            }
        }

        static set(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving data to storage:', error);
                return false;
            }
        }

        static generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
    },

    // CRUD Operations Manager
    CRUDManager: class {
        constructor(storageKey) {
            this.storageKey = storageKey;
        }

        getAll() {
            return App.StorageManager.get(this.storageKey);
        }

        getById(id) {
            const items = this.getAll();
            return items.find(item => item.id === id);
        }

        create(data) {
            const items = this.getAll();
            const newItem = {
                id: App.StorageManager.generateId(),
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            items.push(newItem);
            App.StorageManager.set(this.storageKey, items);
            return newItem;
        }

        update(id, data) {
            const items = this.getAll();
            const index = items.findIndex(item => item.id === id);
            if (index !== -1) {
                items[index] = {
                    ...items[index],
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                App.StorageManager.set(this.storageKey, items);
                return items[index];
            }
            return null;
        }

        delete(id) {
            const items = this.getAll();
            const filteredItems = items.filter(item => item.id !== id);
            App.StorageManager.set(this.storageKey, filteredItems);
            return filteredItems.length < items.length;
        }
    },

    // Modal Manager
    ModalManager: class {
        static show(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        static hide(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        static setupCloseHandlers() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.hide(e.target.id);
                }
                if (e.target.classList.contains('modal-close')) {
                    const modal = e.target.closest('.modal');
                    if (modal) {
                        this.hide(modal.id);
                    }
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const activeModal = document.querySelector('.modal.active');
                    if (activeModal) {
                        this.hide(activeModal.id);
                    }
                }
            });
        }
    },

    // Alert Manager
    AlertManager: class {
        static show(message, type = 'info', duration = 5000) {
            const alertContainer = this.getOrCreateContainer();
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <span>${message}</span>
                <button class="alert-close" onclick="this.parentElement.remove()">×</button>
            `;

            alertContainer.appendChild(alert);

            if (duration > 0) {
                setTimeout(() => {
                    if (alert.parentElement) {
                        alert.remove();
                    }
                }, duration);
            }
        }

        static getOrCreateContainer() {
            let container = document.getElementById('alert-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'alert-container';
                container.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 3000;
                    max-width: 400px;
                `;
                document.body.appendChild(container);
            }
            return container;
        }
    },

    // Navigation Manager
    NavigationManager: class {
        static init() {
            this.setupMobileMenu();
            this.setActiveLink();
        }

        static setupMobileMenu() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });

                // Close menu when clicking on a link
                navMenu.addEventListener('click', (e) => {
                    if (e.target.classList.contains('nav-link')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            }
        }

        static setActiveLink() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    },

    // Animation Manager
    AnimationManager: class {
        static animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            counters.forEach(counter => observer.observe(counter));
        }

        static animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);

                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }

        static fadeInOnScroll() {
            const elements = document.querySelectorAll('.card, .feature-card');
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(element);
            });
        }
    },

    // Form Validation
    FormValidator: class {
        static validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        static validateRequired(value) {
            return value && value.trim().length > 0;
        }

        static validateMinLength(value, minLength) {
            return value && value.trim().length >= minLength;
        }

        static validateMaxLength(value, maxLength) {
            return !value || value.trim().length <= maxLength;
        }

        static showFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.borderColor = '#ef4444';
                let errorElement = field.parentElement.querySelector('.field-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'field-error';
                    errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
                    field.parentElement.appendChild(errorElement);
                }
                errorElement.textContent = message;
            }
        }

        static clearFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.borderColor = '';
                const errorElement = field.parentElement.querySelector('.field-error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }

        static clearAllErrors(formId) {
            const form = document.getElementById(formId);
            if (form) {
                const errorElements = form.querySelectorAll('.field-error');
                errorElements.forEach(error => error.remove());

                const fields = form.querySelectorAll('.form-input, .form-textarea, .form-select');
                fields.forEach(field => field.style.borderColor = '');
            }
        }
    },
};


// Loading Manager
class LoadingManager {
    static show() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('active');
        }
    }

    static hide() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    new App.ThemeManager();

    // Initialize navigation
    App.NavigationManager.init();

    // Initialize modals
    App.ModalManager.setupCloseHandlers();

    // Initialize animations
    App.AnimationManager.animateCounters();
    App.AnimationManager.fadeInOnScroll();

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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