const { loadApp } = require("../helpers/loadApp");

describe("Integração - Fluxos completos pela interface (cliques nos botões)", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  /** cadastra um produto pela tela (preenche inputs + clica em "Criar Produto") */
  const cadastrarProdutoPelaTela = (nome, preco) => {
    app.preencherProduto({ nome, preco: String(preco) });
    app.clicar("Criar Produto");
  };

  const selecionarProduto = (indice) => {
    app.$("produtoSelect").value = String(indice);
  };

  test("produto cadastrado aparece na lista E no select do carrinho", () => {
    cadastrarProdutoPelaTela("Ração", 50);
    cadastrarProdutoPelaTela("Coleira", 30);

    expect(app.$("listaProdutos").children).toHaveLength(2);
    const opcoes = [...app.$("produtoSelect").options].map((o) => o.textContent);
    expect(opcoes).toEqual(["Ração", "Coleira"]);
  });

  describe("T24 - Botões Adicionar / Remover / Finalizar funcionam corretamente", () => {
    beforeEach(() => {
      cadastrarProdutoPelaTela("Ração", 50);
      cadastrarProdutoPelaTela("Coleira", 30);
    });

    test("botão Adicionar coloca o produto selecionado no carrinho e atualiza o total", () => {
      selecionarProduto(1);
      app.clicar("Adicionar");

      expect(app.estado.carrinho().map((p) => p.nome)).toEqual(["Coleira"]);
      expect(app.$("listaCarrinho").children).toHaveLength(1);
      expect(app.$("total").textContent).toBe("30.00");
    });

    test("botão Remover tira um produto do carrinho e recalcula o total", () => {
      selecionarProduto(0);
      app.clicar("Adicionar");
      selecionarProduto(1);
      app.clicar("Adicionar");
      expect(app.$("total").textContent).toBe("80.00");

      app.clicar("Remover");

      expect(app.$("listaCarrinho").children).toHaveLength(1);
      expect(app.$("total").textContent).toBe("30.00");
    });

    test("botão Remover com carrinho vazio não quebra e mantém total 0", () => {
      app.clicar("Remover");

      expect(app.estado.carrinho()).toHaveLength(0);
      expect(Number(app.$("total").textContent)).toBe(0);
    });

    test("botão Finalizar mostra o total, limpa o carrinho e zera a tela", () => {
      selecionarProduto(0);
      app.clicar("Adicionar");
      selecionarProduto(1);
      app.clicar("Adicionar");

      app.clicar("Finalizar");

      expect(app.alert).toHaveBeenCalledWith("Compra finalizada: 80.00");
      expect(app.estado.carrinho()).toHaveLength(0);
      expect(app.$("listaCarrinho").children).toHaveLength(0);
      expect(Number(app.$("total").textContent)).toBe(0);
    });
  });

  test("fluxo completo: cadastro de cliente + pet + produtos → compra acima de R$100 (10% off)", () => {
    // cliente
    app.preencherCliente({ nome: "Carla", email: "carla@email.com" });
    app.clicar("Cadastrar");
    // pet
    app.preencherPet({ nome: "Thor", tipo: "cachorro", idade: "4" });
    app.clicar("Cadastrar Pet");
    // produtos
    cadastrarProdutoPelaTela("Ração", 80);
    cadastrarProdutoPelaTela("Brinquedo", 40);

    expect(app.$("listaClientes").textContent).toContain("Carla");
    expect(app.$("listaPets").textContent).toContain("Thor (cachorro)");

    selecionarProduto(0);
    app.clicar("Adicionar");
    selecionarProduto(1);
    app.clicar("Adicionar");

    // 80 + 40 = 120 → 10% de desconto = 108,00
    expect(app.$("total").textContent).toBe("108.00");

    app.clicar("Finalizar");
    expect(app.alert).toHaveBeenLastCalledWith("Compra finalizada: 108.00");
    expect(app.estado.carrinho()).toHaveLength(0);
  });

  test("os cadastros de cliente, pet e produto não interferem entre si", () => {
    app.preencherCliente({ nome: "Carla", email: "carla@email.com", vip: true });
    app.clicar("Cadastrar");
    app.preencherPet({ nome: "Thor", tipo: "cachorro", idade: "4" });
    app.clicar("Cadastrar Pet");
    cadastrarProdutoPelaTela("Ração", 80);

    expect(app.estado.clientes()).toHaveLength(1);
    expect(app.estado.pets()).toHaveLength(1);
    expect(app.estado.produtos()).toHaveLength(1);
    expect(app.estado.carrinho()).toHaveLength(0);
  });

  test("cliente VIP cadastrado pela tela recebe 15% de desconto na compra (T19 integrado)", () => {
    app.preencherCliente({ nome: "Carla", email: "carla@email.com", vip: true });
    app.clicar("Cadastrar");
    cadastrarProdutoPelaTela("Coleira", 60);
    selecionarProduto(0);
    app.clicar("Adicionar");

    // 60 - 15% = 51,00
    expect(app.$("total").textContent).toBe("51.00");
  });

  test("produto com preço 0 criado pela tela não pode ir para o carrinho (T20 integrado)", () => {
    cadastrarProdutoPelaTela("Brinde", 0);
    if (app.$("produtoSelect").options.length > 0) {
      selecionarProduto(0);
      app.clicar("Adicionar");
    }

    expect(app.estado.carrinho()).toHaveLength(0);
  });
});
