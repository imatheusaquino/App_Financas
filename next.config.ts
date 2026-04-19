import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : ''

const nextConfig: NextConfig = {
  // Headers de segurança aplicados em todas as rotas
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Impede que o site seja embutido em iframes de outros domínios
          { key: 'X-Frame-Options', value: 'DENY' },
          // Impede sniffing de Content-Type pelo navegador
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Controla quais informações de referência são enviadas
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Força HTTPS por 1 ano (ativo em produção via Vercel)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Desabilita APIs de hardware desnecessárias
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Content Security Policy — permite apenas origens necessárias
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: apenas próprio domínio + eval necessário para Next.js dev
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Estilos: próprio domínio + inline (Tailwind/shadcn)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fontes: Google Fonts (Geist)
              `font-src 'self' https://fonts.gstatic.com`,
              // Imagens: próprio domínio + data URIs
              "img-src 'self' data: blob:",
              // Conexões de API: Supabase
              `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname}`,
              // Sem frames externos
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
