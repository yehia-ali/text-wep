declare const window: any;

export function callMobileFunction() {
  let language = localStorage.getItem('language') || 'en';
  window.Android?.backToLogin(true, language);
  window.webkit?.messageHandlers.MessageHandler.postMessage("back-to-login");
}
