<template>
<div >
  <main>
    <div>
      <b-form-group >
      <b-form-group >
        <h2 >{{ current.title }}</h2>
        <div >
          <b-img
              v-if="reproduciendo===false"
              @click="reproducir"
              src="../assets/botones/play.png"
              height="50px"
              width="auto">
          </b-img>
          <b-img
              v-if="reproduciendo===true"
              @click="pausar"
              src="../assets/botones/stop.png"
              height="50px"
              width="auto">
            Pausar
          </b-img>
          <b-img
              v-if="current.favorita===true"
              @click="quitar"
              src="../assets/botones/favourite.png"
              height="50px"
              width="auto"
              >
            quitar favoritas
          </b-img>
          <b-img
              v-if="current.favorita===false"
              @click="anadir"
              src="../assets/botones/notfavourite.png"
              height="50px"
              width="auto">
            añadir a favoritas
          </b-img>
        </div>
      </b-form-group>
      <h3>Canciones:</h3>
      <div
          title="Music"
          class="box">
        <b-form-group>
          <b-button
            block
            variant="warning"
            v-for="song in songs.filter(s=>s.favorita===true)"
            :key="song.src"
            @click="reproducir(song)">
            <div class="d-flex">
              <div class="mr-auto">
                {{ song.title }}
              </div>
              <b-img  class="googleIcon"  src="../assets/botones/favourite.png"></b-img>
            </div>

        </b-button>
          <b-button
            block
            variant="primary"
            v-for="song in songs.filter(s=>s.favorita===false)"
            :key="song.src"
            @click="reproducir(song)">

            <div class="d-flex">
              <div class="mr-auto">
                {{ song.title }}
              </div>
              <img  class="googleIcon" src="../assets/botones/notfavourite.png">
            </div>
        </b-button>
          <p class="my-4" v-for="i in 20" :key="i">
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
      </b-form-group>
      </div>
    </b-form-group>
    </div>
  </main>
</div>
</template>

<script>
import play from '../assets/botones/play.png';
export default {
  name: "Music",
  data () {
    return {
      playbtn: play,
      current: {},
      index: 0,
      reproduciendo: false,
      songs: [
        { favorita:false,
          title:'belonging',
          src: require('@/assets/audio/Belonging by Muted Artlist.mp3')
        },
        { favorita:false,
          title:'chilled',
          src: require('@/assets/audio/chilled.mp3')
        },
        { favorita:false,
          title:'dusk',
          src: require('@/assets/audio/Dusk by IanPost Artlist.mp3')
        },
        { favorita:false,
          title:'staring',
          src: require('@/assets/audio/Staring by Muted Artlist.mp3')
        },
        { favorita:false,
          title:'theworld',
          src: require('@/assets/audio/TheWorldInsideInstrumentalVersion by RodellosMachine Artlist.mp3')
        }

      ],
      player: new Audio()
    }
  },
  methods: {
    reproducir:function (song) {
      if (typeof song.src != "undefined") {
        this.current = song;
        this.player.src = this.current.src;
      }
      this.player.play();
      this.reproduciendo = true;
    },
    pausar:function () {
      this.player.pause();
      this.reproduciendo = false;
    },
    anadir:function () {
      this.$store.dispatch("DataModule/addFavorite",this.current.title).then(()=>this.update())
    },
    quitar:function () {
      this.$store.dispatch("DataModule/deleteFavorite",this.current.title).then(()=>this.update())
    },
    update(){
      this.$store.dispatch('DataModule/sounds').then(response=>{
        response.data.forEach(valor=>{
          let titles=this.songs.map(item=>item.title)
          this.songs[titles.indexOf(valor.sonido)].favorita=valor.favorite
        })
      })
    }
  },
  created () {
    this.update()
    this.current = this.songs[this.index];
    this.player.src = this.current.src;
  }
}
</script>

<style>

.box{
  overflow-y: scroll;
  height: 512px;
}
.googleIcon{
  height: 1.5rem;
  justify-content: flex-end;
  margin-left: 0.5rem;
}
</style>