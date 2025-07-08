// Popup script for text Q&A about the current page
const GROQ_API_KEY = "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";
const VAPI_PUBLIC_KEY = "e6e4f797-344d-44d3-8b54-21a725776fb9"; // Define this for clarity


document.addEventListener('DOMContentLoaded', function() {
  const askForm = document.getElementById('askForm');
  const questionInput = document.getElementById('question');
  const responseDiv = document.getElementById('response');
  const errorDiv = document.getElementById('error');

  askForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;
    responseDiv.textContent = '';
    errorDiv.textContent = '';
    questionInput.disabled = true;
    askForm.querySelector('button').disabled = true;

    // Get page info
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: () => ({
          url: window.location.href,
          title: document.title,
          content: document.body.innerText.substring(0, 2000)
        })
      }, async (results) => {
        if (results && results[0] && results[0].result) {
          const pageContext = results[0].result;
          const answer = await askGroq(question, pageContext);
          responseDiv.textContent = 'Assistant: ' + answer;
          await speak(answer);
        } else {
          errorDiv.textContent = 'Could not get page context.';
        }
        questionInput.disabled = false;
        askForm.querySelector('button').disabled = false;
      });
    });
  });
});

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
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response";
  } catch (e) {
    console.error('Groq API error:', e); // Log the error for debugging
    return "Error contacting Groq.";
  }
}

let vapiInstance = null; // Declare a variable to hold the Vapi instance


async function speak(text) {
  try {
    // Only load Vapi SDK and initialize if not already done
    if (!vapiInstance) {
      await loadVapiSDK();
      if (!window.Vapi) {
        console.error('Vapi SDK not found after loading.');
        return;
      }
      vapiInstance = new window.Vapi(VAPI_PUBLIC_KEY);
      console.log('Vapi initialized in popup successfully.');
    }

    await vapiInstance.say({
      text: text,
      voice: {
        voiceId: "edfe10a1-7194-42ed-87fc-cdd78fe86f95"
      }
    });
  } catch (e) {
    console.error('Vapi speak error:', e);
    errorDiv.textContent = 'Could not initialize Vapi for speech.'; // Display error to user
  }
}

async function loadVapiSDK() {
  if (window.Vapi) return; // If Vapi is already loaded, do nothing
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // Use chrome.runtime.getURL for extension resources
    script.src = chrome.runtime.getURL('lib/vapi.min.js');
    script.onload = resolve;
    script.onerror = (e) => {
      console.error('Failed to load Vapi SDK script:', e);
      reject(e);
    };
    document.head.appendChild(script);
  });
}