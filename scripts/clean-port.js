import { execSync } from 'child_process';

const PORT = 3000;
try {
  if (process.platform === 'win32') {
    execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${PORT}') do taskkill /f /pid %a`, { stdio: 'ignore' });
  } else {
    execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: 'ignore' });
  }
} catch {
  // Silence error if no process is running on port 3000
}