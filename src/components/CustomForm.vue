<template>
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-400 to-purple-600">
      <div class="form-container bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-semibold text-center mb-6 text-gray-700">Buat Kartu Ulang Tahun</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-600 font-medium mb-2">Nama:</label>
            <input
              type="text"
              v-model="userData.name"
              id="name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
  
          <div>
            <label for="dateOfBirth" class="block text-gray-600 font-medium mb-2">Tanggal Lahir:</label>
            <input
              type="date"
              v-model="userData.dateOfBirth"
              id="dateOfBirth"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
  
          <div>
            <label for="message" class="block text-gray-600 font-medium mb-2">Pesan:</label>
            <textarea
              v-model="userData.message"
              id="message"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Tulis pesan untuk kartu"
              required
            ></textarea>
          </div>
  
          <div>
            <label for="photo" class="block text-gray-600 font-medium mb-2">Foto:</label>
            <input
              type="file"
              id="photo"
              class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
              @change="handleFileUpload"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Buat Kartu
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { doc, setDoc } from "firebase/firestore";
  import { firestore, storage } from "../firebase"; // Import Firestore dan Storage dari firebase.js
  
  export default {
    data() {
      return {
        userData: {
          name: "",
          dateOfBirth: "",
          message: "",
          photo: null,
        },
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        this.userData.photo = file; // Menyimpan file foto untuk diunggah ke Storage
      },
      async submitForm() {
        const file = this.userData.photo;
  
        if (file) {
          // Membuat referensi untuk penyimpanan di Firebase Storage
          const storageRef = ref(storage, `uploads/${file.name}`);
  
          try {
            // Upload file ke Firebase Storage
            const uploadSnapshot = await uploadBytes(storageRef, file);
  
            // Mendapatkan URL file yang diunggah
            const downloadURL = await getDownloadURL(uploadSnapshot.ref);
  
            // Membuat referensi ke Firestore untuk menyimpan data pengguna
            const userRef = doc(firestore, "cards", this.userData.name); // Menggunakan nama sebagai ID
  
            // Simpan data ke Firestore
            await setDoc(userRef, { 
              name: this.userData.name,
              dateOfBirth: this.userData.dateOfBirth, // Menyimpan tanggal lahir
              message: this.userData.message,
              photo: downloadURL, // URL dari foto yang diunggah
              createdAt: new Date(), // Menyimpan waktu pembuatan data
            });
  
            // Redirect ke halaman kartu dengan nama sebagai bagian dari URL
            this.$router.push(`/card/${this.userData.name}`);
          } catch (error) {
            console.error("Error uploading file or saving data:", error);
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  