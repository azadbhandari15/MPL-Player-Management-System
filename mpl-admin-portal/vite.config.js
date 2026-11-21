import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'node:https'

const APPS_SCRIPT_EXEC =
  'https://script.google.com/macros/s/AKfycby0ejBGPSgoefebC9XC5W4t1lJ7V893e4TxjU6szOiTAw8hPFKs0Y9Ep-sN1GbTz1H-/exec'

function fetchWithRedirects(targetUrl, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(targetUrl, { family: 4 }, (resp) => {
        if (
          resp.statusCode >= 300 &&
          resp.statusCode < 400 &&
          resp.headers.location &&
          redirectsLeft > 0
        ) {
          resp.resume()
          return resolve(fetchWithRedirects(resp.headers.location, redirectsLeft - 1))
        }

        let data = ''
        resp.on('data', (chunk) => (data += chunk))
        resp.on('end', () => resolve({ status: resp.statusCode, body: data }))
      })
      .on('error', reject)
  })
}

function googleDriveProxyPlugin() {
  return {
    name: 'google-drive-proxy',
    configureServer(server) {
      server.middlewares.use('/drive-proxy', async (req, res) => {
        try {
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
          const { status, body } = await fetchWithRedirects(`${APPS_SCRIPT_EXEC}${query}`)

          res.statusCode = status || 200
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        } catch (err) {
          console.error('[drive-proxy error]', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message, code: err.code }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), googleDriveProxyPlugin()],
  server: {
    port: 5174,
  },
})