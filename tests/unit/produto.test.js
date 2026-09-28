const { loadApp } = require("../helpers/loadApp");

describe("Testes de Produto", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  test("T10 - Deve permitir criar produto com nome", () => {
    app.criarProduto({ nome: "Ração Premium", preco: "89.9" });

    expect(app.estado.produtos()).toEqual([{ nome: "Ração Premium", preco: 89.9 }]);
  });

  describe("T11 - Produto deve possuir preço maior que zero", () => {
    test("aceita preço maior que zero", () => {
      app.criarProduto({ nome: "Osso", preco: "0.01" });

      expect(app.estado.produtos()).toHaveLength(1);
      expect(app.estado.produtos()[0].preco).toBeGreaterThan(0);
    });

    test("não deve criar produto com preço igual a zero", () => {
      app.criarProduto({ nome: "Osso", preco: "0" });

      expect(app.estado.produtos()).toHaveLength(0);
      expect(app.alert).toHaveBeenCalled();
    });
  });

  test("T12 - Produto não pode possuir preço negativo", () => {
    app.criarProduto({ nome: "Osso", preco: "-5" });

    expect(app.estado.produtos()).toHaveLength(0);
    expect(app.alert).toHaveBeenCalledWith("Preço inválido");
  });

  test("T13 - Produto deve aparecer na lista de produtos cadastrados", () => {
    app.criarProduto({ nome: "Ração Premium", preco: "89.9" });
    app.criarProduto({ nome: "Coleira", preco: "25" });

    const itens = [...app.$("listaProdutos").children].map((li) => li.textContent);
    expect(itens).toEqual(["Ração Premium - R$ 89.9", "Coleira - R$ 25"]);
  });
});
