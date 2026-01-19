const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Разрешаем использование .wasm файлов для SQLite в браузере
config.resolver.assetExts.push('wasm');

module.exports = config;