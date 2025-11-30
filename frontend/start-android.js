const { execSync, spawn } = require("child_process");

function isEmulatorRunning() {
    const output = execSync("adb devices").toString();
    return output.includes("emulator");
}

function startEmulator() {
    console.log("🔄 Starting emulator...");

    // Abre o emulador do dispositivo android Pixel_8, se for alterar o dispositivo mude o nome

    spawn("cmd", ["/c", "start", "emulator -avd Pixel_8"]);
}

if (!isEmulatorRunning()) {
    startEmulator();
    console.log("⏳ Waiting for emulator to boot...");
    setTimeout(() => {
        execSync("npx expo start --android", { stdio: "inherit" });
    }, 25000); // aguarda 15 segundos para o emulador iniciar
} else {
    console.log("✅ Emulator already running.");
    execSync("npx expo start --android", { stdio: "inherit" });
}