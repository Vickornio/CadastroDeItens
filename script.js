function initLogin() {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !email.includes("@")) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (!senha || senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    localStorage.setItem("usuarioEmail", email);
    window.location.href = "cadastro.html";
  });
}

class Produto {
  constructor(nome, descricao, categoria) {
    this.id = Date.now();
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
  }
}

const salvarItens = (itens) => {
  localStorage.setItem("itensPapelaria", JSON.stringify(itens));
};

const carregarItens = () => {
  const dados = localStorage.getItem("itensPapelaria");
  return dados ? JSON.parse(dados) : [];
};

function initCadastro() {
  const form = document.getElementById("form-cadastro");
  const itens = carregarItens();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const descricao = form.descricao.value.trim();
    const categoria = form.categoria.value;

    if (!nome) {
      alert("Por favor, informe o nome do item.");
      return;
    }
    if (!categoria) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    const produto = new Produto(nome, descricao, categoria);
    itens.push(produto);
    salvarItens(itens);

    form.reset();
    alert(`Item "${nome}" cadastrado com sucesso!`);
  });
}

function initLista() {
  const listaElement = document.getElementById("lista-itens");
  const btnBuscar = document.getElementById("btn-buscar");
  const buscaNome = document.getElementById("busca-nome");
  const buscaCategoria = document.getElementById("busca-categoria");

  let itens = carregarItens();

  const renderLista = (arr) => {
    listaElement.innerHTML = "";

    if (arr.length === 0) {
      listaElement.innerHTML = `<li><em>Nenhum item encontrado.</em></li>`;
      return;
    }

    arr.forEach((item) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="item-info">
          <strong>${item.nome}</strong> <br/>
          <small>${item.descricao || "-"}</small><br/>
          <small><em>Categoria: ${item.categoria}</em></small>
        </div>
        <button class="btn-remover" data-id="${item.id}">Remover</button>
      `;

      listaElement.appendChild(li);
    });

    const botoesRemover = document.querySelectorAll(".btn-remover");
    botoesRemover.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.getAttribute("data-id"));
        removerItem(id);
      });
    });
  };

  const removerItem = (id) => {
  const item = itens.find(i => i.id === id);

  if (!item) {
    alert("Item não encontrado ou já removido.");
    return;
  }

  if (confirm(`Deseja remover o item "${item.nome}"?`)) {
    itens = itens.filter((i) => i.id !== id);
    salvarItens(itens);
    renderLista(itens);
  }
};


  const filtrarItens = () => {
    const nomeFiltro = buscaNome.value.trim().toLowerCase();
    const categoriaFiltro = buscaCategoria.value;

    const filtrados = itens.filter((item) => {
      const nomeMatch = item.nome.toLowerCase().includes(nomeFiltro);
      const categoriaMatch = categoriaFiltro ? item.categoria === categoriaFiltro : true;
      return nomeMatch && categoriaMatch;
    });

    renderLista(filtrados);
  };

  renderLista(itens);

  btnBuscar.addEventListener("click", filtrarItens);
  buscaNome.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filtrarItens();
  });
}
