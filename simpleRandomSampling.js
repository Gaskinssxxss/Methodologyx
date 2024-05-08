const readline = require("readline");
const fs = require("fs");
const csv = require("csv-parser");
const { table } = require("table");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function bacaPopulasiDariCSV(lokasiFile, namaKolom, panggilanKembali) {
  const populasi = [];

  fs.createReadStream(lokasiFile)
    .pipe(csv())
    .on("data", function (baris) {
      const nilaiGabungan = namaKolom
        .map(function (nama) {
          return baris[nama];
        })
        .join(" ");
      populasi.push(nilaiGabungan.split(" "));
    })
    .on("end", function () {
      panggilanKembali(populasi);
    });
}

function tambahBaris(data) {
  const panjangBarisMaks = Math.max.apply(
    null,
    data.map(function (baris) {
      return baris.length;
    })
  );
  return data.map(function (baris) {
    const selisih = panjangBarisMaks - baris.length;
    return baris.concat(Array(selisih).fill("NoNe"));
  });
}

function samplingAcakSederhana(populasi, ukuranSampel) {
  const itemSampel = [];
  const ukuranPopulasi = populasi.length;

  if (ukuranSampel > ukuranPopulasi) {
    throw new Error("Ukuran sampel lebih besar dari ukuran populasi.");
  }

  const populasiTemp = populasi.slice();

  for (let i = 0; i < ukuranSampel; i++) {
    const indeksAcak = Math.floor(Math.random() * populasiTemp.length);
    const itemTerpilih = populasiTemp[indeksAcak];

    itemSampel.push(itemTerpilih);
    populasiTemp.splice(indeksAcak, 1);
  }

  return itemSampel;
}

function tampilkanData(ukuranSampel, jumlahGenerate) {
  const lokasiFile = "./sampel_data.csv";
  const namaKolom = ["Nama", "Pekerjaan"];
  const generates = [];

  for (let i = 0; i < jumlahGenerate; i++) {
    console.log(`\nGenerate ke-${i + 1}:`);
    bacaPopulasiDariCSV(lokasiFile, namaKolom, function (populasi) {
      const populasiDitambah = tambahBaris(populasi);

      const sampelPopulasi = samplingAcakSederhana(
        populasiDitambah,
        ukuranSampel
      );

      const sampelTable = sampelPopulasi.map((row) =>
        row.map((cell) => cell || "-")
      );
      generates.push(sampelTable);
      console.log("\nSampel:");
      console.log(table(sampelTable));

      if (i === jumlahGenerate - 1) {
        rl.question(
          "Pilih sampel data pada generate ke berapa (1 - " +
            jumlahGenerate +
            "): ",
          (generateKe) => {
            if (
              !isNaN(generateKe) &&
              parseInt(generateKe) > 0 &&
              parseInt(generateKe) <= jumlahGenerate
            ) {
              console.log(`\nSampel dari generate ke-${generateKe}:`);
              console.log(table(generates[parseInt(generateKe) - 1]));
            } else {
              console.log("Input tidak valid.");
            }
            mainLoop();
          }
        );
      }
    });
  }
}

function mainLoop() {
  rl.question(
    "Tekan X untuk mengakhiri atau tekan tombol Enter untuk menampilkan data: ",
    (answer) => {
      if (answer.toLowerCase() === "x") {
        rl.close();
      } else {
        rl.question("Masukkan jumlah generate: ", (jumlahGenerate) => {
          tampilkanData(19, parseInt(jumlahGenerate));
        });
      }
    }
  );
}

mainLoop();
