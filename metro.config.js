const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Esto repara el error de lectura de las librerías 3D (@react-three/drei / three)
config.resolver.sourceExts.push('cjs', 'mjs');

module.exports = config;