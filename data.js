/**
 * Retailer QR Bypass & Read-Only Logic
 * This script handles automatic login via QR code and restricts access.
 */
(function() {
    // We use an interval to ensure the data from the Gist is fully loaded before attempting bypass
    const qrInterval = setInterval(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const rId = urlParams.get('id'); // Looks for ?id=XXXX in the URL

        // Check if ID exists and performanceData is populated from the Cloud/Gist
        if (rId && window.performanceData && window.performanceData.length > 0) {
            
            // Validate if the ID from the QR code exists in our records
            const retailerExists = window.performanceData.some(r => 
                String(getExcelVal(r, 'Bizom ID')) === String(rId)
            );

            if (retailerExists) {
                clearInterval(qrInterval); // Stop checking once found

                // 1. Bypass Login Screen
                document.getElementById('loginScreen').classList.add('hidden');
                document.getElementById('mainApp').classList.remove('hidden');

                // 2. Open the specific Retailer's detailed view immediately
                openDrilldown(rId);

                // 3. Enforce "Read-Only" mode by hiding administrative features
                // This prevents retailers from syncing new data or browsing other regions
                const syncBtn = document.getElementById('syncBtnContainer');
                const adminFilters = document.getElementById('adminFilters');
                
                if (syncBtn) syncBtn.style.display = 'none';
                if (adminFilters) adminFilters.style.display = 'none';

                console.log("Retailer Access Verified: Read-Only Mode Active");
            }
        }
    }, 500); // Checks every 500ms until data is ready
})();
