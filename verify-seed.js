const admin = require('firebase-admin');
require('dotenv').config();

// Create Firebase credentials from environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: 'default',
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: 'default',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'default'
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

async function verifyData() {
  try {
    const noticesSnap = await db.collection('notices').get();
    const blogsSnap = await db.collection('blogPosts').get();

    console.log(`\n✓ Notices in database: ${noticesSnap.size}`);
    noticesSnap.docs.slice(0, 3).forEach(doc => {
      console.log(`  - ${doc.data().title} (urgent: ${doc.data().isUrgent})`);
    });

    console.log(`\n✓ Blog posts in database: ${blogsSnap.size}`);
    blogsSnap.docs.slice(0, 3).forEach(doc => {
      console.log(`  - ${doc.data().title} (category: ${doc.data().category})`);
    });

    // Check for urgent notices
    const urgentCount = noticesSnap.docs.filter(d => d.data().isUrgent).length;
    console.log(`\n✓ Urgent notices: ${urgentCount}`);

    // Check for tips
    const tipsCount = blogsSnap.docs.filter(d => d.data().category === 'tips').length;
    console.log(`✓ Blog tips: ${tipsCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

verifyData();
