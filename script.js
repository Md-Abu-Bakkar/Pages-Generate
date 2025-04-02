// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Toggle Telegram fields
document.getElementById('enableTelegram').addEventListener('change', function() {
    document.getElementById('telegramFields').style.display = this.checked ? 'block' : 'none';
});

// Toggle custom code field
document.getElementById('enableCustomCode').addEventListener('change', function() {
    document.getElementById('customCodeField').classList.toggle('hidden', !this.checked);
});

// Plan management
function addPlan() {
    const name = document.getElementById('newPlanName').value.trim();
    const price = document.getElementById('newPlanPrice').value.trim();
    
    if (!name) {
        showToast('Please enter plan name', 'error');
        return;
    }
    
    if (!price) {
        showToast('Please enter plan price', 'error');
        return;
    }
    
    const planDiv = document.createElement('div');
    planDiv.className = 'plan-item';
    planDiv.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <input type="text" value="${escapeHtml(name)}" class="plan-name" style="flex: 1;" required>
            <input type="text" value="${escapeHtml(price)}" class="plan-price" style="flex: 1;" required>
            <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.remove(); checkPlans();">Remove</button>
        </div>
    `;
    document.getElementById('plansList').appendChild(planDiv);
    
    document.getElementById('newPlanName').value = '';
    document.getElementById('newPlanPrice').value = '';
    document.getElementById('plansError').style.display = 'none';
    showToast('Plan added successfully', 'success');
}

// Payment method management
function addPaymentMethod() {
    const methodDiv = document.createElement('div');
    methodDiv.className = 'payment-method';
    methodDiv.innerHTML = `
        <div class="form-group">
            <label>Method Name</label>
            <input type="text" class="methodName" placeholder="e.g., PayPal" required>
            <div class="error-message methodNameError">Please enter method name</div>
        </div>
        <div class="form-group">
            <label>Payment Address</label>
            <input type="text" class="methodAddress" placeholder="e.g., paypal.me/yourname" required>
            <div class="error-message methodAddressError">Please enter payment address</div>
        </div>
        <button type="button" class="btn btn-danger" onclick="this.parentElement.remove(); checkPaymentMethods();">Remove Method</button>
    `;
    document.getElementById('paymentMethods').appendChild(methodDiv);
    document.getElementById('paymentMethodsError').style.display = 'none';
    showToast('Payment method added', 'success');
}

// Check if plans exist
function checkPlans() {
    const plans = document.querySelectorAll('.plan-item');
    if (plans.length === 0) {
        document.getElementById('plansError').style.display = 'block';
    }
}

// Check if payment methods exist
function checkPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');
    if (methods.length === 0) {
        document.getElementById('paymentMethodsError').style.display = 'block';
    }
}

// Validate login form
function validateLoginForm() {
    let isValid = true;
    
    if (!document.getElementById('loginTitle').value.trim()) {
        document.getElementById('loginTitleError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('loginTitleError').style.display = 'none';
    }
    
    if (!document.getElementById('loginUsername').value.trim()) {
        document.getElementById('loginUsernameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('loginUsernameError').style.display = 'none';
    }
    
    if (!document.getElementById('loginPassword').value.trim()) {
        document.getElementById('loginPasswordError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('loginPasswordError').style.display = 'none';
    }
    
    if (document.getElementById('enableTelegram').checked) {
        if (!document.getElementById('botToken').value.trim()) {
            document.getElementById('botTokenError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('botTokenError').style.display = 'none';
        }
        
        if (!document.getElementById('adminId').value.trim()) {
            document.getElementById('adminIdError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('adminIdError').style.display = 'none';
        }
    }
    
    return isValid;
}

// Validate subscription form
function validateSubscriptionForm() {
    let isValid = true;
    
    const plans = document.querySelectorAll('.plan-item');
    if (plans.length === 0) {
        document.getElementById('plansError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('plansError').style.display = 'none';
        
        // Validate each plan
        plans.forEach(plan => {
            const name = plan.querySelector('.plan-name').value.trim();
            const price = plan.querySelector('.plan-price').value.trim();
            
            if (!name || !price) {
                isValid = false;
            }
        });
    }
    
    const methods = document.querySelectorAll('.payment-method');
    if (methods.length === 0) {
        document.getElementById('paymentMethodsError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('paymentMethodsError').style.display = 'none';
        
        // Validate each payment method
        methods.forEach(method => {
            const name = method.querySelector('.methodName').value.trim();
            const address = method.querySelector('.methodAddress').value.trim();
            
            if (!name || !address) {
                isValid = false;
            }
        });
    }
    
    if (!document.getElementById('subBotToken').value.trim()) {
        document.getElementById('subBotTokenError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('subBotTokenError').style.display = 'none';
    }
    
    if (!document.getElementById('subAdminId').value.trim()) {
        document.getElementById('subAdminIdError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('subAdminIdError').style.display = 'none';
    }
    
    return isValid;
}

// Generate Login Code
function generateLoginCode() {
    if (!validateLoginForm()) {
        showToast('Please fix all errors before generating code', 'error');
        return;
    }
    
    const title = document.getElementById('loginTitle').value.trim();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const enableTelegram = document.getElementById('enableTelegram').checked;
    const botToken = document.getElementById('botToken').value.trim();
    const adminId = document.getElementById('adminId').value.trim();
    const hideAfterLogin = document.getElementById('hideAfterLogin').checked;
    const enableCustomCode = document.getElementById('enableCustomCode').checked;
    const customHtml = document.getElementById('customHtml').value;
    
    let telegramScript = '';
    if (enableTelegram) {
        telegramScript = `
            // Send Telegram notification if accessed via Telegram
            if (isTelegramWebApp()) {
                const user = Telegram.WebApp.initDataUnsafe.user;
                const message = 
                    "🔐 Login\\n─────────────────\\n" +
                    "👤 User: @" + (user.username || 'N/A') + "\\n" +
                    "🆔 Telegram ID: " + user.id + "\\n" +
                    "📝 Name: " + (user.first_name || '') + (user.last_name ? ' ' + user.last_name : '') + "\\n" +
                    "🕒 Time: " + new Date().toLocaleString() + "\\n" +
                    "─────────────────";
                
                fetch(\`https://api.telegram.org/bot${botToken}/sendMessage\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: "${adminId}",
                        text: message
                    })
                }).catch(error => {
                    console.error('Error sending Telegram notification:', error);
                });
            }
        `;
    }
    
    let hideScript = '';
    if (hideAfterLogin) {
        hideScript = `document.getElementById('loginFormContainer').style.display = 'none';`;
    }
    
    let customCodeScript = '';
    if (enableCustomCode && customHtml.trim()) {
        customCodeScript = `
            // Only add custom HTML after successful login
            const customHTML = \`${escapeHtml(customHtml.replace(/`/g, '\\`'))}\`;
            document.getElementById('protectedContent').innerHTML = customHTML;
            document.getElementById('protectedContent').style.display = 'block';
        `;
    }
    
    const code = `<!DOCTYPE html>
<html>
<head>
    <title>${escapeHtml(title)}</title>
    <script src="https://telegram.org/js/telegram-web-app.js"><\/script>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .login-container {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0088cc;
            text-align: center;
            margin-bottom: 20px;
        }
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .login-form input {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .login-form button {
            background: #0088cc;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .login-form button:hover {
            background: #006699;
        }
        .error {
            color: #ff4444;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }
        #protectedContent {
            display: none;
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="loginFormContainer">
        <div class="login-container">
            <h1>${escapeHtml(title)}</h1>
            <form id="loginForm" class="login-form">
                <div>
                    <input type="text" id="inputUsername" placeholder="Username" required>
                    <div class="error" id="usernameError">Please enter username</div>
                </div>
                <div>
                    <input type="password" id="inputPassword" placeholder="Password" required>
                    <div class="error" id="passwordError">Please enter password</div>
                </div>
                <button type="button" onclick="handleLogin()">Login</button>
            </form>
        </div>
    </div>

    <div id="protectedContent"></div>

    <script>
        function isTelegramWebApp() {
            return typeof Telegram !== 'undefined' && 
                   Telegram.WebApp && 
                   Telegram.WebApp.initDataUnsafe;
        }
        
        function handleLogin() {
            const inputUsername = document.getElementById('inputUsername').value.trim();
            const inputPassword = document.getElementById('inputPassword').value.trim();
            
            // Reset errors
            document.getElementById('usernameError').style.display = 'none';
            document.getElementById('passwordError').style.display = 'none';
            
            // Validate inputs
            let isValid = true;
            
            if (!inputUsername) {
                document.getElementById('usernameError').style.display = 'block';
                isValid = false;
            }
            
            if (!inputPassword) {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Check credentials (in production, use server-side validation)
            if (inputUsername !== "${escapeHtml(username)}" || inputPassword !== "${escapeHtml(password)}") {
                alert("Invalid username or password");
                return;
            }
            
            // Login successful
            alert("Login successful!");
            ${hideScript}
            
            ${customCodeScript}
            
            ${telegramScript}
            
            // Initialize Telegram WebApp if available
            if (isTelegramWebApp()) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
            }
        }
    <\/script>
</body>
</html>`;
    
    document.getElementById('loginCode').value = code;
    document.getElementById('loginCodeContainer').style.display = 'block';
    showToast('Login page code generated successfully', 'success');
}

// Generate Subscription Code
function generateSubscriptionCode() {
    if (!validateSubscriptionForm()) {
        showToast('Please fix all errors before generating code', 'error');
        return;
    }
    
    const botToken = document.getElementById('subBotToken').value.trim();
    const adminId = document.getElementById('subAdminId').value.trim();
    
    // Get plans
    const plans = [];
    document.querySelectorAll('.plan-item').forEach(plan => {
        const name = plan.querySelector('.plan-name').value.trim();
        const price = plan.querySelector('.plan-price').value.trim();
        if (name && price) {
            plans.push({ name, price });
        }
    });
    
    // Get payment methods
    const paymentMethods = [];
    document.querySelectorAll('.payment-method').forEach(method => {
        const name = method.querySelector('.methodName').value.trim();
        const address = method.querySelector('.methodAddress').value.trim();
        if (name && address) {
            paymentMethods.push({ name, address });
        }
    });
    
    const code = `<!DOCTYPE html>
<html>
<head>
    <title>Subscription Plans</title>
    <script src="https://telegram.org/js/telegram-web-app.js"><\/script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .subscribe-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0088cc;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        .popup-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1001;
            justify-content: center;
            align-items: center;
        }
        .popup-content {
            background: white;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .plan-option {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            transition: all 0.3s;
        }
        .plan-option:hover {
            border-color: #0088cc;
            box-shadow: 0 2px 8px rgba(0,136,204,0.1);
        }
        .plan-name {
            font-weight: bold;
            font-size: 18px;
            color: #0088cc;
        }
        .plan-price {
            font-size: 16px;
            margin: 5px 0 10px;
        }
        .select-plan-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .payment-section {
            display: none;
            margin-top: 20px;
        }
        .payment-method {
            margin-bottom: 15px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .copy-btn {
            background: #f0f0f0;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
        }
        .txn-input {
            margin: 15px 0;
        }
        .txn-input input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .submit-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px;
            width: 100%;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        .back-btn {
            background: #f0f0f0;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 15px;
        }
        .error {
            color: #ff4444;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }
        @media (max-width: 480px) {
            .popup-content {
                width: 95%;
                padding: 15px;
            }
            .plan-option {
                padding: 10px;
            }
            .subscribe-btn {
                bottom: 10px;
                right: 10px;
                padding: 10px 20px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <button class="subscribe-btn" onclick="showPopup()">Subscribe Now</button>
    
    <div class="popup-overlay" id="popup">
        <div class="popup-content">
            <button class="back-btn" id="backBtn" style="display: none;" onclick="goBack()">← Back</button>
            <h2>Choose a Plan</h2>
            
            <div id="plansSection">
                ${plans.map(plan => `
                    <div class="plan-option">
                        <div class="plan-name">${escapeHtml(plan.name)}</div>
                        <div class="plan-price">${escapeHtml(plan.price)}</div>
                        <button class="select-plan-btn" onclick="selectPlan('${escapeHtml(plan.name)}', '${escapeHtml(plan.price)}')">Select Plan</button>
                    </div>
                `).join('')}
            </div>
            
            <div id="paymentSection" class="payment-section">
                <h3>Payment Information</h3>
                <p>Please send payment to one of the following methods:</p>
                
                ${paymentMethods.map(method => `
                    <div class="payment-method">
                        <p>
                            <strong>${escapeHtml(method.name)}:</strong> 
                            <span id="${method.name.toLowerCase().replace(/\s+/g, '-')}-address">${escapeHtml(method.address)}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${method.name.toLowerCase().replace(/\s+/g, '-')}-address')">Copy</button>
                        </p>
                    </div>
                `).join('')}
                
                <div class="txn-input">
                    <label for="txnId">Transaction ID:</label>
                    <input type="text" id="txnId" placeholder="Enter transaction ID after payment">
                    <div class="error" id="txnError">Please enter transaction ID</div>
                </div>
                
                <button class="submit-btn" onclick="submitPayment()">Complete Subscription</button>
            </div>
        </div>
    </div>

    <script>
        function isTelegramWebApp() {
            return typeof Telegram !== 'undefined' && 
                   Telegram.WebApp && 
                   Telegram.WebApp.initDataUnsafe;
        }
        
        let selectedPlan = '';
        let selectedPrice = '';
        
        function showPopup() {
            document.getElementById('popup').style.display = 'flex';
            document.getElementById('paymentSection').style.display = 'none';
            document.getElementById('backBtn').style.display = 'none';
            document.getElementById('plansSection').style.display = 'block';
            
            // Initialize Telegram WebApp if available
            if (isTelegramWebApp()) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                Telegram.WebApp.BackButton.onClick(goBack);
            }
        }
        
        function selectPlan(plan, price) {
            selectedPlan = plan;
            selectedPrice = price;
            document.getElementById('plansSection').style.display = 'none';
            document.getElementById('paymentSection').style.display = 'block';
            document.getElementById('backBtn').style.display = 'block';
            
            if (isTelegramWebApp()) {
                Telegram.WebApp.BackButton.show();
            }
        }
        
        function goBack() {
            document.getElementById('plansSection').style.display = 'block';
            document.getElementById('paymentSection').style.display = 'none';
            document.getElementById('backBtn').style.display = 'none';
            
            if (isTelegramWebApp()) {
                Telegram.WebApp.BackButton.hide();
            }
        }
        
        function copyToClipboard(id) {
            const text = document.getElementById(id).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert("Copied to clipboard!");
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert("Failed to copy. Please try again.");
            });
        }
        
        async function submitPayment() {
            const txnId = document.getElementById('txnId').value.trim();
            
            // Validate transaction ID
            if (!txnId) {
                document.getElementById('txnError').style.display = 'block';
                return;
            }
            document.getElementById('txnError').style.display = 'none';
            
            // Get selected payment method
            const paymentMethod = document.querySelector('.payment-method:first-child strong').textContent;
            
            // Prepare user info
            let userInfo = "Accessed via web browser";
            if (isTelegramWebApp()) {
                const user = Telegram.WebApp.initDataUnsafe.user;
                userInfo = 
                    "👤 User: @" + (user.username || 'N/A') + "\\n" +
                    "🆔 Telegram ID: " + user.id + "\\n" +
                    "📝 Name: " + (user.first_name || '') + (user.last_name ? ' ' + user.last_name : '');
            }
            
            const message = 
                "🛒 New Subscription\\n─────────────────\\n" +
                userInfo + "\\n" +
                "📆 Plan: " + selectedPlan + "\\n" +
                "💰 Amount: " + selectedPrice + "\\n" +
                "💳 Payment Method: " + paymentMethod + "\\n" +
                "📜 TXN ID: " + txnId + "\\n" +
                "🕒 Time: " + new Date().toLocaleString() + "\\n" +
                "─────────────────";
            
            try {
                await fetch(\`https://api.telegram.org/bot${botToken}/sendMessage\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: "${adminId}",
                        text: message
                    })
                });
                alert("Subscription successful! Thank you.");
                document.getElementById('popup').style.display = 'none';
                
                if (isTelegramWebApp()) {
                    Telegram.WebApp.BackButton.hide();
                }
            } catch (error) {
                console.error('Error sending Telegram notification:', error);
                alert("Subscription successful but notification failed. Please contact admin.");
            }
        }
        
        // Initialize Telegram WebApp if available
        if (isTelegramWebApp()) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
        }
    <\/script>
</body>
</html>`;
    
    document.getElementById('subscriptionCode').value = code;
    document.getElementById('subscriptionCodeContainer').style.display = 'block';
    showToast('Subscription page code generated successfully', 'success');
}

// Copy code to clipboard
function copyCode(elementId) {
    const code = document.getElementById(elementId);
    code.select();
    document.execCommand('copy');
    
    // Show copied feedback
    showToast('Code copied to clipboard!', 'success');
}

// Download code as file
function downloadCode(elementId, filename) {
    const code = document.getElementById(elementId).value;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('File downloaded successfully!', 'success');
}

// Show toast message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event listeners
document.getElementById('generateLoginBtn').addEventListener('click', generateLoginCode);
document.getElementById('generateSubscriptionBtn').addEventListener('click', generateSubscriptionCode);
document.getElementById('addPlanBtn').addEventListener('click', addPlan);
document.getElementById('addPaymentMethodBtn').addEventListener('click', addPaymentMethod);

// Initialize with Telegram fields visible
document.getElementById('telegramFields').style.display = 
    document.getElementById('enableTelegram').checked ? 'block' : 'none';
