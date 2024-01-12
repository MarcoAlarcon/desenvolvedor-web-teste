function drinkTemplate(drink){
    if (drink.nome && drink.imagem){
        let div = $('<div class="drink"></div>')
        let img = $(`<img src="${drink.imagem}" width="32" height="32"/>`)
        let h2 = $(`<h2>${drink.nome}</h2>`)
        
        div.append(img)
        div.append(h2)
        
        return div
    }
    return false
}

$('#buscarDrink').select2({
    ajax: {
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php`,
        dataType: 'json',
        data: function (req) {
        var query = {
            s: req.term,
        }
        return query;
        },
        processResults: function (data) {
        let resposta = []
        data.drinks.forEach((drink) => {
            resposta.push({
                id: drink.idDrink,
                imagem: drink.strDrinkThumb,
                nome: drink.strDrink
            })
        })
        return {
            results: resposta
        };
        }
    },
    templateResult: drinkTemplate,
    });
