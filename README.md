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
- **Reasoning:** Groq powers ultra-fast LLM responses
- **Context Awareness:**
  - Captures current tab URL
  - Extracts visible DOM/text
  - Sends this to the agent for real-time grounding
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

Here’s how it works 👇

# (LinkedIn)

What if you could ask questions about any website - and get a voice reply?

I built a Chrome extension using Vapi + Groq that turns every website into a voice-aware experience.

Once enabled, a floating assistant appears across all tabs. You can click it and ask questions about whatever page you're on - blog, doc, e-commerce, GitHub, anything.

It replies in real-time voice, using Groq for reasoning and Vapi for streaming voice interaction.

I built this for the Vapi DevRel challenge to explore what voice agents could be when they’re not just “chatbots that talk,” but true interfaces to content, context, and tools.

It’s been fun combining voice, utility, and interface innovation - and I think this kind of persistent, page-aware voice assistant will become increasingly useful.

Thanks to the Vapi team for the opportunity.

