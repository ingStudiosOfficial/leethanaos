/* eslint-disable @typescript-eslint/no-explicit-any */
import { GPUDetect } from 'gpu-detect-js';
import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

function convertBatteryTime(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	return `${hours} hours, ${minutes} min remaining`;
}

export async function turtfetchCommand() {
	const cpu = parser.getCPU();
	const gpu = GPUDetect.getGPU();
	const engine = parser.getEngine();
	const browser = parser.getBrowser();
	const battery = await (navigator as any).getBattery();
	console.log('Battery:', battery);
	const locale = Intl.DateTimeFormat().resolvedOptions().locale;

	const result = `
leethana@web
------------
OS: leethanaOS 1.1.0
Host: ${browser.name} (${browser.version})
Kernel: ${engine.name} ${engine.version}
Shell: TurtShell 1.1.0
Display: ${window.screen.width}x${window.screen.height}
DE: TDE 1.1.0
WM: Turtwin
WM Theme: Material 3
Theme: Material 3 [Vue]
Icons: Material Symbols Outlined
Font: Google Sans Flex, Google Sans Code
Cursor: System Default
Terminal: Terminal 1.1.0
CPU: ${cpu.architecture}
GPU: ${gpu.vendor} ${gpu.model}
Memory: ${(navigator as any).deviceMemory} GiB
Battery: ${battery.level * 100}%${!battery.charging ? ` (${convertBatteryTime(battery.dischargingTime)})` : ''}${battery.charging && battery.level < 1 ? ` ${convertBatteryTime(battery.chargingTime)}` : ''} [${battery.charging ? 'AC Connected' : 'Discharging'}]
Locale: ${locale}.UTF-8
`;

	return result;
}
