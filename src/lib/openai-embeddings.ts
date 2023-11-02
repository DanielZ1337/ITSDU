import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

export const embeddings = new OpenAIEmbeddings({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
})