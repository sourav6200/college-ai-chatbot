// Chat history to maintain context
let chatHistory = [];

// Send message when user clicks send button
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    // Don't send empty messages
    if (!message) return;
    
    // Clear input and disable send button
    input.value = '';
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    
    // Remove welcome message if present
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Display user message
    appendMessage('user', message);
    
    // Show loading indicator
    showLoading();
    
    try {
        // Send request to server
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });
        
        // Remove loading indicator
        removeLoading();
        
        if (!response.ok) {
            throw new Error('Failed to get response from server');
        }
        
        const data = await response.json();
        
        // Display bot response
        appendMessage('bot', data.reply);
        
        // Update chat history
        chatHistory.push(
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: data.reply }] }
        );
        
    } catch (error) {
        removeLoading();
        console.error('Error:', error);
        showError('Sorry, I encountered an error. Please make sure the server is running and try again.');
    }
    
    // Re-enable send button
    sendBtn.disabled = false;
    input.focus();
}

// Append message to chat box
function appendMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Show loading indicator
function showLoading() {
    const chatBox = document.getElementById('chatBox');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.textContent = 'Thinking';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove loading indicator
function removeLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show error message
function showError(errorText) {
    const chatBox = document.getElementById('chatBox');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorText;
    chatBox.appendChild(errorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Clear chat
function clearChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = `
        <div class="welcome-message">
            <h2>👋 Welcome!</h2>
            <p>I'm your AI assistant. Ask me anything about your studies, projects, or general questions!</p>
        </div>
    `;
    chatHistory = [];
    document.getElementById('userInput').focus();
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Focus on input when page loads
window.onload = function() {
    document.getElementById('userInput').focus();
};
