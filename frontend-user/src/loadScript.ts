
const GTAG_ID = process.env.REACT_APP_GTAG_ID;

function loadError(onError: any) {
  console.error(`Failed ${onError.target.src} didn't load correctly`);
}
const loadScript = () => {
  const gtagScript = document.createElement("script");
  gtagScript.onerror = loadError;
  gtagScript.async = true;
  document.body.appendChild(gtagScript);
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;

  const _window = window as any;
  _window.dataLayer = _window.dataLayer || [];
  _window.gtag = function gtag() {
      _window.dataLayer.push(arguments);
  }
  _window.gtag('js', new Date());

  _window.gtag('config', GTAG_ID);
};
export default loadScript;