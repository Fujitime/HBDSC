<template>
  <Ballon />
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
    <!-- Confetti Canvas -->
    <canvas id="canvas" class="absolute top-0 left-0 w-full h-full z-20"></canvas>

    <!-- Audio Element for Background Music -->
    <audio ref="backgroundMusic" :src="musicSrc" preload="auto" loop></audio>

    <div v-if="loading" class="loader">Loading...</div>
    <div v-if="error" class="text-red-600 text-center mt-2">{{ error }}</div>

    <div v-if="!loading && !error && customData.name" class="border-4 border-red-500 rounded-lg shadow-md p-8 max-w-lg w-full mx-auto relative happy-birthday-card moving-border bg-gray-800">
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div v-for="(section, index) in customData.optionalSections" :key="index" class="p-4 border-2 border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800">
          <img v-if="section.image" :src="section.image" class="w-full h-auto rounded-lg" alt="Gambar Tambahan">
          <p v-if="section.text" class="text-gray-100 mb-2">{{ section.text }}</p>
        </div>
      </div>
    </section>

    <div v-else-if="!loading && !error" class="text-gray-600 mt-4">Tidak ada data untuk ditampilkan.</div>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase"; 
import CryptoJS from "crypto-js"; 
import Ballon from "./Ballon.vue";
import backgroundMusic from '../assets/music.mp3';

export default {
  components: {
    Ballon,
  },
  data() {
    return {
      customData: {
        name: '',
        message: '',
        photo: '',
        dateOfBirth: '',
        createdAt: '',
        optionalSections: [] // Menampung bagian opsional
      },
      loading: true, // State untuk loading
      error: null, // State untuk penanganan kesalahan
      showStreak: false,
      musicSrc: backgroundMusic,
      isMusicPlaying: false,
      hasInteracted: false, // Untuk melacak apakah pengguna telah berinteraksi
    };
  },
  computed: {
    age() {
      if (this.customData.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.customData.dateOfBirth);

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        const d = today.getDate() - birthDate.getDate();

        if (m < 0 || (m === 0 && d < 0)) {
          age--;
        }

        return age;
      }
      return null;
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.showStreak = !this.showStreak;
    }, 5000);

    // Initialize confetti effect
    this.initConfetti();

    // Tunggu interaksi pengguna sebelum memutar musik
    window.addEventListener('click', this.startMusicAfterInteraction, { once: true });
    window.addEventListener('keydown', this.startMusicAfterInteraction, { once: true });
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  async created() {
    const name = this.$route.params.name; // Ambil nama dari route

    if (!name) {
      console.error("Nama tidak tersedia di route");
      this.error = "Nama tidak ditemukan. Silakan kembali.";
      this.loading = false; // Reset loading state
      return;
    }

    try {
      const docRef = doc(firestore, "cards", name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const encryptedData = docSnap.data(); // Ambil data terenkripsi dari Firestore

        // Dekripsi data yang terenkripsi
        this.customData.name = this.decryptData(encryptedData.name);
        this.customData.message = this.decryptData(encryptedData.message);
        this.customData.dateOfBirth = this.decryptData(encryptedData.dateOfBirth);
        this.customData.photo = encryptedData.photo;
        this.customData.createdAt = encryptedData.createdAt;

        // Dekripsi data optional sections
        this.customData.optionalSections = encryptedData.optionalSections.map(section => ({
          text: section.text ? this.decryptData(section.text) : '',
          image: section.image,
        }));

        console.log("Fetched and Decrypted Data:", this.customData);
      } else {
        console.error("Dokumen tidak ditemukan!");
        this.error = "Kartu tidak ditemukan. Silakan coba nama lain.";
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      this.error = "Terjadi kesalahan saat mengambil data. Silakan coba lagi.";
    } finally {
      this.loading = false; // Reset loading state
    }
  },
  methods: {
    // Fungsi untuk mendekripsi data yang terenkripsi
    decryptData(encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'secretKey'); // Gantilah 'secretKey' dengan kunci yang sesuai
      return bytes.toString(CryptoJS.enc.Utf8); // Mengembalikan data dalam bentuk string
    },

    // Initialize confetti effect
    initConfetti() {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      let confetti = [];
      const confettiCount = 300;
      const gravity = 0.5;
      const terminalVelocity = 5;
      const drag = 0.075;
      const colors = [
        { front: 'red', back: 'darkred' },
        { front: 'green', back: 'darkgreen' },
        { front: 'blue', back: 'darkblue' },
        { front: 'yellow', back: 'darkyellow' },
        { front: 'orange', back: 'darkorange' },
        { front: 'pink', back: 'darkpink' },
        { front: 'purple', back: 'darkpurple' },
        { front: 'turquoise', back: 'darkturquoise' }
      ];

      const randomRange = (min, max) => Math.random() * (max - min) + min;

      // Initialize confetti particles
      const initConfettiParticles = () => {
        confetti = [];
        for (let i = 0; i < confettiCount; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const particle = {
            position: { x: randomRange(0, canvas.width), y: randomRange(0, canvas.height) },
            velocity: { x: randomRange(-2, 2), y: randomRange(-2, 2) },
            size: randomRange(5, 15),
            angle: randomRange(0, 360),
            angularVelocity: randomRange(-0.1, 0.1),
            color: color.front,
            backgroundColor: color.back,
          };
          confetti.push(particle);
        }
      };

      // Update and draw confetti particles
      const updateAndDrawConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(particle => {
          particle.velocity.y += gravity;
          particle.velocity.y = Math.min(particle.velocity.y, terminalVelocity);
          particle.position.x += particle.velocity.x;
          particle.position.y += particle.velocity.y;
          particle.angle += particle.angularVelocity;
          ctx.save();
          ctx.translate(particle.position.x, particle.position.y);
          ctx.rotate(particle.angle);
          ctx.beginPath();
          ctx.rect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.restore();
        });
        confetti = confetti.filter(p => p.position.y < canvas.height); // Filter particles that are out of view
      };

      // Adjust canvas size on resize
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener("resize", resizeCanvas);

      // Start confetti animation
      resizeCanvas();
      initConfettiParticles();
      setInterval(updateAndDrawConfetti, 1000 / 60); // 60 FPS
    },

    // Play the background music after user interaction
    startMusicAfterInteraction() {
      if (!this.hasInteracted) {
        this.$refs.backgroundMusic.play();
        this.hasInteracted = true;
      }
    },
  },
};
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
