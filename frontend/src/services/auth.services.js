// Importanto biblioteca responsável por requisições HTTP
import axios from 'axios';

// Definindo a base do url para os endpoints
// const apiUrl = "https://kosmic-forum-api.herokuapp.com";

// Definindo o bjeto do serviço
const authService = {

    // Definindo a função de login
    async authenticate(data) {
        const endpoint = `/api/login`
        return axios.post(endpoint, data);
    },

    // Função para salar o usuário logado no local storage
    setLoggedUser(data){
        let parsedData = JSON.stringify(data)
        localStorage.setItem("user", parsedData)
    },

    // Função responsável por recuperar o usuário logado do local storage
    getLoggedUser(){
        let data = localStorage.getItem("user");
        if(!data) return null;
        try {
            let parsedData = JSON.parse(data)
            return parsedData
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default authService;
