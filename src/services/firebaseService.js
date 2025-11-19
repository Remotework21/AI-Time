// src/services/firebaseService.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// دالة مساعدة لبناء الداتا المشتركة
const buildPayload = (data, defaultSource) => ({
  ...data,
  source: data.source || defaultSource,
  status: data.status || "new",
  registeredAt: serverTimestamp(),
});

// حفظ بيانات تسجيل الهدايا في giftRegistrations
export const saveGiftRegistration = async (formData) => {
  try {
    const payload = buildPayload(formData, "gifts_page");

    const docRef = await addDoc(collection(db, "giftRegistrations"), payload);

    console.log("✅ تم حفظ طلب هدية بنجاح! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ خطأ في حفظ طلب الهدية:", error);
    throw error;
  }
};

// حفظ بيانات تسجيل المنتجات في productsRegistrations
export const saveProductRegistration = async (formData) => {
  try {
    const payload = buildPayload(formData, "products_page");

    const docRef = await addDoc(
      collection(db, "productsRegistrations"),
      payload
    );

    console.log("✅ تم حفظ طلب منتج بنجاح! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ خطأ في حفظ طلب المنتج:", error);
    throw error;
  }
};
