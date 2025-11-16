// src/services/firebaseService.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// حفظ بيانات تسجيل الهدية
export const saveGiftRegistration = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, 'giftRegistrations'), {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'home_page',
      registeredAt: serverTimestamp(),
      status: 'new'
    });
    
    console.log('✅ تم الحفظ بنجاح! ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ خطأ في الحفظ:', error);
    throw error;
  }
};