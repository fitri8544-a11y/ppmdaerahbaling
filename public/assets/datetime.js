/* =========================================================
   PPM DAERAH BALING
   DATE & TIME ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  function updateDateTime() {

    const now = new Date();

    // Ambil bahasa portal
    const language =
      localStorage.getItem("ppmLanguage") || "bm";

    const locale =
      language === "en"
        ? "en-MY"
        : "ms-MY";


    /* ================= DATE ================= */

    const date = now.toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });


    /* ================= DAY ================= */

    const day = now.toLocaleDateString(locale, {
      weekday: "long"
    });


    /* ================= TIME ================= */

    const time = now.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });


    /* ================= DESKTOP ================= */

    const dateElement =
      document.getElementById("currentDate");

    const timeElement =
      document.getElementById("currentTime");

    if (dateElement) {
      dateElement.textContent = date;
    }

    if (timeElement) {
      timeElement.textContent =
        `${day} • ${time}`;
    }


    /* ================= MOBILE ================= */

    const mobileDate =
      document.getElementById("mobileCurrentDate");

    const mobileTime =
      document.getElementById("mobileCurrentTime");

    if (mobileDate) {
      mobileDate.textContent = date;
    }

    if (mobileTime) {
      mobileTime.textContent =
        `${day} • ${time}`;
    }

  }


  /* ================= INITIAL ================= */

  updateDateTime();


  /* ================= LIVE CLOCK ================= */

  setInterval(updateDateTime, 1000);

});