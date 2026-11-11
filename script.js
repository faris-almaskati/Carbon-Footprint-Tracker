document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('footprint-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const totalElement = document.getElementById('total-footprint');
    const statusElement = document.getElementById('status');
    const targetComparison = document.getElementById('target-comparison');
    const breakdownElement = document.getElementById('breakdown');

    const metricUnit = document.querySelector('.metric-unit');

    if (!form || !submitBtn) return;

    if (metricUnit) metricUnit.style.display = 'none';
    if (statusElement) statusElement.style.display = 'none';

    function checkFormValidity() {
        if (form.checkValidity()) {
            submitBtn.removeAttribute('disabled');
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    form.addEventListener('input', checkFormValidity);
    form.addEventListener('change', checkFormValidity);

    checkFormValidity();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // 1. Calculate individual category totals in Tonnes
        const drivingAnnualKg = (parseFloat(document.getElementById('driving').value) || 0) * 52 * 0.17; 
        const publicAnnualKg  = (parseFloat(document.getElementById('public-transport').value) || 0) * 52 * 0.05; 
        const flightsAnnualKg = (parseFloat(document.getElementById('flights').value) || 0) * 500; 
        const transportTonnes = (drivingAnnualKg + publicAnnualKg + flightsAnnualKg) / 1000;

        const people = parseFloat(document.getElementById('people').value) || 1;
        const electricityAnnualKg = ((parseFloat(document.getElementById('electricity').value) || 0) * 12 * 0.3) / people; 
        const heatingAnnualKg     = ((parseFloat(document.getElementById('heating').value) || 0) * 12 * 0.2) / people;
        const energyTonnes = (electricityAnnualKg + heatingAnnualKg) / 1000;

        const selectedDiet = document.querySelector('input[name="diet"]:checked');
        const dietTonnes = parseFloat(selectedDiet.value); 

        const grandTotal = transportTonnes + energyTonnes + dietTonnes;

        // 2. Display Grand Total & Status
        totalElement.textContent = grandTotal.toFixed(1);

        if (grandTotal <= 2.5) {
            statusElement.textContent = "Low Impact";
            statusElement.className = "status-badge status-low";
            targetComparison.innerHTML = `<span>Status:</span> <span class="target-met">On track, keep it up!</span>`;
        } else if (grandTotal <= 5.0) {
            statusElement.textContent = "Moderate Impact";
            statusElement.className = "status-badge status-average";
            targetComparison.innerHTML = `<span>Status:</span> <span class="target-warning">Slightly over target</span>`;
        } else {
            statusElement.textContent = "High Impact";
            statusElement.className = "status-badge status-high";
            targetComparison.innerHTML = `<span>Status:</span> <span class="target-missed">Over target (Action needed)</span>`;
        }

        // 3. Determine Highest Impact Category & Generate Personalised Tip
        let tipTitle = "";
        let tipText = "";

        if (grandTotal <= 2.5) {
            tipTitle = "✨ Light Footprint!";
            tipText = "Your footprint is already below the 2030 target. Keep sharing your sustainable habits with friends and family!";
        } else if (transportTonnes >= energyTonnes && transportTonnes >= dietTonnes) {
            tipTitle = "🚗 Biggest Impact: Transport";
            tipText = "Try swapping one weekly car trip for public transport, cycling, or walking, or consider offsetting your next flight.";
        } else if (energyTonnes >= transportTonnes && energyTonnes >= dietTonnes) {
            tipTitle = "⚡ Biggest Impact: Home Energy";
            tipText = "Lowering your thermostat by just 1°C and switching off appliances at the wall can cut your home emissions significantly.";
        } else {
            tipTitle = "🥗 Biggest Impact: Diet";
            tipText = "Introducing two or three plant-based meals a week is one of the fastest ways to shrink your food footprint.";
        }

        if (breakdownElement) {
            breakdownElement.innerHTML = `
                <div class="eco-tip-card">
                    <strong>${tipTitle}</strong>
                    <p>${tipText}</p>
                </div>
            `;
        }

        if (metricUnit) metricUnit.style.display = 'block';
        if (statusElement) statusElement.style.display = 'block';
    });
});