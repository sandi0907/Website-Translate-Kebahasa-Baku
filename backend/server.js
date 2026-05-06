const express = require('express');
const cors = require('cors');
const { queryAI } = require('./aiService');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Fitur 1: Perbaiki Kalimat
app.post('/api/perbaiki', async (req, res) => {
    const { text } = req.body;
    const prompt = `Perbaiki kalimat berikut menjadi Bahasa Indonesia baku, formal, dan benar secara tata bahasa. Tampilkan hasil perbaikan saja: "${text}"`;
    const result = await queryAI(prompt);
    res.json({ result });
});

// Endpoint Fitur 2: Arti Kata (Tokenisasi Sederhana)
const axios = require('axios');
// Pastikan library axios sudah terinstall

app.post('/api/kamus', async (req, res) => {
    const { word } = req.body;
    
    if (!word) {
        return res.status(400).json({ error: "Kata tidak boleh kosong" });
    }

    try {
        // 1. Panggil API Heru Sahat (Unofficial KBBI)
        // URL: https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=kata
        const kbbiRes = await axios.get(`https://kbbi.kemendikdasmen.go.id${encodeURIComponent(word)}`);
        
        // Cek apakah data ditemukan
        if (kbbiRes.data && kbbiRes.data.data && kbbiRes.data.data.length > 0) {
            // Mengambil semua arti jika ada lebih dari satu
            const artiList = kbbiRes.data.data.map(item => item.lema + ": " + item.arti.join("; "));
            
            return res.json({ 
                definition: artiList.join("\n\n"),
                source: "KBBI (Heru Sahat API)"
            });
        } else {
            throw new Error("Kata tidak ditemukan di KBBI");
        }

    } catch (error) {
        console.log("KBBI tidak ditemukan, beralih ke AI...");
        
        // 2. Fallback ke AI jika KBBI tidak menemukan kata tersebut
        try {
            const aiPrompt = `Berikan definisi singkat dan formal dalam Bahasa Indonesia untuk kata: "${word}". Jika itu bahasa tidak baku, berikan bentuk bakunya.`;
            // Asumsi fungsi queryAI sudah kamu buat di aiService.js
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

app.listen(3000, () => console.log('Server running on port 3000'));