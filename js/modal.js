const alteraModal = () =>{
    const modal = document.querySelector('#modal')
    const estiloAtual = modal.style.display
    if(estiloAtual == 'block'){
        modal.style.display='none'
    } else {
        modal.style.display = 'block'
    }
}

const btn = document.querySelector('.modalBtn')
btn.addEventListener('click', switchModal)

window.onclick = function(event) {
    const modal = document.querySelector('.modal')
  if (event.target == modal) {
    switchModal()
  }
}