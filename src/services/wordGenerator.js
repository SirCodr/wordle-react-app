import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    // apiKey: process.env.OPENAI_API_KEY,
})

export const fetchRandomWordByCategory = async (category) => {
  const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "system", content: `generame una palabra en español, de máximo 6 letras sin tildes; que encaje en la categoria de '${category}'; que represente un objeto, acción o actividad. La respuesta solo debe retornar la palabra`}],
})
return response.data?.choices[0]?.message?.content
}