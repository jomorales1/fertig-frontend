<template>
    <div>
        <b-jumbotron text-variant="black" bg-variant="white" class="text-left" >
            <div class="row">
                <div class="col-md-4" style="margin: 5%">
                    <header style="font-size: 300%">{{titulo}}</header>
                    <b-container class="row" style="height: 10%"></b-container>
                    <p style="font-size: 150%">{{subtitulo}}</p>
                </div>
                <b-container class="col-md-6 justify-content-center img-fluid"  style="height: auto; max-width: 100%;">
                    <b-img :src="imagen"  center></b-img>
                </b-container>
            </div>
        </b-jumbotron>
    </div>
</template>

<script>
    export default {
        name: "Jumbotron",
        props:['texto', 'titulo', 'subtitulo','imagen']
    }

</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap');
    header{
        font-family: 'Lato',sans-serif;
        font-weight: 900;

    }
    p{
        font-family: 'Lato', sans-serif;
    }

</style>