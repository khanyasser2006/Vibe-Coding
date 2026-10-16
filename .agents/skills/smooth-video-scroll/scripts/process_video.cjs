const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findFfmpegExe(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const res = findFfmpegExe(fullPath);
        if (res) return res;
      } else if (entry.name.toLowerCase() === 'ffmpeg.exe') {
        return fullPath;
      }
    }
  } catch(e) {}
  return null;
}

function getFfmpegPath() {
  // 1. Check local node_modules
  const localStatic = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
  if (fs.existsSync(localStatic)) return localStatic;

  // 2. Check AppData WinGet temp
  const appData = process.env.LOCALAPPDATA || 'C:\\Users\\123\\AppData\\Local';
  const winGetDir = path.join(appData, 'Temp', 'WinGet');
  if (fs.existsSync(winGetDir)) {
    const found = findFfmpegExe(winGetDir);
    if (found) return found;
  }

  // 3. Fallback to system PATH
  return 'ffmpeg';
}

function processVideo(inputVideoPath, targetFrames = 600) {
  const projectRoot = process.cwd();
  const videoFile = inputVideoPath ? path.resolve(inputVideoPath) : findVideoFile(projectRoot);
  
  if (!videoFile || !fs.existsSync(videoFile)) {
    console.error('Error: No valid video file found.');
    process.exit(1);
  }

  const outputDir = path.join(projectRoot, 'public', 'cabinet_frames_600fps');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ffmpeg = getFfmpegPath();
  console.log(`[smooth-video-scroll] Processing video: ${videoFile}`);
  console.log(`[smooth-video-scroll] Target frames: ${targetFrames}`);
  console.log(`[smooth-video-scroll] Using FFmpeg: ${ffmpeg}`);

  let duration = 10;
  try {
    const probe = execSync(`"${ffmpeg}" -i "${videoFile}" 2>&1`, { encoding: 'utf8' });
    const match = probe.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      duration = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3]);
    }
  } catch (e) {
    if (e.output && e.output[1]) {
      const match = e.output[1].match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      if (match) {
        duration = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3]);
      }
    }
  }

  console.log(`[smooth-video-scroll] Video duration: ${duration}s`);
  const fps = targetFrames / duration;

  console.log(`[smooth-video-scroll] Running AI optical flow motion interpolation...`);
  const cmd = `"${ffmpeg}" -y -i "${videoFile}" -vf "minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir" -q:v 2 "${path.join(outputDir, 'frame_%03d.jpg')}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.log('[smooth-video-scroll] Optical flow fallback to blend mode...');
    const fallbackCmd = `"${ffmpeg}" -y -i "${videoFile}" -vf "minterpolate=fps=${fps}:mi_mode=blend" -q:v 2 "${path.join(outputDir, 'frame_%03d.jpg')}"`;
    execSync(fallbackCmd, { stdio: 'inherit' });
  }

  const files = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    .sort();

  const manifestPath = path.join(projectRoot, 'src', 'components', 'frames.json');
  const manifestDir = path.dirname(manifestPath);
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2), 'utf8');
  console.log(`[smooth-video-scroll] Successfully generated ${files.length} frames & updated manifest!`);
}

function findVideoFile(dir) {
  const files = fs.readdirSync(dir);
  const mp4 = files.find(f => f.endsWith('.mp4') || f.endsWith('.webm'));
  return mp4 ? path.join(dir, mp4) : null;
}

const args = process.argv.slice(2);
processVideo(args[0], args[1] ? parseInt(args[1]) : 600);
