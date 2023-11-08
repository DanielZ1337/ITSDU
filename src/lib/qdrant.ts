import {QdrantClient} from '@qdrant/js-client-rest';

export const qdrantClient = new QdrantClient({
    url: 'https://d82e10e2-d553-4d25-9f2c-4baaf3ea6b15.europe-west3-0.gcp.cloud.qdrant.io:6333',
    apiKey: 'pM5zQWArZGhePKTLqmyyjSJBaI7hVE4SmA-eLLd3MSeTib2REnWWZw',
});