// Inicializando o Autocomplete com uma fonte vazia
$('#buscarDrink').autocomplete({
    source: [],
    minLength: 0,
    autoFocus: true,
    open: () => {
        $('#buscarDrink').css("border-radius", "18px 18px 0 0");
    },
    close: () => {
        $('#buscarDrink').css("border-radius", "18px");
    },
    // Adicionando o evento select
    select: function (event, ui) {
        // Obtendo as informações completas do drink selecionado
        const selectedDrink = ui.item.drinkDetails;
        exibirModal(selectedDrink); 
    }
});

$(document).ready( () => {
    obterListaDrinks()
});

let queue = null;

// Adicionando um evento de input ao campo de busca
$('#buscarDrink').on('input', () => {
    clearTimeout(queue);

    // Definindo um intervalo de espera antes de acionar a busca
    queue = setTimeout(() => {
        buscar();
    }, 800);
});

// Função para buscar
async function buscar() {
    const bebida = document.getElementById("buscarDrink").value; 

    // Removendo a fonte atual para evitar duplicatas
    $('#buscarDrink').autocomplete("option", "source", []);

    // Exibindo a mensagem de loading
    $('#loading').css("color", "var(--branco-primario)");

    try {
        const requisicao = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${bebida}`);
        const resposta = await requisicao.json();

        if (!!resposta.drinks) {
            const source = resposta.drinks.map((drink) => ({
                label: drink.strDrink,
                value: drink.strDrink,
                drinkDetails: drink // Armazenando as informações completas do drink
            }));

            // Atualizando a fonte do Autocomplete
            $('#buscarDrink').autocomplete("option", "source", source);
            $('#buscarDrink').autocomplete("search", ""); // Forçando a exibição do dropdown
        }
    } catch (error) {
        console.error('Erro na solicitação Ajax:', error);
    } finally {
        // Ocultando a mensagem de loading
        $('#loading').css("color", "transparent");
    }
}

// Função para exibir o modal
function exibirModal(selectedDrink) {
    let ingredients = []
    let ingredientsHtml = ""
    for( let i = 1; i<=15; i++){
        if(selectedDrink[`strIngredient${i}`] != null){
            ingredients.push(selectedDrink[`strIngredient${i}`])
        }
    }
    ingredients.forEach((ingredient) => {
        ingredientsHtml += `<li class="ingrediente">${ingredient}</li>`
    })
    $("#modal_conteudo")
        .html(
            `<h2 id="modal_nome-drink">${selectedDrink.strDrink}</h2>
            <hr>
            <div id="modal_info-drink">
            <img id="modal_indo-drink-foto" src=${selectedDrink.strDrinkThumb} alt="drink">
            <div id="modal_info-drink-preparo">
                <p style="margin-bottom: 5px">Ingredients:<p>
                ${ingredientsHtml}
                <p id="modal_info-drink-preparo-instrucao">${selectedDrink.strInstructions}</p>
            </div>
            </div>
            `
        )

    $('#modal').modal('show')
}


async function obterListaDrinks (){
    const letrasDoAlfabeto = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Função para obter coquetéis para uma letra específica
    async function obterCoqueteisPorLetra(letra,array) {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letra}`;

        // Exibindo a mensagem de loading
        $('#btn-carta_drinks').css({
            "display":"flex",
            "align-items": "center",
            "justify-content": "center",
            "gap": "15px"
        })
        $('#loadingBtn').css({"color": "var(--azul-primario)","display":"block"});

        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.drinks) {
                data.drinks.forEach((drink) => {
                    array.push(drink)
                })

            } else {
                console.log(`Nenhum coquetel encontrado para a letra ${letra}.`);
            }
        } catch (error) {
            console.error('Erro na solicitação Ajax:', error);
        } finally {
            // Ocultando a mensagem de loading
            $('#loadingBtn').css({"color": "transparent", "display" : "none"});
        }
    }
    
    
    var drinksDisponiveis = []
    // Iterar sobre as letras do alfabeto e fazer solicitações para cada uma pois nao achei endpoint para todos os drink na API
    for (const letra of letrasDoAlfabeto) {
        await obterCoqueteisPorLetra(letra, drinksDisponiveis);
    }
    $('#btn-carta_drinks').prop("disabled", false)
    $('#btn-carta_drinks').on("click", () => {
        exibirModalLista(drinksDisponiveis)
    })
}

function exibirModalLista(drinksDisponiveis){
    let listaDrinks = ""

    drinksDisponiveis.forEach((drink) => {
        listaDrinks += `<li id="${drink.idDrink}" class="modal-lista-item">${drink.strDrink}</li>`
    })
    $('#modal-lista-drinks').html(listaDrinks)
    $('#modal-lista').modal('show')
    $('.modal-lista-item').on("click", (e) => {
        const id = e.target.id
        const indiceObjeto = drinksDisponiveis.findIndex( (objeto) =>{
            return objeto.idDrink === id
        });
        const selectedDrink = drinksDisponiveis[indiceObjeto]
        exibirModal(selectedDrink)
    })
}

