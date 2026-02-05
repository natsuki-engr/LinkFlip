const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withNfcHce(config) {
  // Add NFC permission and HCE service to AndroidManifest
  config = withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;

    // Add <uses-permission android:name="android.permission.NFC" />
    if (!manifest['uses-permission']) manifest['uses-permission'] = [];
    const hasNfcPerm = manifest['uses-permission'].some(
      (p) => p.$?.['android:name'] === 'android.permission.NFC'
    );
    if (!hasNfcPerm) {
      manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.NFC' },
      });
    }

    // Add <uses-feature android:name="android.hardware.nfc.hce" android:required="false" />
    if (!manifest['uses-feature']) manifest['uses-feature'] = [];
    const hasHceFeature = manifest['uses-feature'].some(
      (f) => f.$?.['android:name'] === 'android.hardware.nfc.hce'
    );
    if (!hasHceFeature) {
      manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.nfc.hce',
          'android:required': 'false',
        },
      });
    }

    // Add HCE service to application
    const app = manifest.application?.[0];
    if (app) {
      if (!app.service) app.service = [];
      const hasService = app.service.some(
        (s) => s.$?.['android:name'] === 'com.reactnativehce.services.CardService'
      );
      if (!hasService) {
        app.service.push({
          $: {
            'android:name': 'com.reactnativehce.services.CardService',
            'android:exported': 'true',
            'android:enabled': 'false',
            'android:permission': 'android.permission.BIND_NFC_SERVICE',
          },
          'intent-filter': [
            {
              action: [
                {
                  $: {
                    'android:name':
                      'android.nfc.cardemulation.action.HOST_APDU_SERVICE',
                  },
                },
              ],
              category: [
                { $: { 'android:name': 'android.intent.category.DEFAULT' } },
              ],
            },
          ],
          'meta-data': [
            {
              $: {
                'android:name':
                  'android.nfc.cardemulation.host_apdu_service',
                'android:resource': '@xml/aid_list',
              },
            },
          ],
        });
      }
    }

    return config;
  });

  // Create aid_list.xml resource file
  config = withDangerousMod(config, [
    'android',
    (config) => {
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'xml'
      );
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, 'aid_list.xml'),
        `<host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/app_name"
    android:requireDeviceUnlock="false">
  <aid-group android:category="other"
      android:description="@string/app_name">
    <aid-filter android:name="D2760000850101" />
  </aid-group>
</host-apdu-service>`
      );
      return config;
    },
  ]);

  return config;
}

module.exports = withNfcHce;
