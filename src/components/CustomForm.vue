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

        <!-- Optional Sections for Additional Text and Images -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Tambahkan Konten Opsional</h3>
          <div v-for="(section, index) in optionalSections" :key="index" class="mb-4 border p-4 rounded-lg">
            <div>
              <label :for="'optionalText' + index" class="block text-gray-600 font-medium mb-2">Teks Tambahan:</label>
              <textarea
                v-model="section.additionalText"
                :id="'optionalText' + index"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="Tulis teks tambahan..."
              ></textarea>
            </div>

            <div>
              <label :for="'optionalImage' + index" class="block text-gray-600 font-medium mb-2">Gambar Tambahan:</label>
              <input
                type="file"
                :id="'optionalImage' + index"
                class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
                @change="event => handleAdditionalImageUpload(event, index)"
              />
            </div>

            <button
              type="button"
              class="mt-2 text-red-600 hover:text-red-700"
              @click="removeSection(index)"
            >
              Hapus Seksi
            </button>
          </div>

          <button
            type="button"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            @click="addSection"
          >
            Tambah Seksi Opsional
          </button>
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          :disabled="loading"
        >
          {{ loading ? 'Membuat Kartu...' : 'Buat Kartu' }}
        </button>

        <!-- Error and Success Messages -->
        <div v-if="error" class="text-red-600 text-center mt-2">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-center mt-2">Kartu berhasil dibuat!</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
      optionalSections: [
        { additionalText: "", additionalImage: null } // Initial optional section
      ],
      loading: false, // For tracking loading state
      error: null, // For error handling
      success: false, // For successful submission
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.userData.photo = file; // Menyimpan file foto untuk diunggah ke Storage
    },
    handleAdditionalImageUpload(event, index) {
      const file = event.target.files[0];
      this.optionalSections[index].additionalImage = file; // Menyimpan gambar tambahan untuk diunggah
    },
    addSection() {
      this.optionalSections.push({ additionalText: "", additionalImage: null }); // Add a new optional section
    },
    removeSection(index) {
      this.optionalSections.splice(index, 1); // Remove the specified section
    },
    async submitForm() {
      this.error = null; // Reset error state
      this.success = false; // Reset success state
      this.loading = true; // Set loading state

      // Validate main form fields
      if (!this.userData.name || !this.userData.dateOfBirth || !this.userData.message || !this.userData.photo) {
        this.error = "Semua field utama harus diisi!";
        this.loading = false; // Reset loading state
        return;
      }

      // Check if the user name already exists
      const userRef = doc(firestore, "cards", this.userData.name);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert("Nama sudah ada. Silakan pilih nama lain.");
        this.loading = false; // Reset loading state
        return; // Exit if name already exists
      }

      // Upload main photo
      const mainPhotoRef = ref(storage, `uploads/${this.userData.photo.name}`);

      try {
        const uploadSnapshot = await uploadBytes(mainPhotoRef, this.userData.photo);
        const mainPhotoURL = await getDownloadURL(uploadSnapshot.ref);

        // Prepare data to be saved in Firestore
        const cardData = { 
          name: this.userData.name,
          dateOfBirth: this.userData.dateOfBirth,
          message: this.userData.message,
          photo: mainPhotoURL,
          createdAt: new Date(),
          optionalSections: [] // Initialize for storing optional sections
        };

        // Process each optional section
        for (const section of this.optionalSections) {
          const optionalData = {
            text: section.additionalText,
            image: ""
          };

          // Upload optional image if it exists
          if (section.additionalImage) {
            const additionalImageRef = ref(storage, `uploads/${section.additionalImage.name}`);
            const additionalUploadSnapshot = await uploadBytes(additionalImageRef, section.additionalImage);
            optionalData.image = await getDownloadURL(additionalUploadSnapshot.ref);
          }

          cardData.optionalSections.push(optionalData); // Add section data to Firestore
        }

        // Save data to Firestore
        await setDoc(userRef, cardData);

        this.success = true; // Set success state
        this.$router.push(`/card/${this.userData.name}`);
      } catch (error) {
        console.error("Error uploading file or saving data:", error);
        this.error = "Terjadi kesalahan saat mengunggah file atau menyimpan data. Silakan coba lagi.";
      } finally {
        this.loading = false; // Reset loading state
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
