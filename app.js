const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item Adicionado",
    alertaAtivo: false,
  },
  filters: {
    formatPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },

  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((r) => {
          this.produtos = r;
        });
    },
    fetchDados(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => {
          this.produto = r;
        });
    },
    abrirModal(id) {
      this.fetchDados(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) {
        this.produto = false;
      }
    },

    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) {
        this.carrinhoAtivo = false;
      }
    },

    adicionarCarrinho() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alerta(`${nome} foi adicionado ao carrinho`);
    },

    removerItem(index) {
      this.carrinho.splice(index, 1);
    },

    checarLocalStorage() {
      if (window.localStorage) {
        this.carrinho = JSON.parse(window.localStorage.carrinho); //volta ao estado inicial do objeto
      }
    },

    compararEstoque(){
      const itens = this.carrinho.filter(({id}) => id === this.produto.id);
      this.produto.estoque -= itens.length;
    },

    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1000);
    },
  },

  watch: {
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || " ";
      history.pushState(null, null, `#${hash}`);
      if(this.produto){
        this.compararEstoque();
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho); //transforma o objeto em string
    },
  },

  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
  },
});
