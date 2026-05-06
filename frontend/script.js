const questions = [
    { q: "Manakah kata yang baku?", a: "Aktivitas", options: ["Aktifitas", "Aktivitas", "Aktifitaz", "Aktifiti"], correct: 1 },
    // tambahkan 10 soal lainnya...
];

let currentScore = 0;
function checkAnswer(selectedIdx, correctIdx) {
    if(selectedIdx === correctIdx) currentScore += 10;
    // Lanjut ke soal berikutnya...
}