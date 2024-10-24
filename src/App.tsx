import { useEffect, useState } from 'react'
import OpenAI from 'openai';
import './App.css'
import { marked } from 'marked';

const client = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  'apiKey': "",
  dangerouslyAllowBrowser: true,
});

function App() {
  const [pageContent, setPageContent] = useState<HTMLElement | null>();
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [renderedMarkdown, setRenderedMarkdown] = useState<string>();

  const onSummarizationClick = async () => {
    setError("");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { type: 'GET_DOM_CONTENT' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          // Parsitaan DOM...
          console.log("Got response", response);
          try {
            const parsed = new DOMParser().parseFromString(response.content, "text/html");
            let content = parsed.querySelector("main") ?? parsed.querySelector('[role="main"]');
            if (content === null) {
              // Look for article instead
              content = parsed.querySelector("article") ?? parsed.querySelector('[role="article"]');
              if (content === null) {
                setError("Sivulta ei löytynyt main- tai article-tagia.")
                return;
              }
              return;
            }
            setPageContent(content)
          } catch (e) {
            return;
          }
        }
      });
    });
  }

  useEffect(() => {
    const load = async () => {
      // pageContentin sisältö vaihtui, generoidaan uusi kuvaus.
      setLoading(true);
      const limitedContent = pageContent?.textContent?.substring(0, 4096);
      let completion;
      try {
        completion = await client.chat.completions.create({
          model: "llama-3.2-3b-instruct",
          messages: [
            { role: "system", content: `You are a summarization bot. Respond in Markdown. Summarize the given content and give some key points to the user. The input is from a website, you do not need to summarize what the page itself is about. You may be given HTML or straight up text. Here is the user's content: ${limitedContent}` },
          ],
          temperature: 0.0,
        })
      } catch (e) {
        setError(`Tapahtui virhe yhdistäessä LM Studioon: ${e}`)
        setLoading(false);
        return;
      }
      const parsedResponse = await marked.parse(completion.choices[0]?.message.content!)
      console.log(parsedResponse, "parsed");
      setRenderedMarkdown(parsedResponse);
      setLoading(false);
    }
    console.log("pageContent is:", pageContent)
    if (pageContent !== null && pageContent !== undefined) {
      load();
    } else {
      console.log("Skipping load because pageContent is empty")
    }
  }, [pageContent])

  return (
    <div id="app">
      <h1>Contextualize</h1>
      <div className="card">
        <div className="error">{error && error}</div>
        <button onClick={onSummarizationClick}>
          {loading ? <div className="loader"></div> : "Contextualize current page"}
        </button>
        <div id="response-content" dangerouslySetInnerHTML={{ __html: renderedMarkdown ?? "<div></div>" }}></div>
      </div>
    </div>
  )
}

export default App
