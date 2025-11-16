const API_BASE = {
  content: 'https://getlandingcontent-inau7ud24q-ew.a.run.app',
  giftLead: 'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/submitGiftLead',
  inquiry: 'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/submitInquiry',
  generalInquiry: 'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/submitGeneralInquiry',
  giftLockStatus: 'https://europe-west1-qvcrm-c0e2d.cloudfunctions.net/gift-lock/status'
};

// Get landing content (products, gifts, collaborator)
export const getLandingContent = async (ref) => {
  const url = ref ? `${API_BASE.content}?ref=${encodeURIComponent(ref)}` : API_BASE.content;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || 'Failed to load content');
  return data;
};

// Check gift lock status
export const checkGiftLockStatus = async (phone, ref) => {
  const response = await fetch(API_BASE.giftLockStatus, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, ref })
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || 'Failed to check lock status');
  return data;
};

// Submit gift lead
export const submitGiftLead = async (payload) => {
  const response = await fetch(API_BASE.giftLead, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || 'Failed to submit gift lead');
  return data;
};

// Submit product inquiry
export const submitInquiry = async (payload) => {
  const response = await fetch(API_BASE.inquiry, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || 'Failed to submit inquiry');
  return data;
};

// Submit general inquiry
export const submitGeneralInquiry = async (payload) => {
  if (!payload.phone || !payload.phone.match(/^(05|5)[0-9]{8}$/)) {
    throw new Error('صيغة رقم الجوال غير صحيحة. يجب: 05xxxxxxxx أو 5xxxxxxxx');
  }

  const finalPayload = {
    name: payload.name || '',
    phone: payload.phone || '',
    notes: (payload.notes ?? payload.message ?? '').toString(),
    ref: payload.ref || '',
    sessionId: payload.sessionId || '',
    utm: payload.utm || {},
    eventId: payload.eventId || ''
  };

  if (!finalPayload.notes.trim()) {
    throw new Error('notes_required');
  }

  console.log('📤 Sending general inquiry:', finalPayload);

  const response = await fetch(API_BASE.generalInquiry, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalPayload)
  });

  const data = await response.json();
  console.log('📥 Server response:', data);

  if (!data.ok) {
    throw new Error(data.error || 'فشل إرسال الطلب');
  }
  return data;
};
