const { loadApp } = require("../helpers/loadApp");

describe("Testes de Pet", () => {
  let app;
  beforeEach(() => {
    app = loadApp();
  });
  afterEach(() => app.close());

  test("T06 - Deve permitir cadastrar um pet", () => {
    app.cadastrarPet({ nome: "Rex", tipo: "cachorro", idade: "3" });

    expect(app.estado.pets()).toEqual([{ nome: "Rex", tipo: "cachorro", idade: 3 }]);
    expect(app.$("listaPets").textContent).toContain("Rex (cachorro)");
  });

  test("T07 - Pet deve possuir nome obrigatório", () => {
    app.cadastrarPet({ nome: "", tipo: "gato", idade: "2" });

    expect(app.estado.pets()).toHaveLength(0);
    expect(app.alert).toHaveBeenCalledWith("Pet precisa de nome");
  });

  describe("T08 - Pet deve possuir tipo (cachorro, gato, etc)", () => {
    test.each(["cachorro", "gato", "coelho"])("aceita o tipo '%s'", (tipo) => {
      app.cadastrarPet({ nome: "Bolinha", tipo, idade: "1" });

      expect(app.estado.pets()).toHaveLength(1);
      expect(app.estado.pets()[0].tipo).toBe(tipo);
    });

    test("não deve cadastrar pet sem tipo", () => {
      app.cadastrarPet({ nome: "Bolinha", tipo: "", idade: "1" });

      expect(app.estado.pets()).toHaveLength(0);
      expect(app.alert).toHaveBeenCalled();
    });
  });

  describe("T09 - Pet deve possuir idade válida (número)", () => {
    test("aceita idade numérica e guarda como número", () => {
      app.cadastrarPet({ nome: "Rex", tipo: "cachorro", idade: "5" });

      expect(app.estado.pets()).toHaveLength(1);
      expect(app.estado.pets()[0].idade).toBe(5);
    });

    test.each([["abc"], [""]])("não deve cadastrar pet com idade inválida (%p)", (idade) => {
      app.cadastrarPet({ nome: "Rex", tipo: "cachorro", idade });

      expect(app.estado.pets()).toHaveLength(0);
      expect(app.alert).toHaveBeenCalled();
    });
  });
});
