// Tambahkan kode ini ke file scripts.js atau buat file baru bernama contact-form.js
// Pastikan untuk menyertakan script EmailJS di file HTML Anda

// Inisialisasi EmailJS
(function() {
    // Ganti "YOUR_USER_ID" dengan User ID dari akun EmailJS Anda
    emailjs.init("YOUR_USER_ID");
})();

// Tunggu hingga dokumen sepenuhnya dimuat
document.addEventListener("DOMContentLoaded", function() {
    // Ambil referensi ke form dan elemen-elemen penting
    const contactForm = document.getElementById("contactForm");
    const submitButton = document.getElementById("submitButton");
    const successMessage = document.getElementById("submitSuccessMessage");
    const errorMessage = document.getElementById("submitErrorMessage");

    // Hilangkan atribut "disabled" dari tombol submit saat halaman dimuat
    submitButton.classList.remove("disabled");

    // Tambahkan event listener untuk form submission
    contactForm.addEventListener("submit", function(event) {
        // Cegah form melakukan submit default
        event.preventDefault();

        // Validasi form secara manual (tambahan dari validasi HTML)
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !phone || !message) {
            // Tampilkan error jika ada field yang kosong
            errorMessage.textContent = "Harap isi semua field yang diperlukan.";
            errorMessage.classList.remove("d-none");
            
            // Sembunyikan pesan error setelah 5 detik
            setTimeout(function() {
                errorMessage.classList.add("d-none");
            }, 5000);
            
            return;
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = "Format email tidak valid.";
            errorMessage.classList.remove("d-none");
            
            setTimeout(function() {
                errorMessage.classList.add("d-none");
            }, 5000);
            
            return;
        }

        // Ubah teks tombol dan nonaktifkan selama proses pengiriman
        submitButton.textContent = "Mengirim...";
        submitButton.disabled = true;

        // Persiapkan parameter untuk EmailJS
        const templateParams = {
            from_name: name,
            reply_to: email,
            phone_number: phone,
            message: message
        };

        // Kirim email menggunakan EmailJS
        // Ganti "YOUR_SERVICE_ID" dan "YOUR_TEMPLATE_ID" dengan ID dari akun EmailJS Anda
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
            .then(function(response) {
                // Handle sukses
                console.log("SUCCESS!", response.status, response.text);
                
                // Tampilkan pesan sukses
                successMessage.classList.remove("d-none");
                
                // Reset form
                contactForm.reset();
                
                // Kembalikan tombol ke keadaan awal
                submitButton.textContent = "Submit";
                submitButton.disabled = false;
                
                // Sembunyikan pesan sukses setelah 5 detik
                setTimeout(function() {
                    successMessage.classList.add("d-none");
                }, 5000);
            }, function(error) {
                // Handle error
                console.log("FAILED...", error);
                
                // Tampilkan pesan error
                errorMessage.textContent = "Gagal mengirim pesan. Silakan coba lagi.";
                errorMessage.classList.remove("d-none");
                
                // Kembalikan tombol ke keadaan awal
                submitButton.textContent = "Submit";
                submitButton.disabled = false;
                
                // Sembunyikan pesan error setelah 5 detik
                setTimeout(function() {
                    errorMessage.classList.add("d-none");
                }, 5000);
            });
    });
});