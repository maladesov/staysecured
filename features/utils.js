function isJSON(item) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
}

function ResponseMessage(message = undefined, additionalData = {}) {
  return {
    message,
    ...additionalData,
  };
}

// Форматирование схем по их данным
function formatUser(userData) {
  if (typeof userData === 'string') return `(${userData})`;

  return `${userData.firstName} ${userData.lastName} (${userData._id})`;
}

function formatArticle(articleData) {
  if (typeof articleData === 'string') return `(${articleData})`;

  return `${articleData.header} (${articleData._id})`;
}

function formatUpload(uploadData) {
  if (typeof uploadData === 'string') return `(${uploadData})`;

  return `${uploadData.uploadKey}:${uploadData.filename} (${uploadData._id})`;
}

function parseProjection(projection) {
  let projectionArr;

  try {
    projectionArr = JSON.parse(projection);
  } catch (e) {
    return;
  }

  if (!Array.isArray(projectionArr)) return;

  let projectionObject = {};

  for (let key of projectionArr) {
    projectionObject[key] = 1;
  }

  return projectionObject;
}

module.exports = {
  isJSON,
  ResponseMessage,
  formatUser,
  formatArticle,
  formatUpload,
  parseProjection,
};
