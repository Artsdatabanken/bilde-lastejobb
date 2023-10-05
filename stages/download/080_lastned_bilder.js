const path = require("path");
const { log, io } = require("lastejobb");
const fetch = require("node-fetch");

var kilder = io.lesDatafil("mediakilde.json").items;

const queue = [];

kilder.forEach(mediakilde => {
  queue.push({ kode: mediakilde.kode, mediakilde: mediakilde });
});
log.info("Download queue items: " + queue.length);

processQueue();

async function processQueue() {
  if (queue.length <= 0) return;
  const pending = queue.pop();
  await download(pending.kode, pending.mediakilde);
  processQueue();
}

async function download(kode, mediakilde) {
  if (!mediakilde) return;
  for (var key of Object.keys(mediakilde)) {
    let urls = mediakilde[key];
    if (!Array.isArray(urls)) urls = [urls];
    for (var url of urls) {
      if (url.indexOf("http") !== 0) continue;
      const ext = path.extname(url);
      const dir = path.join("data/" + key + "/");
      const fn = dir + kode + ext;
      if (io.fileExists(fn)) continue;
      io.mkdir(dir);
      await downloadBinary(url, fn);
    }
  }
}

async function downloadBinary(url, targetFile) {
  log.info("Download binary " + url);
  const response = await fetch(url).then();
  const buffer = await response.buffer();
  io.writeBinary(targetFile, buffer);
  await sleep(1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
