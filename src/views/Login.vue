<script>
    import AuthService from "../services/AuthService";
    
    export default {
        data () {
            return {
                email: "",
                mensagem: ""
            };
        },
        methods: {
            login () {
                this.mensagem = AuthService.login(this.email);

            }
        }
    }
</script>
<template>
    <div>
        <h1>Sistema de Frequência</h1>

        <input type="email" placeholder="E-mail" v-model="email">

        <button @click="login">Entrar</button>
        {{ mensagem }}
    </div>
</template>