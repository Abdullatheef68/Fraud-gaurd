/**
 * FraudGuard Authentication Manager
 */
const auth = {
    SESSION_KEY: 'fg_user_session',
    USERS_KEY: 'fg_registered_users',

    init() {
        // Ensure default demo user exists in local storage
        let users = this.getStoredUsers();
        const demoExists = users.some(u => u.email.toLowerCase() === CONFIG.DEMO_USER.email.toLowerCase());
        if (!demoExists) {
            users.push(CONFIG.DEMO_USER);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    },

    getStoredUsers() {
        try {
            const raw = localStorage.getItem(this.USERS_KEY);
            return raw ? JSON.parse(raw) : [CONFIG.DEMO_USER];
        } catch (e) {
            return [CONFIG.DEMO_USER];
        }
    },

    getUser() {
        try {
            const raw = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    isAuthenticated() {
        return !!this.getUser();
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    async login(email, password, rememberMe = false) {
        if (CONFIG.DEMO_MODE) {
            // Local Demo Authentication
            const users = this.getStoredUsers();
            const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
            
            if (found) {
                const sessionUser = {
                    email: found.email,
                    fullName: found.fullName || found.email.split('@')[0],
                    organization: found.organization || 'FraudGuard Tech',
                    role: found.role || 'FRAUD ANALYST',
                    userId: found.userId || 'USR-' + Math.floor(100000 + Math.random() * 900000)
                };
                
                if (rememberMe) {
                    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
                } else {
                    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
                }
                return { success: true, user: sessionUser };
            } else {
                return { success: false, error: 'Invalid email or password.' };
            }
        } else {
            // Real API Authentication
            try {
                const response = await api.login(email, password);
                if (response.success) {
                    const sessionUser = response.user;
                    if (rememberMe) {
                        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
                    } else {
                        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
                    }
                }
                return response;
            } catch (err) {
                return { success: false, error: err.message || 'API Authentication Failed' };
            }
        }
    },

    async register(data) {
        if (CONFIG.DEMO_MODE) {
            let users = this.getStoredUsers();
            if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
                return { success: false, error: 'User with this email already exists.' };
            }
            
            const newUser = {
                email: data.email.trim(),
                password: data.password,
                fullName: data.fullName,
                organization: data.organization || 'General User',
                role: data.role || 'USER',
                userId: 'USR-' + Math.floor(100000 + Math.random() * 900000),
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            
            return { success: true, message: 'Registration successful! You can now log in.' };
        } else {
            return await api.register(data);
        }
    },

    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'login.html';
    }
};

auth.init();
