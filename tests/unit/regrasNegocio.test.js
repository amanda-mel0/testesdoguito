const { loadApp } = require("../helpers/loadApp");

describe("Testes de Regras de Negócio", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  describe("T18 - Compra acima de R$100 deve aplicar desconto de 10%", () => {
    test("R$110 → R$99,00", () => {
      app.criarEAdicionar("Ração", 60);
      app.criarEAdicionar("Cama", 50);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(99, 2);
    });

    test("R$200 → R$180,00", () => {
      app.criarEAdicionar("Casinha", 200);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(180, 2);
    });

    test("exatamente R$100 NÃO recebe desconto (regra é 'acima de')", () => {
      app.criarEAdicionar("Ração", 100);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(100, 2);
    });

    test("compra abaixo de R$100 não recebe desconto", () => {
      app.criarEAdicionar("Ração", 99.9);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(99.9, 2);
    });
  });

  describe("T19 - Cliente VIP deve receber desconto de 15%", () => {
    test("cliente VIP: compra de R$50 → R$42,50", () => {
      app.cadastrarCliente({ nome: "Ana", email: "ana@email.com", vip: true });
      app.criarEAdicionar("Coleira", 50);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(42.5, 2);
    });

    test("controle: cliente não VIP: compra de R$50 → R$50,00", () => {
      app.cadastrarCliente({ nome: "Bia", email: "bia@email.com", vip: false });
      app.criarEAdicionar("Coleira", 50);

      expect(Number(app.window.calcularTotal())).toBeCloseTo(50, 2);
    });
  });

  test("T20 - Carrinho não deve aceitar produto com preço igual a zero", () => {
    app.criarProduto({ nome: "Brinde", preco: "0" });
    // tenta adicionar ao carrinho o produto de preço 0 (caso ele exista na lista)
    if (app.estado.produtos().length > 0) {
      app.window.adicionarCarrinho();
    }

    expect(app.estado.carrinho().filter((p) => p && p.preco === 0)).toHaveLength(0);
  });
});
