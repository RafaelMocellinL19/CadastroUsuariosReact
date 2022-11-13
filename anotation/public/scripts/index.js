const lista = document.querySelector('.lista-pessoas');
const lista__body = document.querySelector('.lista-pessoas__body');

const botoesCancelar = document.querySelectorAll('.botoes-cancelar');

const modalRemoverPessoa = document.querySelector('.modal-removerPessoa');
const btnRemoverPessoa = document.querySelector('.modal-removerPessoa__btn-remover');
const modalEditPessoa = document.querySelector('.modal-editPessoa');
const btnEditPessoa = document.querySelector('.form-editPessoa__btn-edit')
const modalAddPessoa = document.querySelector('.modal-addPessoa');
const btnAddPessoa = document.querySelector('.btn-addPessoa');
const btnCadastrar = document.querySelector('.form-addPessoa__btn-add');

// INPUT's
const inputAddNome = document.getElementById('form-addPessoa__input-nome');
const inputAddEmail = document.getElementById('form-addPessoa__input-email');
const inputAddData = document.getElementById('form-addPessoa__input-data');
const inputEditNome = document.getElementById('form-editPessoa__input-nome');
const inputEditEmail = document.getElementById('form-editPessoa__input-email');
const inputEditData = document.getElementById('form-editPessoa__input-data');

// EVENTOS
btnAddPessoa.addEventListener('click', () => abrirModal(modalAddPessoa));
btnCadastrar.addEventListener('click', () => validarDados('cadastrar', inputAddNome, inputAddEmail, inputAddData));
btnEditPessoa.addEventListener('click', () => validarDados('editar', inputEditNome, inputEditEmail, inputEditData));
btnRemoverPessoa.addEventListener('click', () => removerPessoa());
botoesCancelar.forEach(botao => {
    botao.addEventListener('click', fecharModais);
});

let pessoaSelecionada
let pessoaSelecionada_index

let emailValido;
let dataValida;

function abrirModal(modal){
    modal.style.display = 'block';
    modal.classList.add('fade-in');
    modal.classList.remove('fade-out');
}

function fecharModais(){
    setTimeout(() => {
        modalAddPessoa.style.display = 'none';
        modalEditPessoa.style.display = 'none';
        modalRemoverPessoa.style.display = 'none';

        let inputs = [inputAddNome, inputAddEmail, inputAddData, inputEditNome, inputEditData, inputEditEmail];
        inputs.forEach(input => {
        input.value = '';
        ocultarMsgErro(input);
    })
    }, 500);

    modalAddPessoa.classList.remove('fade-in');
    modalAddPessoa.classList.add('fade-out');
    modalEditPessoa.classList.remove('fade-in');
    modalEditPessoa.classList.add('fade-out');
    modalRemoverPessoa.classList.remove('fade-in');
    modalRemoverPessoa.classList.add('fade-out');
}

class Pessoa {
    constructor(nome, email, data){
        this.nome = nome;
        this.email = email;
        this.data = data;
    }
}

let listaPessoas;
function lerListaPessoas(){
    listaPessoas = JSON.parse(localStorage.getItem('listaPessoas') || '[]');
    
    const listaVazia = document.querySelector('.lista-pessoas-vazia');
    // eslint-disable-next-line eqeqeq
    if(listaPessoas.length == 0){
        lista.style.display = 'none';
        listaVazia.style.display = 'block';
    } else {
        lista.style.display = 'table';
        listaVazia.style.display = 'none';
    }
}

function validarDados(acao, inputNome, inputEmail, inputData){

    lerListaPessoas();

    let funcao = acao;
    let nomeValido = false;
    emailValido = false;
    dataValida = false;
    inputNome.value.length < 3 ? msgErro(inputNome, 'O nome deve possuir no mínimo 3 caracteres!') : nomeValido = true;
    
    // eslint-disable-next-line eqeqeq
    funcao == 'cadastrar' ? validarEmail_add() : validarEmail_edit();

    // eslint-disable-next-line eqeqeq
    inputData.value == '' ? msgErro(inputData, 'Insira uma data válida!') : validarData(inputData);

    // eslint-disable-next-line no-unused-expressions
    !nomeValido ? null :
        !emailValido ? null :
            !dataValida ? null :
                // eslint-disable-next-line eqeqeq
                funcao == 'cadastrar' ? cadastrar() : editarPessoa();      
}

function validarEmail_add(){

    // eslint-disable-next-line eqeqeq
    if(inputAddEmail.value == ''){
        msgErro(inputAddEmail, 'Preencha esse campo!');
    } 
    else if (inputAddEmail.checkValidity()){

        let emailCadastrado = false;
        listaPessoas.forEach(pessoa => {
            // eslint-disable-next-line eqeqeq
            if(inputAddEmail.value == pessoa.email){
                msgErro(inputAddEmail, 'Email já cadastrado!');
                emailCadastrado = true;
            }
        })
        // eslint-disable-next-line no-unused-expressions
        emailCadastrado ? null : emailValido = true;
    } 
    else {
        msgErro(inputAddEmail, 'Email inválido!');
    }
}

function validarEmail_edit(){

    // eslint-disable-next-line eqeqeq
    if(listaPessoas[pessoaSelecionada_index].email == inputEditEmail.value){
        emailValido = true;
    } else {
        // eslint-disable-next-line eqeqeq
        if(inputEditEmail.value == ''){
            msgErro(inputEditEmail, 'Preencha esse campo!');
        } 
        else if (inputEditEmail.checkValidity()){

            let emailCadastrado = false;
            listaPessoas.forEach(pessoa => {
                // eslint-disable-next-line eqeqeq
                if(inputEditEmail.value == pessoa.email){
                    msgErro(inputEditEmail, 'Email já cadastrado!');
                    emailCadastrado = true;
                }
            })
            // eslint-disable-next-line no-unused-expressions
            emailCadastrado ? null : emailValido = true;
        }
        else {
            msgErro(inputEditEmail, 'Email inválido!');
        }
        
    }
}

function validarData(input){

    let data = new Date();
    let diaAtual = data.getDate();
    let mesAtual = data.getMonth();
    let anoAtual = data.getFullYear( );

    let dataNascimento = new Date(`${input.value} 13:00:00`);

    if (dataNascimento <= data) {
        
        dataValida = true;
    }    
    // eslint-disable-next-line eqeqeq
    else if(dataNascimento.getFullYear() == anoAtual && dataNascimento.getMonth() == mesAtual && dataNascimento.getDate() == diaAtual){
        dataValida = true;
    }
    else {
        msgErro(input, 'Insira uma data válida!');
    }
}




function msgErro(input, msg){

    let content = input.parentElement;
    const msgErro_span = content.querySelector('.form__msg-erro');

    msgErro_span.innerHTML = msg;
    
    msgErro_span.style.visibility = 'visible';
    msgErro_span.className = 'form__msg-erro shake-horizontal';
}

function ocultarMsgErro(input){

    let content = input.parentElement;
    const msgErro_span = content.querySelector('.form__msg-erro');

    msgErro_span.style.visibility = 'hidden';
    msgErro_span.className = 'form__msg-erro';
}

function cadastrar(){
    
    lerListaPessoas();

    let novaPessoa = new Pessoa (inputAddNome.value, inputAddEmail.value, inputAddData.value);
    listaPessoas.push(novaPessoa);
    localStorage.setItem('listaPessoas', JSON.stringify(listaPessoas));

    adicionar_Lista(inputAddNome.value, inputAddEmail.value, inputAddData.value);

    lerListaPessoas();

    fecharModais();
}

function adicionar_Lista(nome, email, data){

    const lista__linha = document.createElement('tr');
    const lista__nomePessoa = document.createElement('td');
    const lista__emailPessoa = document.createElement('td');
    const lista__dataPessoa = document.createElement('td');
    const lista__acoes = document.createElement('td');

    lista__nomePessoa.setAttribute('data-titulo', 'Nome:');
    lista__emailPessoa.setAttribute('data-titulo', 'Email:');
    lista__dataPessoa.setAttribute('data-titulo', 'Data de nascimento:');

    lista__linha.appendChild(lista__nomePessoa);
    lista__linha.appendChild(lista__emailPessoa);
    lista__linha.appendChild(lista__dataPessoa);
    lista__linha.appendChild(lista__acoes);

    lista__acoes.className = 'lista-pessoas__content-btn';

    lista__body.appendChild(lista__linha);

    lista__nomePessoa.innerHTML = nome;
    lista__emailPessoa.innerHTML = email;
    let dataFormatada = new Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(`${data} 13:00:00`));
    lista__dataPessoa.innerHTML = dataFormatada;

    const btnEditar = document.createElement('button');
    btnEditar.className = "lista-pessoas__btn-editPessoa"
    btnEditar.addEventListener('click', () => {
        abrirModal(modalEditPessoa);
        capturarDados();
    });

    const btnRemover = document.createElement('button');
    btnRemover.className = "lista-pessoas__btn-removerPessoa"
    btnRemover.addEventListener('click', () => {
        capturarDados();
        msgRemoverPessoa();
        abrirModal(modalRemoverPessoa);
    });

    lista__acoes.appendChild(btnEditar);
    lista__acoes.appendChild(btnRemover);
}

function capturarDados(){

    // eslint-disable-next-line no-restricted-globals
    pessoaSelecionada = event.target.parentElement.parentElement;
    let pessoaSelecionada_email = pessoaSelecionada.children[1].textContent;
    
    lerListaPessoas();
    listaPessoas.forEach((pessoa, index) => {
        // eslint-disable-next-line eqeqeq
        if (pessoaSelecionada_email == pessoa.email){
            pessoaSelecionada_index = index;

            inputEditNome.value = pessoa.nome;
            inputEditEmail.value = pessoa.email;
            inputEditData.value = pessoa.data;
        }
    });
}

function editarPessoa(){
    
    let pessoaEditada = {
        nome: inputEditNome.value,
        email: inputEditEmail.value,
        data: inputEditData.value
    }

    listaPessoas[pessoaSelecionada_index] = pessoaEditada;
    localStorage.setItem('listaPessoas', JSON.stringify(listaPessoas));

    pessoaSelecionada.children[0].innerHTML = pessoaEditada.nome;
    pessoaSelecionada.children[1].innerHTML = pessoaEditada.email;

    let dataFormatada = new Intl.DateTimeFormat('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(`${pessoaEditada.data} 13:00:00`));
    pessoaSelecionada.children[2].innerHTML = dataFormatada;

    fecharModais();
}

function msgRemoverPessoa(){
    let mensagem = document.querySelector('.modal-removerPessoa__mensagem');
    mensagem.innerHTML = `Deseja mesmo remover ${listaPessoas[pessoaSelecionada_index].nome}?`;
}

function removerPessoa(){

    listaPessoas.splice(pessoaSelecionada_index, 1);
    localStorage.setItem('listaPessoas', JSON.stringify(listaPessoas));

    pessoaSelecionada.remove();
    lerListaPessoas();
    fecharModais();

}

function carregarCadastros(){

    lerListaPessoas();
    listaPessoas.forEach(pessoa => {
        adicionar_Lista(pessoa.nome, pessoa.email, pessoa.data);
    })
}

carregarCadastros();