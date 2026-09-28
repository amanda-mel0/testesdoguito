const { loadApp } = require("../helpers/loadApp");

describe("Integração - Carrossel (HTML + JS + timer)", () => {
  let app;
  const transform = () => app.document.querySelector(".slides").style.transform;

  beforeEach(() => {
    jest.useFakeTimers();
    app = loadApp();
  });
  afterEach(() => {
    app.close();
    jest.useRealTimers();
  });

  test("a página possui 3 slides e começa no primeiro", () => {
    expect(app.document.querySelectorAll(".slide")).toHaveLength(3);
    expect(app.estado.slideIndex()).toBe(0);
  });

  test("T23 - O carrossel deve trocar automaticamente as imagens (a cada 4s)", () => {
    jest.advanceTimersByTime(3999);
    expect(app.estado.slideIndex()).toBe(0);

    jest.advanceTimersByTime(1);
    expect(app.estado.slideIndex()).toBe(1);
    expect(transform()).toBe("translateX(-100%)");

    jest.advanceTimersByTime(4000);
    expect(app.estado.slideIndex()).toBe(2);
    expect(transform()).toBe("translateX(-200%)");
  });

  test("T23 - Após o último slide o carrossel volta ao primeiro", () => {
    jest.advanceTimersByTime(4000 * 3);

    expect(app.estado.slideIndex()).toBe(0);
    expect(transform()).toMatch(/^translateX\(-0%\)$/);
  });

  test("botões ❯ e ❮ trocam o slide manualmente (com volta ao início/fim)", () => {
    app.clicar("❯");
    expect(app.estado.slideIndex()).toBe(1);

    app.clicar("❮");
    app.clicar("❮"); // do primeiro volta para o último
    expect(app.estado.slideIndex()).toBe(2);
  });
});
