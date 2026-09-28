const { loadApp } = require("../helpers/loadApp");

describe("Outros Testes (unitários)", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  test("T21 - Carrinho vazio deve retornar total igual a 0", () => {
    expect(app.estado.carrinho()).toHaveLength(0);
    expect(Number(app.window.calcularTotal())).toBe(0);
  });

  test("T22 - Ao finalizar compra o carrinho deve ser limpo", () => {
    app.criarEAdicionar("Coleira", 30);
    app.criarEAdicionar("Brinquedo", 20);

    app.window.finalizarCompra();

    expect(app.alert).toHaveBeenCalledWith("Compra finalizada: 50.00");
    expect(app.estado.carrinho()).toHaveLength(0);
    expect(app.$("listaCarrinho").children).toHaveLength(0);
    expect(Number(app.$("total").textContent)).toBe(0);
  });
});
