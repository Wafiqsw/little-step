const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = {
  'mipmap-mdpi': { size: 48, round: 48 },
  'mipmap-hdpi': { size: 72, round: 72 },
  'mipmap-xhdpi': { size: 96, round: 96 },
  'mipmap-xxhdpi': { size: 144, round: 144 },
  'mipmap-xxxhdpi': { size: 192, round: 192 }
};

const sourceIcon = path.join(__dirname, 'assets', 'icon.png');
const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('Starting icon generation...');

  for (const [folder, sizes] of Object.entries(iconSizes)) {
    const folderPath = path.join(androidResPath, folder);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate square icon
    const squareIconPath = path.join(folderPath, 'ic_launcher.png');
    await sharp(sourceIcon)
      .resize(sizes.size, sizes.size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(squareIconPath);
    console.log(`Generated: ${squareIconPath}`);

    // Generate round icon
    const roundIconPath = path.join(folderPath, 'ic_launcher_round.png');
    const roundMask = Buffer.from(
      `<svg width="${sizes.round}" height="${sizes.round}">
        <circle cx="${sizes.round / 2}" cy="${sizes.round / 2}" r="${sizes.round / 2}" fill="white"/>
      </svg>`
    );

    await sharp(sourceIcon)
      .resize(sizes.round, sizes.round, { fit: 'cover' })
      .composite([{
        input: roundMask,
        blend: 'dest-in'
      }])
      .png()
      .toFile(roundIconPath);
    console.log(`Generated: ${roundIconPath}`);
  }

  console.log('Icon generation completed successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
