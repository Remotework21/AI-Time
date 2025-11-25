// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');
const { db, admin } = require('./firebase/firebase');

// ==================== 🔥 Import Firebase Functions ====================
const {
  getAllNews,
  getNewsById,
  getNewsByCategory,
  saveNewsToFirebase,
  cleanOldNews,
  deactivateNews
} = require('./firebase/firebase');

// ==================== 🧠 Groq SDK for AI News Generation ====================
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ==================== ⚙️ Express Setup ====================
const app = express();
app.use(cors());
app.use(express.json());

// ==================== 🤖 AI News Generator ====================

/**
 * Fetch AI-generated news using Groq's Llama 3.1 model
 * @returns {Promise<Array>} Array of 5 AI-generated news items
 */
async function fetchAINews() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `أنت خبير في أخبار **الذكاء الاصطناعي فقط**. مهمتك إنشاء 5 أخبار واقعية ومحدَّثة اليوم، **جميعها في مجال الذكاء الاصطناعي حصراً**.

✅ شروط صارمة:
- لا تكتب أي خبر خارج مجال الذكاء الاصطناعي (مثل سياسة، رياضة، اقتصاد عام).
- كل خبر يجب أن ينتمي لفئة واحدة فقط من الفئات التالية:
  • "تقنية" — نماذج، أدوات، منصات، برمجة
  • "نصائح" — أفضل ممارسات، برومبت إنجنيرينج، أدوات للمطورين
  • "أعمال" — استثمارات، شركات، نماذج أعمال، سوق عمل
  • "أبحاث" — أوراق بحثية، اكتشافات أكاديمية، جامعات
  • "فعاليات" — مؤتمرات، ورش، مسابقات، ويبنارات
  • "تعليم" — دورات، شهادات، كتب، تدريب
  • "صحة" — تطبيقات طبية، تشخيص، أبحاث صحية بالذكاء الاصطناعي

✅ الهيكل المطلوب (JSON فقط، بدون أي نص خارج JSON):
{
  "news": [
    {
      "title": "عنوان جذاب، لا يتجاوز 80 حرفاً، بلغة عربية فصيحة",
      "summary": "ملخص دقيق (100–150 كلمة)، يشرح الخبر بوضوح",
      "category": "إحدى الفئات السبع أعلاه — كلمة واحدة فقط",
      "importance": "عالي|متوسط|منخفض",
      "date": "YYYY-MM-DD"
    }
  ]
}`
        },
        {
          role: "user",
          content: "أعطني أهم 5 أخبار في الذكاء الاصطناعي لليوم. لا تكتب أي شيء خارج JSON."
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    let raw = response.choices[0].message.content.trim();

    // Clean ```json wrapper if present
    if (raw.startsWith('```')) {
      const start = raw.indexOf('\n') + 1;
      const end = raw.lastIndexOf('```');
      raw = raw.substring(start, end).trim();
    }

    const parsed = JSON.parse(raw);
    
    if (!parsed.news || !Array.isArray(parsed.news)) {
      throw new Error('Invalid news array format from AI');
    }

    console.log(`🤖 تم توليد ${parsed.news.length} أخبار بواسطة AI`);
    return parsed.news;
    
  } catch (error) {
    console.error('❌ خطأ في توليد الأخبار من AI:', error.message);
    throw error;
  }
}

/**
 * Update daily news: fetch from AI and save to Firebase
 */
async function updateDailyNews() {
  try {
    console.log('🔄 بدء تحديث الأخبار اليومية...');
    
    const news = await fetchAINews();
    await saveNewsToFirebase(news);
    
    console.log(`🎉 تم تحديث ${news.length} أخبار بنجاح`);
    return { success: true, count: news.length };
    
  } catch (error) {
    console.error('❌ فشل updateDailyNews:', error.message);
    throw error;
  }
}

// ==================== 🌐 API Endpoints ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'السيرفر يعمل بشكل صحيح',
    timestamp: new Date().toISOString() 
  });
});

/**
 * Get all news with optional limit
 * Query: ?limit=20
 */
app.get('/api/news', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const news = await getAllNews(limit);
    
    res.json({ 
      success: true, 
      count: news.length,
      news 
    });
  } catch (error) {
    console.error('❌ خطأ في endpoint /api/news:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل جلب الأخبار',
      details: error.message 
    });
  }
});

/**
 * Get single news item by ID
 * Path: /api/news/:id
 */
app.get('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const news = await getNewsById(id);
    
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        error: 'الخبر غير موجود' 
      });
    }
    
    res.json({ success: true, news });
  } catch (error) {
    console.error('❌ خطأ في جلب الخبر:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل جلب الخبر',
      details: error.message 
    });
  }
});

/**
 * Get news by category
 * Path: /api/news/category/:category
 * Query: ?limit=10
 */
app.get('/api/news/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const news = await getNewsByCategory(category, limit);
    
    res.json({ 
      success: true, 
      category,
      count: news.length,
      news 
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الأخبار حسب الفئة:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل جلب الأخبار حسب الفئة',
      details: error.message 
    });
  }
});

/**
 * Manually trigger news update
 * POST /api/news/update
 */
app.post('/api/news/update', async (req, res) => {
  try {
    const result = await updateDailyNews();
    res.json({ 
      success: true, 
      message: '✅ تم تحديث الأخبار بنجاح',
      ...result 
    });
  } catch (error) {
    console.error('❌ خطأ في تحديث الأخبار:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل تحديث الأخبار',
      details: error.message 
    });
  }
});

/**
 * Clean old news (older than 30 days)
 * POST /api/news/clean
 */
app.post('/api/news/clean', async (req, res) => {
  try {
    const result = await cleanOldNews();
    res.json({ 
      success: true, 
      message: '✅ تم تنظيف الأخبار القديمة',
      ...result 
    });
  } catch (error) {
    console.error('❌ خطأ في تنظيف الأخبار:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل تنظيف الأخبار القديمة',
      details: error.message 
    });
  }
});

/**
 * Deactivate a news item (soft delete)
 * DELETE /api/news/:id
 */
app.delete('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deactivateNews(id);
    
    res.json({ 
      success: true, 
      message: '✅ تم إلغاء تفعيل الخبر' 
    });
  } catch (error) {
    console.error('❌ خطأ في إلغاء تفعيل الخبر:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل إلغاء تفعيل الخبر',
      details: error.message 
    });
  }
});

// ==================== ⏰ Scheduled Tasks (Optional) ====================

/**
 * Schedule automatic daily news update at 6:00 AM
 * Uncomment to enable
 */
/*
cron.schedule('0 6 * * *', async () => {
  console.log('⏰ تشغيل التحديث التلقائي للأخبار - 6:00 صباحاً');
  try {
    await updateDailyNews();
  } catch (error) {
    console.error('❌ فشل التحديث التلقائي:', error.message);
  }
});
*/

/**
 * Schedule automatic cleanup every Sunday at 2:00 AM
 * Uncomment to enable
 */
/*
cron.schedule('0 2 * * 0', async () => {
  console.log('⏰ تشغيل التنظيف التلقائي - 2:00 صباحاً الأحد');
  try {
    await cleanOldNews();
  } catch (error) {
    console.error('❌ فشل التنظيف التلقائي:', error.message);
  }
});
*/

// ==================== ✉️ Subscription Endpoint (ADD THIS) ====================

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // 🔹 Validate email
    if (!email || typeof email !== 'string' || !email.trim().includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني مطلوب ويجب أن يحتوي على @'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const subscribersRef = db.collection('subscribers');

    // 🔹 Check for duplicates (active subscribers only)
    const existing = await subscribersRef
      .where('email', '==', cleanEmail)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.json({
        success: true,
        message: '✅ أنت مشترك مسبقًا'
      });
    }

    // 🔹 Save to Firebase
    await subscribersRef.add({
      email: cleanEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      source: 'website_form' // optional tracking
    });

    console.log(`✅ اشتراك جديد: ${cleanEmail}`);

    // 🔹 Trigger n8n webhook (if configured)
    const webhookUrl = process.env.N8N_SUBSCRIBE_WEBHOOK;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      }).catch(err => {
        console.warn('⚠️ n8n webhook failed:', err.message);
      });
    }

    // ✅ Success response
    res.json({
      success: true,
      message: 'تم الاشتراك بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في /api/subscribe:', error);
    res.status(500).json({
      success: false,
      error: 'فشل حفظ الاشتراك',
      details: error.message
    });
  }
});

// ==================== 👥 Get All Active Subscribers ====================
/**
 * Get all active subscribers' emails
 * GET /api/subscribers
 */
 app.get('/api/subscribers', async (req, res) => {
  try {
    const snapshot = await db.collection('subscribers')
      .where('isActive', '==', true)
      .select('email') // only fetch email (efficient)
      .get();

    const emails = snapshot.docs.map(doc => doc.data().email);
    
    res.json({ 
      success: true, 
      count: emails.length,
      emails 
    });
  } catch (error) {
    console.error('❌ خطأ في جلب المشتركين:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'فشل جلب قائمة المشتركين',
      details: error.message 
    });
  }
});

// ==================== 🚀 Start Server ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`
╔════════════════════════════════════════╗
║   ✅ السيرفر يعمل على المنفذ ${PORT}      ║
║   🔥 Firebase متصل                     ║
║   🤖 Groq AI جاهز                      ║
║   📰 API endpoints جاهزة               ║
╚════════════════════════════════════════╝
  `);

  // Check if database has news, if not fetch first batch
  try {
    const existing = await getAllNews(1);
    
    if (existing.length === 0) {
      console.log('⚠️ قاعدة البيانات فارغة - جلب الدفعة الأولى من الأخبار...');
      await updateDailyNews();
    } else {
      console.log(`ℹ️ يوجد ${existing.length} خبر في قاعدة البيانات`);
    }
  } catch (error) {
    console.warn('⚠️ فشل التحقق من قاعدة البيانات:', error.message);
  }
});

// ==================== 🛑 Error Handling ====================
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});