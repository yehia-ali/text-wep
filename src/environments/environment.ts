export const environment = {
  production: false,
  publicImageUrl: 'https://publicspace.taskedin.net/',
  supportUrl: 'https://support.taskedin.net/api/',

  // imageUrl: "https://taskedinv2.taskedin.net/",
  /* ========================================== Production Enviroment ========================================== */

  // coreBase: "https://taskedinv2.taskedin.net",
  // publicUrl: 'https://publicspace.taskedin.net/api/',
  // imageUrl: localStorage.getItem('base-url') == "https://ezaby.taskedin.net/" ? "https://ezaby.taskedin.net/" : "https://taskedinv2.taskedin.net/",
  // iframeId: 310346,
  // apiUrl: localStorage.getItem('base-url') || 'https://taskedinv2.taskedin.net/',
  // firebaseConfig: {
  // apiKey: "AIzaSyAa8_AbhPRfRRgNj2_Bj0CfebaAttNaVZU",
  // authDomain: "taskedin-13b36.firebaseapp.com",
  // databaseURL: "https://taskedin-13b36.firebaseio.com",
  // projectId: "taskedin-13b36",
  // storageBucket: "taskedin-13b36.appspot.com",
  // messagingSenderId: "342226115526",
  // appId: "1:342226115526:web:3cd7422416be77ef1870c7",
  // measurementId: "G-220JZD902D",
  // vapidKey: "BCKv9sEwbcYM7X8XWHAVVb-afoUi_51h80-GPe7W5YOu_Hk-26VgOcphOOKg5JVtlTZY7_lxcuUwGdsQjGHB1VM"}

  /* ============================================ pre Production ============================================ */

  coreBase: "https://env.taskedin.net",
  iframeId: 776059,
  apiUrl: !!localStorage.getItem('base-url') ? localStorage.getItem('base-url') : 'https://env.taskedin.net/',
  publicUrl: 'https://prepublicspace.taskedin.net/api/',
  imageUrl: "https://env.taskedin.net/",
  firebaseConfig: {
  apiKey: "AIzaSyCe2ZoKwHwnu5XzciD-k5T_pIaBLj8HAAg",
  authDomain: "taskedin-qc.firebaseapp.com",
  databaseURL: "https://taskedin-qc.firebaseio.com",
  projectId: "taskedin-qc",
  storageBucket: "taskedin-qc.appspot.com",
  messagingSenderId: "293646904736",
  appId: "1:293646904736:web:7b44ef16a260500dd388c5",
  measurementId: "G-F2VC1BVCBW",
  vapidKey: "BCdKteI0FojK-e01xhykGjiQYGpf6-KWYSE3kj6HqeGC_aeg2tx1MwAX0Ir29FQ_cF7ugFMFt6NWbAh8XaJam5s"}
};
