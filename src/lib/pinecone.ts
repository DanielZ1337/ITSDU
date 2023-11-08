import {Pinecone} from '@pinecone-database/pinecone';

export const pineconeClient = new Pinecone({
    apiKey: import.meta.env.VITE_PINECONE_API_KEY,
    environment: "gcp-starter",
});

/*export const client = new PineconeClient()
await client.init({
    environment: "gcp-starter",
    apiKey: import.meta.env.VITE_PINECONE_API_KEY,
});

export const pineconeIndex = client.Index("itsdu"); */
/*export const client = new PineconeClient()
await client.init({
    environment: "gcp-starter",
    apiKey: import.meta.env.VITE_PINECONE_API_KEY,
});

export const pineconeIndex = client.Index("itsdu"); */