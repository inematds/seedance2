# INEMA Prompt Engine

> Gerador estruturado de prompts cinematográficos para Seedance 2.0.
> Taxonomia autoral INEMA v1.0 · Powered by Claude Sonnet 4.6 · Deploy na Vercel.

Transforma descrição em português/inglês → prompt estruturado de 300-450 palavras pronto para colar na fal.ai ou kie.ai.

## Arquitetura

```
app/
├── api/
│   └── generate.ts       # Serverless function (Vercel) com Claude + tool use forçado
├── public/
│   └── index.html        # Frontend single-file (Tailwind CDN, vanilla JS)
├── docs/
│   └── INEMA-TAXONOMY.md # Taxonomia canônica versionada (6 presets INEMA)
├── package.json
├── vercel.json
├── tsconfig.json
└── .env.example
```

**Stack:**
- Frontend: HTML + Tailwind CSS (via CDN) + vanilla JS — zero build.
- Backend: Vercel Serverless Function TypeScript (Node 20).
- IA: Anthropic Claude Sonnet 4.6 com `tool_choice` forçado.
- Cache: `cache_control: ephemeral` no system prompt (5 min TTL, economiza ~89%).
- Rate limit: 5 req/min por IP (in-memory por instância da função).

## Setup local (5 minutos)

```bash
# 1. Instalar dependências
cd app
npm install

# 2. Configurar .env
cp .env.example .env
# editar: ANTHROPIC_API_KEY=sk-ant-sua-chave-real

# 3. Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# 4. Rodar local
vercel dev
# abre http://localhost:3000
```

## Deploy em produção

```bash
# 1. Login no Vercel
vercel login

# 2. Linkar o diretório à um projeto novo
cd app
vercel link

# 3. Configurar env vars em produção
vercel env add ANTHROPIC_API_KEY production
# cole sua chave quando perguntar

# (Opcional) Restringir CORS ao domínio final
vercel env add ALLOWED_ORIGIN production
# ex: https://inema-prompt.vercel.app

# 4. Deploy
vercel --prod
```

O Vercel retorna a URL pública (`https://*.vercel.app`) em segundos.

## Custo por geração

| Fase | Custo |
|---|---|
| Primeira chamada (cold cache) | ~$0.00915 |
| Chamadas subsequentes (warm, &lt;5min) | ~$0.024 inclui output |
| Output típico | ~1500 tokens |

Na prática: **~R$ 0,12 por prompt** gerado após warmup. Com um markup comercial de 10x, a margem é confortável.

## Estrutura do system prompt

O arquivo `api/generate.ts` contém o system prompt em 8 camadas (padrão do módulo 3.3 do curso):

1. **ROLE** — "You are an INEMA Cinematic Prompt Engineer"
2. **OUTPUT SCHEMA** — 7 campos forçados via tool use
3. **PRESETS** — os 6 INEMA (EPIC, INTIMIST, URBAN PULSE, ELEMENTAL, DREAM, DOCUMENTARY)
4. **ROUTING RULES** — match + fallback inventivo + defaults
5. **TEMPLATE TEMPORAL** — `[0s][3s][6s]` + hard rules
6. **APPROVED VOCABULARY** — camera, physics, time, lighting, audio
7. **RECOMMENDATIONS** — 4 dicas técnicas com contra-exemplos
8. **HARDENING** — security rules anti-injection

Ver `docs/INEMA-TAXONOMY.md` para a versão documentada e versionada da taxonomia.

## Fluxo do usuário

```
Usuário descreve cena em PT → POST /api/generate
                              ↓
                         Claude Sonnet 4.6
                      (tool use forçado + cache)
                              ↓
                    JSON estruturado 7 campos:
                    - category (INEMA preset ou inventado)
                    - color_system
                    - camera_style
                    - techniques[4]
                    - english_prompt (300-450 palavras)
                    - portuguese_prompt (tradução literal)
                    - recommendations[4]
                              ↓
                  Frontend renderiza resultado
                              ↓
         [Copiar EN] [Copiar PT] [fal.ai] [kie.ai]
```

## Endpoints

### `POST /api/generate`

**Request:**
```json
{
  "scene": "Uma bailarina girando em um campo de cerejeiras ao pôr do sol...",
  "opts": {
    "pt": true,
    "recs": true
  }
}
```

**Response 200:**
```json
{
  "category": "INEMA DREAM",
  "color_system": "dreamy pastel palette with golden hour warmth, soft diffuse light, gentle particle atmosphere",
  "camera_style": "dreamy slow dollies / graceful orbits / handheld natural lag",
  "techniques": ["cloth inertia physics", "particle drift atmosphere", "120fps slow-motion", "golden hour rim lighting"],
  "english_prompt": "same character throughout all shots\n\n[0s] ...",
  "portuguese_prompt": "mesmo personagem em todos os planos\n\n[0s] ...",
  "recommendations": ["...", "...", "...", "..."]
}
```

**Response 429:** rate limit exceeded
**Response 400:** scene missing or too long (>4000 chars)
**Response 502:** generation failed (Anthropic API error)

## Deep links

A app integra diretamente com:
- **fal.ai** — `https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/text-to-video`
- **kie.ai** — `https://kie.ai/playground/veo3/seedance`

Ao clicar nos botões de abrir, o prompt em inglês é copiado para o clipboard automaticamente. O usuário só precisa colar no campo do modelo.

## Segurança

- **Tool use forçado** bloqueia prompt injection (sem canal de texto livre).
- **Rate limit** 5 req/min por IP.
- **Input cap** de 4000 caracteres.
- **CORS** restrito via `ALLOWED_ORIGIN` (padrão `*` em dev, setar em prod).
- **Refusal estruturado** via `category="REFUSED"` para conteúdo que viola política Anthropic.
- **Security rules** no system prompt interpretam tentativas de injection como parte da descrição.

## Taxonomia canônica

Ver [`docs/INEMA-TAXONOMY.md`](./docs/INEMA-TAXONOMY.md) — documento versionado com os 6 presets INEMA, triggers, strings canônicas, routing rules e template temporal.

## Roadmap v2

- [ ] Taxonomia configurável (UI para criar presets próprios por nicho)
- [ ] Render integrado via fal.ai (polling + storage do vídeo)
- [ ] Autenticação magic link (sem senha, via Resend)
- [ ] Paywall Stripe (freemium: 3 grátis por mês)
- [ ] Dashboard de uso (gerações, custo acumulado, top presets)
- [ ] Histórico versionado de prompts
- [ ] Analytics anônimo (presets mais acionados)
- [ ] Multi-nicho (apps irmãos: beauty, gaming, corporate)

## Relação com o curso

Esta app é o laboratório vivo dos módulos 3.4 e 3.5 da Trilha 3 do curso **Seedance 2.0 Mastery** ([inema.club](https://inema.club)):

- **Módulo 3.4** — "Construindo sua aplicação" — decisões arquiteturais explicadas aqui.
- **Módulo 3.5** — "Passo a passo construindo sua app" — tutorial do zero que produz esta app.
- **Módulo 3.7** — "Fluxo completo end-to-end" — esta app é usada como exemplo real.

Alunos da Trilha 3 podem clonar este código, trocar a taxonomia INEMA pela sua própria, e ter uma app rodando em produção em ~1 hora.

## Licença

MIT. Fique à vontade para forkar, adaptar e publicar sua própria versão com sua taxonomia autoral.
