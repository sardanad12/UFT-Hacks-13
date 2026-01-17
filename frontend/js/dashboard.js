// Dashboard Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Update user information
    updateUserInfo(user);

    // Initialize dashboard data
    initializeDashboard();

    // Setup logout button
    setupLogout();

    // Animate elements on load
    animateOnLoad();
});

// Update user information in header
function updateUserInfo(user) {
    const userName = document.getElementById('userName');
    const userInitials = document.getElementById('userInitials');

    // Capitalize first letter of name
    const name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    userName.textContent = name;

    // Get initials (first letter of name)
    userInitials.textContent = name.charAt(0).toUpperCase();
}

// Initialize dashboard with demo data
function initializeDashboard() {
    // Sample data - in a real app, this would come from an API
    const dashboardData = {
        streak: 6,
        lessonsCompleted: 24,
        timeSpent: 12,
        languages: [
            {
                name: 'Spanish',
                flag: '🇪🇸',
                level: 'Intermediate',
                progress: 68,
                wordsLearned: 450,
                lessonsCompleted: 18
            },
            {
                name: 'French',
                flag: '🇫🇷',
                level: 'Beginner',
                progress: 35,
                wordsLearned: 180,
                lessonsCompleted: 8
            },
            {
                name: 'Japanese',
                flag: '🇯🇵',
                level: 'Advanced',
                progress: 82,
                wordsLearned: 720,
                lessonsCompleted: 32
            }
        ]
    };

    // Update streak
    updateStreak(dashboardData.streak);

    // Update stats
    updateStats(dashboardData.lessonsCompleted, dashboardData.timeSpent);

    // Render language cards
    renderLanguageCards(dashboardData.languages);
}

// Update streak display with animation
function updateStreak(streak) {
    const streakCount = document.getElementById('streakCount');
    let currentStreak = 0;
    
    const interval = setInterval(() => {
        if (currentStreak >= streak) {
            clearInterval(interval);
            return;
        }
        currentStreak++;
        streakCount.textContent = currentStreak;
    }, 100);
}

// Update stats with animation
function updateStats(lessons, hours) {
    const lessonsCompleted = document.getElementById('lessonsCompleted');
    const timeSpent = document.getElementById('timeSpent');

    // Animate lessons
    let currentLessons = 0;
    const lessonsInterval = setInterval(() => {
        if (currentLessons >= lessons) {
            clearInterval(lessonsInterval);
            return;
        }
        currentLessons++;
        lessonsCompleted.textContent = currentLessons;
    }, 50);

    // Animate time
    let currentTime = 0;
    const timeInterval = setInterval(() => {
        if (currentTime >= hours) {
            clearInterval(timeInterval);
            return;
        }
        currentTime++;
        timeSpent.textContent = currentTime + 'h';
    }, 80);
}

// Render language proficiency cards
function renderLanguageCards(languages) {
    const languagesGrid = document.getElementById('languagesGrid');
    languagesGrid.innerHTML = '';

    languages.forEach((language, index) => {
        const card = createLanguageCard(language);
        languagesGrid.appendChild(card);

        // Animate card appearance
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 150);
    });
}

// Create individual language card
function createLanguageCard(language) {
    const card = document.createElement('div');
    card.className = 'language-card';

    card.innerHTML = `
        <div class="language-header">
            <div class="language-flag">${language.flag}</div>
            <div class="language-info">
                <h3>${language.name}</h3>
                <span class="language-level">${language.level}</span>
            </div>
        </div>
        
        <div class="progress-container">
            <div class="progress-header">
                <span class="progress-label">Overall Progress</span>
                <span class="progress-percentage">${language.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" data-progress="${language.progress}"></div>
            </div>
        </div>
        
        <div class="language-stats">
            <div class="language-stat">
                <span class="language-stat-value">${language.wordsLearned}</span>
                <span class="language-stat-label">Words</span>
            </div>
            <div class="language-stat">
                <span class="language-stat-value">${language.lessonsCompleted}</span>
                <span class="language-stat-label">Lessons</span>
            </div>
        </div>
    `;

    // Animate progress bar
    setTimeout(() => {
        const progressFill = card.querySelector('.progress-fill');
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = language.progress + '%';
        }, 100);
    }, 500);

    return card;
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        // Add animation
        this.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Clear user data
            localStorage.removeItem('user');
            
            // Redirect to login
            window.location.href = 'index.html';
        }, 200);
    });
}

// Animate elements on page load
function animateOnLoad() {
    // Fade in main content
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    setTimeout(() => {
        mainContent.style.transition = 'opacity 0.5s ease';
        mainContent.style.opacity = '1';
    }, 100);

    // Add hover effects to nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(5px)';
            }
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add click ripple effect to cards
    const cards = document.querySelectorAll('.stat-card, .language-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(99, 102, 241, 0.2)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add keyframe for ripple animation
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.innerHTML = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Update calendar days based on streak
function updateCalendar(streak) {
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach((day, index) => {
        if (index < streak) {
            day.classList.add('completed');
        }
        if (index === streak) {
            day.classList.add('active');
        }
    });
}

// Add motivational messages based on streak
function getMotivationalMessage(streak) {
    if (streak >= 30) return "Incredible! You're a language learning champion! 🏆";
    if (streak >= 14) return "Two weeks strong! Keep it up! 💪";
    if (streak >= 7) return "One week streak! You're on fire! 🔥";
    if (streak >= 3) return "Great start! Keep the momentum going! ⭐";
    return "Start your streak today! 🚀";
}

// Optional: Add real-time updates
setInterval(() => {
    // Update time or fetch new data if needed
    // This is where you'd make API calls in a real application
}, 60000); // Every minute
