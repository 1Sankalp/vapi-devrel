# (Blog Post)
# I Turned Every Website into a Voice Assistant Using Vapi + Groq

What if you could talk to any webpage and it talked back?

That’s the idea behind this project - a Chrome extension that adds a persistent floating voice assistant to every website you visit. Built with Vapi and Groq, it turns static pages into interactive, contextual voice interfaces.

## 🚀 What I Built

The extension injects a floating widget into the bottom-right corner of your browser window. Once enabled, it stays visible across all tabs and all websites.

Click the widget, speak your question - and the agent responds with voice, powered by Vapi.

It understands:

- The current URL
- The content of the page
- Your question’s context

So whether you’re on a blog, e-commerce site, GitHub repo, or news article - you can ask:

- “What’s this page about?”
- “Give me a summary.”
- “Explain this in simple terms.”
- “How does this compare to [X]?”

And it speaks the answer back.

## 🧠 Why Voice Output Changes the Game

Most people think of voice agents as input layers - like Siri or speech-to-text.

But Vapi’s strength lies in the output. Hearing your assistant reply instantly, conversationally, and with emotion is different. It feels:

- Faster to absorb
- More human
- More trustworthy

Instead of parsing a dense article or scanning pricing tables, you just ask - and listen.

It’s a new interface for the web.

## ⚙️ Under the Hood

- **Voice:** Vapi handles full-duplex streaming voice - input + output

### Injecting the Voice Button (`content.js`)
```js
const btn = document.createElement('button');
btn.textContent = '🎤 Ask about this page';
// Styling + positioning...
document.body.appendChild(btn);

btn.addEventListener('click', async () => {
  const transcript = await listen();
  const answer = await askGroq(transcript, pageContext);
  speak(answer);
});
```

- **Reasoning:** Groq powers ultra-fast LLM responses

```js
const askGroq = async (question, pageContext) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: `You are a voice assistant...` },
        { role: "user", content: question }
      ]
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content;
};
```

- **Context Awareness:**
  - Captures current tab URL
  - Extracts visible DOM/text
  - Sends this to the agent for real-time grounding

```js
  const speak = async (text) => {
  await vapi.say({
    text,
    voice: { voiceId: "edfe10a1-7194-42ed-87fc-cdd78fe86f95" }
  });
};
```

- **Persistence:** Uses a shared background worker and messaging system to keep the widget alive across tabs without refreshing

## 🧪 Developer Learnings

Voice UX is subtle: You have to manage tone, pause duration, streaming cutoff, and when the agent shouldn’t talk.

Groq’s latency makes this feel instant. No long pauses. No awkward lags.

Vapi’s session memory helps it follow up if you say: “Wait, explain that again.”

## 🌍 Use Cases

This isn’t just a demo. It can become:

- A copilot for devs and researchers
- A reader-assistant for visually impaired users
- A productivity tool for summarizing docs or comparing products
- A brand-neutral voice support layer for the entire internet

## 📌 What’s Next

- Let users choose personalities: friendly, sarcastic, mentor, etc.
- Let agents act on pages: fill forms, suggest actions
- Add multimodal parsing: analyze charts, images, links

## 💬 Final Thought

> Voice isn’t a gimmick - when designed right, it’s faster, friendlier, and more natural than text.

With Vapi + Groq, you can create actual agents - not just audio wrappers.

This is just the start.

Built for the Vapi DevRel Challenge - by Sankalp Shrivastava.


# Social Launch Posts

# (Twitter)

What if every website had a voice?

I built a Chrome extension using @vapi_ai + @groqinc that adds a voice assistant to every page you visit.

You can ask it questions about whatever you're looking at - and it responds instantly, in real-time voice.

Here’s how it works 👇 (A thread)
>
Once installed, the extension adds a floating “🎤 Ask about this page” button to every website you open.

Click it. Speak your question. The assistant listens, understands the page you’re on – and speaks the answer back.

No typing. No reading walls of text.
>
@groqinc provides lightning-fast LLM responses with almost zero latency

@vapi_ai gives it a natural, streaming voice - so it feels like a human conversation

Chrome APIs let me grab the current page's text, title, and URL for full context
>
The assistant understands context:

You can ask:

- “What’s this page about?”

- “Summarize this for me”

- “Explain this in simple terms”

- “How does this compare to X?”

And it’ll respond like a voice-native co-pilot.
>
Why voice output is the unlock:

Everyone talks about voice input. But voice replies are faster, more human, and more natural to consume.
It feels like having a smart friend explain things - without you needing to scan or scroll.
>
Built this for the @vapi_ai DevRel Challenge to explore:
What if voice agents weren’t just chatbots that speak...
...but true interfaces to content, context, and tools?

The result: a persistent, intelligent, tab-aware voice assistant.
>
Imagine the use cases:

- Devs asking docs for help

- Visually impaired users getting real-time summaries

- Shoppers comparing products out loud

- Students asking articles for TL;DRs

- Voice agents that can take actions (click buttons, fill forms)

The interface layer is the unlock.
>
This is not "AI for the sake of AI."

It’s utility. It’s interface evolution.
It’s the browser talking back.

# (LinkedIn)

What if you could ask questions about any website - and get a voice reply?

I built a Chrome extension using Vapi + Groq that turns every website into a voice-aware experience.

Once enabled, a floating assistant appears across all tabs. You can click it and ask questions about whatever page you're on - blog, doc, e-commerce, GitHub, anything.

It replies in real-time voice, using Groq for reasoning and Vapi for streaming voice interaction.

I built this for the Vapi DevRel challenge to explore what voice agents could be when they’re not just “chatbots that talk,” but true interfaces to content, context, and tools.

It’s been fun combining voice, utility, and interface innovation - and I think this kind of persistent, page-aware voice assistant will become increasingly useful.

Thanks to the Vapi team for the opportunity.

