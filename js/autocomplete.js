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
        exibirModal(selectedDrink); // Substitua exibirModal pela sua função
    }
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
    console.log("Detalhes do Drink selecionado:", selectedDrink);
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

