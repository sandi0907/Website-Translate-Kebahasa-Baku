const express = require('express');
const cors = require('cors'); // 1. Import CORS
const { queryAI } = require('./aiService');
const axios = require('axios');
const app = express();

// 2. Gunakan Middleware
app.use(cors()); // Mengizinkan akses dari domain luar (seperti HP kamu)
app.use(express.json());

// Endpoint Fitur 1: Perbaiki Kalimat
app.post('/api/perbaiki', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Teks kosong" });

    try {
        const prompt = `Perbaiki kalimat berikut menjadi Bahasa Indonesia baku, formal, dan benar secara tata bahasa. Tampilkan hasil perbaikan saja: "${text}"`;
        const result = await queryAI(prompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: "Gagal memproses AI" });
    }
});

// Endpoint Fitur 2: Arti Kata (KBBI + AI Fallback)
app.post('/api/kamus', async (req, res) => {
    const { word } = req.body;
    
    if (!word) {
        return res.status(400).json({ error: "Kata tidak boleh kosong" });
    }

    try {
        // 3. Perbaikan URL API KBBI Heru Sahat
        const apiUrl = `https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${encodeURIComponent(word)}`;
        const kbbiRes = await axios.get(apiUrl);
        
        if (kbbiRes.data && kbbiRes.data.data && kbbiRes.data.data.length > 0) {
            const artiList = kbbiRes.data.data.map(item => item.lema + ": " + item.arti.join("; "));
            
            return res.json({ 
                definition: artiList.join("\n\n"),
                source: "KBBI (Heru Sahat API)"
            });
        } else {
            throw new Error("Kata tidak ditemukan di KBBI");
        }

    } catch (error) {
        console.log("KBBI tidak ditemukan atau error, beralih ke AI...");
        
        try {
            const aiPrompt = `Berikan definisi singkat dan formal dalam Bahasa Indonesia untuk kata: "${word}". Jika itu bahasa tidak baku, berikan bentuk bakunya.`;
            const aiResult = await queryAI(aiPrompt); 
            
            res.json({ 
                definition: aiResult,
                source: "AI Assistant (Cadangan)"
            });
        } catch (aiError) {
            res.status(500).json({ error: "Gagal mendapatkan definisi dari semua sumber." });
        }
    }
});

// 4. Gunakan Port Dinamis untuk Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
