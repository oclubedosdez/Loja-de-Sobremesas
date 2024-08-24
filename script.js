


// Função para carregar o JSON e exibir os dados
async function loadDesserts() {
  try {
    const response = await fetch('dados.json');
    const data = await response.json();

    // Seleciona o container onde os dados serão exibidos
    const container = document.getElementById('menu-sobremesas');

    // Itera sobre o array de sobremesas
    data.forEach(dessert => {
      let sobremesa = `
           <div class="sobremesa" data-nome="${dessert.name}" data-img="${dessert.image.thumbnail}">
        <img class="imagen-sobremesa" src="${dessert.image.desktop}" alt="">
        <!--Botão adicionar sobremesa-->
        <button class="adicionar_sobremesa">
          <img src="./assets/images/icon-add-to-cart.svg" alt="">
          <h2>Add to Cart</h2>
        </button>
        <!--Adicionar mais da sobremesa escolhida-->
        <button class="adicionar_sobremesa_ativo">
          <div class="decrementar_sobremesa">
            <svg xmlns="http://www.w3.org/2000/svg" class="meu-svg" width="10" height="2" fill="none"
              viewBox="0 0 10 2">
              <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
            </svg>
          </div>

          <p class="cont_sobremesa">1</p>

          <div class="incrementar_sobremesa">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
              <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
            </svg>
          </div>
        </button>

        <article class="info">
          <h1>${dessert.category}</h1>
          <h2>${dessert.name}</h2>
          <p class="custo_sobremessa" valor-sobremesa="${dessert.price}">R$${dessert.price.toFixed(2)}</p>
        </article>
      </div>
          `
      container.innerHTML += sobremesa;
    });

  } catch (error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }


  let carrinho = [];

  let sobremesas = document.querySelectorAll(".sobremesa");
  let CarrinhoDeCompra = document.getElementById("container_compras");
  let QuantidadeDeItensNoCarrinho = document.querySelector("#menu_compra_carrinho .titulo_carrinho #num");
  let ValorTotalDaCompra = document.querySelector("#valor");

  let menu_compra = document.querySelector("#menu_compra");
  let menu_compra_carrinho = document.querySelector("#menu_compra_carrinho");

  let BtnConfimarCompra = document.querySelector('#confirmar_compra');
  let TelaDeConfirmacao = document.querySelector("#overlay");
  let ComecarNovaCompra = document.querySelector("#comecar_compra");

  sobremesas.forEach((sobremesa) => {
    let btn_add_sobremesa = sobremesa.querySelector(".adicionar_sobremesa");
    let btn_add_sobremesa_ativo = sobremesa.querySelector(".adicionar_sobremesa_ativo");
    let BtnDecrementarSobremesa = sobremesa.querySelector(".decrementar_sobremesa");
    let BtnIncrementarSobremesa = sobremesa.querySelector(".incrementar_sobremesa");
    let QuantidadeDaSobremesa = sobremesa.querySelector(".cont_sobremesa");




    let AumentarSobremesa = 1;

    // BOTÃO ADICIONAR SOBREMESA AO CARRINHO
    btn_add_sobremesa.onclick = function () {
      menu_compra.style.display = 'none';
      menu_compra_carrinho.style.display = 'flex';





      AumentarSobremesa = 1; // Resetar para 1 ao adicionar a sobremesa novamente
      QuantidadeDaSobremesa.innerHTML = AumentarSobremesa; // Resetar a contagem visualmente

      btn_add_sobremesa.style.display = "none";
      btn_add_sobremesa_ativo.style.display = "flex";

      var ItemSobremesa = sobremesa.querySelector(".info h2").innerText;
      let Categoria = sobremesa.querySelector(".info h1").innerText;
      let thumbnail = sobremesa.getAttribute('data-img');

      let ValorDaSobremesa = Number(sobremesa.querySelector(".info p").getAttribute("valor-sobremesa"));

      // Verifique se a sobremesa já está no array
      let itemExistente = carrinho.find((item) => item.nome === ItemSobremesa);

      if (itemExistente) {
        itemExistente.quantidade++;
      } else {
        carrinho.push({
          nome: ItemSobremesa,
          categoria: Categoria,
          quantidade: AumentarSobremesa,
          ImgThumbnail: thumbnail,
          valor: ValorDaSobremesa.toFixed(2),
        });
        AtualizarCarrinho();
      }

      // Atualizar Quantidade De Sobremesas no Carrinho
      let total = somarQuantidadesDoCarrinho();
      QuantidadeDeItensNoCarrinho.innerHTML = `(${total})`;
      AtualizarValorTotal();

    };




    // BOTÃO AUMENTAR QUANTIDADE DA SOBREMESA
    BtnIncrementarSobremesa.onclick = function () {
      AumentarSobremesa++;
      QuantidadeDaSobremesa.innerHTML = AumentarSobremesa;

      var ItemSobremesa = sobremesa.querySelector(".info h2").innerText;

      // Atualiza a quantidade da sobremesa no array do carrinho
      let itemExistente = carrinho.find((item) => item.nome === ItemSobremesa);
      if (itemExistente) {
        itemExistente.quantidade = AumentarSobremesa;
      }

      AtualizarCarrinho();
      AtualizarValorTotal();
      let total = somarQuantidadesDoCarrinho();
      QuantidadeDeItensNoCarrinho.innerHTML = `(${total})`;
    };

    // BOTÃO DIMINUIR QUANTIDADE DA SOBREMESA
    BtnDecrementarSobremesa.onclick = function () {
      AumentarSobremesa--;
      if (AumentarSobremesa < 1) {
        AumentarSobremesa = 0; // Permitir que chegue a zero
        btn_add_sobremesa_ativo.style.display = "none";
        btn_add_sobremesa.style.display = "flex";

        // Remover do carrinho
        var ItemSobremesa = sobremesa.querySelector(".info h2").innerText;
        carrinho = carrinho.filter((item) => item.nome !== ItemSobremesa);

        QuantidadeDaSobremesa.innerHTML = AumentarSobremesa; // Mostrar zero
        AtualizarCarrinho();
        AtualizarValorTotal();
        let total = somarQuantidadesDoCarrinho();
        QuantidadeDeItensNoCarrinho.innerHTML = `(${total})`;
        return;
      }
      QuantidadeDaSobremesa.innerHTML = AumentarSobremesa;

      var ItemSobremesa = sobremesa.querySelector(".info h2").innerText;

      let itemExistente = carrinho.find((item) => item.nome === ItemSobremesa);
      if (itemExistente) {
        itemExistente.quantidade = AumentarSobremesa;
      }

      AtualizarCarrinho();
      AtualizarValorTotal();
      let total = somarQuantidadesDoCarrinho();
      QuantidadeDeItensNoCarrinho.innerHTML = `(${total})`;
    };

    // FUNÇÃO ATUALIZAR QUANTIDADE DE SOBREMESAS NO CARRINHO
    function somarQuantidadesDoCarrinho() {
      let totalQuantidades = 0;

      carrinho.forEach((item) => {
        totalQuantidades += item.quantidade;

      });

      if (Number(totalQuantidades) == 0) {
        menu_compra_carrinho.style.display = 'none';
        menu_compra.style.display = 'flex';
      }
      return totalQuantidades;
    }

    // FUNÇÃO ATUALIZAR O CARRINHO
    function AtualizarCarrinho() {
      CarrinhoDeCompra.innerHTML = "";

      carrinho.forEach((MenuCarrinho) => {
        let SobremesaAdicionada = `
          <section class="compra_adicionada" categoria="">
            <div class="info_compra">
              <h2>${MenuCarrinho.nome}</h2>
              <p><span class="quantidade_da_sobremesa">${MenuCarrinho.quantidade}x</span> <span class="valor_da_sobremesa">@ R$${MenuCarrinho.valor}</span> <span class="valor_total">R$${Number(MenuCarrinho.quantidade * MenuCarrinho.valor).toFixed(2)}</span></p>
            </div>
            <button class="img_remover_sobremesa">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 10 10">
                <path fill="#87635a" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
              </svg>
            </button>
          </section>
        `;
        CarrinhoDeCompra.innerHTML += SobremesaAdicionada;
      });

      // REMOVER SOBREMESA DO CARRINHO
      let btn_remover_sobremesa = document.querySelectorAll('.img_remover_sobremesa');

      btn_remover_sobremesa.forEach((RemoverSobremesa) => {
        RemoverSobremesa.onclick = function () {
          // Encontrar o nome da sobremesa a ser removida
          let nomeSobremesa = this.parentNode.querySelector('.info_compra h2').innerText;

          // Remover o item do carrinho pelo nome
          carrinho = carrinho.filter((item) => item.nome !== nomeSobremesa);

          AtualizarCarrinho(); // Atualizar o carrinho após a remoção
          AtualizarValorTotal(); // Atualizar o valor total após a remoção

          let total = somarQuantidadesDoCarrinho(); // Atualizar o número de itens no carrinho
          QuantidadeDeItensNoCarrinho.innerHTML = `(${total})`;



          // ATUALIZAR BOTÕES DE AUMENTAR E DIMINUIR SOBREMESA
          const sobremesaDiv = document.querySelector(`.sobremesa[data-nome='${nomeSobremesa}']`);

          if (sobremesaDiv) {
            const btnAtivo = sobremesaDiv.querySelector('.adicionar_sobremesa_ativo');
            const btnAdiciona = sobremesaDiv.querySelector('.adicionar_sobremesa');

            btnAtivo.style.display = 'none';
            btnAdiciona.style.display = 'flex';

            AumentarSobremesa = 1; // Resetar a quantidade para 1 após a remoção
            const quantidadeSobremesa = sobremesaDiv.querySelector('.cont_sobremesa');
            quantidadeSobremesa.innerHTML = AumentarSobremesa; // Atualizar visualmente para 1
          }
        };
      });
    }


    let ContainerSobremesasCompradas = document.querySelector('#Sobremesas_Comprada');


    // FUNÇÃO ATUALIZAR O VALOR TOTAL DA COMPRA
    function AtualizarValorTotal() {
      let total = 0;

      carrinho.forEach((item) => {
        total += item.quantidade * item.valor;
      });

      ValorTotalDaCompra.innerHTML = `R$${total.toFixed(2)}`;
    }


    //BOTÃO DE CONFIMARÇÃO DE COMPRA
    BtnConfimarCompra.onclick = function () {
      TelaDeConfirmacao.style.display = 'flex';


      carrinho.forEach(ConfirmaCompra => {
        let sobremesa = `
        <div class="sobremesa_confirmada">
          
          <section class="valor_e_quantiade">
            <img src="${ConfirmaCompra.ImgThumbnail}" alt="">
            <div class="titulos_sobremesa_confimada">
              <h3>${ConfirmaCompra.nome}</h3>
              <p>
                <span class="sobremesa_confimada_quantidade">${ConfirmaCompra.quantidade}x</span>
                <span class="sobremesa_confimada_valor">@ R$${ConfirmaCompra.valor}</span>
              </p>
            </div>
          </section>
          <p class="sobremesa_confimada_total">R$${Number(ConfirmaCompra.quantidade * ConfirmaCompra.valor).toFixed(2)}</p>
        </div>
        `;
        ContainerSobremesasCompradas.innerHTML += sobremesa;
      });
    }

    ComecarNovaCompra.onclick = function () {
      ContainerSobremesasCompradas.innerHTML = '';
      TelaDeConfirmacao.style.display = 'none';
      CarrinhoDeCompra.innerHTML = '';
      QuantidadeDeItensNoCarrinho.innerHTML = `(${0})`;

      const btnAtivo = document.querySelectorAll('.adicionar_sobremesa_ativo');
      const btnAdiciona = document.querySelectorAll('.adicionar_sobremesa');

      btnAtivo.forEach(BotaoAtivo => BotaoAtivo.style.display = 'none');
      btnAdiciona.forEach(BotaoAdicionar => BotaoAdicionar.style.display = 'flex');

      ValorTotalDaCompra.innerHTML = `R$${0}`;
      menu_compra_carrinho.style.display = 'none';
      menu_compra.style.display = 'flex';

      carrinho = [];
    }

  });




}

// Chama a função para carregar os dados quando a página for carregada
window.onload = loadDesserts;


