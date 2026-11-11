/**
 * Wadhwani Foundation Certificate Verification Web Application Clone
 */

// Target default certificate data (fallback / offline ready)
const DEFAULT_CERTIFICATE = {
  id: "6ae0ca9dfa09ff77a70fd003",
  name: "SAISAKTHI MK",
  createdAt: "2026-10-27T16:00:29.900Z",
  courseName: "Self-Presentation",
  instituteName: "ICT Academy of Tamil Nadu",
  imageSrc: "/assets/cert.png",
  pdfSrc: "/assets/cert.pdf"
};

const API_BASE_URL = "https://api.wfcommon.wfglobal.org/";

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } catch (e) {
    return isoString;
  }
}

async function fetchCertificate(certificateId) {
  // If matching default offline certificate, return cached data
  if (certificateId === DEFAULT_CERTIFICATE.id || !certificateId) {
    return {
      certificateId: DEFAULT_CERTIFICATE.id,
      name: DEFAULT_CERTIFICATE.name,
      issuedOn: formatDate(DEFAULT_CERTIFICATE.createdAt),
      imageUrl: DEFAULT_CERTIFICATE.imageSrc,
      pdfUrl: DEFAULT_CERTIFICATE.pdfSrc
    };
  }

  // Attempt live API fetch for other certificate IDs
  try {
    const res = await fetch(`${API_BASE_URL}api/v1/certificateservice/get?certificateId=${certificateId}`);
    if (!res.ok) throw new Error("Certificate not found");
    const json = await res.json();
    if (!json || json.status !== "SUCCESS" || !json.data || !json.data.certificates || json.data.certificates.length === 0) {
      throw new Error("Invalid certificate response");
    }
    const cert = json.data.certificates[0];
    return {
      certificateId: cert.id,
      name: cert.name,
      issuedOn: formatDate(cert.createdAt),
      imageUrl: `${API_BASE_URL}api/v1/certificateservice/generate/${cert.id}/png`,
      pdfUrl: `${API_BASE_URL}api/v1/certificateservice/generate/${cert.id}/pdf`
    };
  } catch (err) {
    console.warn("Could not fetch remote certificate:", err);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Update year dynamically
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const certificateId = getQueryParam("certificateId") || DEFAULT_CERTIFICATE.id;
  
  const contentContainer = document.getElementById("certificate-content");
  const notFoundContainer = document.getElementById("notfound-content");
  
  const certIdEl = document.getElementById("cert-id");
  const certRecipientEl = document.getElementById("cert-recipient");
  const certIssuedOnEl = document.getElementById("cert-issued-on");
  const certImg = document.getElementById("cert-image");
  const imgSpinner = document.getElementById("img-spinner");
  const downloadBtn = document.getElementById("download-btn");
  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");
  const btnSpinner = document.getElementById("btn-spinner");

  // Fetch or resolve certificate
  const certData = await fetchCertificate(certificateId);

  if (!certData) {
    // Show Not Found view
    contentContainer.style.display = "none";
    notFoundContainer.style.display = "flex";
    return;
  }

  // Populate data
  certIdEl.textContent = certData.certificateId;
  certRecipientEl.textContent = certData.name;
  certIssuedOnEl.textContent = certData.issuedOn;

  // Handle image load (cache buster query parameter to ensure immediate browser refresh)
  certImg.onload = () => {
    imgSpinner.style.display = "none";
    certImg.style.display = "block";
    downloadBtn.disabled = false;
  };

  certImg.onerror = () => {
    imgSpinner.style.display = "none";
    contentContainer.style.display = "none";
    notFoundContainer.style.display = "flex";
  };

  certImg.src = certData.imageUrl + "?v=" + Date.now();

  // Download Handler
  downloadBtn.addEventListener("click", async () => {
    downloadBtn.disabled = true;
    btnSpinner.style.display = "inline-block";
    btnIcon.style.display = "none";
    btnText.textContent = "Downloading Certificate...";

    try {
      let blob;
      if (certData.pdfUrl === DEFAULT_CERTIFICATE.pdfSrc) {
        const response = await fetch(certData.pdfUrl + "?v=" + Date.now());
        blob = await response.blob();
      } else {
        const response = await fetch(certData.pdfUrl, {
          method: "GET",
          headers: { "Content-Type": "application/pdf" }
        });
        if (!response.ok) throw new Error("Failed to fetch certificate PDF");
        const arrayBuf = await response.arrayBuffer();
        blob = new Blob([arrayBuf], { type: "application/pdf" });
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      const fileName = `${certData.name || "user"}_${certData.certificateId || "certificate"}.pdf`;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate PDF. Please check your network connection.");
    } finally {
      downloadBtn.disabled = false;
      btnSpinner.style.display = "none";
      btnIcon.style.display = "inline-block";
      btnText.textContent = "Download Certificate";
    }
  });
});
