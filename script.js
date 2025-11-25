 // Simple authentication system using objects
        const users = {
            clients: {},
            partners: {},
            companies: {}
        };

        // Services storage
        let services = [
            {
                id: 1,
                icon: 'fa-laptop-code',
                title: 'Web Development',
                description: 'Professional web development services including frontend, backend, and full-stack solutions.',
                provider: 'TechSolutions Inc.'
            },
            {
                id: 2,
                icon: 'fa-mobile-alt',
                title: 'Mobile App Development',
                description: 'Native and cross-platform mobile application development for iOS and Android.',
                provider: 'AppMasters Ltd.'
            },
            {
                id: 3,
                icon: 'fa-paint-brush',
                title: 'Graphic Design',
                description: 'Creative design services for branding, marketing materials, and digital assets.',
                provider: 'Creative Minds Studio'
            },
            {
                id: 4,
                icon: 'fa-bullhorn',
                title: 'Digital Marketing',
                description: 'Comprehensive digital marketing strategies including SEO, SEM, and social media marketing.',
                provider: 'Marketing Pros'
            },
            {
                id: 5,
                icon: 'fa-pen-fancy',
                title: 'Content Writing',
                description: 'Professional content creation for websites, blogs, and marketing campaigns.',
                provider: 'WordCraft Writers'
            },
            {
                id: 6,
                icon: 'fa-headset',
                title: 'Customer Support',
                description: '24/7 customer support services with multilingual capabilities.',
                provider: 'Support Heroes'
            }
        ];

        let currentUser = null;
        let serviceIdCounter = services.length + 1;

        // Page navigation
        function showPage(pageId) {
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        // User type selector
        document.querySelectorAll('.user-type-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const parent = this.parentElement;
                parent.querySelectorAll('.user-type-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const formId = parent.closest('form') ? parent.closest('form').id : parent.nextElementSibling.id;
                if (formId === 'loginForm') {
                    document.getElementById('loginUserType').value = this.dataset.type;
                } else if (formId === 'signupForm') {
                    document.getElementById('signupUserType').value = this.dataset.type;
                }
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const userType = document.getElementById('loginUserType').value;
            
            const userGroup = userType + 's';
            
            if (users[userGroup][email] && users[userGroup][email].password === password) {
                currentUser = {
                    email: email,
                    type: userType,
                    ...users[userGroup][email]
                };
                
                alert('Login successful! Welcome to PlacidConcepts.');
                showPage('mainSite');
                loadServices();
            } else {
                alert('Invalid credentials. Please try again or sign up for a new account.');
            }
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const userType = document.getElementById('signupUserType').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            const userGroup = userType + 's';
            
            if (users[userGroup][email]) {
                alert('This email is already registered. Please login instead.');
                return;
            }
            
            users[userGroup][email] = {
                name: name,
                email: email,
                password: password,
                type: userType,
                createdAt: new Date().toISOString()
            };
            
            alert('Account created successfully! Please login to continue.');
            showPage('loginPage');
            
            // Clear form
            document.getElementById('signupForm').reset();
            document.querySelectorAll('#signupPage .user-type-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('#signupPage .user-type-btn[data-type="client"]').classList.add('active');
        });

        // Forgot password form
        document.getElementById('forgotForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('forgotEmail').value;
            let found = false;
            
            for (let userGroup in users) {
                if (users[userGroup][email]) {
                    found = true;
                    break;
                }
            }
            
            if (found) {
                alert('Password reset link has been sent to your email address. Please check your inbox.');
            } else {
                alert('No account found with this email address.');
            }
            
            document.getElementById('forgotForm').reset();
        });

        // Provider registration form
        document.getElementById('providerRegistrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newService = {
                id: serviceIdCounter++,
                icon: getCategoryIcon(document.getElementById('serviceCategory').value),
                title: document.getElementById('serviceTitle').value,
                description: document.getElementById('serviceDescription').value,
                provider: document.getElementById('providerName').value,
                category: document.getElementById('serviceCategory').value,
                email: document.getElementById('providerEmail').value,
                phone: document.getElementById('providerPhone').value,
                website: document.getElementById('providerWebsite').value,
                addedAt: new Date().toISOString()
            };
            
            services.push(newService);
            
            alert('Service registered successfully! Your service is now live in our marketplace.');
            
            document.getElementById('providerRegistrationForm').reset();
            
            loadServices();
            
            document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
        });

        function getCategoryIcon(category) {
            const icons = {
                'Web Development': 'fa-laptop-code',
                'Mobile Development': 'fa-mobile-alt',
                'Graphic Design': 'fa-paint-brush',
                'Digital Marketing': 'fa-bullhorn',
                'Content Writing': 'fa-pen-fancy',
                'Virtual Assistant': 'fa-user-tie',
                'Data Entry': 'fa-keyboard',
                'SEO Services': 'fa-search',
                'Video Production': 'fa-video',
                'Other': 'fa-briefcase'
            };
            return icons[category] || 'fa-briefcase';
        }

        // Load services into swiper
        function loadServices() {
            const container = document.getElementById('servicesContainer');
            container.innerHTML = '';
            
            services.forEach(service => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="service-card">
                        <div class="service-img-placeholder">
                            <i class="fas ${service.icon}"></i>
                        </div>
                        <div class="service-icon">
                            <i class="fas ${service.icon}"></i>
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <div class="service-provider">
                            <i class="fas fa-user-circle"></i> ${service.provider}
                        </div>
                    </div>
                `;
                container.appendChild(slide);
            });
            
            // Initialize or update Swiper
            if (window.servicesSwiper) {
                window.servicesSwiper.update();
            } else {
                initSwiper();
            }
        }

        // Initialize Swiper
        function initSwiper() {
            window.servicesSwiper = new Swiper('.servicesSwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }
            });
        }

        // Logout function
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                currentUser = null;
                showPage('loginPage');
                alert('You have been logged out successfully.');
            }
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Close mobile menu if open
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                            bsCollapse.hide();
                        }
                    }
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'linear-gradient(135deg, #6d3610, #a0522d)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            }
        });

        // Add some demo users for testing
        users.clients['client@test.com'] = {
            name: 'Test Client',
            email: 'client@test.com',
            password: 'password123',
            type: 'client'
        };

        users.partners['partner@test.com'] = {
            name: 'Test Partner',
            email: 'partner@test.com',
            password: 'password123',
            type: 'partner'
        };

        users.companies['company@test.com'] = {
            name: 'Test Company',
            email: 'company@test.com',
            password: 'password123',
            type: 'company'
        };

        console.log('Demo accounts available:');
        console.log('Client: client@test.com / password123');
        console.log('Partner: partner@test.com / password123');
        console.log('Company: company@test.com / password123');