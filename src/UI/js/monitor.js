const path = require("path");
const osutils = require("node-os-utils");
const { ipcRenderer } = require("electron");

const POLLING_RATE = 2;
let CPU_THRESHOLD;
let ALERT_FREQUENCY;

ipcRenderer.on("settings:get", (e, settings) => {
  CPU_THRESHOLD = +settings.CPU_THRESHOLD;
  ALERT_FREQUENCY = +settings.ALERT_FREQUENCY;
});

const cpu = osutils.cpu;
const mem = osutils.mem;

const secondstoDhms = (seconds) => {
  seconds = +seconds;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d, ${h}h, ${m}m, ${s}s,`;
};

const notify = (opts) => {
  new Notification(opts.title, opts);
};

const runNotify = (frequency) => {
  if (!localStorage.getItem("LAST_NOTIFY")) {
    localStorage.setItem("LAST_NOTIFY", +new Date());
    return true;
  }

  const notifyTime = new Date(parseInt(localStorage.getItem("LAST_NOTIFY")));
  const now = new Date();
  const delta = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(delta / (1000 * 60));

  if (minutesPassed > frequency) {
    return true;
  } else {
    return false;
  }
};

// Statics
document.getElementById("cpu-model").innerText = cpu.model();
document.getElementById("comp-name").innerText = osutils.os.hostname();
document.getElementById(
  "os"
).innerText = `${osutils.os.type()} ${osutils.os.arch()}`;
mem
  .info()
  .then(
    (data) => (document.getElementById("mem-total").innerText = data.totalMemMb)
  );

// On Interval (2 secs)
setInterval(() => {
  cpu.usage().then((data) => {
    document.getElementById("cpu-usage").innerText = data + "%";
    document.getElementById("cpu-progress").style.width = data + "%";

    if (data > CPU_THRESHOLD) {
      document.getElementById("cpu-progress").style.background = "red";
    } else {
      document.getElementById("cpu-progress").style.background = "#30c88b";
    }

    if (data > CPU_THRESHOLD && runNotify(ALERT_FREQUENCY)) {
      notify({
        title: "CPU Overload",
        body: `CPU is over ${CPU_THRESHOLD}%`,
        icon: path.join(__dirname, "img", "icon.png"),
      });

      localStorage.setItem("LAST_NOTIFY", +new Date());
    }
  });

  cpu.free().then((data) => {
    document.getElementById("cpu-free").innerText = data + "%";
  });

  document.getElementById("sys-uptime").innerText = secondstoDhms(
    osutils.os.uptime()
  );
}, POLLING_RATE * 1000);
