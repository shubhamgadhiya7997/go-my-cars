const admin = require('./firebase');
const serviceAccount = require('./config.json');
async function sendNotification(token, title, body, data = {}) {
  console.log("token", serviceAccount)
  const message = {
    notification: { title, body },
    token,
    data, 
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}

module.exports = sendNotification;
