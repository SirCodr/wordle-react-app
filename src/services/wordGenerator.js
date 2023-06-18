import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: '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',
    // apiKey: process.env.OPENAI_API_KEY,
})

export const fetchRandomWordByCategory = async (category) => {
  const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages: [{ role: "user", content: `Hablando de ${category}, dime una palabra de 5 letras que no tenga tildes y sin puntos`}],
})
return response.data?.choices[0]?.message?.content
}