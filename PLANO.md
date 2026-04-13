# Plano — Curso "Seedance 2.0 Mastery" (3 trilhas)

## Context

O usuário quer construir "o melhor curso do mundo" sobre Seedance 2.0 (text-to-video da ByteDance, #1 global em abr/2026), atuando como editor de vídeo/filme/propaganda profissional. O material de partida são 5 documentos já coletados em `doc/` (gitignorado) que cobrem:

- **Estado do modelo**: Seedance 2.0 com áudio nativo, suporte a 9 imagens + 3 clipes de referência, API aberta na fal.ai, técnicas oficiais de timeline prompting.
- **Engenharia reversa completa** de `seedance-gen.netlify.app` (51 sondas, 17 gêneros, taxonomia canônica, rigidez 100% do template).
- **System prompt didático reconstruído** em 8 camadas (ROLE / SCHEMA / 7 PRESETS / ROUTING / TEMPLATE / VOCAB / RECS / HARDENING).
- **Clone funcional production-ready** (Netlify + Claude Sonnet 4.6 + tool use forçado, $0.024/geração).
- **Mapa de saturação** (95% coberto, o que ainda está oculto, custo de sondar).

Três trilhas paralelas foram pedidas:
1. **LEIGO** — quem nunca usou IA para vídeo.
2. **PROMPT-READY** — quem quer receitas prontas + dicas avançadas.
3. **PROFISSIONAL** — quem quer entender a lógica interna do Seedance.

O diferencial competitivo deste curso (vs. os ~10 guias públicos já catalogados) é que o usuário tem **dois ativos que ninguém mais tem publicados**:
- **A taxonomia canônica extraída empiricamente** (strings literais de 7 presets core + método de descoberta)
- **Um clone funcional production-ready** que pode virar laboratório interativo do aluno.

Combinar isso com os recursos públicos já mapeados (redreamality, MindStudio, awesome-seedance 500+ prompts, fal.ai) dá ao curso a chance real de ser o mais completo do mundo em português.

---

## Filosofia pedagógica

Três princípios que vão estruturar TODO o conteúdo:

1. **Cada trilha é uma porta de entrada, não uma prisão.** Leigo pode ir para Profissional depois. Profissional pode voltar para Prompt-Ready quando tiver pressa. Conteúdo modular com pontos de travessia explícitos.

2. **"Show, don't tell" em IA de vídeo é literal.** Cada conceito é pareado com um **vídeo-exemplo renderizado de verdade** no Seedance 2.0 via fal.ai (ou Dreamina). Sem isso o aluno não acredita no que lê.

3. **Honestidade arquitetural.** O curso diz explicitamente o que é público (timeline prompting, vocabulário oficial) vs. o que é a opinião autoral do usuário (os 7 presets, o STOP MOTION, o template 350-500 palavras). Isso vira ferramenta pedagógica, não limitação.

---

## Estrutura de 3 trilhas

Cada trilha tem **Módulos** → **Aulas** → **Exercícios**. Abaixo, o mapa proposto (escopo ainda a validar com o usuário).

### Capítulo 0 — Portão comum (todas as trilhas)

Uma sequência curta de orientação que TODOS assistem antes de escolher trilha:

- **0.1** O que é Seedance 2.0 (cronologia, #1 global, audio nativo, fal.ai aberta).
- **0.2** Os 3 caminhos deste curso — "qual é o seu caso?" (diagnóstico em 5 perguntas → recomendação de trilha).
- **0.3** Setup mínimo: abrir conta fal.ai OU Dreamina, gerar primeiro vídeo de 10s com prompt de 1 linha (para o aluno sair da sessão com algo já feito).
- **0.4** Ética e limites: filtro de moderação, uso comercial, quando pedir consentimento, o dilema "filter bypass".

Fontes: `seedance-pesquisa-web-2026.md` (estado do modelo, URLs oficiais), trechos públicos de redreamality/MindStudio para setup.

---

### TRILHA A — "Meu Primeiro Filme de 10 Segundos" (Leigo)

**Público**: nunca usou IA para vídeo, pode não saber o que é "plano geral" ou "slow motion".
**Promessa**: ao final, terá **3 vídeos postáveis** (social/WhatsApp/reels) e saberá descrever cenas sem jargão.
**Tom**: amigável, visual-first, zero terminologia sem tradução no mesmo parágrafo.

**Módulo A1 — Da ideia ao vídeo (fundamentos)**
- A1.1 Por que a IA entende melhor algumas frases que outras (intuição, sem técnica).
- A1.2 Os 4 elementos que todo vídeo bom tem: **quem, onde, o que acontece, que clima**.
- A1.3 Aula-exemplo: uma frase ruim → uma frase boa → vídeo final. Lado a lado.
- A1.4 Seu primeiro prompt guiado (preencha-as-lacunas em português, o curso traduz para EN automaticamente).

**Módulo A2 — Dicionário de cinema sem trauma**
- A2.1 Planos (geral, médio, close) explicados com memes e filmes conhecidos.
- A2.2 Movimentos de câmera (dolly, pan, crash zoom) com GIFs de Hollywood.
- A2.3 Luz e cor: por que "hora dourada" vira amarelo-mel e "blade runner" vira azul-vermelho.
- A2.4 Vocabulário mínimo útil (10 termos). Cheat sheet imprimível.

**Módulo A3 — 7 cenas, 7 estilos (introdução aos presets)**
- Uma aula por preset, MAS na versão leiga: "quando você quer um vídeo tipo Duna" → aqui tem os botões.
- Cada aula tem **1 template pronto em português** + o mesmo template em EN pronto para colar.
- Os 7 presets são os do material: Duna Épico / John Wick / Blade Runner / Silent Hill / Tempestade / Conto de Fadas / Anime Shonen.
- A3.8 "E se minha cena não encaixar em nenhum?" → a cláusula "inventar gênero" explicada sem jargão.

**Módulo A4 — Fazendo e publicando**
- A4.1 Conta na fal.ai em 5 min. Quanto custa (centavos por render).
- A4.2 Usando o playground: colar prompt, esperar render, baixar.
- A4.3 Erros comuns ("por que meu personagem muda no meio do vídeo?") → a linha `same character throughout all shots`.
- A4.4 Edição mínima: cortar início/fim, adicionar música livre, exportar pra TikTok/Reels.
- A4.5 Publicando com ética: hashtags #IA, disclosure, direitos de imagem.

**Projeto final da trilha A**: aluno envia 3 vídeos (1 escolhido de cada de 3 presets diferentes) + a frase em português que usou.

---

### TRILHA B — "Receitário Cinematográfico Seedance" (Prompt-Ready / Aplicado)

**Público**: já sabe o que é um plano, já gerou 1-2 vídeos, quer produtividade e resultados consistentes em projetos reais (UGC, anúncios, conteúdo de cliente).
**Promessa**: ao final, terá **um banco pessoal de 30+ prompts prontos** categorizados, dominará os 7 presets, saberá fazer variações em 30 segundos, e entenderá os hacks não documentados.
**Tom**: direto, receitas, copy-paste, benchmark de tempo, zero filler.

**Módulo B1 — Anatomia de um prompt Seedance que funciona**
- B1.1 O template temporal rígido `[0s] [3s] [6s]` — por que 3 beats, não 4.
- B1.2 As 3 fases de áudio (práticas → brass chord → orquestra) como "arco emocional em 10s".
- B1.3 `same character throughout all shots` + `Anamorphic 2.39:1` — as duas linhas que mudam tudo.
- B1.4 O STOP MOTION freeze: por que é o "money shot" do template.
- B1.5 Cheat sheet visual da estrutura (1 página).

**Módulo B2 — Os 7 presets canônicos (a enciclopédia de receitas)**
Uma aula profunda por preset, cada uma contendo:
  - A string canônica literal (color, camera, techniques)
  - 4 exemplos de prompt completo (cenas diferentes dentro do mesmo preset)
  - Vídeos renderizados de cada exemplo
  - Variações permitidas vs. proibidas
  - Gatilhos de ativação (quando escolher este preset)

Presets: **DUNE EPIC, JOHN WICK ACTION, BLADE RUNNER NOIR, SILENT HILL HORROR, STORM EPIC, FAIRY TALE CINEMATIC, ANIME SHONEN EPIC**.

**Módulo B3 — Vocabulário canônico aplicado**
- B3.1 Câmera (10 termos) — quando usar cada um.
- B3.2 Física (7 termos) — `cloth inertia`, `water surface tension`, `sand displacement`, etc.
- B3.3 Tempo (`120fps`, `snap back`, `STOP MOTION`) — os únicos 3 truques temporais que importam.
- B3.4 Lighting (8 termos) — mapping direto preset → lighting.
- B3.5 Áudio (keywords, tag `@Audio`) — aproveitando o áudio nativo da v2.0.

**Módulo B4 — Extensões e hacks avançados**
- B4.1 "Inventar gênero": o truque `<REFERENCE> <STYLE>` (Wes Anderson Symmetric, Sergio Leone Standoff, etc.).
- B4.2 Adaptar paleta sem perder identidade (Blade Runner em cena de velas, Kung fu em bambuzal).
- B4.3 O truque da tradução chinesa para passar por filtro mais frouxo — e a ética/risco disso.
- B4.4 Prompts de 1 linha vs. 400 palavras: quando cada abordagem vence.
- B4.5 Combinando presets: quando um prompt precisa de "70% Dune, 30% Anime Shonen" e como escrever.

**Módulo B5 — Variações em escala**
- B5.1 A/B testing de prompts: rode 3 variantes, compare side-by-side.
- B5.2 Templates parametrizados em planilha (Google Sheets + fórmulas simples → 20 prompts em 10 min).
- B5.3 Fluxo de aprovação de cliente com 5 versões em 30 min.
- B5.4 Usando image-to-video da v2.0 com refs (até 9 imagens).

**Projeto final da trilha B**: aluno entrega 1 campanha fictícia com 10 prompts e 10 vídeos renderizados, com um dos 7 presets dominando e outro como variação.

---

### TRILHA C — "A Lógica por Trás do Seedance" (Profissional/Técnico)

**Público**: produtor de agência, prompt engineer, tech-creative, alguém que quer **construir pipeline próprio** ou **entender como a máquina realmente pensa** para escalar.
**Promessa**: ao final, entenderá a arquitetura do Seedance 2.0 como modelo, saberá reverse-engineerar outros produtos, terá o clone funcional rodando em sua própria infra, e saberá como derivar sua própria taxonomia para um nicho específico.
**Tom**: técnico, com código real, cálculos de custo, experimentos mensuráveis.

**Módulo C1 — Seedance 2.0 como modelo (sem mitos)**
- C1.1 Arquitetura geral de modelos text-to-video. Onde Seedance difere de Kling/Veo/Runway.
- C1.2 Por que o Seedance é sensível à forma do prompt: a noção de "distribuição de treinamento".
- C1.3 Timeline prompting como técnica **oficial** documentada (redreamality, MindStudio).
- C1.4 O que mudou da v1 para v2: áudio nativo, 9 imagens de ref, faces reais — implicações práticas.
- C1.5 Benchmarks (Artificial Analysis Video Arena): #1 em T2V e I2V em abr/2026.

**Módulo C2 — Engenharia reversa como método**
- C2.1 O caso seedance-gen.netlify.app: o que é, por que vale estudar.
- C2.2 Stack forense: análise estática de HTML/JS + chamadas-sonda. Sem tocar no backend.
- C2.3 As 51 sondas em 5 rodadas: como desenhar o experimento. Hit rate decrescente por rodada.
- C2.4 Taxonomia descoberta: 17 gêneros, 5 core hard-coded (prova via repetição literal de strings).
- C2.5 Medindo rigidez: 100% STOP MOTION, 100% `[0s][6s]`, 97.9% opening literal — por que isso é prova de instrução explícita.
- C2.6 Achados de segurança do original (quota client-side, CORS `*`, allowlist plain, debug leak). Hands-on: reproduzindo o bypass.
- C2.7 Onde saturar: curva de descoberta, custo-benefício, quando parar.

**Módulo C3 — O system prompt reconstruído (anatomia em 8 camadas)**
Uma aula por camada do `seedance-system-prompt-didactic.md`:
  - C3.1 **ROLE** — por que "Seedance Cinematic Prompt Engineer" ancora tudo.
  - C3.2 **OUTPUT SCHEMA** via tool use (os 7 campos obrigatórios; por que forçado bloqueia injection).
  - C3.3 **PRESETS** como biblioteca de receitas (strings canônicas literais).
  - C3.4 **ROUTING RULES** — classificação + cláusula "inventar gênero".
  - C3.5 **TEMPLATE TEMPORAL** não-negociável (line-by-line do template).
  - C3.6 **VOCABULÁRIO APROVADO** — por que listar explicitamente.
  - C3.7 **RECOMMENDATIONS** — o anti-marketing-copy.
  - C3.8 **TRADUÇÃO CHINESA** literal + **HARDENING** anti-injection.

**Módulo C4 — Construindo seu clone (laboratório mão-na-massa)**
- C4.1 Arquitetura do clone: frontend vanilla + Netlify Function + Claude Sonnet 4.6.
- C4.2 `generate.ts` linha-a-linha: tool use forçado, prompt cache ephemeral, rate limit in-memory.
- C4.3 `check-email.ts` + HMAC tokens: allowlist correta vs. original quebrado.
- C4.4 Deploy em `netlify deploy --prod`. Custo real: $0.024/geração após warmup.
- C4.5 Segurança: as 6 correções do clone vs. o original.
- C4.6 Extensões: streaming response, webhook para fal.ai, dashboard de custo.

**Módulo C5 — Derivando SUA taxonomia (ofício autoral)**
- C5.1 A observação ética: copiar 1:1 é replicar produto comercial. Fazer a sua é o ofício.
- C5.2 Metodologia: escolha de nicho → listagem de estilos → validação empírica em batch.
- C5.3 Exercício guiado: o aluno escolhe um nicho (ex: UGC de beleza, gaming shorts, educação infantil, corporativo B2B) e deriva 5-7 presets próprios.
- C5.4 Como testar empiricamente na fal.ai — plano de validação de 4-6h e ~$5.
- C5.5 Escrevendo seus próprios prompts canônicos (strings literais).
- C5.6 Documentando sua biblioteca para reuso em equipe.

**Módulo C6 — Produção em escala e pipeline comercial**
- C6.1 Integração com editores profissionais: DaVinci Resolve, Premiere, After Effects. Onde encaixa o Seedance no fluxo.
- C6.2 Batch generation e controle de qualidade: scripts Python/TS que geram 50 variações e ordenam por score.
- C6.3 Custos comparativos: fal.ai vs. Dreamina vs. concorrentes por segundo de vídeo final.
- C6.4 Vendendo vídeo-IA para clientes: precificação, briefing, entrega, escopo.
- C6.5 Compliance: direitos de imagem, deepfake, faces reais, marcas, uso comercial.
- C6.6 Red-team: como auditar o output antes da entrega (detecção de drift, refusal, qualidade).

**Projeto final da trilha C**: aluno entrega **um micro-SaaS funcional** derivado do clone — nicho próprio, taxonomia autoral de 5-7 presets, 30 gerações validadas, README de arquitetura e custo.

---

## Pontes entre trilhas

- **Leigo → Prompt-Ready**: após o projeto final A, o módulo "Capítulo 0.5" convida o aluno a aprofundar. Pré-requisito automático: terminar trilha A ou passar um teste de aferição (10 perguntas).
- **Prompt-Ready → Profissional**: ponte é o módulo C2 (engenharia reversa como método) — quem já sabe usar presets naturalmente se pergunta "como isso foi descoberto?".
- **Profissional → Prompt-Ready**: um profissional pode ler B2 como "referência rápida" quando esquecer um preset. Tratamos como "enciclopédia aberta".

---

## O que está nos docs vs. o que precisamos criar

| Conteúdo | Fonte | Ação |
|---|---|---|
| Taxonomia dos 7 presets + strings canônicas | `seedance-system-prompt-didactic.md` camada 3 | Usar literal |
| Template `[0s][3s][6s]` + regras rígidas | `seedance-system-prompt-didactic.md` camada 4 | Usar literal |
| Vocabulário canônico | camada 5 | Usar literal + expandir com exemplos |
| Método das 51 sondas | `seedance-gen-reverse-engineering.md` seções 5-7 | Virar módulo C2 inteiro |
| Achados de segurança | mesma seção 3 | Virar aula C2.6 |
| Código do clone (`generate.ts`, `check-email.ts`, HTML) | `seedance-clone/` | Virar laboratório C4 |
| Estado do Seedance 2.0 + links oficiais | `seedance-pesquisa-web-2026.md` | Virar Capítulo 0.1 + C1 |
| Análise de saturação | `seedance-saturacao-e-proximas-sondas.md` | Virar aula C2.7 |
| **Fundamentos de cinema para leigos** (planos, ângulos, luz, cor) | **Não está nos docs** | **Criar do zero** para Módulo A2 |
| **Workflow com DaVinci/Premiere** | **Não está nos docs** | **Criar** para C6.1 |
| **Pricing e vendas de vídeo-IA** | **Não está nos docs** | **Criar** para C6.4 |
| **Compliance / direitos** | **Não está nos docs** | **Criar** para Capítulo 0.4 + C6.5 |
| **Integração com o áudio nativo da v2.0** | Mencionado mas não detalhado | **Validar empiricamente** antes de ensinar |
| **Image-to-video com 9 refs** | Mencionado mas não detalhado | **Validar empiricamente** antes de ensinar |
| **Vídeos-exemplo renderizados de fato** para cada aula | **Não existem** | **Renderizar** todos (exigência pedagógica central) |

---

## Formato e entrega (decisões travadas)

- **Formato**: HTML no padrão INEMA.CLUB. Skills `formato-curso` e `revisar-curso` aplicam direto. Uma página de índice por trilha + páginas de aula + componentes visuais INEMA.
- **Navegação**: cada aula = 1 página HTML, header de trilha colorido (A verde "iniciante", B âmbar "aplicado", C azul "técnico"), barra de progresso, links "anterior/próxima".
- **Mídia (sem fal.ai por ora)**: o usuário ainda não tem crédito fal.ai. Estratégia de compensação:
  - Embeds de **terceiros creditados**: GitHub `awesome-seedance-2-prompts` (500+ prompts com vídeos), YouTube de criadores Seedance, página oficial ByteDance.
  - **Placeholders "Vídeo-exemplo a render"** em cada aula, com o prompt exato catalogado — quando o usuário conseguir crédito, renderiza em batch e substitui em uma sessão só.
  - **Side-by-side GIF/still** dos outputs oficiais do `awesome-seedance` em vez de vídeo.
  - Risco: curso lança ~70% da força visual final. Documentado num aviso na página de abertura.
- **Entrega temporal**: **tudo de uma vez**. As 3 trilhas completas antes de publicar. Coerência > velocidade. Expectativa de 3-5 semanas de trabalho focado.
- **Aviso v2.0**: banner fixo no Capítulo 0 avisando que parte do material foi extraído contra Seedance 1.x e está marcado com selo **"Revalidar na v2.0"**. Cada ponto afetado (STOP MOTION, 3 fases de áudio, 350-500 palavras, anamorphic mandatório, filter bypass chinês) recebe o selo explicitamente e uma nota de revisão futura.
- **Downloads por módulo**: 1 PDF cheat sheet + 1 arquivo `.md` com todos os prompts da aula para copiar.
- **Laboratório interativo** (trilha C): o clone não roda embedado, mas as instruções de "deploy o seu em 10 min" estão na aula C4.4.
- **Idioma**: conteúdo em PT-BR, prompts em EN (e CN quando relevante, com aviso ético).

---

## Roadmap de produção (atualizado com decisões)

Sem validação empírica prévia (decisão do usuário). Sem fal.ai no início. Entrega monolítica das 3 trilhas.

1. **Fase 1 — Esqueleto HTML INEMA.CLUB (meio dia)**: skill `formato-curso` gera a shell: 1 página-hub + 1 índice por trilha (A/B/C) + template de aula. Define paleta por trilha, barra de progresso, componente "Vídeo-exemplo".
2. **Fase 2 — Capítulo 0 comum (1 dia)**: 4 aulas de portal — estado do Seedance 2.0, setup fal.ai/Dreamina, diagnóstico de trilha, ética + **banner "Revalidar na v2.0"**.
3. **Fase 3 — Trilha A (4-5 dias)**: 4 módulos × ~4-5 aulas = ~20 aulas. Cria do zero o **Dicionário de cinema sem trauma** (A2). Hands-on leve com playground.
4. **Fase 4 — Trilha B (6-8 dias)**: 5 módulos. O núcleo é **B2 (7 presets canônicos)** — 7 aulas profundas, cada uma com 4 exemplos de prompt completo + vídeo placeholder. B4 cobre hacks/inventar-gênero. B5 cobre escala e image-to-video.
5. **Fase 5 — Trilha C (6-8 dias)**: 6 módulos. **C3** é o system prompt didático já pronto (8 aulas, uma por camada, copiando o `.md` existente). **C4** é laboratório do clone (4 aulas usando `generate.ts` linha-a-linha). **C5-C6** exigem criação nova (taxonomia autoral, pipeline comercial, compliance).
6. **Fase 6 — Revisão integrada (1-2 dias)**: usar skill `revisar-curso` para auditar os ~70 arquivos HTML. Conferir links entre trilhas, pontes, consistência visual, selos "Revalidar v2.0".
7. **Fase 7 — Publicação**: push para INEMA.CLUB.
8. **Fase 8 — Pós-lançamento** (quando o usuário conseguir crédito fal.ai): batch-render dos vídeos-exemplo placeholders, substituição em sessão única.

**Estimativa total**: 3-5 semanas. Paralelismo possível entre módulos dentro de cada trilha.

---

## Verificação (como saber que está pronto)

- **Trilha A** pronta quando um usuário sem experiência consegue, em 2 horas, publicar um vídeo de 10s decente no Instagram/TikTok só lendo a trilha A.
- **Trilha B** pronta quando um editor freelancer consegue entregar 10 prompts aprovados por cliente em menos de 1 hora usando só o receitário.
- **Trilha C** pronta quando um dev consegue, em 1 tarde, fazer deploy de um clone derivado com taxonomia diferente do original.
- **Curso** pronto quando os três testes acima passam com usuários reais (não hipotéticos).

---

## Decisões travadas

- ✅ **Formato**: HTML INEMA.CLUB.
- ✅ **Fal.ai**: sem crédito no início. Vídeos como placeholder + embeds de terceiros creditados; substituição pós-lançamento.
- ✅ **Entrega**: tudo de uma vez (3 trilhas completas antes de publicar).
- ✅ **Validação v2.0**: não travar na pré-redação; marcar pontos afetados com selo "Revalidar v2.0" e banner no Capítulo 0.

## Decisões ainda pendentes (não bloqueiam início)

Estas podem ser tomadas durante a execução:

1. **Monetização**: grátis aberto na INEMA.CLUB, pago, ou freemium (A grátis / B+C pagas)? Padrão assumido: **grátis aberto** a menos que avisado.
2. **Co-autoria**: Claude redige drafts completos e o usuário revisa? Ou co-escrita iterativa aula a aula? Padrão assumido: **Claude draft → usuário revisa por módulo**.
3. **Créditos dos embeds**: qual é a política de creditar terceiros (awesome-seedance, MindStudio, redreamality) nas páginas? Padrão assumido: **link + nome do autor em cada embed + página "Fontes" no Capítulo 0**.

---

## Arquivos críticos a reusar

- `doc/seedance-system-prompt-didactic.md` — base das trilhas B e C.
- `doc/seedance-gen-reverse-engineering.md` — base do módulo C2.
- `doc/seedance-pesquisa-web-2026.md` — base do Capítulo 0 e do C1.
- `doc/seedance-clone/netlify/functions/generate.ts` — laboratório do módulo C4.
- `doc/seedance-clone/index.html` — referência de frontend vanilla do módulo C4.
- `doc/seedance-clone/README.md` — instruções de deploy do C4.
- `doc/seedance-saturacao-e-proximas-sondas.md` — aula C2.7 + discussão de até onde ir.
