<template>
    <div >
      <canvas class="confetti" id="canvas"></canvas>
      <Balon />
    </div>
  </template>
  
  <script>
  import Balon from './components/Ballon.vue';
  import music from './assets/music.mp3';
  
  export default {
    components: {
      Balon,
    },
    mounted() {
      const playMusicOnce = () => {
        const audio = new Audio(music);
        audio.play();
        document.removeEventListener('click', playMusicOnce);
      };
      document.addEventListener('click', playMusicOnce);
    },
  };
  </script>
  