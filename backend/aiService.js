const { OpenAI } = require("openai");
require('dotenv').config();

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN, // Pastikan token di .env sudah benar
});

async function queryAI(userContent) {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "CohereLabs/c4ai-command-a-03-2025:cohere", // Kamu bisa ganti model di sini
            messages: [
                {
                    role: "system",
                    content: "Anda adalah asisten ahli Bahasa Indonesia. Tugas Anda adalah memperbaiki kalimat menjadi baku sesuai PUEBI, memberikan definisi kata, mengevaluasi jawaban quiz, dan tetap tampilkan kata yang hanya menggunakan satu huruf, serta jangan ubah kata hai dan halo."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            max_tokens: 500,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Kesalahan AI:", error.message);
        return "Maaf, terjadi kesalahan saat menghubungi server AI.";
    }
}

module.exports = { queryAI };