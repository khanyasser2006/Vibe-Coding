const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const heroVideo = path.join(root, 'Creating_ice_cream_commercial_video_20260910194925.mp4');
const peachVideo = path.join(root, 'Creating_peach_ice_cream_commercial_20260910200310.mp4');

const heroOutDir = path.join(root, 'public', 'hero_frames');
const peachOutDir = path.join(root, 'public', 'peach_frames');
const assetsOutDir = path.join(root, 'public', 'assets');
const dataOutDir = path.join(root, 'src', 'data');

[heroOutDir, peachOutDir, assetsOutDir, dataOutDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Copy and standardize the images
const imageMap = [
  { src: 'ChatGPT Image Sep 10, 2026, 07_25_07 PM.png', dest: 'cine-cone-hero.png' },
  { src: 'ChatGPT Image Sep 10, 2026, 08_03_56 PM.png', dest: 'cine-billboard-sunset.png' },
  { src: 'ChatGPT Image Sep 10, 2026, 08_04_01 PM.png', dest: 'cine-billboard-storefront.png' },
  { src: 'ChatGPT Image Sep 10, 2026, 08_04_09 PM.png', dest: 'cine-bowl-signature.png' }
];

imageMap.forEach(({ src, dest }) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(assetsOutDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied image: ${src} -> ${dest}`);
  }
});

function extractFrames(videoPath, outDir, frameCount, prefix) {
  console.log(`Extracting ${frameCount} frames for ${path.basename(videoPath)} into ${outDir}...`);
  if (fs.existsSync(outDir)) {
    fs.readdirSync(outDir).forEach(f => {
      if (f.endsWith('.jpg') || f.endsWith('.png')) {
        try { fs.unlinkSync(path.join(outDir, f)); } catch(e) {}
      }
    });
  }

  const fps = frameCount / 10;
  const outPattern = path.join(outDir, `${prefix}_%04d.jpg`);
  
  // Use scale to 1280:720 and minterpolate for smooth optical flow
  const cmd = `ffmpeg -y -i "${videoPath}" -vf "scale=1280:720,minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir" -q:v 3 "${outPattern}"`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.log(`Optical flow mci mode failed or slow, using minterpolate blend mode...`);
    const fallbackCmd = `ffmpeg -y -i "${videoPath}" -vf "scale=1280:720,minterpolate=fps=${fps}:mi_mode=blend" -q:v 3 "${outPattern}"`;
    execSync(fallbackCmd, { stdio: 'inherit' });
  }

  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`Generated ${files.length} frames for ${prefix}`);
  return files;
}

const heroFrames = extractFrames(heroVideo, heroOutDir, 300, 'hero');
const peachFrames = extractFrames(peachVideo, peachOutDir, 250, 'peach');

fs.writeFileSync(path.join(dataOutDir, 'hero_frames.json'), JSON.stringify(heroFrames, null, 2), 'utf8');
fs.writeFileSync(path.join(dataOutDir, 'peach_frames.json'), JSON.stringify(peachFrames, null, 2), 'utf8');

console.log('All asset extractions & manifests complete!');
