<template>
    <div >
        <b-jumbotron text-variant="black" bg-variant="white" class="text-left">
            <div class="row">
                <b-container class="col-md-3 justify-content-center" style="height: 100%; max-width: 100%;">
                    <b-img :src="imagen" center></b-img>
                </b-container>
                <!--<b-container class="col-md-1"></b-container>-->
                <div class="col-md-7" >
                    <header style="font-size: 300%">{{titulo}}</header>
                    <b-container class="row" style="height: 10%"></b-container>
                    <p style="font-size: 150%">{{subtitulo}}</p>
                    <br>
                    <br>
                    <br>
                    <br>
                    <!--<b-container class="row" style="height: 40%"></b-container-->
                    <b-button style="flex-direction: column;" variant="primary" @click="register">Crear cuenta</b-button>
                </div>
            </div>
        </b-jumbotron>
    </div>
</template>

<script>
    import router from "../router";
    export default {
        name: "InvertJumbotron",
        props:['texto', 'titulo', 'subtitulo','imagen'],
        methods:{
            register(){
                router.push("/SignUp")
            }
        }
    }

</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;900&display=swap');
    header{
        font-family: 'Lato',sans-serif;
        font-weight: 900;
    }
    p{
        font-family: 'Lato', sans-serif;
    }
    button{
        font-family: 'Lato', sans-serif;
    }
</style>