/* =========================================================
   PPM DAERAH BALING
   MAKLUMAN / ANNOUNCEMENT ARCHIVE ENGINE
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

if (!firebase.apps.length) {

  firebase.initializeApp(
    firebaseConfig
  );

}


/* =========================================================
   FIRESTORE + AUTH
========================================================= */

const db = firebase.firestore();

const auth = firebase.auth();


/* =========================================================
   ELEMENTS
========================================================= */

const archiveLoading =
  document.getElementById(
    "archiveLoading"
  );

const archiveNoticeList =
  document.getElementById(
    "archiveNoticeList"
  );

const archiveEmpty =
  document.getElementById(
    "archiveEmpty"
  );

const archiveAddNoticeBtn =
  document.getElementById(
    "archiveAddNoticeBtn"
  );

const archiveNoticeModal =
  document.getElementById(
    "archiveNoticeModal"
  );

const archiveModalClose =
  document.getElementById(
    "archiveModalClose"
  );

const archiveCancelBtn =
  document.getElementById(
    "archiveCancelBtn"
  );

const archiveNoticeForm =
  document.getElementById(
    "archiveNoticeForm"
  );

const archiveModalTitle =
  document.getElementById(
    "archiveModalTitle"
  );

const archiveNoticeTitle =
  document.getElementById(
    "archiveNoticeTitle"
  );

const archiveNoticeType =
  document.getElementById(
    "archiveNoticeType"
  );

const archiveNoticeDescription =
  document.getElementById(
    "archiveNoticeDescription"
  );

const archiveNoticeUrl =
  document.getElementById(
    "archiveNoticeUrl"
  );

const archiveNoticeExpiry =
  document.getElementById(
    "archiveNoticeExpiry"
  );

const archiveSubmitLabel =
  document.getElementById(
    "archiveSubmitLabel"
  );

const noticeFilterButtons =
  document.querySelectorAll(
    ".notice-filter"
  );


/* =========================================================
   STATE
========================================================= */

let allNotices = [];

let currentFilter = "all";

let formMode = "add";

let editingNoticeId = null;

let currentUser = null;


/* =========================================================
   SECURITY / HTML ESCAPE
========================================================= */

function escapeHtml(value) {

  if (value === null ||
      value === undefined) {

    return "";

  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   SAFE URL
========================================================= */

function getSafeUrl(value) {

  if (!value) {
    return "";
  }

  try {

    const url =
      new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {

      return "";

    }

    return url.href;

  }

  catch (error) {

    return "";

  }

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(timestamp) {

  if (
    !timestamp ||
    typeof timestamp.toDate !==
      "function"
  ) {

    return "";

  }

  return timestamp
    .toDate()
    .toLocaleDateString(
      "ms-MY",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

}


/* =========================================================
   DATE INPUT FORMAT
========================================================= */

function formatDateInput(timestamp) {

  if (
    !timestamp ||
    typeof timestamp.toDate !==
      "function"
  ) {

    return "";

  }

  const date =
    timestamp.toDate();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

}


/* =========================================================
   NOTICE STATUS
========================================================= */

function isNoticeExpired(data) {

  if (
    !data.expiresAt ||
    typeof data.expiresAt.toDate !==
      "function"
  ) {

    return false;

  }

  return (
    data.expiresAt.toDate() <
    new Date()
  );

}


/* =========================================================
   TYPE INFORMATION
========================================================= */

function getTypeInfo(type) {

  switch (type) {

    case "activity":

      return {
        label: "Aktiviti / Program",
        icon: "calendar-days",
        badge:
          "bg-blue-50 text-blue-700 border-blue-100"
      };


    case "document":

      return {
        label: "Dokumen / Surat",
        icon: "file-text",
        badge:
          "bg-amber-50 text-amber-700 border-amber-100"
      };


    case "link":

      return {
        label: "Pautan",
        icon: "link",
        badge:
          "bg-purple-50 text-purple-700 border-purple-100"
      };


    default:

      return {
        label: "Pengumuman",
        icon: "megaphone",
        badge:
          "bg-green-50 text-green-700 border-green-100"
      };

  }

}


/* =========================================================
   SHOW LOADING
========================================================= */

function showLoading() {

  if (archiveLoading) {

    archiveLoading.classList.remove(
      "hidden"
    );

  }

  if (archiveNoticeList) {

    archiveNoticeList.classList.add(
      "hidden"
    );

  }

  if (archiveEmpty) {

    archiveEmpty.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   SHOW EMPTY
========================================================= */

function showEmpty() {

  if (archiveLoading) {

    archiveLoading.classList.add(
      "hidden"
    );

  }

  if (archiveNoticeList) {

    archiveNoticeList.classList.add(
      "hidden"
    );

  }

  if (archiveEmpty) {

    archiveEmpty.classList.remove(
      "hidden"
    );

  }

}


/* =========================================================
   RENDER NOTICE LIST
========================================================= */

function renderNotices() {

  if (!archiveNoticeList) {
    return;
  }


  const filteredNotices =
    currentFilter === "all"
      ? allNotices
      : allNotices.filter(
          (notice) =>
            notice.data.type ===
            currentFilter
        );


  if (
    filteredNotices.length === 0
  ) {

    showEmpty();

    if (window.lucide) {
      lucide.createIcons();
    }

    return;

  }


  if (archiveLoading) {

    archiveLoading.classList.add(
      "hidden"
    );

  }


  if (archiveEmpty) {

    archiveEmpty.classList.add(
      "hidden"
    );

  }


  archiveNoticeList.classList.remove(
    "hidden"
  );


  archiveNoticeList.innerHTML =
    filteredNotices
      .map(
        (notice) => {

          const data =
            notice.data;

          const typeInfo =
            getTypeInfo(
              data.type
            );

          const expired =
            isNoticeExpired(
              data
            );

          const safeUrl =
            getSafeUrl(
              data.url
            );


          const statusBadge =
            expired

              ? `
                <span
                  class="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-100
                    px-3
                    py-1
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  <i
                    data-lucide="clock-3"
                    class="h-3 w-3"
                  ></i>

                  Tamat
                </span>
              `

              : `
                <span
                  class="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-green-100
                    bg-green-50
                    px-3
                    py-1
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-green-700
                  "
                >
                  <span
                    class="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-green-500
                    "
                  ></span>

                  Aktif
                </span>
              `;


          const linkButton =
            safeUrl

              ? `
                <a
                  href="${escapeHtml(
                    safeUrl
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-green-700
                    transition
                    hover:bg-green-100
                  "
                >
                  Lihat Selanjutnya

                  <i
                    data-lucide="arrow-up-right"
                    class="h-4 w-4"
                  ></i>
                </a>
              `

              : "";


          const adminActions =
            currentUser

              ? `
                <div
                  class="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <button
                    type="button"
                    data-edit-notice="${notice.id}"
                    class="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-green-200
                      bg-green-50
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-green-700
                      transition
                      hover:bg-green-100
                    "
                  >
                    <i
                      data-lucide="pencil"
                      class="h-3.5 w-3.5"
                    ></i>

                    Edit
                  </button>


                  <button
                    type="button"
                    data-delete-notice="${notice.id}"
                    class="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-red-700
                      transition
                      hover:bg-red-100
                    "
                  >
                    <i
                      data-lucide="trash-2"
                      class="h-3.5 w-3.5"
                    ></i>

                    Padam
                  </button>

                </div>
              `

              : "";


          return `
            <article
              class="
                overflow-hidden
                rounded-2xl
                border
                ${
                  expired
                    ? "border-slate-200"
                    : "border-green-100"
                }
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >

              <div
                class="
                  flex
                  flex-col
                  gap-5
                  p-5
                  sm:p-6
                  lg:flex-row
                  lg:items-start
                "
              >


                <!-- ICON -->

                <div
                  class="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      expired
                        ? "bg-slate-100 text-slate-500"
                        : "bg-green-100 text-green-800"
                    }
                  "
                >

                  <i
                    data-lucide="${typeInfo.icon}"
                    class="h-6 w-6"
                  ></i>

                </div>


                <!-- CONTENT -->

                <div
                  class="
                    min-w-0
                    flex-1
                  "
                >

                  <div
                    class="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >

                    <span
                      class="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        px-3
                        py-1
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        ${typeInfo.badge}
                      "
                    >
                      ${escapeHtml(
                        typeInfo.label
                      )}
                    </span>

                    ${statusBadge}

                    <span
                      class="
                        text-xs
                        font-semibold
                        text-slate-400
                      "
                    >
                      ${escapeHtml(
                        formatDate(
                          data.createdAt
                        )
                      )}
                    </span>

                  </div>


                  <h3
                    class="
                      mt-3
                      text-lg
                      font-extrabold
                      leading-snug
                      text-slate-900
                      sm:text-xl
                    "
                  >
                    ${escapeHtml(
                      data.title ||
                      "Makluman"
                    )}
                  </h3>


                  <p
                    class="
                      mt-2
                      whitespace-pre-line
                      text-sm
                      leading-7
                      text-slate-600
                    "
                  >${escapeHtml(
                    data.description ||
                    ""
                  )}</p>


                  <div
                    class="
                      mt-5
                      flex
                      flex-col
                      gap-3
                      border-t
                      border-slate-100
                      pt-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div>
                      ${linkButton}
                    </div>

                    ${adminActions}

                  </div>

                </div>

              </div>

            </article>
          `;

        }
      )
      .join("");


  bindNoticeActions();


  if (window.lucide) {

    lucide.createIcons();

  }

}


/* =========================================================
   BIND EDIT / DELETE
========================================================= */

function bindNoticeActions() {

  document
    .querySelectorAll(
      "[data-edit-notice]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            openEditModal(
              button.dataset
                .editNotice
            );

          }
        );

      }
    );


  document
    .querySelectorAll(
      "[data-delete-notice]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            deleteNotice(
              button.dataset
                .deleteNotice
            );

          }
        );

      }
    );

}


/* =========================================================
   FILTER BUTTON UI
========================================================= */

function updateFilterButtons() {

  noticeFilterButtons.forEach(
    (button) => {

      const active =
        button.dataset
          .noticeFilter ===
        currentFilter;


      if (active) {

        button.classList.remove(
          "border",
          "border-slate-200",
          "bg-white",
          "text-slate-600"
        );

        button.classList.add(
          "bg-green-700",
          "text-white"
        );

      }

      else {

        button.classList.remove(
          "bg-green-700",
          "text-white"
        );

        button.classList.add(
          "border",
          "border-slate-200",
          "bg-white",
          "text-slate-600"
        );

      }

    }
  );

}


/* =========================================================
   FILTER EVENTS
========================================================= */

noticeFilterButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        currentFilter =
          button.dataset
            .noticeFilter ||
          "all";


        updateFilterButtons();

        renderNotices();

      }
    );

  }
);


/* =========================================================
   OPEN ADD MODAL
========================================================= */

function openAddModal() {

  if (
    !currentUser ||
    !archiveNoticeModal
  ) {

    return;

  }


  formMode = "add";

  editingNoticeId = null;


  if (archiveNoticeForm) {

    archiveNoticeForm.reset();

  }


  if (archiveModalTitle) {

    archiveModalTitle.textContent =
      "Tambah Makluman";

  }


  if (archiveSubmitLabel) {

    archiveSubmitLabel.textContent =
      "Simpan Makluman";

  }


  archiveNoticeModal.classList.remove(
    "hidden"
  );

  archiveNoticeModal.classList.add(
    "flex"
  );


  if (archiveNoticeTitle) {

    setTimeout(
      () =>
        archiveNoticeTitle.focus(),
      100
    );

  }

}


/* =========================================================
   OPEN EDIT MODAL
========================================================= */

function openEditModal(id) {

  if (
    !currentUser ||
    !archiveNoticeModal
  ) {

    return;

  }


  const notice =
    allNotices.find(
      (item) =>
        item.id === id
    );


  if (!notice) {

    alert(
      "Makluman tidak dapat dikenal pasti."
    );

    return;

  }


  const data =
    notice.data;


  formMode = "edit";

  editingNoticeId = id;


  if (archiveModalTitle) {

    archiveModalTitle.textContent =
      "Edit Makluman";

  }


  if (archiveSubmitLabel) {

    archiveSubmitLabel.textContent =
      "Kemaskini Makluman";

  }


  if (archiveNoticeTitle) {

    archiveNoticeTitle.value =
      data.title || "";

  }


  if (archiveNoticeType) {

    archiveNoticeType.value =
      data.type || "";

  }


  if (archiveNoticeDescription) {

    archiveNoticeDescription.value =
      data.description || "";

  }


  if (archiveNoticeUrl) {

    archiveNoticeUrl.value =
      data.url || "";

  }


  if (archiveNoticeExpiry) {

    archiveNoticeExpiry.value =
      formatDateInput(
        data.expiresAt
      );

  }


  archiveNoticeModal.classList.remove(
    "hidden"
  );

  archiveNoticeModal.classList.add(
    "flex"
  );


  if (archiveNoticeTitle) {

    setTimeout(
      () =>
        archiveNoticeTitle.focus(),
      100
    );

  }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

  if (!archiveNoticeModal) {
    return;
  }


  archiveNoticeModal.classList.add(
    "hidden"
  );

  archiveNoticeModal.classList.remove(
    "flex"
  );


  formMode = "add";

  editingNoticeId = null;


  if (archiveNoticeForm) {

    archiveNoticeForm.reset();

  }

}


/* =========================================================
   ADD BUTTON
========================================================= */

if (archiveAddNoticeBtn) {

  archiveAddNoticeBtn.addEventListener(
    "click",
    openAddModal
  );

}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

if (archiveModalClose) {

  archiveModalClose.addEventListener(
    "click",
    closeModal
  );

}


if (archiveCancelBtn) {

  archiveCancelBtn.addEventListener(
    "click",
    closeModal
  );

}


/* =========================================================
   MODAL BACKDROP
========================================================= */

if (archiveNoticeModal) {

  archiveNoticeModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        archiveNoticeModal
      ) {

        closeModal();

      }

    }
  );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeModal();

    }

  }
);


/* =========================================================
   SAVE / UPDATE NOTICE
========================================================= */

if (archiveNoticeForm) {

  archiveNoticeForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const user =
        auth.currentUser;


      if (!user) {

        alert(
          "Sesi admin tidak aktif. Sila log masuk semula."
        );

        closeModal();

        return;

      }


      const title =
        archiveNoticeTitle
          ? archiveNoticeTitle
              .value.trim()
          : "";

      const type =
        archiveNoticeType
          ? archiveNoticeType.value
          : "";

      const description =
        archiveNoticeDescription
          ? archiveNoticeDescription
              .value.trim()
          : "";

      const url =
        archiveNoticeUrl
          ? archiveNoticeUrl
              .value.trim()
          : "";

      const expiry =
        archiveNoticeExpiry
          ? archiveNoticeExpiry.value
          : "";


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


      if (
        url &&
        !getSafeUrl(url)
      ) {

        alert(
          "Pautan tidak sah. Gunakan alamat bermula dengan http:// atau https://."
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

        /* ================= EDIT ================= */

        if (
          formMode === "edit" &&
          editingNoticeId
        ) {

          await db
            .collection(
              "announcements"
            )
            .doc(
              editingNoticeId
            )
            .update({

              title,

              type,

              description,

              url,

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


          closeModal();


          alert(
            "Makluman berjaya dikemaskini."
          );

        }


        /* ================= ADD ================= */

        else {

          await db
            .collection(
              "announcements"
            )
            .add({

              title,

              type,

              description,

              url,

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


          closeModal();


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


        alert(
          formMode === "edit"
            ? "Makluman tidak dapat dikemaskini."
            : "Makluman tidak dapat disimpan."
        );

      }

    }
  );

}


/* =========================================================
   DELETE NOTICE
========================================================= */

async function deleteNotice(id) {

  const user =
    auth.currentUser;


  if (!user) {

    alert(
      "Sesi admin tidak aktif. Sila log masuk semula."
    );

    return;

  }


  const notice =
    allNotices.find(
      (item) =>
        item.id === id
    );


  if (!notice) {

    alert(
      "Makluman tidak dapat dikenal pasti."
    );

    return;

  }


  const confirmed =
    confirm(
      `Adakah anda pasti mahu memadam makluman ini?\n\n${notice.data.title || "Makluman"}\n\nTindakan ini tidak boleh dibatalkan.`
    );


  if (!confirmed) {
    return;
  }


  try {

    await db
      .collection(
        "announcements"
      )
      .doc(id)
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
      "Makluman tidak dapat dipadam."
    );

  }

}


/* =========================================================
   FIREBASE AUTH STATE
========================================================= */

auth.onAuthStateChanged(
  (user) => {

    currentUser = user;


    if (archiveAddNoticeBtn) {

      if (user) {

        archiveAddNoticeBtn
          .classList
          .remove(
            "hidden"
          );

        archiveAddNoticeBtn
          .classList
          .add(
            "inline-flex"
          );

      }

      else {

        archiveAddNoticeBtn
          .classList
          .add(
            "hidden"
          );

        archiveAddNoticeBtn
          .classList
          .remove(
            "inline-flex"
          );

      }

    }


    /*
      Render semula supaya butang
      Edit / Padam muncul atau hilang
      mengikut status Firebase Auth.
    */

    renderNotices();

  }
);


/* =========================================================
   REALTIME FIRESTORE LISTENER
========================================================= */

function loadNotices() {

  showLoading();


  db
    .collection(
      "announcements"
    )
    .orderBy(
      "createdAt",
      "desc"
    )
    .onSnapshot(

      (snapshot) => {

        allNotices =
          snapshot.docs.map(
            (doc) => ({

              id: doc.id,

              data: doc.data()

            })
          );


        renderNotices();

      },


      (error) => {

        console.error(
          "Ralat memuatkan makluman:",
          error
        );


        showEmpty();

      }

    );

}


/* =========================================================
   START
========================================================= */

updateFilterButtons();

loadNotices();


if (window.lucide) {

  lucide.createIcons();

}