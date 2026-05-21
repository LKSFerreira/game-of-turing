# GitHub Models API Reference

Esta documentação serve como referência local para o uso da API de inferência de IA do **GitHub Models** (Marketplace de modelos do GitHub rodando através da infraestrutura do Azure AI Inference).

## 1. Visão Geral e Autenticação

A API oficial de inferência do GitHub permite consumir LLMs hospedados (incluindo modelos de ponta da OpenAI, Meta, Mistral e xAI) enviando um Personal Access Token (PAT) clássico ou fine-grained que possua ao menos o escopo **`models:read`**.

- **Endpoint Base:** `https://models.github.ai/inference`
- **Chat Completions:** `https://models.github.ai/inference/chat/completions`

### Headers Obrigatórios
Para utilizar o endpoint nativo `models.github.ai`, os seguintes headers são exigidos pela API do GitHub:
- `Accept: application/vnd.github+json`
- `Authorization: Bearer <SEU_GITHUB_PAT>`
- `X-GitHub-Api-Version: 2022-11-28`
- `Content-Type: application/json`

---

## 2. Modelos Suportados (Destaques)

O GitHub Models expõe modelos sob o nome da família ou do fabricante. Para referenciá-los no payload, você normalmente os prefixa com a organização (ex: `openai/gpt-4o`).

Alguns dos principais modelos de interesse para o projeto:
- **`openai/gpt-5-nano`**: Focado em ultra-baixa latência e velocidade pura, suporta tool calling e raciocínio avançado minimizado. Ideal para simulações responsivas.
- **`openai/gpt-5-mini`**: Versão de custo otimizado para aplicações leves.
- **`openai/gpt-4o-mini`**: Versão acessível e consolidada para tarefas de texto diversas.
- **`meta-llama/Llama-3.3-70B-Instruct`**: Llama aprimorado oferecendo performance comparável a modelos fechados.
- **`xAI/Grok-3-Mini`**: Modelo leve focado em raciocínio, ótimo para lógica matemática.

---

## 3. Exemplo de Uso (cURL / Fetch)

O GitHub Models é perfeitamente compatível com a especificação da OpenAI para Chat Completions. 

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  https://models.github.ai/inference/chat/completions \
  -d '{
    "model":"openai/gpt-5-nano",
    "messages":[
      {"role":"system","content":"Você é um assistente rápido."},
      {"role":"user","content":"Qual a capital da França?"}
    ]
  }'
```

---

## 4. Limites de Taxa (Rate Limits) do "Free Tier"

O acesso gratuito pelo playground e via API é fornecido para experimentação e possui limites rígidos. Caso exceda as cotas, será retornado um `429 Too Many Requests`. 

Para contornar instabilidades do Rate Limit em produção, é recomendado atrelar esta integração a um sistema de **Circuit Breaker**, ou aceitar os Termos Pagos por meio de conta Azure conectada ao Github.

Abaixo estão as restrições para contas padrão (Tier Low/High):

| Tier/Família | Requisições por Minuto | Requisições por Dia | Tokens por Requisição | Requests Simultâneos |
| :--- | :--- | :--- | :--- | :--- |
| **Baixa (Geral)** | 15 | 150 | 8000 in / 4000 out | 5 |
| **Alta (Geral)** | 10 | 50 | 8000 in / 4000 out | 2 |
| **gpt-5-nano / mini** | 2 a 3 (depende do plano Copilot) | 12 a 20 | 4000 in / 4000 out | 1 |
| **DeepSeek R1** | 1 a 2 | 8 a 12 | 4000 in / 4000 out | 1 |
| **Grok-3 Mini** | 2 a 3 | 30 a 50 | 4000 in / 8000 out | 1 |

> *Nota: Os limites podem aumentar caso a conta possua assinaturas do GitHub Copilot Pro/Business/Enterprise.*

---

## 5. Implementação no Projeto (Game of Turing)

No projeto, o **GitHub Models** foi implementado como **Provedor Principal** do Orquestrador de Inteligência Artificial (`provedor-github.ts`), devido à sua vasta gama de modelos avançados e integração direta e estável pelo Marketplace, substituindo a prioridade primária da Groq. O modelo padronizado na PoC é o **`openai/gpt-5-nano`** para garantir alta cadência e fluidez (simulando "WPM - Words per minute" humano).

---

## 6. Documentação Completa (Referência Oficial)

Abaixo encontra-se a transcrição da documentação oficial do GitHub Models para uso avançado, Playground e Avaliação de IAs.

### Sobre modelos de GitHub

GitHub Models é um conjunto de ferramentas de desenvolvedor que levam você da ideia de IA à implementação, incluindo um catálogo de modelos, gerenciamento de prompts e avaliações quantitativas.

O GitHub Models é um workspace que reduz a barreira à adoção da IA no nível empresarial. Ele ajuda você a ir além da experimentação isolada inserindo o desenvolvimento de IA diretamente em fluxos de trabalho GitHub familiares. O GitHub Models fornece ferramentas para testar LLMs, refinar prompts, avaliar saídas e tomar decisões informadas com base em métricas estruturadas.

#### Funcionalidades

* **Desenvolvimento de prompts**: inicie o desenvolvimento de IA diretamente em um editor estruturado com suporte para instruções do sistema, entradas de teste e configuração de variáveis.
* **Comparação de modelos**: teste vários modelos lado a lado com prompts e entradas idênticos para experimentar saídas diferentes.
* **Avaliadores**: use métricas de pontuação, como similaridade, relevância e fundamentação, para analisar as saídas e acompanhar o desempenho.
* **Configurações de prompt**: salve as configurações de prompt, modelo e parâmetro como arquivos `.prompt.yml` em seu repositório.
* **Integração da produção**: use a configuração salva para criar recursos de IA ou conectar-se por meio de SDKs à API REST dos GitHub Models.

### Prototipagem com modelos de IA

Se você deseja desenvolver um aplicativo de IA generativa, pode usar GitHub Models para encontrar e experimentar modelos de IA gratuitamente.

#### Encontrar modelos de IA
1. Vá para github.com/marketplace/models.
2. Clique em **Model: Select a Model** no canto superior esquerdo da página.
3. O modelo é aberto no playground de modelos.

#### Experimentar com modelos de IA no playground
O playground de modelos de IA é um recurso gratuito que permite que você ajuste os parâmetros dos modelos e envie comandos para observar como eles respondem.
Para ajustar os parâmetros do modelo, no playground, selecione a guia **Parâmetros** na barra lateral. Para ver o código que corresponde aos parâmetros selecionados, alterne da guia Chat para a guia Código.

#### Comparando modelos
Você pode enviar um prompt para dois modelos ao mesmo tempo e comparar as respostas. Com um modelo aberto no playground, clique em **Compare** e, no menu suspenso, selecione um modelo para comparação. Os parâmetros definidos são usados para ambos os modelos.

#### Como salvar e compartilhar seus experimentos de playground
Salve e compartilhe seu progresso no playground com predefinições. As predefinições salvam: Seu estado atual, Seus parâmetros e Seu histórico de chat.
Para criar uma predefinição para o contexto atual, selecione `Preset: PRESET-NAME` e clique em Create new preset.

### Como otimizar seu aplicativo alimentado por IA com modelos

Com novos modelos de IA sendo lançados regularmente, escolher o ideal para seu aplicativo pode ser desafiador. O GitHub Models ajuda a otimizar seu aplicativo alimentado por IA, permitindo que você compare diferentes modelos e variações de prompt com amostra de entradas, ao mesmo tempo em que usa avaliadores integrados para validar a saída do modelo.

#### Testar variações de prompt com um modelo específico
Testar variações de prompt ajuda a:
* **Otimizar o desempenho e a qualidade**: pequenas alterações no fraseado podem afetar a qualidade da resposta.
* **Esclarecer as instruções**: ao variar o fraseado do prompt, você pode identificar qual versão o modelo entende melhor.
* **Adaptar-se a um comportamento de modelo específico**: você pode adaptar sua entrada à maneira como um modelo específico interpreta a linguagem.
* **Verificar o formato da saída**: talvez você queira uma lista, um parágrafo, um bloco de código ou um tom específico.

#### Avaliar a saída do modelo
Conforme você executa os modelos nos cenários de exemplo, o uso do token de **Entrada** e **Saída** e a **Latência** são exibidos após cada execução. O uso do token é importante porque afeta diretamente as limitações de custo, desempenho e modelo. Modelos com latência menor, como a classe "nano" (`gpt-5-nano`), são fundamentais para respostas em tempo real.

### Faturamento e Entrar em produção
Quando estiver pronto para ir além da oferta gratuita, você terá duas opções para acessar modelos de IA além dos limites gratuitos:
* Você pode aceitar o uso pago dos GitHub Models, permitindo limites de taxa maiores. O preço baseia-se no número de unidades de token usadas (Ex: USD 0,00001 por unidade de token padrão).
* Trazer suas próprias chaves de API (BYOK) de assinatura OpenAI ou Azure.

*Referência final: Extraído do Hub Oficial de Documentos do GitHub (2026).*
