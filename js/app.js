// App State
const appState = {
    completedTasks: JSON.parse(localStorage.getItem('completedTasks') || '{}'),
    theme: localStorage.getItem('theme') || 'light',
    selectedDayId: JSON.parse(localStorage.getItem('selectedDayId') || '1'),
    lastProgressPercent: 0,
    notificationsEnabled: localStorage.getItem('notificationsEnabled') === 'true' || false,
    notify5min: localStorage.getItem('notify5min') === 'true' || false,
    notifyOnTime: localStorage.getItem('notifyOnTime') === 'true' || false,
    notifyCelebration: localStorage.getItem('notifyCelebration') === 'true' || false,
    touchStartX: 0,
    touchEndX: 0,
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    renderDaysList();
    renderRoutineView(appState.selectedDayId);
    setupEventListeners();
    applyMobileDaysPanelState();
    applyMobileStatsState();
    updateStats();
    runEntryAnimations();
    showOneTimeTip();
    setupAutoUpdate();
    setupNotificationSystem();
    setupSettingsModal();
    setupMobileNavigation();
    setupSwipeNavigation();
});

// ============ THEME MANAGEMENT ============
function initializeTheme() {
    if (appState.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

document.getElementById('darkModeToggle').addEventListener('click', () => {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', appState.theme);
    initializeTheme();
    showToast(`${appState.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`);
});

// ============ RENDER TIMETABLE ============
function renderDaysList() {
    const container = document.getElementById('daysList');
    container.innerHTML = '';

    TIMETABLE_DATA.forEach(day => {
        const completedCount = day.tasks.filter(task => 
            appState.completedTasks[day.id]?.[task.id]
        ).length;
        
        const dayItem = document.createElement('button');
        dayItem.className = `w-full text-left p-3 rounded-xl transition-all duration-200 border glass-day-btn ${
            appState.selectedDayId === day.id 
            ? `bg-gradient-to-r ${day.color} text-white border-transparent shadow-lg active-day` 
            : `text-gray-800 dark:text-gray-100 border-white/30 hover:border-white/60`
        }`;
        dayItem.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold text-sm">${day.name}</p>
                    <p class="text-xs opacity-75">${completedCount}/${day.tasks.length}</p>
                </div>
                <div class="text-lg">${appState.selectedDayId === day.id ? '✓' : ''}</div>
            </div>
        `;
        
        dayItem.addEventListener('click', () => {
            selectDay(day.id, true);
        });
        
        container.appendChild(dayItem);
    });
}

function renderRoutineView(dayId) {
    const day = TIMETABLE_DATA.find(d => d.id === dayId);
    if (!day) return;

    const content = document.getElementById('routineContent');
    const completedCount = day.tasks.filter(task => 
        appState.completedTasks[day.id]?.[task.id]
    ).length;
    const pendingCount = day.tasks.length - completedCount;
    const progressPercent = Math.round((completedCount / day.tasks.length) * 100);
    const nextTask = getNextTaskForToday(day);

    const routineMarkup = `
        <!-- Day Header -->
        <div class="bg-gradient-to-r ${day.color} text-white p-6 rounded-lg mb-6 -m-6 mb-6">
            <h2 class="text-3xl font-bold mb-2">${day.name}</h2>
            <p class="text-lg opacity-90">${day.dayType === 'recovery' ? '🌟 Recovery Day' : '⚡ Productive Day'}</p>
        </div>

        <!-- Live Insights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div class="glass-mini rounded-xl p-3">
                <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Next Focus</p>
                <p class="font-semibold text-gray-800 dark:text-gray-100 mt-1">${nextTask ? `${nextTask.time} • ${nextTask.activity}` : 'No fixed-time task left'}</p>
            </div>
            <div class="glass-mini rounded-xl p-3">
                <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Completed</p>
                <p class="font-semibold text-gray-800 dark:text-gray-100 mt-1">${completedCount} tasks</p>
            </div>
            <div class="glass-mini rounded-xl p-3">
                <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Pending</p>
                <p class="font-semibold text-gray-800 dark:text-gray-100 mt-1">${pendingCount} tasks</p>
            </div>
        </div>

        <!-- Progress Section -->
        <div class="mb-8">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">${completedCount}/${day.tasks.length} (${progressPercent}%)</span>
            </div>
            <div class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-gradient-to-r ${day.color} h-3 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
            </div>
        </div>

        <!-- Tasks Section -->
        <div>
            <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">📋 Daily Routine</h3>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">${day.tasks.length} tasks</p>
            </div>
            <div class="space-y-3" id="detailedTasksList">
                <!-- Tasks will be rendered here -->
            </div>
        </div>
    `;

    content.classList.remove('content-swap-in');
    content.classList.add('content-swap-out');

    requestAnimationFrame(() => {
        content.innerHTML = routineMarkup;

        const tasksList = content.querySelector('#detailedTasksList');
        day.tasks.forEach((task, index) => {
            const taskElement = createDetailedTaskElement(day.id, task, day, index);
            tasksList.appendChild(taskElement);
        });

        content.classList.remove('content-swap-out');
        content.classList.add('content-swap-in');
    });
}

function createDetailedTaskElement(dayId, task, day, index = 0) {
    const taskDiv = document.createElement('div');
    const isCompleted = appState.completedTasks[dayId]?.[task.id] || false;
    
    taskDiv.className = `routine-task-shell p-4 rounded-2xl border transition-all duration-300 cursor-pointer glass-task-card ${
        isCompleted 
            ? `task-done border-green-300/60 dark:border-green-700/70` 
            : `border-white/40 hover:border-white/70`
    }`;
    taskDiv.style.animation = `fadeIn 0.3s ease ${(index * 0.04).toFixed(2)}s both`;

    taskDiv.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="task-leading flex flex-col items-center gap-2 pt-0.5">
                <span class="task-index">${index + 1}</span>
                <div class="task-rail"></div>
            </div>
            <input 
                type="checkbox" 
                class="mt-0.5 w-6 h-6 rounded cursor-pointer accent-indigo-600 flex-shrink-0"
                ${isCompleted ? 'checked' : ''}
            />
            <div class="task-main flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-2xl">${task.icon}</span>
                        <p class="text-base font-semibold truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}">
                            ${task.activity}
                        </p>
                    </div>
                    <span class="task-status ${isCompleted ? 'task-status-done' : 'task-status-live'}">${isCompleted ? 'Done' : 'Active'}</span>
                </div>
                <div class="task-meta flex flex-wrap items-center gap-2 ml-10">
                    <span class="task-chip task-chip-time">⏰ ${task.time}</span>
                    <span class="task-chip task-chip-category">${formatCategory(task.category)}</span>
                </div>
            </div>
        </div>
    `;

    const checkbox = taskDiv.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
        handleTaskToggle(dayId, task.id, e.target.checked);
    });

    taskDiv.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
            checkbox.click();
        }
    });

    return taskDiv;
}

function getNextTaskForToday(day) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const parsed = day.tasks
        .map(task => ({ task, minutes: parseStartTimeToMinutes(task.time) }))
        .filter(item => item.minutes !== null)
        .sort((a, b) => a.minutes - b.minutes);

    const next = parsed.find(item => item.minutes >= nowMinutes);
    return next ? next.task : null;
}

function parseStartTimeToMinutes(timeText) {
    const match = String(timeText).match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    return hours * 60 + minutes;
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// ============ TASK MANAGEMENT ============
function handleTaskToggle(dayId, taskId, isChecked) {
    if (!appState.completedTasks[dayId]) {
        appState.completedTasks[dayId] = {};
    }

    appState.completedTasks[dayId][taskId] = isChecked;
    localStorage.setItem('completedTasks', JSON.stringify(appState.completedTasks));

    const taskList = document.getElementById('detailedTasksList');
    const previousScroll = taskList ? taskList.scrollTop : 0;

    renderDaysList();
    renderRoutineView(appState.selectedDayId);

    // Restore scroll position to avoid jump after rerender.
    requestAnimationFrame(() => {
        const updatedTaskList = document.getElementById('detailedTasksList');
        if (updatedTaskList) {
            updatedTaskList.scrollTop = previousScroll;
        }
    });

    updateStats();

    if (isChecked) {
        showCelebration();
        showToast('✓ Task completed!', 'success');
        playSound();
        sendNotification('Task Completed! 🎉', `Great job! Keep up the momentum!`);
    }
}

function handleResetWeek() {
    if (confirm('Are you sure you want to reset all tasks for this week? This cannot be undone.')) {
        appState.completedTasks = {};
        localStorage.setItem('completedTasks', JSON.stringify(appState.completedTasks));
        renderDaysList();
        renderRoutineView(appState.selectedDayId);
        updateStats();
        showToast('↺ Week reset successfully!', 'info');
    }
}

// ============ STATS & ANALYTICS ============
function updateStats() {
    const totalTasks = getTotalTasks();
    const completedTasks = getCompletedTasks();
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update progress
    animateCounter(
        document.getElementById('weeklyProgress'),
        appState.lastProgressPercent,
        progressPercent,
        '%'
    );
    document.getElementById('weeklyProgressBar').style.width = `${progressPercent}%`;
    appState.lastProgressPercent = progressPercent;

    // Update task count
    document.getElementById('tasksCompleted').textContent = `${completedTasks}/${totalTasks}`;

    // Update streak (simple: if all tasks completed in a day, count it)
    updateStreak();
}

function updateStreak() {
    const today = new Date().toDateString();
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{"date": "", "count": 0}');

    const totalTasks = getTotalTasks();
    const completedTasks = getCompletedTasks();

    // Simplified streak: count days with all tasks completed
    const streakCount = Math.min(completedTasks > 0 ? 1 : 0, 7);
    document.getElementById('streak').textContent = `${streakCount} days 🔥`;
}

// ============ UI UTILITIES ============
function showToast(message, type = 'default') {
    const container = document.getElementById('toastContainer');
    
    const bgColor = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'info': 'bg-blue-500',
        'default': 'bg-gray-800 dark:bg-gray-700'
    }[type] || 'bg-gray-800 dark:bg-gray-700';

    const toast = document.createElement('div');
    toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in pointer-events-auto`;
    toast.textContent = message;
    toast.style.animation = 'slideIn 0.3s ease-out';

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function playSound() {
    // Simple beep sound using Web Audio API
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.1);
    } catch (e) {
        console.log('Sound not available');
    }
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    document.getElementById('resetBtn').addEventListener('click', handleResetWeek);
    
    // Mobile toggle for days list
    const toggleBtn = document.getElementById('toggleDaysView');
    const daysPanel = document.getElementById('daysPanel');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (!daysPanel) return;

            daysPanel.classList.toggle('hidden');
            toggleBtn.textContent = daysPanel.classList.contains('hidden') ? '📅 Show Days' : '📅 Hide Days';
        });
    }

    const statsToggleBtn = document.getElementById('statsToggleBtn');
    const statsSection = document.getElementById('statsSection');
    if (statsToggleBtn && statsSection) {
        statsToggleBtn.addEventListener('click', () => {
            statsSection.classList.toggle('hidden');
            statsToggleBtn.textContent = statsSection.classList.contains('hidden') ? '► Weekly Stats' : '▼ Weekly Stats';
        });
    }

    window.addEventListener('resize', () => {
        applyMobileDaysPanelState();
        applyMobileStatsState();
    });

    document.addEventListener('keydown', (event) => {
        const tagName = document.activeElement?.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToAdjacentDay(1);
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToAdjacentDay(-1);
        }
    });
}

function setupAutoUpdate() {
    // Update every minute
    setInterval(updateStats, 60000);
}

function applyMobileDaysPanelState() {
    const daysPanel = document.getElementById('daysPanel');
    const toggleBtn = document.getElementById('toggleDaysView');
    if (!daysPanel || !toggleBtn) return;

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        daysPanel.classList.add('hidden');
        toggleBtn.textContent = '📅 Show Days';
    } else {
        daysPanel.classList.remove('hidden');
        toggleBtn.textContent = '📅 Days List';
    }
}

function applyMobileStatsState() {
    const statsToggleBtn = document.getElementById('statsToggleBtn');
    const statsSection = document.getElementById('statsSection');
    if (!statsToggleBtn || !statsSection) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        statsToggleBtn.classList.remove('hidden');
        statsSection.classList.add('hidden');
        statsToggleBtn.textContent = '► Weekly Stats';
    } else {
        statsToggleBtn.classList.add('hidden');
        statsSection.classList.remove('hidden');
        statsToggleBtn.textContent = '▼ Weekly Stats';
    }
}

function selectDay(dayId, closeMobilePanel = false) {
    appState.selectedDayId = dayId;
    localStorage.setItem('selectedDayId', JSON.stringify(dayId));
    renderDaysList();
    renderRoutineView(dayId);

    if (!closeMobilePanel) return;

    const daysPanel = document.getElementById('daysPanel');
    const toggleBtn = document.getElementById('toggleDaysView');
    if (window.innerWidth < 1024 && daysPanel && toggleBtn) {
        daysPanel.classList.add('hidden');
        toggleBtn.textContent = '📅 Show Days';
    }
}

function goToAdjacentDay(direction) {
    const index = TIMETABLE_DATA.findIndex(day => day.id === appState.selectedDayId);
    if (index < 0) return;

    const nextIndex = (index + direction + TIMETABLE_DATA.length) % TIMETABLE_DATA.length;
    selectDay(TIMETABLE_DATA[nextIndex].id, window.innerWidth < 1024);
}

function animateCounter(element, start, end, suffix = '') {
    if (!element || start === end) {
        if (element) {
            element.textContent = `${end}${suffix}`;
        }
        return;
    }

    const duration = 350;
    const startedAt = performance.now();

    const update = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(start + (end - start) * eased);
        element.textContent = `${value}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
}

function runEntryAnimations() {
    const sections = document.querySelectorAll('[data-reveal]');
    sections.forEach((section, index) => {
        section.style.animation = `riseIn 0.45s ease ${(index * 0.06).toFixed(2)}s both`;
    });
}

function showOneTimeTip() {
    const key = 'planora_shortcut_tip_seen';
    if (localStorage.getItem(key)) {
        return;
    }

    showToast('Tip: Use Left and Right arrow keys to switch days', 'info');
    localStorage.setItem(key, '1');
}

// ============ NOTIFICATION SYSTEM ============

function setupNotificationSystem() {
    const notificationsToggle = document.getElementById('notificationsToggle');
    const notify5min = document.getElementById('notify5min');
    const notifyOnTime = document.getElementById('notifyOnTime');
    const notifyCelebration = document.getElementById('notifyCelebration');
    const requestNotificationBtn = document.getElementById('requestNotificationBtn');
    const notificationOptions = document.getElementById('notificationOptions');

    // Load saved preferences
    notificationsToggle.checked = appState.notificationsEnabled;
    notify5min.checked = appState.notify5min;
    notifyOnTime.checked = appState.notifyOnTime;
    notifyCelebration.checked = appState.notifyCelebration;

    // Toggle options visibility
    notificationsToggle.addEventListener('change', (e) => {
        appState.notificationsEnabled = e.target.checked;
        localStorage.setItem('notificationsEnabled', appState.notificationsEnabled);
        notificationOptions.classList.toggle('hidden', !e.target.checked);
        
        if (e.target.checked && Notification.permission === 'default') {
            requestNotificationBtn.classList.remove('hidden');
        } else {
            requestNotificationBtn.classList.add('hidden');
        }
    });

    notify5min.addEventListener('change', (e) => {
        appState.notify5min = e.target.checked;
        localStorage.setItem('notify5min', appState.notify5min);
    });

    notifyOnTime.addEventListener('change', (e) => {
        appState.notifyOnTime = e.target.checked;
        localStorage.setItem('notifyOnTime', appState.notifyOnTime);
    });

    notifyCelebration.addEventListener('change', (e) => {
        appState.notifyCelebration = e.target.checked;
        localStorage.setItem('notifyCelebration', appState.notifyCelebration);
    });

    // Request notification permission
    requestNotificationBtn.addEventListener('click', () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    requestNotificationBtn.classList.add('hidden');
                    showToast('🔔 Notifications enabled!', 'success');
                }
            });
        }
    });

    // Check if notification permission needed
    if ('Notification' in window && Notification.permission === 'default' && appState.notificationsEnabled) {
        requestNotificationBtn.classList.remove('hidden');
    }

    // Start notification checker
    setupNotificationChecker();
}

function setupNotificationChecker() {
    // Check every minute for notifications
    setInterval(() => {
        if (!appState.notificationsEnabled) return;

        const day = TIMETABLE_DATA.find(d => d.id === appState.selectedDayId);
        if (!day) return;

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        day.tasks.forEach(task => {
            const taskMinutes = parseStartTimeToMinutes(task.time);
            if (taskMinutes === null) return;

            // 5 minutes before notification
            if (appState.notify5min && taskMinutes - nowMinutes === 5) {
                sendNotification(`⏰ Upcoming: ${task.activity}`, `Starting in 5 minutes at ${task.time}`);
            }

            // On time notification
            if (appState.notifyOnTime && taskMinutes === nowMinutes) {
                sendNotification(`🎯 Time for ${task.activity}!`, `It's ${task.time} - Time to start!`);
            }
        });
    }, 60000); // Check every minute
}

function sendNotification(title, options = {}) {
    if (!appState.notificationsEnabled || !('Notification' in window)) return;

    if (Notification.permission !== 'granted') return;

    try {
        new Notification(title, {
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%236366f1" width="180" height="180"/><text x="50%" y="50%" font-size="90" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⏰</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%236366f1" width="180" height="180"/><text x="50%" y="50%" font-size="90" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⏰</text></svg>',
            ...options
        });
    } catch (e) {
        console.log('Notification sent:', title);
    }
}

function showCelebration() {
    if (!appState.notifyCelebration) return;

    const taskDiv = document.querySelector('.routine-task-shell:has(input[type="checkbox"]:checked)');
    if (taskDiv) {
        taskDiv.classList.add('task-celebration');
        setTimeout(() => taskDiv.classList.remove('task-celebration'), 600);
    }

    // Create confetti particles
    const emojis = ['🎉', '✨', '🌟', '⭐', '🎊', '👏'];
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '50vh';
        particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 800);
    }
}

// ============ SETTINGS MODAL ============

function setupSettingsModal() {
    const settingsBtn = document.getElementById('settingsBtn');
    const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');

    function openSettings() {
        settingsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeSettings() {
        settingsModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    settingsBtn?.addEventListener('click', openSettings);
    mobileSettingsBtn?.addEventListener('click', openSettings);
    closeSettingsBtn.addEventListener('click', closeSettings);

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettings();
        }
    });

    // Export data
    exportDataBtn.addEventListener('click', () => {
        const data = {
            completedTasks: appState.completedTasks,
            theme: appState.theme,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planora-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        showToast('📥 Data exported successfully!', 'success');
        closeSettings();
    });

    // Clear data
    clearDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            appState.completedTasks = {};
            localStorage.clear();
            window.location.reload();
        }
    });
}

// ============ MOBILE NAVIGATION ============

function setupMobileNavigation() {
    const mobileStatsBtn = document.getElementById('mobileStatsBtn');
    const mobileDaysBtn = document.getElementById('mobileDaysBtn');
    const statsSection = document.getElementById('statsSection');
    const daysPanel = document.getElementById('daysPanel');

    mobileStatsBtn?.addEventListener('click', () => {
        updateMobileNav('stats');
        statsSection?.scrollIntoView({ behavior: 'smooth' });
    });

    mobileDaysBtn?.addEventListener('click', () => {
        updateMobileNav('days');
        daysPanel?.scrollIntoView({ behavior: 'smooth' });
    });
}

function updateMobileNav(active) {
    const items = document.querySelectorAll('.mobile-nav-item');
    items.forEach(item => item.classList.remove('active'));

    if (active === 'stats') {
        document.getElementById('mobileStatsBtn')?.classList.add('active');
    } else if (active === 'days') {
        document.getElementById('mobileDaysBtn')?.classList.add('active');
    }
}

// ============ SWIPE NAVIGATION ============

function setupSwipeNavigation() {
    const routineView = document.getElementById('routineView');
    
    routineView?.addEventListener('touchstart', (e) => {
        appState.touchStartX = e.changedTouches[0].screenX;
    }, false);

    routineView?.addEventListener('touchend', (e) => {
        appState.touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

function handleSwipe() {
    const diff = appState.touchStartX - appState.touchEndX;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    const currentIndex = TIMETABLE_DATA.findIndex(d => d.id === appState.selectedDayId);
    let nextIndex = currentIndex;

    if (diff > threshold) {
        // Swiped left - next day
        nextIndex = (currentIndex + 1) % TIMETABLE_DATA.length;
    } else if (diff < -threshold) {
        // Swiped right - previous day
        nextIndex = (currentIndex - 1 + TIMETABLE_DATA.length) % TIMETABLE_DATA.length;
    }

    if (nextIndex !== currentIndex) {
        selectDay(TIMETABLE_DATA[nextIndex].id, true);
    }
}
