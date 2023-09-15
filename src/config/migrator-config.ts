import fs from 'fs';
import  path from 'path';


function getConfig() {
  try {
    const configPath = path.resolve(__dirname, '../../migrator.json');
    const rawConfig = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(rawConfig);
  } catch (error) {
    console.error('Error loading configuration:', error);
    process.exit(1);
  }
}

export default getConfig