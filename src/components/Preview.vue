<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div v-if="loading" class="loader">Loading...</div>
      <div v-if="error" class="text-red-600 text-center mt-2">{{ error }}</div>
  
      <div v-if="!loading && !error && customData.name" class="border-4 border-red-500 rounded-lg shadow-md p-8 max-w-lg w-full mx-auto relative happy-birthday-card moving-border">
        <div class="text-center mb-4 relative">
          <div class="relative inline-block">
            <img :src="customData.photo" alt="Foto Profil"
                 class="animate-animated animate__fadeIn w-40 h-40 rounded-full border-4 border-red-500 animate__animated animate__heartBeat relative z-10">
            <div class="absolute -top-2 -right-2">
              <div class="relative rounded-full bg-gray-100 h-10 w-10 p-1 z-10">
                <div class="absolute top-0 right-0 animasi text-2xl">
                  <div class="relative inline-block">
                    <img v-if="showStreak" src="../assets/img/streak.png" class="w-auto h-auto" alt="">
                    <span v-if="showStreak" class="fire absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-200 font-bold" style="text-shadow: 2px 2px 4px rgb(221, 20, 20);">
                      {{ age }}
                    </span>
                    <span v-else>🎉</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 class="text-3xl pb-3 font-semibold animate__animated animate__zoomIn" id="birthdayText">
            <span class="animasi">🥳</span>
            <p class="water-effect">
              <span>おたんじょうび </span><br />
              <span>おめでとう</span>
            </p>
            <span class="animasi">🥳</span>
          </h1>
          <h2 class="text-4xl pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {{ customData.name }}
          </h2>
          <p class="text-gray-300">{{ customData.message }}</p>
        </div>
      </div>
  
      <!-- Optional Sections -->
      <section v-if="customData.optionalSections && customData.optionalSections.length" class="max-w-lg w-full mx-auto mt-4">
        <h3 class="text-xl font-semibold text-center">Konten Tambahan:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div v-for="(section, index) in customData.optionalSections" :key="index" class="p-4 border-2 border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <p v-if="section.text" class="text-gray-700 mb-2">{{ section.text }}</p>
            <img v-if="section.image" :src="section.image" class="w-full h-auto rounded-lg" alt="Gambar Tambahan">
          </div>
        </div>
      </section>
  
      <div v-else-if="!loading && !error" class="text-gray-600 mt-4">Tidak ada data untuk ditampilkan.</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      customData: {
        type: Object,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: ''
      },
      showStreak: {
        type: Boolean,
        default: false
      },
      age: {
        type: Number,
        default: 0
      }
    }
  }
  </script>
  

<style scoped>
.loader {
  border: 4px solid #f3f3f3; /* Light gray */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.water-effect {
  display: inline-block;
  color: transparent;
  position: relative;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: url('https://i.ibb.co/CvwWQZF/water.gif');
  background-repeat: repeat-x;
  animation: watereffect 5s infinite normal linear;
  -webkit-text-stroke: 1px #95E6F9;
}

/* Custom Styles for the Card */
.moving-border {
  @apply bg-gradient-to-br from-black to-red-900;
}

.moving-border::before,
.moving-border::after {
  content: "";
  position: absolute;
  inset: -0.2rem;
  z-index: -1;
  background: linear-gradient(var(--angle), 
    #032146,  #C3F2FF, #b00);
  animation: rotate 10s linear infinite;
}

.moving-border::after {
  filter: blur(10px);
}

@keyframes rotate {
  0%     { --angle: 0deg; }
  100%   { --angle: 360deg; }
}

@keyframes watereffect {
  0%{background-position: 0 10px}
  5%{background-position: 5% 5px}
  10%{background-position: 10% -10px}
  15%{background-position: 15% -20px}
  20%{background-position: 20% -30px}
  25%{background-position: 25% -40px}
  30%{background-position: 30% -50px}
  40%{background-position:35% -55px}
  50%{background-position:40% -55px}
  60%{background-position:50% -55px}
  70%{background-position:60% -55px}
  80%{background-position:70% -55px}
  90%{background-position:80% -55px}
  100%{background-position:90% -55px}
}

.animasi {
  display: inline-block;
  font-size: 30px;
  animation: gerakan 2s infinite alternate ease-in-out;
}

@keyframes gerakan {
  0% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1.2) rotate(10deg);
  }
}

.animasichange {
  animation: changeText 1s linear infinite;
}

@keyframes changeText {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
