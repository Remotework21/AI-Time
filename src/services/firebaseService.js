// src/services/firebaseService.js
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

// 🟢 حفظ استفسارات صفحة الهوم في generalInquiries
export const saveGeneralInquiry = async (formData) => {
  try {
    const payload = buildPayload(formData, "home_inquiry");
    const docRef = await addDoc(collection(db, "generalInquiries"), payload);
    console.log("✅ تم إرسال الاستفسار! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ خطأ في إرسال الاستفسار:", error);
    throw error;
  }
};

// =============================================================================
// ✅ NEW: Validation & File Upload Utilities
// =============================================================================
const storage = getStorage();

// 🛡️ Saudi phone validation: must be 10 digits, start with 05
export const isValidSaudiPhone = (phone) => {
  const trimmed = phone?.trim();
  return trimmed && /^05[0-9]{8}$/.test(trimmed);
};

// 🛡️ Email validation (RFC 5322 simplified)
export const isValidEmail = (email) => {
  const trimmed = email?.trim();
  if (!trimmed) return false;
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(trimmed);
};

// 📤 Upload files to Firebase Storage
export const uploadFilesToStorage = async (files, docId) => {
  if (!files || files.length === 0) return [];
  const uploadPromises = Array.from(files).map((file) => {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = `req_${docId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storageRef = ref(storage, `product_requests/${docId}/${safeName}`);
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || "application/octet-stream",
        customMetadata: {
          originalName: file.name,
          size: file.size.toString(),
          type: file.type,
        },
      });
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        }
      );
    });
  });
  return Promise.all(uploadPromises);
};

// 📥 Enhanced save: creates doc → uploads files → updates with URLs
export const saveRequestedProductWithFiles = async (formData, fileInput) => {
  // 🔹 Step 1: Validate essential fields
  if (!formData.fullName?.trim()) throw new Error("الاسم مطلوب");
  if (!isValidSaudiPhone(formData.phone)) throw new Error("رقم الجوال غير صالح. مثال: 05XXXXXXXX");
  if (!isValidEmail(formData.email)) throw new Error("البريد الإلكتروني غير صالح");
  if (!formData.projectStatus) throw new Error("يرجى تحديد حالة المشروع");
  if (!formData.problemDescription?.trim()) throw new Error("وصف المشكلة مطلوب");

  // 🔹 Step 2: Create Firestore doc first (to get docId for folder naming)
  const payload = {
    ...formData,
    source: formData.source || "product_request_page",
    status: formData.status || "new",
    registeredAt: serverTimestamp(),
    files: [],
  };
  const docRef = await addDoc(collection(db, "RequestedProducts"), payload);
  console.log("✅ Document created. ID:", docRef.id);

  // 🔹 Step 3: Upload files (if any)
  let fileUrls = [];
  if (fileInput?.files?.length) {
    try {
      fileUrls = await uploadFilesToStorage(fileInput.files, docRef.id);
    } catch (uploadErr) {
      console.warn("⚠️ File upload failed (request still saved):", uploadErr);
    }
  }

  // 🔹 Step 4: Update doc with file URLs
  if (fileUrls.length > 0) {
    await updateDoc(doc(db, "RequestedProducts", docRef.id), {
      files: fileUrls,
    });
  }

  return { success: true, id: docRef.id, files: fileUrls };
};

// 🟢 حفظ طلبات المنتجات المخصصة في "RequestedProducts" ✅ NEW
export const saveRequestedProduct = async (formData) => {
  try {
    const payload = buildPayload(formData, "product_request_page");
    const docRef = await addDoc(collection(db, "RequestedProducts"), payload);
    console.log("✅ تم حفظ طلب المنتج المخصص! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ خطأ في حفظ طلب المنتج المخصص:", error);
    throw error;
  }
};

// 🟢 NEW: Save contact form inquiries to Firestore ✅
export const saveContactInquiry = async (formData) => {
  try {
    // Validate required fields
    if (!formData.name?.trim()) throw new Error("الاسم الكامل مطلوب");
    if (!isValidEmail(formData.email)) throw new Error("يرجى إدخال بريد إلكتروني صحيح");
    if (!formData.subjectLine?.trim()) throw new Error("موضوع الرسالة مطلوب");
    if (!formData.message?.trim()) throw new Error("الرسالة لا يمكن أن تكون فارغة");

    // Prepare payload with consistent metadata
    const payload = {
      ...formData,
      source: "contact_page",
      status: "new",
      registeredAt: serverTimestamp(),
    };

    // Save to Firestore collection: "contactInquiries"
    const docRef = await addDoc(collection(db, "contactInquiries"), payload);
    console.log("✅ تم حفظ استفسار التواصل! ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ خطأ في حفظ استفسار التواصل:", error);
    throw error; // Let caller handle UI feedback
  }
};