<template>
<div>
  <main>
    <b-form-group >
      <h2 >{{ current.title }}</h2>
      <div >
        <b-button
            v-if="reproduciendo===false"
            @click="reproducir">
          Reproducir
        </b-button>
        <b-button
            v-if="reproduciendo===true"
            @click="pausar">
          Pausar
        </b-button>
        <b-button
            v-if="current.favorita===true"
            @click="quitar">
          quitar favoritas
        </b-button>
        <b-button
            v-if="current.favorita===false"
            @click="anadir">
          añadir a favoritas
        </b-button>
      </div>
    </b-form-group>
    <b-form-group>
      <h3>Canciones:</h3>
      <h4>Favoritas</h4>

      <b-button
          v-for="song in songs.filter(s=>s.favorita===true)"
          :key="song.src"
          @click="reproducir(song)">
        {{ song.title }}

      </b-button>
      </b-form-group>
      <h4>Otras</h4>
      <b-button
          v-for="song in songs.filter(s=>s.favorita===false)"
          :key="song.src"
          @click="reproducir(song)">
        {{ song.title }}

      </b-button>
  </main>
</div>
</template>

<script>
export default {
  name: "Music",
  data () {
    return {
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