/* =========================================================
   PPM DAERAH BALING
   GALLERY INTERACTIONS
   MULTI VIDEO ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     GET ALL VIDEO CARDS
  ===================================================== */

  const videoCards =
    document.querySelectorAll("[data-video-id]");

  if (!videoCards.length) {
    return;
  }


  /* =====================================================
     SAVED COMMENT NAME
  ===================================================== */

  const savedName =
    localStorage.getItem("ppm-comment-name") || "";


  /* =====================================================
     INITIALIZE EACH VIDEO
  ===================================================== */

  videoCards.forEach((card) => {

    const videoId =
      card.dataset.videoId;

    if (!videoId) {
      return;
    }


    /* ===================================================
       ELEMENTS
    =================================================== */

    const likeButton =
      card.querySelector("[data-like-button]");

    const likeCount =
      card.querySelector("[data-like-count]");

    const commentButton =
      card.querySelector("[data-comment-button]");

    const commentCount =
      card.querySelector("[data-comment-count]");

    const commentPanel =
      card.querySelector("[data-comment-panel]");

    const commentName =
      card.querySelector("[data-comment-name]");

    const commentText =
      card.querySelector("[data-comment-text]");

    const submitComment =
      card.querySelector("[data-submit-comment]");

    const commentList =
      card.querySelector("[data-comment-list]");


    /* ===================================================
       FIRESTORE REFERENCES
    =================================================== */

    const videoRef =
      db.collection("galleryVideos").doc(videoId);

    const commentsRef =
      videoRef.collection("comments");


    /* ===================================================
       LOAD LIKE COUNT
    =================================================== */

    if (likeCount) {

      videoRef.onSnapshot(
        (doc) => {

          if (!doc.exists) {

            likeCount.textContent = "0";
            return;

          }

          const data = doc.data();

          likeCount.textContent =
            data.likes || 0;

        },

        (error) => {

          console.error(
            `[PPM BALING] Gagal membaca Like ${videoId}:`,
            error
          );

        }
      );

    }


    /* ===================================================
       LOCAL LIKE STATUS
    =================================================== */

    const likeStorageKey =
      `ppm-liked-${videoId}`;


    function showLikedState() {

      if (!likeButton) {
        return;
      }

      likeButton.classList.add(
        "text-red-500"
      );

      const heart =
        likeButton.querySelector(
          '[data-lucide="heart"]'
        );

      if (heart) {

        heart.setAttribute(
          "fill",
          "currentColor"
        );

      }

    }


    if (
      localStorage.getItem(
        likeStorageKey
      )
    ) {

      showLikedState();

    }


    /* ===================================================
       LIKE BUTTON
    =================================================== */

    if (likeButton) {

      likeButton.addEventListener(
        "click",
        async () => {

          if (
            localStorage.getItem(
              likeStorageKey
            )
          ) {
            return;
          }

          likeButton.disabled = true;

          try {

            await videoRef.set(
              {
                likes:
                  firebase.firestore
                    .FieldValue
                    .increment(1),

                updatedAt:
                  firebase.firestore
                    .FieldValue
                    .serverTimestamp()
              },
              {
                merge: true
              }
            );


            localStorage.setItem(
              likeStorageKey,
              "true"
            );


            showLikedState();


            if (window.lucide) {
              lucide.createIcons();
            }

          }

          catch (error) {

            console.error(
              `[PPM BALING] Like gagal ${videoId}:`,
              error
            );

          }

          finally {

            likeButton.disabled = false;

          }

        }
      );

    }


    /* ===================================================
       OPEN / CLOSE COMMENT PANEL
    =================================================== */

    if (
      commentButton &&
      commentPanel
    ) {

      commentButton.addEventListener(
        "click",
        () => {

          commentPanel.classList.toggle(
            "hidden"
          );


          if (
            !commentPanel.classList.contains(
              "hidden"
            )
          ) {

            if (commentName) {
              commentName.focus();
            }

          }

        }
      );

    }


    /* ===================================================
       RESTORE SAVED NAME
    =================================================== */

    if (
      savedName &&
      commentName
    ) {

      commentName.value =
        savedName;

    }


    /* ===================================================
       LOAD COMMENTS
    =================================================== */

    commentsRef
      .orderBy("createdAt", "desc")
      .onSnapshot(

        (snapshot) => {

          /* ================= COUNT ================= */

          if (commentCount) {

            commentCount.textContent =
              snapshot.size;

          }


          if (!commentList) {
            return;
          }


          /* ================= CLEAR LIST ================= */

          commentList.innerHTML = "";


          /* ================= EMPTY ================= */

          if (snapshot.empty) {

            const emptyMessage =
              document.createElement("p");

            emptyMessage.className =
              "text-sm text-slate-400";

            emptyMessage.textContent =
              "Belum ada komen. Jadilah yang pertama memberikan komen.";

            commentList.appendChild(
              emptyMessage
            );

            return;

          }


          /* ================= COMMENTS ================= */

          snapshot.forEach((commentDoc) => {

            const data =
              commentDoc.data();


            const item =
              document.createElement("div");

            item.className =
              "rounded-xl border border-slate-200 bg-slate-50 p-4";


            /* ================= NAME ================= */

            const name =
              document.createElement("div");

            name.className =
              "text-sm font-bold text-slate-900";

            name.textContent =
              data.name || "Pengguna";


            /* ================= COMMENT ================= */

            const text =
              document.createElement("p");

            text.className =
              "mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600";

            text.textContent =
              data.comment || "";


            /* ================= DATE ================= */

            const date =
              document.createElement("div");

            date.className =
              "mt-2 text-[11px] font-medium text-slate-400";


            if (
              data.createdAt &&
              data.createdAt.toDate
            ) {

              date.textContent =
                data.createdAt
                  .toDate()
                  .toLocaleString(
                    "ms-MY",
                    {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }
                  );

            }

            else {

              date.textContent =
                "Baru sahaja";

            }


            /* ================= APPEND ================= */

            item.appendChild(name);

            item.appendChild(text);

            item.appendChild(date);

            commentList.appendChild(
              item
            );

          });

        },


        /* ================= ERROR ================= */

        (error) => {

          console.error(
            `[PPM BALING] Gagal membaca komen ${videoId}:`,
            error
          );

        }

      );


    /* ===================================================
       SUBMIT COMMENT
    =================================================== */

    if (
      submitComment &&
      commentName &&
      commentText
    ) {

      submitComment.addEventListener(
        "click",
        async () => {

          const name =
            commentName.value.trim();

          const comment =
            commentText.value.trim();


          /* ================= VALIDATION ================= */

          if (!name) {

            alert(
              "Sila masukkan nama."
            );

            commentName.focus();

            return;

          }


          if (!comment) {

            alert(
              "Sila tulis komen."
            );

            commentText.focus();

            return;

          }


          if (name.length > 50) {

            alert(
              "Nama tidak boleh melebihi 50 aksara."
            );

            return;

          }


          if (comment.length > 300) {

            alert(
              "Komen tidak boleh melebihi 300 aksara."
            );

            return;

          }


          /* ================= DISABLE ================= */

          submitComment.disabled = true;

          const originalHTML =
            submitComment.innerHTML;

          submitComment.textContent =
            "Menghantar...";


          try {

            /* ================= FIRESTORE ================= */

            await commentsRef.add({

              name: name,

              comment: comment,

              createdAt:
                firebase.firestore
                  .FieldValue
                  .serverTimestamp()

            });


            /* ================= SAVE NAME ================= */

            localStorage.setItem(
              "ppm-comment-name",
              name
            );


            /* ================= UPDATE OTHER FORMS ================= */

            document
              .querySelectorAll(
                "[data-comment-name]"
              )
              .forEach((input) => {

                input.value = name;

              });


            /* ================= CLEAR COMMENT ================= */

            commentText.value = "";


            console.log(
              `[PPM BALING] Komen berjaya dihantar: ${videoId}`
            );

          }

          catch (error) {

            console.error(
              `[PPM BALING] Komen gagal ${videoId}:`,
              error
            );


            alert(
              "Komen tidak dapat dihantar. Sila cuba lagi."
            );

          }

          finally {

            submitComment.disabled = false;

            submitComment.innerHTML =
              originalHTML;


            if (window.lucide) {
              lucide.createIcons();
            }

          }

        }
      );

    }

  });


  /* =====================================================
     REFRESH LUCIDE ICONS
  ===================================================== */

  if (window.lucide) {
    lucide.createIcons();
  }

});