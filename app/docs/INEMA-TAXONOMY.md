# Taxonomia INEMA — Presets Canônicos

> Versão: 0.1 (DRAFT) · Data: 2026-04-13
> Status: **aguardando revisão do usuário antes de virar canônica no system prompt**

Esta é a taxonomia autoral da aplicação INEMA de geração de prompts para Seedance 2.0. Segue a estrutura arquitetural do módulo 3.3 da Trilha 3 (8 camadas), mas com nomes, triggers e strings canônicas próprias — **não é cópia** dos presets do produto estudado.

## Princípios

1. **Cada preset tem uma função emocional clara** — não sobreposição.
2. **Strings canônicas são literais** — o modelo copia, não parafraseia.
3. **Triggers são palavras-chave** (em PT ou EN) que a cena do usuário contém.
4. **Vocabulário herdado** (camera, physics, time, lighting) é público e universal — reutilizável.
5. **Fallback inventivo** quando nenhum core encaixa (padrão `<REFERENCE> <STYLE>`).

---

## Os 6 presets core

### 1. INEMA EPIC — Grandeza e escala

**Função emocional:** o mundo como protagonista, sentimento de pequenez diante da imensidão, respeito, solenidade.

```
Triggered by: paisagens vastas, natureza imponente, figura solitária contra o mundo,
              escala geográfica, vistas aéreas, montanhas, desertos, oceanos, espaço,
              ruínas antigas, geleiras, savanas, mythic figures
color_system: "golden earth tones with deep shadow contrast, low sun angle, horizon-dominated framing"
camera_style: "aerial pull-back / extreme low-angle / overhead top-down"
techniques:   ["atmospheric haze depth", "natural cloth movement",
               "120fps slow-motion", "horizon rim lighting"]
```

**Casos-exemplo:** viajante em deserto · barco ao amanhecer no mar · escalador em montanha · astronauta em paisagem lunar · peregrino em planície.

---

### 2. INEMA INTIMIST — Momentos íntimos e contemplativos

**Função emocional:** proximidade pessoal, silêncio significativo, vulnerabilidade, gestos pequenos que importam.

```
Triggered by: cenas pessoais silenciosas, olhares demorados, pequenos gestos,
              interiores calmos, solidão contemplativa, toque delicado, memória,
              escrita de carta, preparação de chá, primeira vez
color_system: "warm neutral palette with soft key light, selective focus on subject,
               ambient bokeh background"
camera_style: "slow dolly-in / intimate close-up / handheld natural lag"
techniques:   ["shallow depth of field", "skin texture macro detail",
               "breath-synced micro-movement", "ambient volumetric light"]
```

**Casos-exemplo:** mão escrevendo carta à luz de janela · avô passando xícara de chá · casal em silêncio no sofá · criança amarrando sapato · primeira leitura de livro.

---

### 3. INEMA URBAN PULSE — Cidade contemporânea viva

**Função emocional:** cotidiano vibrante, movimento urbano, modernidade, ritmo da cidade, vida acontecendo.

```
Triggered by: ruas movimentadas, metrô, café urbano, escritório moderno, skateboard,
              street style, cotidiano urbano, trânsito, food truck, festival de rua,
              bicicleta na cidade, ginásio
color_system: "desaturated concrete tones with accent color pops,
               mixed practical lighting, natural reflections"
camera_style: "tracking shot / handheld natural lag / crash zoom"
techniques:   ["reflective surface interaction", "crowd motion blur",
               "120fps slow-motion detail capture", "mixed color temperature"]
```

**Casos-exemplo:** corrida da manhã pela cidade · skatista em praça · atravessando metrô de São Paulo · barista preparando café · vendedor de rua em feira.

---

### 4. INEMA ELEMENTAL — Forças da natureza em primeiro plano

**Função emocional:** poder da natureza, elemento como protagonista absoluto, impotência humana, beleza destrutiva.

```
Triggered by: chuva forte, tempestade, fogo, vento intenso, ondas, neve, relâmpago,
              furacão, tornado, vulcão, avalanche, natureza violenta
color_system: "high contrast elemental palette with dramatic directional light,
               element-as-key-light, deep negative space"
camera_style: "aerial pull-back / extreme low-angle / tracking shot"
techniques:   ["water surface tension physics", "particle system interaction",
               "120fps slow-motion snap-back", "elemental rim lighting"]
```

**Casos-exemplo:** árvore sozinha em tempestade · fogueira à noite · barco em ondas gigantes · primeira neve caindo · raio iluminando floresta.

---

### 5. INEMA DREAM — Onírico e fantasia suave

**Função emocional:** mágico sem ser infantil, memória idealizada, poesia visual, atmosfera etérea.

```
Triggered by: cenas surreais, fantasia delicada, infância, memória nostálgica,
              luz dourada mágica, atmosfera etérea, flores flutuando, ninho, sonho,
              bailarina, contos de fadas contemporâneos
color_system: "dreamy pastel palette with golden hour warmth,
               soft diffuse light, gentle particle atmosphere"
camera_style: "dreamy slow dollies / graceful orbits / handheld natural lag"
techniques:   ["cloth inertia physics", "particle drift atmosphere",
               "120fps slow-motion", "golden hour rim lighting"]
```

**Casos-exemplo:** bailarina girando em campo de cerejeiras · criança correndo atrás de borboleta · noiva caminhando em jardim · jovem lendo sob árvore · velas flutuando no lago.

---

### 6. INEMA DOCUMENTARY — Observação autêntica

**Função emocional:** realismo honesto, relato, crédibilidade, personagem real em contexto real.

```
Triggered by: realismo, relato, personagem real contando história, produtos em uso real,
              depoimento visual, artesanato em processo, profissional trabalhando,
              família em casa, entrevista, making-of
color_system: "natural palette with source-motivated lighting,
               minimal color grading, honest skin tones"
camera_style: "handheld natural lag / intimate close-up / tracking shot"
techniques:   ["natural practical lighting", "unscripted micro-expressions",
               "environmental sound detail", "documentary observational framing"]
```

**Casos-exemplo:** ceramista no torno · enfermeira em plantão · feirante contando da banca · pai ensinando filho a andar de bike · artesã bordando no quintal.

---

## Fallback inventivo

Quando nenhum dos 6 core se encaixa mas a cena evoca um estilo cinematográfico famoso, o modelo deve **inventar um gênero novo** em CAPS seguindo o padrão `<REFERENCE> <STYLE>`.

**Exemplos permitidos:**
- `LYNCH SURREAL` — surrealismo David Lynch (cortinas vermelhas, luz verde, slow ambient dread)
- `ALMODOVAR VIBRANT` — melodrama espanhol Almodóvar (vermelho + amarelo vivos, paixão)
- `MIYAZAKI PASTORAL` — estética Studio Ghibli (céu azul com nuvens grandes, vento no cabelo)
- `KUBRICK SYMMETRIC` — simetria Kubrick (one-point perspective, geometria rígida)
- `WONG KAR WAI NEON` — Wong Kar Wai (slow motion, neon, solidão urbana)
- `GLAUBER ROCHA ARIDO` — cinema novo brasileiro (alto contraste, ventos do sertão)

**Instrução ao modelo:** use o nome do diretor/estilo em CAPS, preencha `color_system`, `camera_style` e `techniques` baseado no conhecimento visual desse estilo.

---

## Routing rules (ordem de prioridade)

1. **Match pelo PRIMEIRO** preset cujos triggers se encaixam na descrição.
2. **Se nenhum core encaixa** mas a cena evoca estilo cinematográfico famoso → invente via fallback.
3. **Default de escala**: cenas épicas/grandes sem trigger específico → `INEMA EPIC`.
4. **Default de intimidade**: cenas pessoais/calmas sem trigger específico → `INEMA INTIMIST`.
5. **Override urbano**: qualquer cena de cotidiano urbano, mesmo que caiba em outro preset, prefere `INEMA URBAN PULSE` quando o movimento da cidade é central.

---

## Template temporal (herdado e adaptado)

A estrutura `[0s][3s][6s]` do material de referência é **técnica oficial** (timeline prompting documentada em MindStudio/redreamality). Vai ser reutilizada com adaptações mínimas:

```
LINE 1 (literal opening, always):
  same character throughout all shots

[0s] <ONE camera move from preset> <subject> <action>, <ONE physics from preset>,
     <color descriptor from color_system>, <lighting note>.
     Phase 1 audio: practical sounds only — <2-3 ambient sounds>.

[3s] <DIFFERENT camera move from preset> <transition or escalation>,
     120fps slow-motion captures <specific micro-detail>, <color reinforcement>.
     Phase 2 audio: ambient music enters softly, building subtle tension.

[6s] <climax framing>. <moment of pause 1-2s — brief quiet — frozen micro-detail>
     — return to natural motion as <return event>.
     Phase 3 audio: full emotional resolution with layered sound.
     Cinematic 2.39:1 aspect ratio.
```

### Diferenças vs. template do material de referência

| Elemento | Material referência | INEMA |
|---|---|---|
| Abertura literal | "same character throughout all shots" | **mantém** (é técnica universal) |
| [0s] audio | "practical sounds only — ambient list" | **mantém** |
| [3s] audio | "single low brass chord arrives, building tension" | **"ambient music enters softly, building subtle tension"** — menos dramático, mais versátil |
| [6s] técnica | "STOP MOTION X-seconds — complete audio silence — explosive snap-back" | **"moment of pause 1-2s — brief quiet — frozen micro-detail — return to natural motion"** — mais suave, menos datado |
| [6s] audio | "full orchestral score crescendo with 3x audio density" | **"full emotional resolution with layered sound"** — sem obrigar orquestra |
| Fechamento | "Anamorphic 2.39:1" | **"Cinematic 2.39:1 aspect ratio"** — mesma coisa, linguagem menos técnica |

**Justificativa das mudanças:** O template original foi validado contra Seedance 1.x e é datado (STOP MOTION virou assinatura overused, brass chord é muito específico). A versão INEMA mantém o que é técnica universal (`same character`, 3 beats, 3 fases de áudio, 2.39:1) mas substitui os elementos autorais do produto estudado por variações mais flexíveis e atemporais.

**Selo "Revalidar v2.0"**: testar empiricamente se esses 3 elementos modificados performam tão bem quanto os originais no Seedance 2.0 atual. Se não, voltar para os originais.

---

## Decisões pendentes (aguardando input do usuário)

Antes de congelar esta taxonomia no `SYSTEM_PROMPT` do `api/generate.ts`, o usuário precisa revisar:

1. **Nomes dos 6 presets** — "INEMA EPIC", "INEMA INTIMIST", "INEMA URBAN PULSE", "INEMA ELEMENTAL", "INEMA DREAM", "INEMA DOCUMENTARY". Mantém todos? Troca algum? Adiciona um 7º?

2. **Strings canônicas** — cada preset tem uma string `color_system` de 1 linha. As do draft são propostas. Usuário quer reescrever?

3. **Triggers** — as palavras-chave que ativam cada preset estão corretas para o público da INEMA?

4. **Fallback inventivo** — os 6 exemplos (LYNCH, ALMODOVAR, MIYAZAKI, KUBRICK, WONG KAR WAI, GLAUBER ROCHA) são direções razoáveis? Glauber Rocha vale a pena citar (brasileiro) ou é muito nicho?

5. **Template temporal** — as 4 mudanças listadas em "Diferenças vs. material de referência" são aceitáveis? Ou prefere manter o template original do produto estudado literalmente (STOP MOTION + brass chord + 3x audio density)?

Quando as 5 decisões forem tomadas, o system prompt final é escrito no `api/generate.ts` e a app vai para teste.

---

## Próximos passos (após aprovação)

1. Usuário revisa este documento e pede ajustes (nomes, strings, triggers, fallback, template).
2. Segunda versão deste .md é commitada com "(APROVADA v1.0)" no header.
3. System prompt completo é escrito em `api/generate.ts` embutindo esta taxonomia.
4. Frontend é construído.
5. Deploy + teste.
