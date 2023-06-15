import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: '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',
    // apiKey: process.env.OPENAI_API_KEY,
})

export const fetchRandomWordByCategory = async () => {
  const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Hablando de bancos, dime una palabra de 5 letras que no tenga tildes`}],
})
return response.data?.choices[0]?.message?.content
}