// Charts and Data Visualization for FundFlow

class FundFlowCharts {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#6366f1',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6',
            gray: '#6b7280'
        };
    }

    initializeCharts() {
        this.initCashFlowChart();
        this.initBudgetChart();
        this.initScoreChart();
    }

    // Cash Flow Chart (Line Chart)
    initCashFlowChart() {
        const canvas = document.getElementById('cashFlowChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Sample data for 7 days
        const cashFlowData = this.generateCashFlowData();
        
        this.drawCashFlowChart(ctx, canvas, cashFlowData);
    }

    drawCashFlowChart(ctx, canvas, data) {
        const { width, height } = canvas;
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set up styling
        ctx.lineWidth = 2;
        ctx.font = '12px Inter, sans-serif';

        // Draw grid and axes
        this.drawChartGrid(ctx, padding, chartWidth, chartHeight, data);

        // Draw cash flow line
        this.drawCashFlowLine(ctx, padding, chartWidth, chartHeight, data);

        // Draw data points
        this.drawCashFlowPoints(ctx, padding, chartWidth, chartHeight, data);
    }

    drawChartGrid(ctx, padding, width, height, data) {
        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const valueRange = maxValue - minValue;
        const gridLines = 5;

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= gridLines; i++) {
            const y = padding + (height / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxValue - (valueRange / gridLines) * i;
            ctx.fillStyle = '#6b7280';
            ctx.fillText(`₹${Math.round(value)}`, 10, y + 4);
        }

        // Vertical grid lines
        for (let i = 0; i <= data.labels.length - 1; i++) {
            const x = padding + (width / (data.labels.length - 1)) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + height);
            ctx.stroke();

            // X-axis labels
            ctx.fillStyle = '#6b7280';
            ctx.fillText(data.labels[i], x - 15, padding + height + 20);
        }
    }

    drawCashFlowLine(ctx, padding, width, height, data) {
        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const valueRange = maxValue - minValue || 1;

        ctx.strokeStyle = this.chartColors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.values.forEach((value, index) => {
            const x = padding + (width / (data.values.length - 1)) * index;
            const y = padding + height - ((value - minValue) / valueRange) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    drawCashFlowPoints(ctx, padding, width, height, data) {
        const maxValue = Math.max(...data.values);
        const minValue = Math.min(...data.values);
        const valueRange = maxValue - minValue || 1;

        data.values.forEach((value, index) => {
            const x = padding + (width / (data.values.length - 1)) * index;
            const y = padding + height - ((value - minValue) / valueRange) * height;

            // Draw point
            ctx.fillStyle = this.chartColors.primary;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Draw white center
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Budget Donut Chart
    initBudgetChart() {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const budgetData = this.generateBudgetData();
        
        this.drawBudgetDonutChart(ctx, canvas, budgetData);
    }

    drawBudgetDonutChart(ctx, canvas, data) {
        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2 - 20;
        const innerRadius = outerRadius * 0.6;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        let startAngle = -Math.PI / 2;
        
        data.segments.forEach((segment) => {
            const sliceAngle = (segment.percentage / 100) * 2 * Math.PI;
            
            // Draw segment
            ctx.fillStyle = segment.color;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Draw remaining budget segment
        const remainingAngle = (data.remaining / 100) * 2 * Math.PI;
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + remainingAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + remainingAngle, startAngle, true);
        ctx.closePath();
        ctx.fill();
    }

    // Financial Score Chart (Circular Progress)
    initScoreChart() {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawScoreChart(ctx, canvas, 78); // 78% score
    }

    drawScoreChart(ctx, canvas, score) {
        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 15;
        const lineWidth = 12;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background circle
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw progress arc
        const progressAngle = (score / 100) * 2 * Math.PI;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, this.chartColors.primary);
        gradient.addColorStop(1, this.chartColors.success);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progressAngle);
        ctx.stroke();
    }

    // Data generation functions
    generateCashFlowData() {
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const baseValue = 1200;
        const values = [];

        // Generate sample cash flow data
        for (let i = 0; i < 7; i++) {
            const variation = (Math.random() - 0.5) * 200;
            const dailyChange = Math.random() > 0.5 ? 
                Math.random() * 50 : // income day
                -Math.random() * 80; // expense day
            values.push(baseValue + variation + (dailyChange * i));
        }

        return { labels, values };
    }

    generateBudgetData() {
        return {
            segments: [
                { category: 'Food', percentage: 21, color: '#ef4444' },
                { category: 'Transport', percentage: 7, color: '#f59e0b' },
                { category: 'Entertainment', percentage: 5, color: '#22c55e' },
                { category: 'Education', percentage: 44, color: '#6366f1' }
            ],
            remaining: 23
        };
    }

    // Animation functions
    animateChart(chartId, duration = 1000) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            // Redraw chart with animation progress
            this.redrawChartWithProgress(chartId, easeOutCubic);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    redrawChartWithProgress(chartId, progress) {
        switch (chartId) {
            case 'cashFlowChart':
                this.animateCashFlowChart(progress);
                break;
            case 'budgetChart':
                this.animateBudgetChart(progress);
                break;
            case 'scoreChart':
                this.animateScoreChart(progress);
                break;
        }
    }

    animateCashFlowChart(progress) {
        const canvas = document.getElementById('cashFlowChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateCashFlowData();
        
        // Modify data based on progress
        const animatedData = {
            labels: data.labels,
            values: data.values.map((value, index) => {
                const targetIndex = Math.floor(progress * data.values.length);
                return index <= targetIndex ? value : data.values[0];
            })
        };

        this.drawCashFlowChart(ctx, canvas, animatedData);
    }

    animateBudgetChart(progress) {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateBudgetData();
        
        // Animate segments appearing one by one
        const animatedData = {
            segments: data.segments.map((segment, index) => ({
                ...segment,
                percentage: progress > (index / data.segments.length) ? 
                    segment.percentage * ((progress - (index / data.segments.length)) * data.segments.length) : 0
            })),
            remaining: data.remaining
        };

        this.drawBudgetDonutChart(ctx, canvas, animatedData);
    }

    animateScoreChart(progress) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const targetScore = 78;
        const animatedScore = targetScore * progress;
        
        this.drawScoreChart(ctx, canvas, animatedScore);
    }

    // Responsive handling
    handleResize() {
        // Reinitialize charts on window resize
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    // Interactive features
    addChartInteractivity() {
        const charts = ['cashFlowChart', 'budgetChart', 'scoreChart'];
        
        charts.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (!canvas) return;

            canvas.addEventListener('mousemove', (e) => this.handleChartHover(e, chartId));
            canvas.addEventListener('mouseleave', () => this.handleChartLeave(chartId));
            canvas.addEventListener('click', (e) => this.handleChartClick(e, chartId));
        });
    }

    handleChartHover(event, chartId) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Change cursor to pointer when hovering over interactive elements
        canvas.style.cursor = 'pointer';

        // Add hover effects (placeholder for now)
        console.log(`Hovering over ${chartId} at (${x}, ${y})`);
    }

    handleChartLeave(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            canvas.style.cursor = 'default';
        }
    }

    handleChartClick(event, chartId) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        console.log(`Clicked on ${chartId} at (${x}, ${y})`);
        
        // Handle chart interactions based on chart type
        switch (chartId) {
            case 'budgetChart':
                this.handleBudgetChartClick(x, y, canvas);
                break;
            case 'cashFlowChart':
                this.handleCashFlowChartClick(x, y, canvas);
                break;
            case 'scoreChart':
                this.handleScoreChartClick();
                break;
        }
    }

    handleBudgetChartClick(x, y, canvas) {
        // Determine which segment was clicked
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const outerRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
        const innerRadius = outerRadius * 0.6;

        if (distance >= innerRadius && distance <= outerRadius) {
            // Calculate angle
            const angle = Math.atan2(y - centerY, x - centerX);
            const normalizedAngle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
            
            // Determine which segment (simplified)
            const segmentIndex = Math.floor(normalizedAngle / (Math.PI / 2));
            const categories = ['Food', 'Transport', 'Entertainment', 'Education'];
            
            if (categories[segmentIndex]) {
                window.fundFlowApp?.showNotification(`Viewing ${categories[segmentIndex]} category details`, 'info');
            }
        }
    }

    handleCashFlowChartClick(x, y, canvas) {
        // Show detailed information for the clicked day
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const dayWidth = chartWidth / 6;
        const dayIndex = Math.floor((x - padding) / dayWidth);
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        if (dayIndex >= 0 && dayIndex < days.length) {
            window.fundFlowApp?.showNotification(`Showing details for ${days[dayIndex]}`, 'info');
        }
    }

    handleScoreChartClick() {
        window.fundFlowApp?.showNotification('Opening financial health breakdown...', 'info');
    }

    // Export functionality
    exportChart(chartId, filename) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        // Create download link
        const link = document.createElement('a');
        link.download = filename || `${chartId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    // Update chart data
    updateChartData(chartId, newData) {
        switch (chartId) {
            case 'cashFlowChart':
                this.updateCashFlowData(newData);
                break;
            case 'budgetChart':
                this.updateBudgetData(newData);
                break;
            case 'scoreChart':
                this.updateScoreData(newData);
                break;
        }
    }

    updateCashFlowData(data) {
        const canvas = document.getElementById('cashFlowChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawCashFlowChart(ctx, canvas, data);
    }

    updateBudgetData(data) {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawBudgetDonutChart(ctx, canvas, data);
    }

    updateScoreData(score) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawScoreChart(ctx, canvas, score);
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fundFlowCharts = new FundFlowCharts();
    
    // Add to window for external access
    window.fundFlowApp = window.fundFlowApp || {};
    window.fundFlowApp.initCharts = () => {
        window.fundFlowCharts.initializeCharts();
        window.fundFlowCharts.addChartInteractivity();
    };
    
    window.fundFlowApp.initBudgetChart = () => {
        window.fundFlowCharts.initBudgetChart();
        setTimeout(() => window.fundFlowCharts.animateChart('budgetChart'), 200);
    };
    
    window.fundFlowApp.initScoreChart = () => {
        window.fundFlowCharts.initScoreChart();
        setTimeout(() => window.fundFlowCharts.animateChart('scoreChart'), 200);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        window.fundFlowCharts.handleResize();
    });
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FundFlowCharts;
}