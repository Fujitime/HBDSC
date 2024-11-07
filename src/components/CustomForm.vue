<template>
  <div :class="['flex justify-center items-center min-h-screen transition-all duration-300', darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-400 to-purple-600']">
    <div class="form-container bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-7xl w-full">
      
      <!-- Form and Preview section, arranged side by side on desktop and larger -->
      <div class="flex flex-col md:flex-row md:justify-between gap-8">
        
        <!-- Preview Component -->
        <Preview 
          :customData="{
            name: userData.name || 'Sepuh!',
            message: userData.message || 'Selamat hari ulang tahun ke 18 Puh Sekarang sudah resmi menjadi dewasa! XD',
            photo: userData.photo || 'https://halosepuh.netlify.app/assets/sepuh-s1R6haKi.jpg',
            optionalSections: optionalSections.map(section => ({
              text: section.additionalText || 'Haloo',
              image: section.additionalImage || 'https://halosepuh.netlify.app/assets/sepuh-s1R6haKi.jpg'
            }))
          }" 
          :loading="loading" 
          :error="error" 
          class="flex-1"
        />

        <!-- Form Section -->
        <form @submit.prevent="submitForm" class="space-y-4 flex-1">
          <div>
            <label for="name" class="block text-gray-600 dark:text-gray-300 font-medium mb-2">Nama Orang yang Ulang Tahun:</label>
            <input
              type="text"
              v-model="userData.name"
              id="name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              placeholder="Masukkan nama orang yang ulang tahun"
              required
            />
          </div>

          <div>
            <label for="dateOfBirth" class="block text-gray-600 dark:text-red-300 font-medium mb-2">Tanggal Lahir-nya:</label>
            <input
              type="date"
              v-model="userData.dateOfBirth"
              id="dateOfBirth"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>

          <div>
            <label for="message" class="block text-gray-600 dark:text-gray-300 font-medium mb-2">Pesan Ulang Tahun:</label>
            <textarea
              v-model="userData.message"
              id="message"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              rows="4"
              placeholder="Tulis pesan untuk kartu ulang tahun"
              required
            ></textarea>
          </div>

          <div>
            <label for="photo" class="block text-gray-600 dark:text-gray-300 font-medium mb-2">Foto Profil:</label>
            <input
              type="file"
              id="photo"
              class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 dark:bg-gray-800 dark:text-gray-300 dark:file:bg-gray-700"
              @change="handleFileUpload"
              required
            />
          </div>

          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Tambahkan Konten Opsional</h3>
            <div v-for="(section, index) in optionalSections" :key="index" class="mb-4 border p-4 rounded-lg dark:bg-gray-800">
              <div>
                <label :for="'optionalText' + index" class="block text-gray-600 dark:text-gray-300 font-medium mb-2">Teks Tambahan:</label>
                <textarea
                  v-model="section.additionalText"
                  :id="'optionalText' + index"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  rows="3"
                  placeholder="Tulis teks tambahan"
                ></textarea>
              </div>

              <div>
                <label :for="'optionalImage' + index" class="block text-gray-600 dark:text-gray-300 font-medium mb-2">Gambar Tambahan:</label>
                <input
                  type="file"
                  :id="'optionalImage' + index"
                  class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 dark:bg-gray-800 dark:text-gray-300 dark:file:bg-gray-700"
                  @change="event => handleAdditionalImageUpload(event, index)"
                />
              </div>

              <button
                type="button"
                class="mt-2 text-red-600 hover:text-red-700"
                @click="removeSection(index)"
              >
                Hapus Section
              </button>
            </div>

            <button
              type="button"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              @click="addSection"
            >
              Tambah Section Opsional
            </button>
          </div>

          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            :disabled="loading"
          >
            {{ loading ? 'Membuat Kartu...' : 'Buat Kartu' }}
          </button>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 mt-4">
            <p>{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="text-green-600 mt-4">
            <p>Kartu ulang tahun berhasil dibuat!</p>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, storage } from "../firebase"; // Mengimpor Firestore dan Storage dari firebase.js
import CryptoJS from "crypto-js"; // Untuk enkripsi data
import Preview from './Preview.vue'; // Komponen untuk pratinjau

export default {
  components: {
    Preview, // Mendaftarkan komponen Preview
  },
  data() {
    return {
      userData: {
        name: "",
        dateOfBirth: "",
        message: "",
        photo: null, // Menyimpan URL foto yang diupload untuk pratinjau
        photoFile: null, // Menyimpan referensi file foto asli untuk diupload
      },
      optionalSections: [{ additionalText: "", additionalImage: null, additionalImageFile: null }], // Menyimpan bagian opsional
      loading: false,
      error: null,
      success: false,
      darkMode: false,
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode; 
    },
    // Menangani upload foto utama
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.userData.photo = URL.createObjectURL(file); // Membuat URL untuk pratinjau
      this.userData.photoFile = file; // Menyimpan file asli untuk diupload
    },
    // Menangani upload gambar tambahan
    handleAdditionalImageUpload(event, index) {
      const file = event.target.files[0];
      this.optionalSections[index].additionalImage = URL.createObjectURL(file); // Membuat URL untuk pratinjau
      this.optionalSections[index].additionalImageFile = file; // Menyimpan file gambar untuk diupload
    },
    addSection() {
      this.optionalSections.push({ additionalText: "", additionalImage: null, additionalImageFile: null }); // Menambahkan bagian opsional baru
    },
    removeSection(index) {
      this.optionalSections.splice(index, 1); // Menghapus bagian opsional
    },
    async submitForm() {
      this.error = null;
      this.success = false;
      this.loading = true;

      // Validasi form
      if (!this.userData.name || !this.userData.dateOfBirth || !this.userData.message || !this.userData.photoFile) {
        this.error = "Semua field utama harus diisi!";
        this.loading = false;
        return;
      }

      // Enkripsi data (nama, pesan, tanggal lahir)
      const encryptedName = CryptoJS.AES.encrypt(this.userData.name, 'secretKey').toString();
      const encryptedMessage = CryptoJS.AES.encrypt(this.userData.message, 'secretKey').toString();
      const encryptedDateOfBirth = CryptoJS.AES.encrypt(this.userData.dateOfBirth, 'secretKey').toString();

      // Membuat ID dokumen unik menggunakan timestamp dan string acak
      const documentId = this.generateDocumentId(); // Generate ID unik untuk dokumen

      // Cek apakah nama sudah ada di Firestore
      const userRef = doc(firestore, "cards", documentId); // Menggunakan ID unik sebagai ID dokumen
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        this.error = "Nama sudah ada. Silakan pilih nama lain.";
        this.loading = false;
        return;
      }

      // Upload foto utama ke Firebase Storage
      const mainPhotoRef = ref(storage, `uploads/${this.userData.photoFile.name}`);
      
      try {
        const uploadSnapshot = await uploadBytes(mainPhotoRef, this.userData.photoFile);

        // Ambil URL dari foto yang diupload
        const mainPhotoURL = await getDownloadURL(uploadSnapshot.ref);

        // Menyusun data untuk disimpan ke Firestore
        const cardData = {
          name: encryptedName, // Menyimpan nama terenkripsi
          message: encryptedMessage, // Menyimpan pesan terenkripsi
          dateOfBirth: encryptedDateOfBirth, // Menyimpan tanggal lahir terenkripsi
          photo: mainPhotoURL, // Menyimpan URL foto yang diupload
          createdAt: new Date(),
          optionalSections: [] // Menyimpan bagian opsional yang akan diproses
        };

        // Proses setiap bagian opsional
        for (const section of this.optionalSections) {
          const optionalData = {
            text: section.additionalText ? CryptoJS.AES.encrypt(section.additionalText, 'secretKey').toString() : '',
            image: ""
          };

          // Upload gambar opsional jika ada
          if (section.additionalImageFile) {
            const additionalImageRef = ref(storage, `uploads/${section.additionalImageFile.name}`);
            const additionalUploadSnapshot = await uploadBytes(additionalImageRef, section.additionalImageFile);
            optionalData.image = await getDownloadURL(additionalUploadSnapshot.ref); // Ambil URL gambar opsional yang diupload
          }

          // Tambahkan data opsional ke cardData
          cardData.optionalSections.push(optionalData);
        }

        // Simpan data ke Firestore
        await setDoc(userRef, cardData);

        this.success = true;

        // Navigasi ke halaman baru setelah data disimpan
        this.$router.push(`/card/${documentId}`); // Gunakan ID dokumen di URL

        // Bersihkan form setelah navigasi
        this.userData = {
          name: "",
          dateOfBirth: "",
          message: "",
          photo: null,
        };
        this.optionalSections = [{ additionalText: "", additionalImage: null, additionalImageFile: null }];
      } catch (error) {
        console.error("Error uploading file or saving data:", error);
        this.error = "Terjadi kesalahan saat mengunggah file atau menyimpan data. Silakan coba lagi.";
      } finally {
        this.loading = false;
      }
    },

    // Fungsi untuk menghasilkan ID dokumen unik
    generateDocumentId() {
      // Membuat ID unik menggunakan timestamp dan string acak
      const randomString = Math.random().toString(36).substring(2, 15); // Membuat string acak
      const timestamp = Date.now().toString(36); // Menggunakan timestamp sebagai bagian dari ID
      return `${timestamp}-${randomString}`; // Menggabungkan timestamp dan string acak
    },

    // Mengambil dan mendekripsi data dari Firestore
    async fetchData() {
      const documentId = this.$route.params.name; // Mendapatkan ID dokumen dari parameter route
      const userRef = doc(firestore, "cards", documentId);

      // Mengambil data dari Firestore
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const encryptedData = docSnap.data();

        // Dekripsi data
        const decryptedName = this.decryptData(encryptedData.name);
        const decryptedMessage = this.decryptData(encryptedData.message);
        const decryptedDateOfBirth = this.decryptData(encryptedData.dateOfBirth);

        // Menampilkan data yang telah didekripsi
        this.customData = {
          name: decryptedName,
          message: decryptedMessage,
          dateOfBirth: decryptedDateOfBirth,
          photo: encryptedData.photo,
          createdAt: encryptedData.createdAt,
          optionalSections: encryptedData.optionalSections || []
        };
      } else {
        console.error("Dokumen tidak ditemukan!");
        this.error = "Kartu tidak ditemukan. Silakan coba nama lain.";
      }
      this.loading = false;
    },

    // Fungsi untuk mendekripsi data
    decryptData(encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'secretKey');
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  },
};
</script>



<style scoped>
.form-container {
  /* Additional styles for the form container if needed */
}
</style>
