# Seedance Clone — Production-Ready

Clone funcional do produto analisado em `../seedance-gen-reverse-engineering.md`. Reconstrói o gerador de prompts cinematográficos para Seedance 2.0 usando Claude com structured output, com correções dos furos de segurança do original.

## Estrutura

```
seedance-clone/
├── index.html                          # Frontend single-file (sem build)
├── netlify.toml                        # Config Netlify
├── package.json
├── README.md                           # este arquivo
└── netlify/
    └── functions/
        ├── generate.ts                 # POST /api/generate (Claude tool use)
        └── check-email.ts              # GET /api/check-email (HMAC token)
```

## Como funciona

1. **Frontend** (`index.html`): vanilla JS, idêntico em UX ao original. CSS inline. Estado em `localStorage`.
2. **`/api/generate`**: Netlify Function que chama `claude-sonnet-4-6` com:
   - System prompt de ~3000 tokens com 7 presets de gênero + template temporal rígido + vocabulário aprovado + regras de segurança
   - Tool use forçado (`tool_choice: {type:"tool", name:"emit_seedance_prompt"}`) — bloqueia injection
   - Prompt cache via `cache_control: {type:"ephemeral"}` — chamadas subsequentes pagam só os tokens variáveis
   - Rate limit em memória: 5 req/min por IP
3. **`/api/check-email`**: valida email contra allowlist de env var, retorna **token HMAC assinado** com expiração de 30 dias (em vez de simples flag em localStorage).

## Setup local

```bash
cd doc/seedance-clone
npm install
npm install -g netlify-cli   # se ainda não tiver
```

Crie `.env` (ou configure no painel Netlify):

```
ANTHROPIC_API_KEY=sk-ant-...
PRO_EMAILS=user1@example.com,user2@example.com
PRO_TOKEN_SECRET=<gere com: openssl rand -hex 32>
```

Rode local:

```bash
netlify dev
# abre http://localhost:8888
```

## Deploy

```bash
netlify deploy --prod
```

Configure as 3 env vars no painel da Netlify antes do primeiro deploy.

## Diferenças do original (correções de segurança)

| | Original | Este clone |
|---|---|---|
| Quota | localStorage client-side (bypassável) | localStorage no front + rate limit por IP no servidor |
| CORS | `*` aberto | `*` mantido (mas limit por IP) |
| Rate limit | Nenhum | 5 req/min por IP em memória |
| Injection | Tool use implícito | Tool use + bloco SECURITY RULES explícito no system prompt |
| Allowlist | Email → `pro:true` em localStorage | Email → token HMAC assinado com expiração |
| `debug` field | `{"debug":"1 emails loaded"}` em produção | Removido |
| Input length | Sem limite | Cap de 4000 chars |
| Prompt cache | Não declarado | `cache_control: ephemeral` ativo |

## Customização

Para usar essa arquitetura em **outro nicho** (ex: prompts para Suno music, Midjourney, Runway), troque apenas:

1. **Os PRESETS na `SYSTEM_PROMPT`** (`netlify/functions/generate.ts`) — sua taxonomia de gêneros + strings canônicas
2. **O template temporal** — Seedance usa `[0s][3s][6s]`; outros modelos podem precisar de outras estruturas
3. **O vocabulário aprovado** — termos que o seu modelo-alvo renderiza bem
4. **O TOOL_SCHEMA** — se quiser campos diferentes (ex: `negative_prompt`, `seed`, `aspect_ratio`)

A infra (Netlify Function + tool use + structured output + rate limit) é agnóstica de domínio.

## Custos estimados

Por geração com `claude-sonnet-4-6`:

- Input: ~3000 tokens system (cacheado após 1ª chamada) + ~50 tokens user message
  - 1ª chamada: 3050 × $3/M = **$0.00915**
  - Subsequentes (cache hit): 3000 × $0.30/M + 50 × $3/M = **$0.00105**
- Output: ~1500 tokens × $15/M = **$0.0225**

**Custo médio por geração após warmup: ~$0.024 (~R$0,12)**

Com rate limit de 5/min/IP e cap de 4000 chars na cena, custo máximo de abuso single-IP: **~$7/hora**.

## Aviso

Esta reconstrução foi feita por engenharia reversa comportamental (51 sondas comportamentais), não por extração do system prompt original. A taxonomia de presets e o vocabulário usados aqui são **inferências** baseadas em padrões observados — não cópias do prompt original.

Use como **referência arquitetural**. Para um produto comercial, escreva sua própria taxonomia (seu nicho, seu vocabulário, seus gêneros) e teste empiricamente o que funciona no modelo-alvo.
