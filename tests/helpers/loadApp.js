const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const SRC = path.join(__dirname, "..", "..", "src");
const html = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
const appCode = fs.readFileSync(path.join(SRC, "app.js"), "utf8");

function loadApp() {
  const intervalos = [];

  const htmlSemScript = html.replace(/<script\s+src="app\.js"><\/script>/, "");

  const dom = new JSDOM(htmlSemScript, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.alert = jest.fn();

      Object.defineProperty(window.HTMLElement.prototype, "innerText", {
        configurable: true,
        get() {
          return this.textContent;
        },
        set(valor) {
          this.textContent = valor;
        },
      });
  
      window.setInterval = (fn, ms) => {
        const id = global.setInterval(fn, ms);
        intervalos.push(id);
        return id;
      };
      window.clearInterval = (id) => global.clearInterval(id);
    },
  });

  const { window } = dom;
  const { document } = window;

  
  const script = document.createElement("script");
  script.textContent = appCode;
  document.body.appendChild(script);

  const $ = (id) => document.getElementById(id);

  return {
    window,
    document,
    $,
    alert: window.alert,


    close() {
      intervalos.forEach((id) => global.clearInterval(id));
      window.close();
    },


    estado: {
      clientes: () => window.eval("clientes"),
      pets: () => window.eval("pets"),
      produtos: () => window.eval("produtos"),
      carrinho: () => window.eval("carrinho"),
      slideIndex: () => window.eval("slideIndex"),
    },

    // ---- atalhos para preencher formulários e clicar nos botões ----
    preencherCliente({ nome = "", email = "", vip = false } = {}) {
      $("clienteNome").value = nome;
      $("clienteEmail").value = email;
      $("clienteVip").checked = vip;
    },
    preencherPet({ nome = "", tipo = "", idade = "" } = {}) {
      $("petNome").value = nome;
      $("petTipo").value = tipo;
      $("petIdade").value = idade;
    },
    preencherProduto({ nome = "", preco = "" } = {}) {
      $("produtoNome").value = nome;
      $("produtoPreco").value = preco;
    },
    clicar(textoDoBotao) {
      const botao = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.trim() === textoDoBotao
      );
      if (!botao) throw new Error(`Botão "${textoDoBotao}" não encontrado`);
      botao.click();
    },

    // ---- ações de alto nível ----
    cadastrarCliente(dados) {
      this.preencherCliente(dados);
      window.criarCliente();
    },
    cadastrarPet(dados) {
      this.preencherPet(dados);
      window.cadastrarPet();
    },
    criarProduto(dados) {
      this.preencherProduto(dados);
      window.criarProduto();
    },
   
    criarEAdicionar(nome, preco) {
      this.criarProduto({ nome, preco: String(preco) });
      const select = $("produtoSelect");
      select.value = String(select.options.length - 1);
      window.adicionarCarrinho();
    },
  };
}

module.exports = { loadApp };
