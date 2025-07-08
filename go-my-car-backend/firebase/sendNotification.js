const admin = require('./firebase');

async function sendNotification(token, title, body, data = {}) {
  console.log("token", token)
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
