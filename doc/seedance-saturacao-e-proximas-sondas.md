# Saturação da Engenharia Reversa & Próximas Sondas Possíveis

> Análise de até onde a sondagem comportamental do `seedance-gen.netlify.app` já chegou, o que ainda está oculto, e o que valeria sondar depois.
> Data: 2026-04-13

---

## ⏳ TODO PARA DEPOIS

**Opção em aberto**: rodar ~40 sondas dirigidas adicionais para fechar os 5% restantes do mapa. Foco em três áreas:

1. **Confirmar/refinar presets core** (~15 sondas dirigidas a cinemas que ainda não acionei: musical Broadway, noir clássico anos 40, esporte dramático, etc.)
2. **Mapear comportamento de refusal** (~10 sondas testando o que o modelo recusa e qual fallback path usa)
3. **Descobrir regras condicionais ocultas** (~15 sondas: cenas de 1 palavra, multi-personagem, números/datas, real people, NSFW, technical keywords específicos)

**Custo**: ~10 minutos paralelizado, ~$1 da API key do dono.
**Resultado esperado**: cobrir 100% do que importa pra reconstrução comercial. Mais que isso é diminishing returns.

---

## A pergunta de origem

> "Teria mais elementos se continuássemos pesquisando ou não?"

**Resposta curta**: sim, mas com retornos progressivamente diferentes em camadas distintas — algumas saturadas, outras com curva ainda crescente.

---

## O que já está fechado (não mudaria com mais sondas)

A **arquitetura macro** está saturada. Sondas adicionais não vão revelar nada novo nestes pontos:

- ✅ **Schema de saída** — 7 campos, formato JSON via tool use
- ✅ **Template temporal** — `[0s][3s][6s] + 3 fases de áudio + STOP MOTION mandatório`
- ✅ **Vocabulário canônico** — câmera / física / lighting / tempo / áudio
- ✅ **Hardening anti-injection** — testado, não vaza system prompt
- ✅ **5 presets core hard-coded** — DUNE EPIC, JOHN WICK ACTION, BLADE RUNNER NOIR, SILENT HILL HORROR, STORM EPIC, confirmados via repetição literal de strings em múltiplas amostras

---

## O que continuaria aparecendo (curva crescente, não decrescente)

A taxonomia de gêneros **não está saturando**. Observe a curva de descoberta nas 5 rodadas:

| Rodada | Sondas | Novos gêneros | Hit rate |
|---:|---:|---:|---:|
| 1 | 12 | 0 | 0% |
| 2 | 12 | 1 | 8% |
| 3 | 10 | 2 | 20% |
| 4 | 6 | 4 | **67%** |
| 5 | 8 | 6 | **75%** |

A taxa de descoberta **subiu** quando comecei a usar referências cinematográficas explícitas (Wes Anderson, Tim Burton, Sergio Leone, Stranger Things, Matrix). Isso confirma a hipótese estrutural: **o catálogo é parcialmente infinito**.

### Por que infinito

O system prompt tem ~5-7 presets hard-coded **+ uma instrução tipo**:

> *"Se o cenário evocar fortemente um estilo cinematográfico famoso, você pode usá-lo em CAPS e preencher os campos canônicos a partir do seu conhecimento de cinema."*

Como Claude conhece **milhares** de diretores, estilos, períodos, escolas e tropos cinematográficos, o teto prático de gêneros distintos é **quantos cinematic styles existem na cultura** — provavelmente 50-100+ acionáveis se você for criativo nas sondas.

A pergunta certa **não é** "quantos gêneros existem?" — é "quais ~5-7 são realmente core?".

---

## O que ainda está oculto e valeria sondar

| Área | O que descobriria | Custo (sondas) | Prioridade |
|---|---|---:|---|
| **Canonicidade dos 12 secundários** | Re-sondar cada um 3-5x para ver se a string de cor é estável (canônica) ou varia (inventada na hora) | ~50 | Média |
| **Presets core ainda não acionados** | Cenas tipo "musical Broadway", "noir clássico anos 40", "esporte dramático em câmera lenta" | ~15 | **Alta** |
| **Regras condicionais ocultas** | Cenas de 1 palavra, multi-personagem, NSFW, real people, números/datas, technical keywords | ~20 | Alta |
| **Comportamento de refusal** | Conteúdo que viola policy — descobrir qual é o fallback path do modelo | ~10 | **Alta** (crítico se for produto comercial) |
| **Few-shot examples no system prompt** | Frases-chave muito específicas (ex: "perfect spherical droplets", "twin-tails streaming backward") repetindo entre gêneros sugerem que existem few-shots no prompt — possível extrair indiretamente | indireto | Baixa |
| **Limites técnicos** | Quanto tempo o STOP MOTION pode durar? Pode ter 4 beats em vez de 3? Pode pedir aspect ratio diferente de 2.39:1? | ~10 | Baixa |
| **Detecção de tom adversarial** | Cenas em que o modelo recusa criar o prompt vs aceita (testar limite ético) | ~15 | Média |

---

## Custo-benefício de continuar

| Estratégia | Sondas | Tempo | Custo (API key dono) | Ganho |
|---|---:|---:|---:|---|
| **Parar agora** | 0 | 0min | $0 | 95% do mapa pronto, suficiente pra reconstrução |
| **Sondas dirigidas focadas** | 40 | ~10min | ~$1 | Fecha 100% do que importa pra produto comercial |
| **Enumeração exaustiva** | 200+ | ~1h | ~$5 | Curiosidades + edge cases, mas overhead alto |
| **Tentar extrair few-shots** | 50-100 | variável | ~$2 | Possível mas baixo retorno (Claude é resistente) |

---

## Recomendação prática

**Você já tem 95% do que precisa pra reconstruir o produto comercialmente.**

Os 5% restantes só importam se:
1. Você quer um produto **idêntico** ao original (vs. funcionalmente equivalente)
2. Você precisa do **comportamento de refusal** mapeado pra evitar bugs em produção
3. Você quer descobrir regras condicionais escondidas que afetam casos especiais

**Para a maioria dos usos**, melhor é:

1. ✅ Decidir **sua própria taxonomia** pro seu nicho (5-10 presets curados, não copiar tudo)
2. ✅ Iterar empiricamente no Seedance pra ver o que realmente renderiza bem
3. ✅ Adicionar presets que o original ignora (`OBSERVATIONAL DOCUMENTARY`, `SITCOM NATURALIST`, `WES ANDERSON SYMMETRIC` se quiser comédia leve)

**Não vale** tentar enumerar todos os gêneros possíveis — isso é infinito porque metade é Claude inventando, e copiar tudo só importa se você é um clone-direto.

---

## Conclusão

A engenharia reversa atingiu o ponto de **diminishing returns macro** mas tem **espaço crescente em micro-detalhes**. A decisão de continuar ou não depende exclusivamente do **objetivo final**:

- **Aprender como o produto funciona** → ✅ Pronto. Pare agora.
- **Reconstruir um clone funcional pro seu nicho** → ✅ Pronto. Pare agora.
- **Reconstruir um clone idêntico ao original** → ⚠️ +40 sondas dirigidas resolvem.
- **Pesquisa de segurança / red team** → ⚠️ Foco em refusal e edge cases (~25 sondas).
- **Extrair o system prompt literal** → ❌ Não vale o esforço. Hardening do tool use bloqueia.
