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
   FIREBASE AUTHENTICATION
========================================================= */

const auth = firebase.auth();


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

/* =========================================================
   ADMIN LOGIN MODAL
========================================================= */

const adminLoginBtn =
  document.getElementById("adminLoginBtn");

const adminLoginModal =
  document.getElementById("adminLoginModal");

const adminLoginClose =
  document.getElementById("adminLoginClose");

const adminLoginForm =
  document.getElementById("adminLoginForm");

const adminEmail =
  document.getElementById("adminEmail");

const adminPassword =
  document.getElementById("adminPassword");

const adminLoginError =
  document.getElementById("adminLoginError");


function openAdminLoginModal() {

  if (!adminLoginModal) return;

  adminLoginModal.classList.remove("hidden");
  adminLoginModal.classList.add("flex");

}


function closeAdminLoginModal() {

  if (!adminLoginModal) return;

  adminLoginModal.classList.add("hidden");
  adminLoginModal.classList.remove("flex");

}


/* =========================================================
   ADMIN LOGIN / LOGOUT BUTTON
========================================================= */

if (adminLoginBtn) {

  adminLoginBtn.addEventListener(
    "click",
    async () => {

      /* =====================================================
         BELUM LOGIN
      ===================================================== */

      if (!auth.currentUser) {

        openAdminLoginModal();

        return;

      }


      /* =====================================================
         SUDAH LOGIN
      ===================================================== */

      const confirmed = confirm(
        "Log keluar daripada akaun Admin?"
      );


      if (!confirmed) {
        return;
      }


      try {

        await auth.signOut();

        console.log(
          "Admin berjaya logout."
        );


        /*
          Tutup semua modal sekiranya
          masih terbuka ketika logout.
        */

        closeAdminLoginModal();


        if (
          typeof closeAddNoticeModal ===
          "function"
        ) {

          closeAddNoticeModal();

        }


        alert(
          "Anda telah log keluar daripada akaun Admin."
        );

      }

      catch (error) {

        console.error(
          "Ralat logout admin:",
          error
        );

        alert(
          "Logout tidak berjaya. Sila cuba lagi."
        );

      }

    }
  );

}


if (adminLoginClose) {

  adminLoginClose.addEventListener(
    "click",
    closeAdminLoginModal
  );

}

/* =========================================================
   ADMIN LOGIN
========================================================= */

if (adminLoginForm) {

  adminLoginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const email =
        adminEmail.value.trim();

      const password =
        adminPassword.value;

      /* RESET ERROR */

      adminLoginError.classList.add("hidden");
      adminLoginError.textContent = "";

      try {

        await auth.signInWithEmailAndPassword(
          email,
          password
        );

        /* CLEAR PASSWORD */

        adminPassword.value = "";

        /* CLOSE LOGIN MODAL */

        closeAdminLoginModal();

        console.log(
          "Admin berjaya login."
        );

      }

      catch (error) {

        console.error(
          "Admin login error:",
          error
        );

        adminLoginError.textContent =
          "E-mel atau kata laluan tidak betul.";

        adminLoginError.classList.remove(
          "hidden"
        );

      }

    }
  );

}

/* =========================================================
   NOTICE ELEMENTS
========================================================= */

const adminAddNoticeBtn =
  document.getElementById("adminAddNoticeBtn");

const addNoticeModal =
  document.getElementById("addNoticeModal");

const addNoticeClose =
  document.getElementById("addNoticeClose");

const addNoticeForm =
  document.getElementById("addNoticeForm");

const noticeTitle =
  document.getElementById("noticeTitle");

const noticeType =
  document.getElementById("noticeType");

const noticeDescription =
  document.getElementById("noticeDescription");

const noticeUrl =
  document.getElementById("noticeUrl");

const noticeExpiry =
  document.getElementById("noticeExpiry");


/* =========================================================
   NOTICE DISPLAY ELEMENTS
========================================================= */

const noticeLoading =
  document.getElementById("noticeLoading");

const noticeData =
  document.getElementById("noticeData");

const noticeEmpty =
  document.getElementById("noticeEmpty");

const noticeDisplayDate =
  document.getElementById("noticeDisplayDate");

const noticeDisplayTitle =
  document.getElementById("noticeDisplayTitle");

const noticeDisplayDescription =
  document.getElementById("noticeDisplayDescription");

const noticeDisplayLink =
  document.getElementById("noticeDisplayLink");


/* =========================================================
   NOTICE ADMIN CONTROLS
========================================================= */

const noticeAdminActions =
  document.getElementById("noticeAdminActions");

const editNoticeBtn =
  document.getElementById("editNoticeBtn");

const deleteNoticeBtn =
  document.getElementById("deleteNoticeBtn");


/* =========================================================
   NOTICE STATE
========================================================= */

let currentNoticeId = null;

let currentNoticeData = null;

let noticeFormMode = "add";


/* =========================================================
   NOTICE MODAL HELPERS
========================================================= */

function getNoticeSubmitButton() {

  if (!addNoticeForm) {
    return null;
  }

  return addNoticeForm.querySelector(
    'button[type="submit"]'
  );

}


function setNoticeFormMode(mode) {

  noticeFormMode = mode;

  const submitButton =
    getNoticeSubmitButton();


  if (!submitButton) {
    return;
  }


  if (mode === "edit") {

    submitButton.innerHTML = `
      <i
        data-lucide="save"
        class="h-4 w-4"
      ></i>

      Kemaskini Makluman
    `;

  }

  else {

    submitButton.innerHTML = `
      <i
        data-lucide="save"
        class="h-4 w-4"
      ></i>

      Simpan Makluman
    `;

  }


  if (window.lucide) {
    lucide.createIcons();
  }

}


/* =========================================================
   OPEN ADD NOTICE MODAL
========================================================= */

function openAddNoticeModal() {

  if (!addNoticeModal) {
    return;
  }


  if (!auth.currentUser) {
    return;
  }


  setNoticeFormMode("add");


  if (addNoticeForm) {
    addNoticeForm.reset();
  }


  addNoticeModal.classList.remove(
    "hidden"
  );

  addNoticeModal.classList.add(
    "flex"
  );


  if (noticeTitle) {
    setTimeout(
      () => noticeTitle.focus(),
      100
    );
  }

}


/* =========================================================
   CLOSE NOTICE MODAL
========================================================= */

function closeAddNoticeModal() {

  if (!addNoticeModal) {
    return;
  }


  addNoticeModal.classList.add(
    "hidden"
  );

  addNoticeModal.classList.remove(
    "flex"
  );


  setNoticeFormMode("add");


  if (addNoticeForm) {
    addNoticeForm.reset();
  }

}


/* =========================================================
   ADD NOTICE BUTTON
========================================================= */

if (adminAddNoticeBtn) {

  adminAddNoticeBtn.addEventListener(
    "click",
    openAddNoticeModal
  );

}


/* =========================================================
   CLOSE NOTICE BUTTON
========================================================= */

if (addNoticeClose) {

  addNoticeClose.addEventListener(
    "click",
    closeAddNoticeModal
  );

}


/* =========================================================
   CLOSE NOTICE MODAL ON BACKDROP
========================================================= */

if (addNoticeModal) {

  addNoticeModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        addNoticeModal
      ) {

        closeAddNoticeModal();

      }

    }
  );

}


/* =========================================================
   NOTICE FORM SUBMIT
   ADD + EDIT
========================================================= */

if (addNoticeForm) {

  addNoticeForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      /* ================= CHECK ADMIN ================= */

      const user =
        auth.currentUser;


      if (!user) {

        alert(
          "Sesi admin tidak aktif. Sila log masuk semula."
        );

        closeAddNoticeModal();

        return;

      }


      /* ================= GET FORM DATA ================= */

      const title =
        noticeTitle
          ? noticeTitle.value.trim()
          : "";

      const type =
        noticeType
          ? noticeType.value
          : "";

      const description =
        noticeDescription
          ? noticeDescription.value.trim()
          : "";

      const url =
        noticeUrl
          ? noticeUrl.value.trim()
          : "";

      const expiry =
        noticeExpiry
          ? noticeExpiry.value
          : "";


      /* ================= VALIDATION ================= */

      if (
        !title ||
        !type ||
        !description ||
        !expiry
      ) {

        alert(
          "Sila lengkapkan semua maklumat wajib."
        );

        return;

      }


      const expiryDate =
        new Date(
          `${expiry}T23:59:59`
        );


      if (
        Number.isNaN(
          expiryDate.getTime()
        )
      ) {

        alert(
          "Tarikh luput tidak sah."
        );

        return;

      }


      try {

        /* =================================================
           EDIT MODE
        ================================================= */

        if (
          noticeFormMode === "edit"
        ) {

          if (!currentNoticeId) {

            alert(
              "Makluman tidak dapat dikenal pasti."
            );

            return;

          }


          await db
            .collection("announcements")
            .doc(currentNoticeId)
            .update({

              title: title,

              type: type,

              description:
                description,

              url: url,

              expiresAt:
                firebase
                  .firestore
                  .Timestamp
                  .fromDate(
                    expiryDate
                  ),

              updatedAt:
                firebase
                  .firestore
                  .FieldValue
                  .serverTimestamp(),

              updatedBy:
                user.uid

            });


          closeAddNoticeModal();


          alert(
            "Makluman berjaya dikemaskini."
          );

        }


        /* =================================================
           ADD MODE
        ================================================= */

        else {

          await db
            .collection("announcements")
            .add({

              title: title,

              type: type,

              description:
                description,

              url: url,

              expiresAt:
                firebase
                  .firestore
                  .Timestamp
                  .fromDate(
                    expiryDate
                  ),

              createdAt:
                firebase
                  .firestore
                  .FieldValue
                  .serverTimestamp(),

              updatedAt:
                firebase
                  .firestore
                  .FieldValue
                  .serverTimestamp(),

              createdBy:
                user.uid,

              active: true

            });


          closeAddNoticeModal();


          alert(
            "Makluman berjaya disimpan."
          );

        }

      }

      catch (error) {

        console.error(
          "Ralat menyimpan makluman:",
          error
        );


        if (
          noticeFormMode === "edit"
        ) {

          alert(
            "Makluman tidak dapat dikemaskini. Sila cuba lagi."
          );

        }

        else {

          alert(
            "Makluman tidak dapat disimpan. Sila cuba lagi."
          );

        }

      }

    }
  );

}


/* =========================================================
   FORMAT NOTICE DATE
========================================================= */

function formatNoticeDate(timestamp) {

  if (!timestamp) {
    return "";
  }


  const date =
    timestamp.toDate();


  return date.toLocaleDateString(
    "ms-MY",
    {

      day: "numeric",

      month: "long",

      year: "numeric"

    }
  );

}


/* =========================================================
   DISPLAY EMPTY NOTICE
========================================================= */

function showEmptyNotice() {

  currentNoticeId = null;

  currentNoticeData = null;


  if (noticeLoading) {

    noticeLoading.classList.add(
      "hidden"
    );

  }


  if (noticeData) {

    noticeData.classList.add(
      "hidden"
    );

  }


  if (noticeEmpty) {

    noticeEmpty.classList.remove(
      "hidden"
    );

  }

}


/* =========================================================
   DISPLAY LATEST NOTICE
========================================================= */

function displayLatestNotice(doc) {

  if (!doc) {

    showEmptyNotice();

    return;

  }


  const data =
    doc.data();


  currentNoticeId =
    doc.id;

  currentNoticeData =
    data;


  /* ================= DISPLAY STATE ================= */

  if (noticeLoading) {

    noticeLoading.classList.add(
      "hidden"
    );

  }


  if (noticeEmpty) {

    noticeEmpty.classList.add(
      "hidden"
    );

  }


  if (noticeData) {

    noticeData.classList.remove(
      "hidden"
    );

  }


  /* ================= TITLE ================= */

  if (noticeDisplayTitle) {

    noticeDisplayTitle.textContent =
      data.title ||
      "Makluman Terkini";

  }


  /* ================= DESCRIPTION ================= */

  if (noticeDisplayDescription) {

    noticeDisplayDescription.textContent =
      data.description || "";

  }


  /* ================= DATE ================= */

  if (noticeDisplayDate) {

    noticeDisplayDate.textContent =
      formatNoticeDate(
        data.createdAt
      );

  }


  /* ================= LINK ================= */

  if (noticeDisplayLink) {

    if (data.url) {

      noticeDisplayLink.href =
        data.url;

      noticeDisplayLink.classList.remove(
        "hidden"
      );

      noticeDisplayLink.classList.add(
        "inline-flex"
      );

    }

    else {

      noticeDisplayLink.classList.add(
        "hidden"
      );

      noticeDisplayLink.classList.remove(
        "inline-flex"
      );

      noticeDisplayLink.removeAttribute(
        "href"
      );

    }

  }


  if (window.lucide) {
    lucide.createIcons();
  }

}


/* =========================================================
   FIRESTORE REALTIME NOTICE LISTENER
========================================================= */

function loadLatestNotice() {

  if (
    !noticeLoading ||
    !noticeData ||
    !noticeEmpty
  ) {

    return;

  }


  db
    .collection("announcements")
    .where(
      "active",
      "==",
      true
    )
    .orderBy(
      "createdAt",
      "desc"
    )
    .limit(10)
    .onSnapshot(

      (snapshot) => {

        const now =
          new Date();

        let latestDocument =
          null;


        snapshot.forEach(
          (doc) => {

            if (
              latestDocument
            ) {
              return;
            }


            const data =
              doc.data();


            if (
              !data.expiresAt
            ) {
              return;
            }


            const expiryDate =
              data.expiresAt.toDate();


            if (
              expiryDate >= now
            ) {

              latestDocument =
                doc;

            }

          }
        );


        if (
          latestDocument
        ) {

          displayLatestNotice(
            latestDocument
          );

        }

        else {

          showEmptyNotice();

        }

      },


      (error) => {

        console.error(
          "Ralat memuatkan makluman:",
          error
        );

        showEmptyNotice();

      }

    );

}


/* =========================================================
   START NOTICE ENGINE
========================================================= */

loadLatestNotice();


/* =========================================================
   EDIT NOTICE
========================================================= */

if (editNoticeBtn) {

  editNoticeBtn.addEventListener(
    "click",
    () => {


      /* ================= CHECK ADMIN ================= */

      if (!auth.currentUser) {

        alert(
          "Sesi admin tidak aktif. Sila log masuk semula."
        );

        return;

      }


      /* ================= CHECK NOTICE ================= */

      if (
        !currentNoticeId ||
        !currentNoticeData
      ) {

        alert(
          "Makluman tidak dapat dikenal pasti."
        );

        return;

      }


      const data =
        currentNoticeData;


      /* ================= EDIT MODE ================= */

      setNoticeFormMode(
        "edit"
      );


      /* ================= FILL FORM ================= */

      if (noticeTitle) {

        noticeTitle.value =
          data.title || "";

      }


      if (noticeType) {

        noticeType.value =
          data.type || "";

      }


      if (noticeDescription) {

        noticeDescription.value =
          data.description || "";

      }


      if (noticeUrl) {

        noticeUrl.value =
          data.url || "";

      }


      /* ================= EXPIRY ================= */

      if (
        noticeExpiry &&
        data.expiresAt
      ) {

        const expiryDate =
          data.expiresAt.toDate();


        const year =
          expiryDate.getFullYear();

        const month =
          String(
            expiryDate.getMonth() + 1
          ).padStart(
            2,
            "0"
          );

        const day =
          String(
            expiryDate.getDate()
          ).padStart(
            2,
            "0"
          );


        noticeExpiry.value =
          `${year}-${month}-${day}`;

      }


      /* ================= OPEN MODAL ================= */

      if (addNoticeModal) {

        addNoticeModal.classList.remove(
          "hidden"
        );

        addNoticeModal.classList.add(
          "flex"
        );

      }


      if (noticeTitle) {

        setTimeout(
          () =>
            noticeTitle.focus(),
          100
        );

      }

    }
  );

}


/* =========================================================
   DELETE NOTICE
========================================================= */

if (deleteNoticeBtn) {

  deleteNoticeBtn.addEventListener(
    "click",
    async () => {


      /* ================= CHECK ADMIN ================= */

      const user =
        auth.currentUser;


      if (!user) {

        alert(
          "Sesi admin tidak aktif. Sila log masuk semula."
        );

        return;

      }


      /* ================= CHECK NOTICE ================= */

      if (!currentNoticeId) {

        alert(
          "Makluman tidak dapat dikenal pasti."
        );

        return;

      }


      /* ================= CONFIRM ================= */

      const confirmed =
        confirm(
          "Adakah anda pasti mahu memadam makluman ini?\n\nTindakan ini tidak boleh dibatalkan."
        );


      if (!confirmed) {
        return;
      }


      try {

        await db
          .collection("announcements")
          .doc(currentNoticeId)
          .delete();


        alert(
          "Makluman berjaya dipadam."
        );

      }

      catch (error) {

        console.error(
          "Ralat memadam makluman:",
          error
        );


        alert(
          "Makluman tidak dapat dipadam. Sila cuba lagi."
        );

      }

    }
  );

}


/* =========================================================
   ADMIN AUTH STATE
========================================================= */

auth.onAuthStateChanged(
  (user) => {


    if (!adminLoginBtn) {
      return;
    }


    /* =====================================================
       ADMIN LOGGED IN
    ===================================================== */

    if (user) {

      adminLoginBtn.innerHTML = `
        <i
          data-lucide="shield-check"
          class="h-4 w-4"
        ></i>
      `;


      adminLoginBtn.classList.remove(
        "text-slate-500"
      );


      adminLoginBtn.classList.add(
        "bg-green-50",
        "border-green-200",
        "text-green-700"
      );


      adminLoginBtn.title =
        "Admin Aktif";


      adminLoginBtn.setAttribute(
        "aria-label",
        "Admin Aktif"
      );


      /* SHOW ADD BUTTON */

      if (adminAddNoticeBtn) {

        adminAddNoticeBtn.classList.remove(
          "hidden"
        );

        adminAddNoticeBtn.classList.add(
          "flex"
        );

      }


      /* SHOW NOTICE ACTIONS */

      if (noticeAdminActions) {

        noticeAdminActions.classList.remove(
          "hidden"
        );

        noticeAdminActions.classList.add(
          "flex"
        );

      }

    }


    /* =====================================================
       NOT LOGGED IN
    ===================================================== */

    else {

      adminLoginBtn.innerHTML = `
        <i
          data-lucide="lock"
          class="h-4 w-4"
        ></i>
      `;


      adminLoginBtn.classList.remove(
        "bg-green-50",
        "border-green-200",
        "text-green-700"
      );


      adminLoginBtn.classList.add(
        "text-slate-500"
      );


      adminLoginBtn.title =
        "Login Admin";


      adminLoginBtn.setAttribute(
        "aria-label",
        "Login Admin"
      );


      /* HIDE ADD BUTTON */

      if (adminAddNoticeBtn) {

        adminAddNoticeBtn.classList.add(
          "hidden"
        );

        adminAddNoticeBtn.classList.remove(
          "flex"
        );

      }


      /* HIDE NOTICE ACTIONS */

      if (noticeAdminActions) {

        noticeAdminActions.classList.add(
          "hidden"
        );

        noticeAdminActions.classList.remove(
          "flex"
        );

      }

    }


    if (window.lucide) {
      lucide.createIcons();
    }

  }
);


/* =========================================================
   CLOSE LOGIN MODAL WHEN CLICKING BACKDROP
========================================================= */

if (adminLoginModal) {

  adminLoginModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        adminLoginModal
      ) {

        closeAdminLoginModal();

      }

    }
  );

}


/* =========================================================
   CLOSE MODALS WITH ESC
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

      closeAdminLoginModal();

      closeAddNoticeModal();

    }

  }
);


/* =========================================================
   REFRESH LUCIDE ICONS
========================================================= */

if (window.lucide) {

  lucide.createIcons();

}