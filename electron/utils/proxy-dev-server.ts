import {ITSLEARNING_URL} from '../services/itslearning/itslearning.ts'

export async function startProxyDevServer() {
    const express = await import('express').then(m => m.default)
    const cors = await import('cors').then(m => m.default)
    const bodyParser = await import('body-parser').then(m => m.default)
    const {createProxyMiddleware} = await import('http-proxy-middleware')
    const proxy = express()
    proxy.use(bodyParser.urlencoded({extended: true}));
    proxy.use(cors())
    // proxy.use(express.json())
    proxy.use('*', createProxyMiddleware({
        target: ITSLEARNING_URL,
        changeOrigin: true,
        secure: false,
        onProxyReq: (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
        }
    }))

    proxy.listen(8080, () => {
        console.log('API Proxy Server with CORS enabled is listening on port 8080')
    })
}