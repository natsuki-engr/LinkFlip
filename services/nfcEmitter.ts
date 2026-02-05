import { Platform, NativeModules } from 'react-native';

let currentUrl: string | null = null;
let session: any = null;
let isEnabled = false;
let isHardwareAvailable: boolean | null = null;
let isEmitting = false;
let hceModule: any = null;

// Check if the native HCE module is linked (not available in Expo Go)
function isNativeModuleAvailable(): boolean {
  return Platform.OS === 'android' && NativeModules.Hce != null;
}

function getHceModule(): any {
  if (hceModule) return hceModule;
  if (!isNativeModuleAvailable()) return null;
  try {
    hceModule = require('react-native-hce');
    return hceModule;
  } catch {
    return null;
  }
}

export function setCurrentUrl(url: string | null): void {
  currentUrl = url;
  if (isEnabled) {
    if (url) {
      startEmitting(url);
    } else {
      stopEmitting();
    }
  }
}

export async function setNfcEnabled(enabled: boolean): Promise<void> {
  isEnabled = enabled;
  if (enabled && currentUrl) {
    await startEmitting(currentUrl);
  } else {
    await stopEmitting();
  }
}

export async function checkNfcAvailable(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  if (isHardwareAvailable !== null) return isHardwareAvailable;
  if (!isNativeModuleAvailable()) {
    isHardwareAvailable = false;
    return false;
  }
  try {
    const mod = getHceModule();
    if (!mod) {
      isHardwareAvailable = false;
      return false;
    }
    session = await mod.HCESession.getInstance();
    isHardwareAvailable = true;
  } catch {
    isHardwareAvailable = false;
  }
  return isHardwareAvailable;
}

async function startEmitting(url: string): Promise<void> {
  if (!isNativeModuleAvailable()) return;
  try {
    const mod = getHceModule();
    if (!mod) return;
    if (!session) {
      session = await mod.HCESession.getInstance();
    }
    if (isEmitting) {
      await session.setEnabled(false);
    }
    const tag = new mod.NFCTagType4({
      type: mod.NFCTagType4NDEFContentType.URL,
      content: url,
      writable: false,
    });
    session.setApplication(tag);
    await session.setEnabled(true);
    isEmitting = true;
  } catch (error) {
    console.error('NFC HCE start failed:', error);
  }
}

async function stopEmitting(): Promise<void> {
  if (!isNativeModuleAvailable() || !session || !isEmitting) return;
  try {
    await session.setEnabled(false);
    isEmitting = false;
  } catch (error) {
    console.error('NFC HCE stop failed:', error);
  }
}
