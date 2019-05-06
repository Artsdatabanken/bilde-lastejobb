const path = require("path");
const config = require("./config");
const { http, log, io } = require("lastejobb");
const fetch = require("node-fetch");

var data = io.readJson(config.datakilde.metabase);

const queue = [];

Object.keys(data).forEach(kode => {
  const node = data[kode];
  const mediakilde = node.mediakilde;
  if (mediakilde) queue.push({ kode: node.kode, mediakilde: mediakilde });
});
log.info("Download queue items: " + queue.length);

processQueue();

async function processQueue() {
  const pending = queue.pop();
  log.info("Download " + pending.kode);
  await download(pending.kode, pending.mediakilde);
  await sleep(9000);
  if (queue.length > 0) processQueue();
}

function download(kode, mediakilde) {
  if (!mediakilde) return;
  Object.keys(mediakilde).forEach(key => {
    let urls = mediakilde[key];
    if (!urls) debugger;
    if (!Array.isArray(urls)) urls = [urls];
    urls.forEach(url => {
      //      const ext = url.endsWith(".png") ? ".png" : ".jpg";
      const ext = path.extname(url);
      const dir = path.join(config.imagePath.source, key + "/");
      io.mkdir(dir);
      const fn = dir + kode + ext;
      if (io.fileExists(fn)) return;
      downloadBinary(url, fn);
    });
  });
}

async function downloadBinary(url, targetFile) {
  log.info("Download binary " + url);
  const response = await fetch(url).then();
  const buffer = await response.buffer();
  io.writeBinary(targetFile, buffer);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
