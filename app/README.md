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

## Testando localmente — passo a passo completo

### Pré-requisitos

Antes de começar, você precisa ter:

| Item | Versão mínima | Como verificar |
|---|---|---|
| **Node.js** | 18+ (recomendado 20) | `node --version` |
| **npm** | 9+ (vem com o Node) | `npm --version` |
| **git** | qualquer recente | `git --version` |
| **Chave Anthropic API** | — | [console.anthropic.com](https://console.anthropic.com) → API Keys |

Se não tem Node, instale via [nodejs.org](https://nodejs.org) (LTS) ou via `nvm`:

```bash
# com nvm (recomendado no Linux/macOS)
nvm install 20
nvm use 20
```

### Passo 1 — Obter uma chave da Anthropic API

Você precisa de uma chave para rodar o app. **~$5 de crédito** é suficiente para ~200 testes locais.

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login (Google ou email)
3. Vá em **API Keys** no menu lateral → **Create Key**
4. Dê um nome (ex: `inema-local`) → **Create Key**
5. **Copie a chave** (começa com `sk-ant-...`) — você só vai vê-la uma vez
6. Em **Billing**, adicione $5 ou $10 de crédito (ou use o crédito grátis inicial se for nova conta)

### Passo 2 — Clonar o repositório (se ainda não tem)

```bash
git clone https://github.com/inematds/seedance2.git
cd seedance2/app
```

Se já clonou antes, só entre na pasta `app`:

```bash
cd caminho/para/seedance2/app
```

### Passo 3 — Instalar dependências

```bash
npm install
```

Isso instala `@anthropic-ai/sdk`, `@vercel/node` e `typescript` (~30-60s na primeira vez).

**Se der erro de permissão:** não use `sudo`. Use `nvm` para instalar o Node sem permissões de root.

### Passo 4 — Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Agora edite o arquivo `.env` no seu editor e coloque a chave real:

```
ANTHROPIC_API_KEY=sk-ant-api03-abc123... (cole aqui a chave do Passo 1)
ALLOWED_ORIGIN=*
```

**Importante:** o arquivo `.env` já está no `.gitignore` — nunca commite a chave.

### Passo 5 — Instalar o Vercel CLI

```bash
npm install -g vercel
```

Se der erro de permissão global, use `nvm` (que instala em user-space) ou rode com prefix local:

```bash
npm install --prefix ~/.local vercel
# e depois adicione ~/.local/bin ao PATH
```

Verifique:

```bash
vercel --version
# deve mostrar algo como 37.x.x
```

### Passo 6 — Rodar o app localmente

```bash
vercel dev
```

Na primeira vez o CLI vai perguntar:
- **"Set up and develop X?"** → responda `Y`
- **"Which scope?"** → escolha sua conta pessoal
- **"Link to existing project?"** → `N` (é a primeira vez)
- **"What's your project name?"** → aceite o padrão (ex: `app`) ou nomeie
- **"In which directory is your code located?"** → aceite `./`
- Pode perguntar sobre framework → escolha **"Other"**

Depois da configuração inicial, o servidor sobe em:

```
Ready! Available at http://localhost:3000
```

Abra `http://localhost:3000` no navegador. O app deve estar rodando. 🎉

### Passo 7 — Testar a aplicação

**Via navegador:**

1. Abra `http://localhost:3000`
2. Clique em um dos botões de exemplo (ex: "Épico") — vai preencher a textarea
3. Clique em **"Gerar prompt cinematográfico"**
4. Espere ~15-30 segundos (primeira vez é mais lenta por causa do cold start)
5. Resultado estruturado deve aparecer com:
   - Categoria INEMA (ex: `INEMA EPIC`)
   - Sistema de cores + estilo de câmera + 4 técnicas
   - Prompt em inglês (300-450 palavras)
   - Prompt em português (tradução literal)
   - 4 recomendações técnicas
6. Teste os botões **"Copiar"**, **"Abrir na fal.ai"** e **"Abrir na kie.ai"**

**Via curl (útil para debug sem abrir navegador):**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "scene": "Uma bailarina de vestido branco girando em um campo de cerejeiras ao pôr do sol",
    "opts": { "pt": true, "recs": true }
  }' | jq
```

(Se não tiver `jq`, remova o `| jq` — vai aparecer o JSON cru.)

Resposta esperada: JSON com `category`, `color_system`, `camera_style`, `techniques`, `english_prompt`, `portuguese_prompt`, `recommendations`.

### Passo 8 — Conferir o cache e os logs

No terminal do `vercel dev`, cada chamada aparece como log:

```
[generate] ip=::1 category=INEMA DREAM tokens_in=3127 tokens_out=1450 cache_read=0
[generate] ip=::1 category=INEMA INTIMIST tokens_in=3128 tokens_out=1420 cache_read=2932
```

**Na segunda chamada (dentro de 5 min), `cache_read` deve ser > 0** — prova de que o prompt cache está funcionando (~89% de economia nos tokens de input).

## Troubleshooting

| Problema | Causa provável | Solução |
|---|---|---|
| `Error: Cannot find module '@anthropic-ai/sdk'` | `npm install` não rodou ou falhou | Rode `npm install` de novo dentro de `app/` |
| `Error: ANTHROPIC_API_KEY is not set` | `.env` não existe ou variável não está lá | Confira `cat .env` mostra a chave com prefix `sk-ant-` |
| `401 authentication_error` da Anthropic | Chave inválida ou sem crédito | Confira `console.anthropic.com` — regenere a chave ou adicione saldo |
| `Rate limit exceeded` | Você fez > 5 requests em 1 minuto | Espere 60s ou reinicie o `vercel dev` (zera o bucket in-memory) |
| Frontend abre mas clica e nada acontece | Abriu o arquivo diretamente em vez do servidor local | Use `http://localhost:3000`, NÃO `file://...` |
| `vercel dev` pede login no navegador | Primeira vez usando o CLI | Faça login na conta Vercel (grátis) — não precisa criar projeto ainda |
| Fica travado "Gerando..." indefinidamente | Internet ruim, API fora, ou cold start lento | Espere 30s. Se passar disso, olhe o terminal do `vercel dev` para ver o erro |
| `Error: No scene provided` | Textarea vazia ou só espaços | Digite uma descrição de pelo menos 1 palavra |
| `SyntaxError: Unexpected token '<'` | Endpoint retornou HTML em vez de JSON (geralmente 500 do servidor) | Olhe o terminal do `vercel dev` — há um erro Python/TS que mostra a stack trace |

## Rodar sem Vercel CLI (alternativa)

Se você não quer instalar o Vercel CLI e só quer testar a function, dá para rodar direto com `tsx`:

```bash
npm install -g tsx

# Inicia um servidor HTTP simples que simula /api/generate
npx tsx --tsconfig tsconfig.json api/generate.ts
```

**Mas é mais complicado** — você precisa montar o wrapper HTTP na mão, porque a função espera `VercelRequest`/`VercelResponse`. **Recomendo usar `vercel dev`** (que cuida de tudo).

Alternativa ainda mais simples: deploy direto em produção (Passo "Deploy em produção" abaixo) e testar lá.

---

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
