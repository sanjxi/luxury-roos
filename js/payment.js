/**
 * Payment Module
 * Simulates payment processing.
 */

const Payment = {
    process: (cardDetails) => {
        return new Promise((resolve, reject) => {
            // Simulate realistic API delay
            setTimeout(() => {
                // Formatting
                const cleanNum = cardDetails.number.replace(/\s/g, '');

                // Basic validation (Luhn algorithm placeholder)
                if (cleanNum.length >= 13 && cardDetails.cvv.length >= 3) {
                    resolve({ success: true, transactionId: 'tx_' + Date.now() });
                } else {
                    reject({ success: false, message: 'Payment Declined: Invalid card details.' });
                }
            }, 2500); // 2.5s delay
        });
    }
};
