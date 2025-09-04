// frontend/src/utils/asset.js
export const asset = (path) =>
  new URL(path, import.meta.env.BASE_URL).toString();
// usage: asset('images/fans.png') -> '/fix-daddy/images/fans.png' in prod, '/images/fans.png' locally
