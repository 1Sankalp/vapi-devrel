// Inject a floating voice button for voice Q&A
(function() {
  if (window.voiceAssistantInjected) return;
  window.voiceAssistantInjected = true;

  // Create button
  const btn = document.createElement('button');
  btn.textContent = '🎤 Ask about this page';
  btn.style.position = 'fixed';
  btn.style.bottom = '24px';
  btn.style.right = '24px';
  btn.style.zIndex = '999999';
  btn.style.background = '#2563eb';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '24px';
  btn.style.padding = '14px 22px';
  btn.style.fontWeight = '600';
  btn.style.fontSize = '16px';
  btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
  btn.style.cursor = 'pointer';
  btn.style.transition = 'all 0.2s';

  document.body.appendChild(btn);

  // Create response box
  const respBox = document.createElement('div');
  respBox.style.position = 'fixed';
  respBox.style.bottom = '80px';
  respBox.style.right = '24px';
  respBox.style.zIndex = '999999';
  respBox.style.background = '#fff';
  respBox.style.color = '#222';
  respBox.style.borderRadius = '16px';
  respBox.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  respBox.style.padding = '16px';
  respBox.style.maxWidth = '340px';
  respBox.style.display = 'none';
  respBox.style.fontSize = '14px';
  respBox.style.lineHeight = '1.5';
  respBox.style.border = '1px solid #e5e7eb';
  document.body.appendChild(respBox);

  // Speech recognition setup
  const GROQ_API_KEY = "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";
  const VAPI_PUBLIC_KEY = "e6e4f797-344d-44d3-8b54-21a725776fb9";
  let recognition;
  let listening = false;
  let vapi = null;
  
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Initialize Vapi
  async function initVapi() {
    try {
      await loadVapiSDK();
      if (window.Vapi) {
        vapi = new window.Vapi(VAPI_PUBLIC_KEY);
        console.log('Vapi initialized successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
      return false;
    }
    return false;
  }

  btn.addEventListener('click', async function() {
    if (!window.SpeechRecognition) {
      showResp('Speech recognition not supported in this browser.', true);
      return;
    }
    
    if (listening) return;
    
    recognition = new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    listening = true;
    btn.textContent = '🎤 Listening...';
    btn.style.background = '#dc2626';
    showResp('Listening... Please speak your question.', false);

    recognition.onresult = async function(event) {
      listening = false;
      btn.textContent = '🎤 Processing...';
      btn.style.background = '#f59e0b';
      
      const transcript = event.results[0][0].transcript;
      showResp('<strong>You:</strong> ' + transcript + '<br><br><em>Getting response...</em>', false);
      
      // Get page context
      const pageContext = {
        url: window.location.href,
        title: document.title,
        content: document.body.innerText.substring(0, 2000)
      };
      
      const answer = await askGroq(transcript, pageContext);
      showResp('<strong>You:</strong> ' + transcript + '<br><br><strong>Assistant:</strong> ' + answer, false);
      
      // Try to speak the response
      await speak(answer);
      
      resetButton();
    };

    recognition.onerror = function(event) {
      listening = false;
      showResp('Speech recognition error: ' + event.error, true);
      resetButton();
    };

    recognition.onend = function() {
      if (listening) {
        listening = false;
        resetButton();
      }
    };

    recognition.start();
  });

  function resetButton() {
    btn.textContent = '🎤 Ask about this page';
    btn.style.background = '#2563eb';
  }

  function showResp(msg, isError) {
    respBox.innerHTML = msg;
    respBox.style.display = 'block';
    respBox.style.color = isError ? '#dc2626' : '#222';
    respBox.style.background = isError ? '#fef2f2' : '#fff';
    respBox.style.borderColor = isError ? '#fca5a5' : '#e5e7eb';
    
    // Auto-hide after 10 seconds for non-error messages
    if (!isError) {
      setTimeout(() => {
        respBox.style.display = 'none';
      }, 10000);
    }
  }

  async function askGroq(question, pageContext) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are a helpful voice assistant. You can see the current webpage the user is on.\nCurrent page URL: ${pageContext.url}\nCurrent page title: ${pageContext.title}\nCurrent page content: ${pageContext.content}\nAnswer questions about this page or provide general assistance. Be concise and helpful.`
            },
            { role: "user", content: question },
          ],
          max_tokens: 256,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response received";
    } catch (error) {
      console.error('Groq API error:', error);
      return "Error contacting AI service. Please try again.";
    }
  }

  async function speak(text) {
    // Try Web Speech API first (more reliable)
    if (window.speechSynthesis) {
      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        speechSynthesis.speak(utterance);
        return;
      } catch (error) {
        console.error('Web Speech API error:', error);
      }
    }
    
    // Fallback to Vapi if Web Speech API fails
    try {
      if (!vapi) {
        const initialized = await initVapi();
        if (!initialized) {
          console.warn('Could not initialize Vapi for speech');
          return;
        }
      }
      
      // Use Vapi for speech synthesis
      if (vapi && vapi.say) {
        await vapi.say({
          text: text,
          voice: {
            voiceId: "edfe10a1-7194-42ed-87fc-cdd78fe86f95"
          }
        });
      }
    } catch (error) {
      console.error('Vapi speech error:', error);
    }
  }

  // Load Vapi SDK from CDN
  async function loadVapiSDK() {
    if (window.Vapi) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
      script.onload = () => {
        console.log('Vapi SDK loaded successfully');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Vapi SDK:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  // Initialize Vapi when the script loads
  initVapi().then(success => {
    if (success) {
      console.log('Voice assistant ready with Vapi support');
    } else {
      console.log('Voice assistant ready with Web Speech API only');
    }
  });

  // Add click outside to close response box
  document.addEventListener('click', function(event) {
    if (!respBox.contains(event.target) && !btn.contains(event.target)) {
      respBox.style.display = 'none';
    }
  });
})();