const readline = require("readline");
const Table = require("cli-table");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tingkatKepercayaan = [80, 85, 90, 95, 99];
const marginOfErr = [0.01, 0.02, 0.03, 0.04, 0.05];

function doCalculateMaderfaker(populasi, tingkatKepercayaan, MOE) {
  const Z = indexKepercayaan(tingkatKepercayaan);

  const p = 0.5;
  const numerator = populasi * Math.pow(Z, 2) * p * (1 - p);
  const denominator =
    Math.pow(MOE, 2) * (populasi - 1) + Math.pow(Z, 2) * p * (1 - p);
  const Sample = numerator / denominator;

  return Math.ceil(Sample);
}

function indexKepercayaan(tingkatKepercayaan) {
  const ZScores = {
    80: 1.282,
    85: 1.44,
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };

  return ZScores[tingkatKepercayaan];
}

function promptUserForPopulationSize() {
  rl.question("Masukkan ukuran populasi: ", (populasi) => {
    calculateAndDisplaySampleSizes(parseInt(populasi));
  });
}

function calculateAndDisplaySampleSizes(populasi) {
  tingkatKepercayaan.forEach((newTingkatKercayaan) => {
    const table = new Table({
      head: [
        `Ukuran Sampel (Tingkat Kepercayaan ${newTingkatKercayaan}%)`,
        "Margin of Error (%)",
        "Jumlah Sample",
      ],
    });

    marginOfErr.forEach((MOE) => {
      const Sample = doCalculateMaderfaker(populasi, newTingkatKercayaan, MOE);
      table.push([populasi, MOE * 100, Sample]);
    });
    console.log(table.toString());
  });
  rl.close();
}

promptUserForPopulationSize();
