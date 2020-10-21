<template>
    <div>
        <b-jumbotron text-variant="black" bg-variant="white" class="text-left" >
            <div class="d-flex flex-wrap align-items-center">
                <div class="col-lg-4" style="margin: 5%">
                    <header style="font-size: 300%">{{titulo}}</header>
                    <b-container class="row" style="height: 10%"></b-container>
                    <p style="font-size: 150%">{{subtitulo}}</p>
                </div>
                <b-img :src="imagen"  center class="h-100 col-md-6 flex-shrink-1 img-fluid imagenInicio"></b-img>
            </div>
        </b-jumbotron>
    </div>
</template>

<script>
    export default {
        name: "Jumbotron",
        props:{
            texto:{
                type:String
            },
            titulo:{
                type:String
            },
            subtitulo:{
                type:String
            },
            imagen:{
                type:String
            }
        }
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
    .imagenInicio{
        object-fit: contain;
    }

</style>