// backend/firebase/firebase.js
const admin = require('firebase-admin');

// ==================== 🔥 Firebase Initialization ====================
// Initialize only once to prevent "app already exists" error
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase initialized successfully');
}

const db = admin.firestore();

// ==================== 📰 News Functions ====================

/**
 * Get all active news with pagination
 * @param {number} limit - Maximum number of news items to return
 * @returns {Promise<Array>} Array of news objects
 */
async function getAllNews(limit = 20) {
  try {
    const newsSnapshot = await db.collection('ai_news')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const news = [];
    newsSnapshot.forEach(doc => {
      news.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`✅ جلب ${news.length} خبر من Firebase`);
    return news;
  } catch (error) {
    console.error('❌ خطأ في جلب جميع الأخبار:', error.message);
    throw error;
  }
}

/**
 * Get a single news item by ID
 * @param {string} newsId - News document ID
 * @returns {Promise<Object|null>} News object or null if not found
 */
async function getNewsById(newsId) {
  try {
    const doc = await db.collection('ai_news').doc(newsId).get();
    
    if (!doc.exists) {
      console.log(`⚠️ الخبر ${newsId} غير موجود`);
      return null;
    }
    
    const news = { id: doc.id, ...doc.data() };
    console.log(`✅ تم جلب الخبر: ${newsId}`);
    return news;
  } catch (error) {
    console.error('❌ خطأ في جلب الخبر:', error.message);
    throw error;
  }
}

/**
 * Get news by category
 * @param {string} category - Category name (تقنية، نصائح، أعمال، etc.)
 * @param {number} limit - Maximum number of news items
 * @returns {Promise<Array>} Array of news in the specified category
 */
async function getNewsByCategory(category, limit = 10) {
  try {
    const cleanCategory = (typeof category === 'string' ? category.trim() : '');
    
    if (!cleanCategory) {
      throw new Error('الفئة فارغة أو غير صالحة');
    }
    
    const snapshot = await db.collection('ai_news')
      .where('isActive', '==', true)
      .where('category', '==', cleanCategory)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const news = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log(`✅ جلب ${news.length} خبر من فئة "${cleanCategory}"`);
    return news;
  } catch (error) {
    console.error('❌ خطأ في جلب الأخبار حسب الفئة:', error.message);
    throw error;
  }
}

/**
 * Save multiple news items to Firebase in a batch
 * @param {Array} newsArray - Array of news objects to save
 * @returns {Promise<Object>} Success status
 */
async function saveNewsToFirebase(newsArray) {
  try {
    if (!Array.isArray(newsArray) || newsArray.length === 0) {
      throw new Error('مصفوفة الأخبار فارغة أو غير صالحة');
    }
    
    const batch = db.batch();
    const newsCollection = db.collection('ai_news');
    
    for (const newsItem of newsArray) {
      const docRef = newsCollection.doc();
      batch.set(docRef, {
        ...newsItem,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true
      });
    }
    
    await batch.commit();
    console.log(`✅ تم حفظ ${newsArray.length} خبر في Firebase`);
    
    return { success: true, count: newsArray.length };
  } catch (error) {
    console.error('❌ خطأ في حفظ الأخبار:', error.message);
    throw error;
  }
}

/**
 * Delete news older than 30 days
 * @returns {Promise<Object>} Number of deleted documents
 */
async function cleanOldNews() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const snapshot = await db.collection('ai_news')
      .where('createdAt', '<', thirtyDaysAgo)
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ لا توجد أخبار قديمة للحذف');
      return { success: true, deleted: 0 };
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ تم حذف ${snapshot.size} خبر قديم (أقدم من 30 يوم)`);
    
    return { success: true, deleted: snapshot.size };
  } catch (error) {
    console.error('❌ خطأ في تنظيف الأخبار القديمة:', error.message);
    throw error;
  }
}

/**
 * Deactivate a news item (soft delete)
 * @param {string} newsId - News document ID
 * @returns {Promise<Object>} Success status
 */
async function deactivateNews(newsId) {
  try {
    await db.collection('ai_news').doc(newsId).update({
      isActive: false,
      deactivatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ تم إلغاء تفعيل الخبر: ${newsId}`);
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إلغاء تفعيل الخبر:', error.message);
    throw error;
  }
}

// ==================== 📤 Exports ====================
module.exports = {
  db,
  admin,
  getAllNews,
  getNewsById,
  getNewsByCategory,
  saveNewsToFirebase,
  cleanOldNews,
  deactivateNews
};