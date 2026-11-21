import { useEffect, useState } from "react";

// const APPS_SCRIPT_URL =
//   "https://script.google.com/macros/s/AKfycby5Er7QtQfOQ8fJLHW97oIrNkRUjbnDZykYUM2SsGaKO1iOoqy7-ABReClOzhv-e7UN/exec";

const APPS_SCRIPT_URL = "/drive-proxy";

export default function PrivateDriveImage({ url, alt = "Drive Image", ...props }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setError(null);
    setImgSrc(null);

    fetch(`${APPS_SCRIPT_URL}?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.error) {
          setError(data.error);
        } else {
          setImgSrc(data.url);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (error) return <span>Error: {error}</span>;
  if (!imgSrc) return <span>Loading...</span>;

  return <img src={imgSrc} alt={alt} {...props} />;
}