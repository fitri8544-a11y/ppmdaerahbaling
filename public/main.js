/* =========================================================
   PPM DAERAH BALING
   FIREBASE / FIRESTORE ENGINE
========================================================= */


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

  apiKey: "AIzaSyAU-mdQWJkF9tiyrl6ZxJeGTyfHG2TYSVU",

  authDomain: "ppmdaerahbaling.firebaseapp.com",

  projectId: "ppmdaerahbaling",

  storageBucket: "ppmdaerahbaling.firebasestorage.app",

  messagingSenderId: "336046440771",

  appId: "1:336046440771:web:f26f1be4acc6ec265d6ff6"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

firebase.initializeApp(firebaseConfig);


/* =========================================================
   FIRESTORE
========================================================= */

const db = firebase.firestore();


/* =========================================================
   LOAD SCHOOL COUNT
========================================================= */

async function loadSchoolCount() {

  const schoolCountElement =
    document.getElementById("schoolCount");

  if (!schoolCountElement) {
    return;
  }


  try {

    const snapshot =
      await db.collection("sekolah").get();

    const totalSchools =
      snapshot.size;


    schoolCountElement.textContent =
      totalSchools;


    console.log(
      `[PPM BALING] Jumlah sekolah: ${totalSchools}`
    );

  }

  catch (error) {

    console.error(
      "[PPM BALING] Gagal mendapatkan jumlah sekolah:",
      error
    );

  }

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* LOAD SCHOOL COUNT */

    loadSchoolCount();


    /* SCHOOL CARD LINK */

    const schoolCard =
      document.getElementById("schoolCard");

    if (schoolCard) {

      schoolCard.style.cursor = "pointer";

      schoolCard.setAttribute(
        "role",
        "link"
      );

      schoolCard.setAttribute(
        "tabindex",
        "0"
      );


      /* CLICK */

      schoolCard.addEventListener(
        "click",
        () => {

          window.location.href =
            "ppmbaling.html#maklumat-sekolah";

        }
      );


      /* KEYBOARD ACCESS */

      schoolCard.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            window.location.href =
              "ppmbaling.html#maklumat-sekolah";

          }

        }
      );

    }

  }
);