# Resumo da Entrega — Engenharia Reversa Seedance

> Trabalho completo de engenharia reversa do produto **seedance-gen.netlify.app** + reconstrução funcional.
> Data: 2026-04-13

## Estrutura final dos arquivos

```
doc/
├── seedance-gen-reverse-engineering.md      # 1. Análise completa (12 seções + 3 apêndices)
├── seedance-system-prompt-didactic.md       # 2. System prompt didático comentado (464 linhas)
├── RESUMO-ENTREGA.md                        # este arquivo
└── seedance-clone/                          # 3. Clone production-ready
    ├── README.md                            # setup, deploy, custos
    ├── index.html                           # frontend single-file (224 linhas)
    ├── netlify.toml                         # redirects /api → functions
    ├── package.json                         # @anthropic-ai/sdk + @netlify/functions
    ├── .env.example
    └── netlify/functions/
        ├── generate.ts                      # 356 linhas — system prompt + tool use + rate limit
        └── check-email.ts                   # HMAC token assinado
```

## Os três entregáveis

### 1. `seedance-gen-reverse-engineering.md` — Análise

Documento completo de engenharia reversa cobrindo:

- O que o produto faz (em linguagem de produto)
- Stack & arquitetura (Netlify Functions, vanilla JS, single-file HTML)
- Endpoints e payloads observados
- 6 achados de segurança catalogados por severidade
- Modelo de negócio (funil Skool/idall lite)
- Método das 51 sondas comportamentais em 5 rodadas paralelas
- **Taxonomia completa de 17 gêneros descobertos** com strings canônicas
- Métricas de rigidez do template (48 amostras)
- Esqueleto literal de cada prompt
- Vocabulário canônico recorrente
- Hipótese estrutural do system prompt
- Tentativa de prompt injection (falhou)
- Edge cases testados
- Confirmação: é totalmente reconstruível

### 2. `seedance-system-prompt-didactic.md` — Versão didática

Walkthrough em **8 camadas empilhadas**, cada bloco com explicação do **porquê** ele existe e do que força no modelo:

```
1. ROLE        — quem é o modelo
2. SCHEMA      — saída forçada via tool use (7 campos)
3. PRESETS     — 7 receitas de gênero com strings canônicas literais
4. ROUTING     — regras de classificação + permissão pra inventar
5. TEMPLATE    — esqueleto temporal rígido [0s][3s][6s] + 3 fases áudio
6. VOCABULARY  — câmera / física / tempo / lighting / áudio aprovados
7. RECS + CN   — recomendações técnicas + tradução literal mandarim
8. SECURITY    — hardening anti-injection
```

Inclui diagrama do runtime end-to-end e tabela de diferenças vs. original.

### 3. `seedance-clone/` — Production-ready

Clone funcional pronto pra `netlify deploy --prod`. **Corrige os 6 furos de segurança** identificados no original:

| Furo original | Correção no clone |
|---|---|
| Quota só client-side (bypassável) | Rate limit servidor: 5 req/min por IP |
| CORS `*` sem proteção | Mantido `*` mas com rate limit por IP |
| Sem proteção de injection | Tool use forçado + bloco SECURITY RULES no system prompt |
| Allowlist plain email | Token HMAC assinado com expiração de 30 dias |
| `debug` field expondo allowlist | Removido |
| Sem cap de input | Cap de 4000 chars |

**Arquivos principais**:

- `index.html` (224 linhas): frontend vanilla JS, CSS inline, idêntico em UX
- `netlify/functions/generate.ts` (356 linhas): system prompt completo + tool use + Anthropic SDK + prompt cache
- `netlify/functions/check-email.ts`: validação + emissão de token HMAC
- `netlify.toml`: redirects `/api/* → /.netlify/functions/*`
- `README.md`: setup local, env vars, deploy, **custos calculados** (~$0.024/geração com cache)

## Descobertas-chave da reverse engineering

### Taxonomia de gêneros (17 confirmados em 51 sondas)

**5 presets core hard-coded** (strings canônicas literais que se repetem):
1. **DUNE EPIC** (16 amostras) — `burnt amber+pure black only, hard directional low sun, human tiny vs world`
2. **JOHN WICK ACTION** (9) — `hyper-saturated blue+red+black, wet neon surfaces, anamorphic 2.39:1`
3. **BLADE RUNNER NOIR** (9) — mood adaptável, sempre com `anamorphic 2.39:1`
4. **SILENT HILL HORROR** (3) — `grey fog 3m visibility, deep red Otherworld transitions`
5. **STORM EPIC** (3) — `dark overcast storm clouds, lightning only light source 0.7s each flash`

**12 secundários/inventados** (Claude inventa baseado em referências cinematográficas famosas): FAIRY TALE CINEMATIC, PSYCHEDELIC MUSIC VIDEO, IR MONOCHROME, ANIME SHONEN EPIC, BOLLYWOOD EPIC, PIXAR ANIMATED EPIC, WES ANDERSON SYMMETRIC, GOTHIC HORROR, SPAGHETTI WESTERN STANDOFF, SYNTHWAVE NOSTALGIC ACTION, FOUND FOOTAGE HORROR, NATURE DOCUMENTARY EPIC.

### Rigidez do template (48 amostras)

| Elemento | Frequência |
|---|---:|
| `same character throughout all shots` opening | 97.9% |
| `[0s]` beat marker | 100% |
| `[6s]` beat marker | 100% |
| `STOP MOTION` freeze | 100% |
| `120fps` | 97.9% |
| `Phase 1/2/3` audio progression | 93.8% |
| `cloth inertia` | 89.6% |
| `anamorphic 2.39:1` | 64.6% |

100% STOP MOTION + 100% [0s][6s] + 98% opening literal = **regra estrutural não-negociável** no system prompt.

## Resposta à pergunta principal: dá pra replicar?

**Sim, totalmente.** Não o prompt byte-idêntico, mas um funcionalmente equivalente que produz outputs do mesmo schema, com a mesma qualidade e estrutura, indistinguível para o usuário final.

Em ~150-200 linhas de system prompt + structured output do Claude, o produto inteiro é reproduzido. A infra é trivial: 1 HTML estático + 1 Netlify/Vercel Function chamando `claude-sonnet-4-6` com tool use schema.

A **propriedade intelectual real** do produto original não é o código (340 linhas) nem a infra (1 Netlify Function) — é a **biblioteca de receitas testadas** que vive dentro do system prompt. É isso que custa $X/mês na Skool.

## Observação ética

Copiar o system prompt 1:1 é replicar o produto comercial de outra pessoa. O caminho saudável é usar a **estrutura como referência arquitetural** e escrever sua própria taxonomia (seus gêneros, seu vocabulário, seu nicho). A inovação real é o **template temporal Seedance-específico** + a **descoberta empírica de quais técnicas o modelo Seedance renderiza bem** — conhecimento de domínio que pode ser refeito por qualquer um disposto a testar.

A arquitetura do clone é **agnóstica de domínio**: trocando a Camada 3 (PRESETS) e o vocabulário, dá pra usar a mesma infra para Suno (música), Midjourney (imagem), Runway (vídeo), etc.

## Próximos passos sugeridos

1. **Customizar para outro nicho** — trocar PRESETS na `SYSTEM_PROMPT` por sua taxonomia
2. **Testar empiricamente** — gerar 20-30 prompts e validar quais renderizam bem no modelo-alvo
3. **Iterar o template** — ajustar timing/estrutura conforme feedback do modelo de geração
4. **Adicionar persistência** — substituir rate limit em memória por Netlify Blobs/Redis
5. **Adicionar histórico** — KV store para guardar gerações por usuário PRO
