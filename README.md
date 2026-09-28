# 🐶 Doguito PetShop — Testes unitários e de integração (Jest)

Testes automatizados em **JavaScript + Jest** para o sistema *Doguito PetShop* (`src/`),
seguindo os 24 casos propostos no documento **Testes_unitários.pdf**.

> O código-fonte do sistema (`src/app.js`, `index.html`, `style.css`) **não foi alterado**.

## Como rodar

```bash
npm install
npm test                  # todos os testes
npm run test:unit         # somente unitários
npm run test:integration  # somente integração
```

## Como funciona

O sistema é um front-end sem módulos (funções globais + DOM). Para testá-lo sem mexer no código,
`tests/helpers/loadApp.js` carrega `index.html` + `app.js` em um DOM isolado (**jsdom**) a cada teste:

- `alert` é substituído por `jest.fn()` (para verificar as mensagens de erro);
- `innerText` recebe um polyfill (o jsdom não implementa, os navegadores sim);
- o `setInterval` do carrossel usa os *fake timers* do Jest (`jest.advanceTimersByTime`).

## Estrutura

```
src/                         sistema original (index.html, app.js, style.css)
tests/helpers/loadApp.js     carrega o sistema no jsdom
tests/unit/                  T01–T22 (cliente, pet, produto, carrinho, regras, outros)
tests/integration/           T23–T24 + fluxos completos pela interface
```

## Resultado da execução

**45 testes: 37 passam ✅ | 8 falham ❌** — as falhas são **defeitos reais do sistema**
(o teste descreve a regra do documento; o `app.js` não a implementa).

| Caso | Situação | Observação |
|---|---|---|
| T01–T05 Cliente | ✅ | |
| T06, T07 Pet (cadastro, nome obrigatório) | ✅ | |
| **T08** Pet com tipo | ❌ | `cadastrarPet` não valida `tipo`: aceita tipo vazio |
| **T09** Pet com idade numérica | ❌ | `parseInt("abc")` vira `NaN` e o pet é cadastrado assim mesmo (2 testes) |
| T10, T12, T13 Produto | ✅ | |
| **T11** Preço maior que zero | ❌ | `criarProduto` só barra `preco < 0`; preço `0` é aceito |
| T14–T17 Carrinho | ✅ | |
| T18 Desconto de 10% acima de R$100 | ✅ | R$100 exato não tem desconto (regra "acima de") |
| **T19** Desconto de 15% para VIP | ❌ | Não implementado: o carrinho não tem relação com o cliente VIP (unitário + integração) |
| **T20** Carrinho rejeita preço zero | ❌ | Produto com preço 0 entra no carrinho (unitário + integração) |
| T21 Carrinho vazio = 0 | ✅ | `calcularTotal()` devolve a *string* `"0.00"` (comparado com `Number`) |
| T22 Finalizar limpa o carrinho | ✅ | |
| T23 Carrossel automático (4 s) | ✅ | Inclui a volta ao primeiro slide |
| T24 Botões Adicionar/Remover/Finalizar | ✅ | Testados por clique real nos botões |

### Observações extras
- "Remover" sempre tira o **primeiro** item do carrinho (`shift()`), não o produto selecionado.
- O total exibido usa `toFixed(2)`, portanto é sempre texto (`"50.00"`).
