# Contextualize
A tool for quickly summarizing the contents of a website.

## Requirements
- Local installation of [LM Studio](https://lmstudio.ai/)
- Local server running on port 1234
- Installation of the llama-3.2-3b-instruct model. Contextualize will use this model to summarize the input.

## Functionality
Content of the webpage is grabbed with the use of a [Content script](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) due to Manifest v3 limitations.  
The given input is stripped into 4096 characters to fit the default context size of Llama 3. The model has a preprompt configured to respond in Markdown. After the response, the Markdown input is parsed and displayed on the page using React's `dangerouslySetInnerHtml`.