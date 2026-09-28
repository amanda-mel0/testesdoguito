const { loadApp } = require("../helpers/loadApp");

describe("Testes de Carrinho", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  test("T14 - Deve permitir adicionar produto ao carrinho", () => {
    app.criarEAdicionar("Coleira", 25);

    expect(app.estado.carrinho()).toHaveLength(1);
    expect(app.estado.carrinho()[0].nome).toBe("Coleira");
  });

  test("T15 - Deve permitir remover produto do carrinho", () => {
    app.criarEAdicionar("Coleira", 25);
    app.criarEAdicionar("Brinquedo", 15);
    expect(app.estado.carrinho()).toHaveLength(2);

    app.window.removerCarrinho();

    expect(app.estado.carrinho()).toHaveLength(1);
    expect(app.$("listaCarrinho").children).toHaveLength(1);
  });

  test("T16 - Carrinho deve listar todos os produtos adicionados", () => {
    app.criarEAdicionar("Coleira", 25);
    app.criarEAdicionar("Brinquedo", 15);
    app.criarEAdicionar("Petisco", 8);

    const itens = [...app.$("listaCarrinho").children].map((li) => li.textContent);
    expect(itens).toHaveLength(3);
    expect(itens[0]).toContain("Coleira");
    expect(itens[1]).toContain("Brinquedo");
    expect(itens[2]).toContain("Petisco");
  });

  test("T17 - Carrinho deve calcular o valor total da compra", () => {
    app.criarEAdicionar("Coleira", 30);
    app.criarEAdicionar("Brinquedo", 20);

    expect(Number(app.window.calcularTotal())).toBe(50);
    expect(app.$("total").textContent).toBe("50.00");
  });
});
