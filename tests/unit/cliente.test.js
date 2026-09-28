const { loadApp } = require("../helpers/loadApp");

describe("Testes de Cliente", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  test("T01 - Deve permitir criar cliente com nome válido", () => {
    app.cadastrarCliente({ nome: "Maria Silva", email: "maria@email.com" });

    expect(app.estado.clientes()).toHaveLength(1);
    expect(app.estado.clientes()[0].nome).toBe("Maria Silva");
    expect(app.$("listaClientes").textContent).toContain("Maria Silva");
    expect(app.alert).not.toHaveBeenCalled();
  });

  test("T02 - Não deve permitir cliente com nome vazio", () => {
    app.cadastrarCliente({ nome: "", email: "maria@email.com" });

    expect(app.estado.clientes()).toHaveLength(0);
    expect(app.alert).toHaveBeenCalledWith("Nome inválido");
  });

  test("T03 - Deve permitir cadastrar cliente com email válido", () => {
    app.cadastrarCliente({ nome: "João", email: "joao@email.com" });

    expect(app.estado.clientes()).toHaveLength(1);
    expect(app.estado.clientes()[0].email).toBe("joao@email.com");
    expect(app.alert).not.toHaveBeenCalled();
  });

  test("T04 - Não deve permitir email inválido", () => {
    app.cadastrarCliente({ nome: "João", email: "joao.email.com" });

    expect(app.estado.clientes()).toHaveLength(0);
    expect(app.alert).toHaveBeenCalledWith("Email inválido");
  });

  test("T05 - Deve permitir marcar cliente como VIP", () => {
    app.cadastrarCliente({ nome: "Ana", email: "ana@email.com", vip: true });
    app.cadastrarCliente({ nome: "Bia", email: "bia@email.com", vip: false });

    const [ana, bia] = app.estado.clientes();
    expect(ana.vip).toBe(true);
    expect(bia.vip).toBe(false);
  });
});
