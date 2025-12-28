// FundFlow Application JavaScript

class FundFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.transactions = this.loadTransactions();
        this.budget = this.loadBudget();
        this.goals = this.loadGoals();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupEventListeners();
        this.renderCurrentPage();
        this.startPeriodicUpdates();
    }

    // Navigation System
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    navigateToPage(page) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show/hide pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        this.currentPage = page;
        this.renderCurrentPage();
    }

    // Modal Management
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.modal-close');

        // Close modal when clicking close button
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal').classList.remove('active');
            });
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Add Transaction Button
        const addTransactionBtn = document.querySelector('.transaction-filters .btn-primary');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                this.openAddTransactionModal();
            });
        }

        // Transaction Form Submission
        const transactionForm = document.querySelector('.transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTransaction(e.target);
            });
        }

        // Goal Action Buttons
        document.querySelectorAll('.goal-actions .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                const goalCard = e.target.closest('.goal-card');
                const goalTitle = goalCard.querySelector('.goal-info h3').textContent;
                this.handleGoalContribution(goalTitle);
            });
        });

        // Challenge Log Success Button
        const challengeBtn = document.querySelector('.challenge-card .btn-primary');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', () => {
                this.logChallengeSuccess();
            });
        }

        // Chart Controls
        document.querySelectorAll('.chart-controls .btn-secondary').forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from siblings
                e.target.parentElement.querySelectorAll('.btn-secondary').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Add active class to clicked button
                e.target.classList.add('active');
                // Update chart (placeholder for now)
                console.log('Chart period changed to:', e.target.textContent);
            });
        });

        // Category Progress Animations
        this.animateProgressBars();

        // Smart Insight Actions
        document.querySelectorAll('.insight-content .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                const insightCard = e.target.closest('.insight-card');
                const insightTitle = insightCard.querySelector('h3').textContent;
                this.handleInsightAction(insightTitle);
            });
        });
    }

    // Page Rendering
    renderCurrentPage() {
        switch (this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'budget':
                this.renderBudget();
                break;
            case 'transactions':
                this.renderTransactions();
                break;
            case 'goals':
                this.renderGoals();
                break;
            case 'coaching':
                this.renderCoaching();
                break;
        }
    }

    renderDashboard() {
        this.updateStats();
        this.renderRecentActivity();
        this.renderSmartInsights();
        setTimeout(() => this.initCharts(), 100);
    }

    renderBudget() {
        this.updateBudgetOverview();
        this.renderBudgetCategories();
        setTimeout(() => this.initBudgetChart(), 100);
    }

    renderTransactions() {
        this.renderTransactionList();
    }

    renderGoals() {
        this.renderGoalCards();
    }

    renderCoaching() {
        this.updateCoachingScore();
        this.renderLearningModules();
        setTimeout(() => this.initScoreChart(), 100);
    }

    // Dashboard Functions
    updateStats() {
        const balance = this.calculateCurrentBalance();
        const monthlyBudget = this.budget.total;
        const spent = this.calculateMonthlySpent();
        const savingsProgress = this.calculateSavingsProgress();

        // Update stat cards (these would be dynamically updated in a real app)
        console.log('Stats updated:', { balance, monthlyBudget, spent, savingsProgress });
    }

    renderRecentActivity() {
        const recentTransactions = this.getRecentTransactions(5);
        const activityList = document.querySelector('.activity-list');
        
        if (activityList && recentTransactions.length > 0) {
            // This is already rendered in HTML, but in a real app would be dynamic
            console.log('Recent activity rendered:', recentTransactions);
        }
    }

    renderSmartInsights() {
        const insights = this.generateSmartInsights();
        console.log('Smart insights generated:', insights);
    }

    // Budget Functions
    updateBudgetOverview() {
        const totalBudget = 850;
        const spent = 664;
        const remaining = totalBudget - spent;

        // Update budget display
        const budgetCenter = document.querySelector('.budget-center h3');
        if (budgetCenter) {
            budgetCenter.textContent = `₹${remaining}`;
        }
    }

    renderBudgetCategories() {
        // Animate progress bars
        setTimeout(() => {
            this.animateProgressBars();
        }, 200);
    }

    // Transaction Functions
    openAddTransactionModal() {
        const modal = document.getElementById('addTransactionModal');
        if (modal) {
            modal.classList.add('active');
            // Set today's date as default
            const dateInput = modal.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
        }
    }

    handleAddTransaction(form) {
        const formData = new FormData(form);
        const transaction = {
            id: Date.now(),
            amount: parseFloat(formData.get('amount')) || 0,
            description: formData.get('description') || '',
            category: formData.get('category') || '',
            date: formData.get('date') || new Date().toISOString().split('T')[0],
            type: parseFloat(formData.get('amount')) > 0 ? 'income' : 'expense'
        };

        this.addTransaction(transaction);
        this.closeModal('addTransactionModal');
        form.reset();
        
        // Show success message
        this.showNotification('Transaction added successfully!', 'success');
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction);
        this.saveTransactions();
        if (this.currentPage === 'transactions') {
            this.renderTransactionList();
        }
    }

    renderTransactionList() {
        // In a real app, this would dynamically render the transaction list
        // For now, we're using static HTML content
        console.log('Transaction list rendered');
    }

    // Goal Functions
    handleGoalContribution(goalTitle) {
        const amount = prompt(`How much would you like to contribute to "${goalTitle}"?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            this.addGoalContribution(goalTitle, parseFloat(amount));
            this.showNotification(`₹${amount} added to ${goalTitle}!`, 'success');
        }
    }

    addGoalContribution(goalTitle, amount) {
        // Update goal progress (simplified for demo)
        const goalCard = Array.from(document.querySelectorAll('.goal-card')).find(card => 
            card.querySelector('.goal-info h3')?.textContent === goalTitle
        );
        
        if (goalCard) {
            const currentSpan = goalCard.querySelector('.progress-info .current');
            if (currentSpan) {
                const currentAmount = parseFloat(currentSpan.textContent.replace('₹', ''));
                const newAmount = currentAmount + amount;
                currentSpan.textContent = `₹${newAmount}`;
                
                // Update progress bar
                const progressBar = goalCard.querySelector('.progress-fill');
                const targetAmount = parseFloat(goalCard.querySelector('.progress-info .target').textContent.replace('/ ₹', ''));
                const progressPercent = (newAmount / targetAmount) * 100;
                progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
            }
        }
    }

    renderGoalCards() {
        // Animate progress bars for goals
        setTimeout(() => {
            this.animateProgressBars();
        }, 200);
    }

    // Coaching Functions
    updateCoachingScore() {
        // Calculate and update financial health score
        const score = this.calculateFinancialScore();
        console.log('Financial score updated:', score);
    }

    logChallengeSuccess() {
        const progressText = document.querySelector('.challenge-progress span');
        if (progressText) {
            const current = parseInt(progressText.textContent.match(/\d+/)[0]);
            const total = parseInt(progressText.textContent.match(/\/(\d+)/)[1]);
            
            if (current < total) {
                const newProgress = current + 1;
                progressText.textContent = `Progress: ${newProgress}/${total} days`;
                
                const progressBar = document.querySelector('.challenge-progress .progress-fill');
                if (progressBar) {
                    progressBar.style.width = `${(newProgress / total) * 100}%`;
                }
                
                this.showNotification('Great job! Challenge progress logged.', 'success');
            }
        }
    }

    renderLearningModules() {
        // Add interactive features to learning modules
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            const continueBtn = card.querySelector('.btn-primary');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    const moduleTitle = card.querySelector('h3').textContent;
                    this.startLearningModule(moduleTitle);
                });
            }
        });
    }

    startLearningModule(moduleTitle) {
        this.showNotification(`Starting "${moduleTitle}" module...`, 'info');
        // In a real app, this would navigate to the learning content
    }

    // Utility Functions
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const width = bar.style.width || bar.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '0%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = width;
            }, index * 100);
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success-color)' : 
                         type === 'error' ? 'var(--danger-color)' : 
                         'var(--primary-color)'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleInsightAction(insightTitle) {
        if (insightTitle === 'Coffee Spending Alert') {
            this.showNotification('Reminder set for home brewing!', 'success');
        }
    }

    // Data Management
    loadTransactions() {
        const stored = localStorage.getItem('fundflow-transactions');
        return stored ? JSON.parse(stored) : this.getDefaultTransactions();
    }

    saveTransactions() {
        localStorage.setItem('fundflow-transactions', JSON.stringify(this.transactions));
    }

    loadBudget() {
        const stored = localStorage.getItem('fundflow-budget');
        return stored ? JSON.parse(stored) : this.getDefaultBudget();
    }

    loadGoals() {
        const stored = localStorage.getItem('fundflow-goals');
        return stored ? JSON.parse(stored) : this.getDefaultGoals();
    }

    getDefaultTransactions() {
        return [
            {
                id: 1,
                amount: 800,
                description: 'Monthly Stipend',
                category: 'income',
                date: '2025-10-01',
                type: 'income'
            },
            {
                id: 2,
                amount: -120,
                description: 'Textbook Purchase',
                category: 'education',
                date: '2025-10-02',
                type: 'expense'
            },
            {
                id: 3,
                amount: -12.50,
                description: 'Lunch at Campus Cafe',
                category: 'food',
                date: '2025-10-03',
                type: 'expense'
            }
        ];
    }

    getDefaultBudget() {
        return {
            total: 850,
            categories: {
                food: { budget: 200, spent: 180 },
                transport: { budget: 100, spent: 65 },
                entertainment: { budget: 80, spent: 45 },
                education: { budget: 300, spent: 374 }
            }
        };
    }

    getDefaultGoals() {
        return [
            {
                title: 'Emergency Fund',
                target: 1500,
                current: 320,
                description: 'Build 3-month expense buffer'
            },
            {
                title: 'New Laptop',
                target: 1200,
                current: 450,
                description: 'MacBook for coding projects'
            }
        ];
    }

    // Calculation Functions
    calculateCurrentBalance() {
        return this.transactions.reduce((sum, t) => sum + t.amount, 1245);
    }

    calculateMonthlySpent() {
        const currentMonth = new Date().getMonth();
        return this.transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
            .reduce((sum, t) => sum + Math.abs(t.amount), 664);
    }

    calculateSavingsProgress() {
        // Simplified calculation
        return 320;
    }

    calculateFinancialScore() {
        // Simplified scoring algorithm
        const budgetAdherence = 0.85; // 85% budget adherence
        const savingsRate = 0.70; // 70% savings rate
        const consistency = 0.80; // 80% consistency
        
        return Math.round((budgetAdherence + savingsRate + consistency) / 3 * 100);
    }

    getRecentTransactions(limit = 5) {
        return this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    generateSmartInsights() {
        return [
            {
                type: 'warning',
                title: 'Coffee Spending Alert',
                message: 'You\'ve spent 40% more on coffee this week.'
            },
            {
                type: 'success',
                title: 'Great Progress!',
                message: 'You\'re 85% on track with your monthly budget.'
            }
        ];
    }

    // Periodic Updates
    startPeriodicUpdates() {
        // Update data every minute (in a real app, this would be less frequent)
        setInterval(() => {
            this.updateRealTimeData();
        }, 60000);
    }

    updateRealTimeData() {
        // Simulate real-time updates
        const now = new Date();
        if (now.getSeconds() === 0) { // Update every minute
            this.renderCurrentPage();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fundFlowApp = new FundFlowApp();
});

// Add some utility functions for demo purposes
window.simulateTransaction = function(amount, description, category) {
    const transaction = {
        id: Date.now(),
        amount: amount,
        description: description,
        category: category,
        date: new Date().toISOString().split('T')[0],
        type: amount > 0 ? 'income' : 'expense'
    };
    
    window.fundFlowApp.addTransaction(transaction);
    window.fundFlowApp.showNotification('Demo transaction added!', 'info');
};

window.simulateGoalProgress = function(goalTitle, amount) {
    window.fundFlowApp.addGoalContribution(goalTitle, amount);
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                window.fundFlowApp.navigateToPage('dashboard');
                break;
            case '2':
                e.preventDefault();
                window.fundFlowApp.navigateToPage('budget');
                break;
            case '3':
                e.preventDefault();
                window.fundFlowApp.navigateToPage('transactions');
                break;
            case '4':
                e.preventDefault();
                window.fundFlowApp.navigateToPage('goals');
                break;
            case '5':
                e.preventDefault();
                window.fundFlowApp.navigateToPage('coaching');
                break;
        }
    }
});