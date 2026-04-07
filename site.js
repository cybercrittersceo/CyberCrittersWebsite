document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.querySelector(".menu-toggle");
  var siteMenu = document.getElementById("site-menu");
  var menuCloseTargets = document.querySelectorAll("[data-menu-close], [data-menu-link]");
  var body = document.body;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function closeMenu() {
    body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  }

  function openMenu() {
    body.classList.add("menu-open");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation menu");
    }
  }

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", function () {
      if (body.classList.contains("menu-open")) {
        closeMenu();
        return;
      }

      openMenu();
    });

    menuCloseTargets.forEach(function (target) {
      target.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  initMissionTyping();
  initFaqSequence();
  initTeamScreen();
  initTiltedCards();
  initBlogResearchPage();
  initArticlePage();

  function initMissionTyping() {
    var missionText = document.querySelector(".hero-mission[data-full-text]");
    var fullText;
    var index = 0;

    if (!missionText) {
      return;
    }

    fullText = missionText.dataset.fullText || missionText.textContent.trim();

    if (prefersReducedMotion.matches) {
      missionText.textContent = fullText;
      missionText.classList.add("is-complete");
      return;
    }

    missionText.textContent = "";
    missionText.classList.add("is-typing");

    function typeNextCharacter() {
      if (index < fullText.length) {
        missionText.textContent += fullText.charAt(index);
        index += 1;
        window.setTimeout(typeNextCharacter, 24);
        return;
      }

      missionText.classList.remove("is-typing");
      missionText.classList.add("is-complete");
    }

    window.setTimeout(typeNextCharacter, 250);
  }

  function initFaqSequence() {
    var faqSection = document.getElementById("faq");
    var faqSteps = Array.prototype.slice.call(document.querySelectorAll("[data-faq-step]"));
    var faqStatus = document.querySelector("[data-faq-status]");
    var faqHost = document.querySelector("[data-faq-host]");
    var hasStarted = false;

    if (!faqSection || !faqSteps.length) {
      return;
    }

    function showAllFaqSteps() {
      faqSteps.forEach(function (step) {
        step.classList.add("is-question-visible", "is-answer-visible", "is-complete");
      });

      if (faqStatus) {
        faqStatus.textContent = "";
        faqStatus.setAttribute("hidden", "");
      }
    }

    if (prefersReducedMotion.matches) {
      showAllFaqSteps();
      return;
    }

    function animateHost(questionText) {
      if (faqStatus) {
        faqStatus.removeAttribute("hidden");
        faqStatus.textContent = questionText;
      }

      if (!faqHost) {
        return;
      }

      faqHost.classList.remove("is-speaking");
      void faqHost.offsetWidth;
      faqHost.classList.add("is-speaking");

      window.setTimeout(function () {
        faqHost.classList.remove("is-speaking");
      }, 720);
    }

    function revealStep(index) {
      var step;
      var questionText;

      if (index >= faqSteps.length) {
        if (faqStatus) {
          faqStatus.textContent = "";
          faqStatus.setAttribute("hidden", "");
        }

        return;
      }

      step = faqSteps[index];
      questionText = step.getAttribute("data-faq-question") || "Here comes the next question.";

      animateHost(questionText);
      step.classList.add("is-question-visible");

      window.setTimeout(function () {
        step.classList.add("is-answer-visible");
      }, 420);

      window.setTimeout(function () {
        step.classList.add("is-complete");
        revealStep(index + 1);
      }, 1900);
    }

    if (!("IntersectionObserver" in window)) {
      revealStep(0);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || hasStarted) {
            return;
          }

          hasStarted = true;
          observer.disconnect();
          window.setTimeout(function () {
            revealStep(0);
          }, 220);
        });
      },
      {
        threshold: 0.28
      }
    );

    observer.observe(faqSection);
  }

  function initTeamScreen() {
    var teamScreen = document.querySelector("[data-team-screen]");
    var hasStarted = false;
    var timers = [];

    if (!teamScreen) {
      return;
    }

    function clearTeamTimers() {
      timers.forEach(function (timer) {
        window.clearTimeout(timer);
      });

      timers = [];
    }

    function setTeamState(stateName) {
      teamScreen.classList.remove("is-static", "is-powering-on", "is-on", "is-impact", "is-powering-off", "is-off");

      if (stateName) {
        teamScreen.classList.add(stateName);
      }
    }

    function runTeamSequence() {
      clearTeamTimers();
      setTeamState("is-static");

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-powering-on");
        }, 760)
      );

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-on");
        }, 1460)
      );

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-impact");
        }, 2760)
      );

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-on");
        }, 3360)
      );

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-powering-off");
        }, 5120)
      );

      timers.push(
        window.setTimeout(function () {
          setTeamState("is-off");
        }, 5860)
      );

      timers.push(
        window.setTimeout(function () {
          runTeamSequence();
        }, 8280)
      );
    }

    if (prefersReducedMotion.matches) {
      setTeamState("is-on");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      runTeamSequence();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || hasStarted) {
            return;
          }

          hasStarted = true;
          observer.disconnect();
          runTeamSequence();
        });
      },
      {
        threshold: 0.4
      }
    );

    observer.observe(teamScreen);
  }

  function initTiltedCards() {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tilted-card]"));
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!cards.length || !canHover || prefersReducedMotion.matches) {
      return;
    }

    cards.forEach(function (card) {
      var scene = card.querySelector(".tilted-member-scene");
      var surface = card.querySelector(".tilted-member-surface");
      var tooltip = card.querySelector(".tilted-member-tooltip");
      var rafId = null;
      var nextState = null;

      if (!scene || !surface || !tooltip) {
        return;
      }

      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }

      function applyState() {
        if (!nextState) {
          return;
        }

        card.style.setProperty("--tilt-x", nextState.tiltX + "deg");
        card.style.setProperty("--tilt-y", nextState.tiltY + "deg");
        card.style.setProperty("--glare-x", nextState.glareX + "%");
        card.style.setProperty("--glare-y", nextState.glareY + "%");
        card.style.setProperty("--caption-x", nextState.captionX + "px");
        card.style.setProperty("--caption-y", nextState.captionY + "px");
        card.style.setProperty("--caption-opacity", nextState.captionOpacity);
        card.style.setProperty("--card-scale", nextState.scale);
        rafId = null;
      }

      function queueState(state) {
        nextState = state;

        if (rafId !== null) {
          return;
        }

        rafId = window.requestAnimationFrame(applyState);
      }

      function resetCard() {
        queueState({
          tiltX: 0,
          tiltY: 0,
          glareX: 50,
          glareY: 50,
          captionX: 14,
          captionY: 14,
          captionOpacity: 0,
          scale: 1
        });
      }

      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var surfaceRect = surface.getBoundingClientRect();
        var relX = (event.clientX - rect.left) / rect.width;
        var relY = (event.clientY - rect.top) / rect.height;
        var centeredX = relX - 0.5;
        var centeredY = relY - 0.5;
        var tooltipWidth = tooltip.offsetWidth;
        var tooltipHeight = tooltip.offsetHeight;
        var inset = 12;
        var pointerX = event.clientX - surfaceRect.left;
        var pointerY = event.clientY - surfaceRect.top;
        var captionX = pointerX + 18;
        var captionY = pointerY - tooltipHeight - 14;

        if (captionY < inset) {
          captionY = pointerY + 18;
        }

        captionX = clamp(captionX, inset, Math.max(inset, surfaceRect.width - tooltipWidth - inset));
        captionY = clamp(captionY, inset, Math.max(inset, surfaceRect.height - tooltipHeight - inset));

        queueState({
          tiltX: centeredY * -12,
          tiltY: centeredX * 16,
          glareX: relX * 100,
          glareY: relY * 100,
          captionX: captionX,
          captionY: captionY,
          captionOpacity: 1,
          scale: 1.01
        });
      });

      card.addEventListener("pointerenter", function () {
        card.classList.add("is-tilting");
      });

      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        resetCard();
      });

      resetCard();
    });
  }

  function initBlogResearchPage() {
    var articlesFeed = document.querySelector("[data-articles-feed]");
    var iggyFeed = document.querySelector("[data-iggy-feed]");
    var articlesEmpty = document.querySelector("[data-articles-empty]");
    var iggyEmpty = document.querySelector("[data-iggy-empty]");
    var adminPanel = document.querySelector("[data-blog-admin-panel]");
    var unlockForm = document.querySelector("[data-blog-unlock-form]");
    var unlockInput = document.getElementById("blog-admin-password");
    var adminFeedback = document.querySelector("[data-blog-admin-feedback]");
    var composer = document.querySelector("[data-blog-composer]");
    var lockButton = document.querySelector("[data-blog-lock]");
    var articleForm = document.querySelector("[data-article-form]");
    var tipForm = document.querySelector("[data-tip-form]");
    var formFeedback = document.querySelector("[data-blog-form-feedback]");
    var typeTabs = document.querySelectorAll("[data-post-type]");
    var articlesStorageKey = "cybercritters_articles";
    var iggyStorageKey = "cybercritters_iggy_tips";
    var unlockKey = "cybercritters_blog_admin_unlocked";
    var adminPassword = "Critters2026";
    var canUseLocalStorage = supportsStorage("localStorage");
    var canUseSessionStorage = supportsStorage("sessionStorage");
    var fallbackArticles = [];
    var fallbackTips = [];
    var fallbackUnlocked = false;
    var storedArticles;
    var storedTips;
    var activePostType = "article";
    var dateFormatter =
      typeof Intl !== "undefined" && Intl.DateTimeFormat
        ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    if (!articlesFeed && !iggyFeed) {
      return;
    }

    storedArticles = getStoredItems(articlesStorageKey, fallbackArticles, isValidArticle);
    storedTips = getStoredItems(iggyStorageKey, fallbackTips, isValidTip);
    renderArticles(storedArticles);
    renderTips(storedTips);
    syncAdminState();

    // ── Type tabs ──
    typeTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activePostType = tab.dataset.postType;
        typeTabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        if (articleForm) { articleForm.hidden = activePostType !== "article"; }
        if (tipForm) { tipForm.hidden = activePostType !== "tip"; }
        clearFeedback(formFeedback);
      });
    });

    // ── Unlock ──
    if (unlockForm) {
      unlockForm.addEventListener("submit", function (event) {
        var entered;
        event.preventDefault();
        entered = unlockInput ? unlockInput.value.trim() : "";

        if (entered !== adminPassword) {
          setFeedback(adminFeedback, "Password incorrect. Admin access is still locked.", "error");
          return;
        }

        setUnlockedState(true);
        syncAdminState();
        unlockForm.reset();
        clearFeedback(adminFeedback);
        setFeedback(formFeedback, "Admin access unlocked.", "success");

        var firstInput = composer ? composer.querySelector("input, textarea") : null;
        if (firstInput) { firstInput.focus(); }
      });
    }

    // ── Lock ──
    if (lockButton) {
      lockButton.addEventListener("click", function () {
        setUnlockedState(false);
        syncAdminState();
        clearFeedback(formFeedback);
        setFeedback(adminFeedback, "Admin access locked again.", "success");
        if (unlockInput) { unlockInput.focus(); }
      });
    }

    // ── Article form ──
    if (articleForm) {
      articleForm.addEventListener("submit", function (event) {
        var formData, title, bodyText, imageFile;
        event.preventDefault();

        if (!getUnlockedState()) {
          setFeedback(formFeedback, "Unlock the composer before publishing.", "error");
          return;
        }

        formData = new FormData(articleForm);
        title = normalizeText(formData.get("title"));
        bodyText = normalizeBody(formData.get("body"));
        imageFile = getImageFile(formData.get("image"));

        if (!title || !bodyText) {
          setFeedback(formFeedback, "Title and article body are required.", "error");
          return;
        }

        clearFeedback(formFeedback);

        preparePostImage(imageFile, title, function (error, imageData) {
          var now, newArticle, next, saved;

          if (error) { setFeedback(formFeedback, error, "error"); return; }

          now = new Date();
          newArticle = {
            id: "article-" + now.getTime(),
            title: title,
            body: bodyText,
            imageSrc: imageData ? imageData.src : "",
            imageAlt: imageData ? imageData.alt : "",
            isoDate: now.toISOString().slice(0, 10),
            dateLabel: formatDate(now)
          };

          next = [newArticle].concat(storedArticles);
          saved = saveStoredItems(articlesStorageKey, next, fallbackArticles);

          if (!saved) {
            setFeedback(formFeedback, imageData ? "Could not save — try a smaller image." : "Could not save in this browser.", "error");
            return;
          }

          storedArticles = next;
          articlesFeed.insertBefore(createArticleCard(newArticle), articlesFeed.firstChild);
          syncEmpty();
          articleForm.reset();
          setFeedback(formFeedback, canUseLocalStorage ? "Article published." : "Article added for this visit only.", "success");
        });
      });
    }

    // ── Iggy Tip form ──
    if (tipForm) {
      tipForm.addEventListener("submit", function (event) {
        var formData, caption, imageFile;
        event.preventDefault();

        if (!getUnlockedState()) {
          setFeedback(formFeedback, "Unlock the composer before posting.", "error");
          return;
        }

        formData = new FormData(tipForm);
        caption = normalizeText(formData.get("caption"));
        imageFile = getImageFile(formData.get("image"));

        if (!caption) {
          setFeedback(formFeedback, "A caption is required.", "error");
          return;
        }

        if (!imageFile) {
          setFeedback(formFeedback, "An image is required for Iggy Tips.", "error");
          return;
        }

        clearFeedback(formFeedback);

        preparePostImage(imageFile, caption, function (error, imageData) {
          var now, newTip, next, saved;

          if (error) { setFeedback(formFeedback, error, "error"); return; }

          if (!imageData) {
            setFeedback(formFeedback, "Image could not be processed.", "error");
            return;
          }

          now = new Date();
          newTip = {
            id: "tip-" + now.getTime(),
            caption: caption,
            imageSrc: imageData.src,
            imageAlt: imageData.alt,
            isoDate: now.toISOString().slice(0, 10),
            dateLabel: formatDate(now)
          };

          next = [newTip].concat(storedTips);
          saved = saveStoredItems(iggyStorageKey, next, fallbackTips);

          if (!saved) {
            setFeedback(formFeedback, "Could not save — try a smaller image.", "error");
            return;
          }

          storedTips = next;
          iggyFeed.insertBefore(createTipCard(newTip), iggyFeed.firstChild);
          syncEmpty();
          tipForm.reset();
          setFeedback(formFeedback, canUseLocalStorage ? "Tip posted." : "Tip added for this visit only.", "success");
        });
      });
    }

    // ── Render helpers ──
    function renderArticles(articles) {
      var fragment;
      if (!articles.length) { syncEmpty(); return; }
      fragment = document.createDocumentFragment();
      articles.forEach(function (a) { fragment.appendChild(createArticleCard(a)); });
      articlesFeed.appendChild(fragment);
      syncEmpty();
    }

    function renderTips(tips) {
      var fragment;
      if (!tips.length) { syncEmpty(); return; }
      fragment = document.createDocumentFragment();
      tips.forEach(function (t) { fragment.appendChild(createTipCard(t)); });
      iggyFeed.appendChild(fragment);
      syncEmpty();
    }

    function syncEmpty() {
      if (articlesEmpty) { articlesEmpty.hidden = articlesFeed.children.length > 0; }
      if (iggyEmpty) { iggyEmpty.hidden = iggyFeed.children.length > 0; }
    }

    function createArticleCard(post) {
      var article = document.createElement("article");
      var meta = document.createElement("div");
      var date = document.createElement("time");
      var titleEl;
      var image;
      var deleteBtn;
      var readMoreLink;
      var articleUrl = post.id ? "article.html?id=" + encodeURIComponent(post.id) : null;

      article.className = "blog-post-card blog-post-card--local";

      meta.className = "blog-post-meta";
      meta.appendChild(createChip("blog-post-type", "Article"));

      date.className = "blog-post-date";
      date.textContent = post.dateLabel;
      if (post.isoDate) { date.setAttribute("datetime", post.isoDate); }
      meta.appendChild(date);

      if (post.imageSrc) { image = createBlogPostImage(post); }

      if (articleUrl) {
        titleEl = document.createElement("a");
        titleEl.href = articleUrl;
        titleEl.className = "blog-post-title blog-post-title-link";
      } else {
        titleEl = document.createElement("h3");
        titleEl.className = "blog-post-title";
      }
      titleEl.textContent = post.title;

      if (articleUrl) {
        readMoreLink = document.createElement("a");
        readMoreLink.href = articleUrl;
        readMoreLink.className = "blog-read-more";
        readMoreLink.textContent = "Read full article \u2192";
      }

      deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "blog-delete-btn";
      deleteBtn.textContent = "Delete article";
      deleteBtn.setAttribute("aria-label", "Delete article: " + post.title);
      deleteBtn.style.display = getUnlockedState() ? "" : "none";
      deleteBtn.addEventListener("click", function () {
        if (!getUnlockedState()) { return; }
        if (!window.confirm("Delete \"" + post.title + "\"? This cannot be undone.")) { return; }
        storedArticles = storedArticles.filter(function (a) { return a !== post; });
        saveStoredItems(articlesStorageKey, storedArticles, fallbackArticles);
        if (article.parentNode) { article.parentNode.removeChild(article); }
        syncEmpty();
      });

      var cardFooter = document.createElement("div");
      cardFooter.className = "blog-card-footer";
      if (readMoreLink) { cardFooter.appendChild(readMoreLink); }
      cardFooter.appendChild(deleteBtn);

      article.appendChild(meta);
      if (image) { article.appendChild(image); }
      article.appendChild(titleEl);
      article.appendChild(cardFooter);

      return article;
    }

    function createTipCard(tip) {
      var card = document.createElement("figure");
      var img = document.createElement("img");
      var caption = document.createElement("figcaption");
      var deleteBtn;

      card.className = "iggy-tip-card";
      img.className = "iggy-tip-image";
      img.src = tip.imageSrc;
      img.alt = tip.imageAlt || tip.caption;
      img.loading = "lazy";
      img.decoding = "async";

      caption.className = "iggy-tip-caption";
      caption.textContent = tip.caption;

      deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "blog-delete-btn";
      deleteBtn.textContent = "Delete tip";
      deleteBtn.setAttribute("aria-label", "Delete tip: " + tip.caption);
      deleteBtn.style.display = getUnlockedState() ? "" : "none";
      deleteBtn.addEventListener("click", function () {
        if (!getUnlockedState()) { return; }
        if (!window.confirm("Delete tip \"" + tip.caption + "\"? This cannot be undone.")) { return; }
        storedTips = storedTips.filter(function (t) { return t !== tip; });
        saveStoredItems(iggyStorageKey, storedTips, fallbackTips);
        if (card.parentNode) { card.parentNode.removeChild(card); }
        syncEmpty();
      });

      card.appendChild(img);
      card.appendChild(caption);
      card.appendChild(deleteBtn);

      return card;
    }

    function createBlogPostImage(post) {
      var media = document.createElement("figure");
      var image = document.createElement("img");
      media.className = "blog-post-media";
      image.className = "blog-post-image";
      image.src = post.imageSrc;
      image.alt = post.imageAlt || post.title;
      image.loading = "lazy";
      image.decoding = "async";
      media.appendChild(image);
      return media;
    }

    function createChip(className, text) {
      var chip = document.createElement("span");
      chip.className = className;
      chip.textContent = text;
      return chip;
    }

    // ── Storage helpers ──
    function supportsStorage(storageName) {
      var storage;
      var probe = "__cybercritters_probe__";
      try {
        storage = window[storageName];
        storage.setItem(probe, probe);
        storage.removeItem(probe);
        return true;
      } catch (e) {
        return false;
      }
    }

    function getStoredItems(key, fallback, validator) {
      var raw, parsed;
      if (!canUseLocalStorage) { return fallback.slice(); }
      try {
        raw = window.localStorage.getItem(key);
        parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) { return []; }
        return parsed.filter(validator);
      } catch (e) {
        return [];
      }
    }

    function saveStoredItems(key, items, fallback) {
      if (!canUseLocalStorage) {
        fallback.length = 0;
        items.forEach(function (i) { fallback.push(i); });
        return true;
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(items));
        return true;
      } catch (e) {
        return false;
      }
    }

    function isValidArticle(post) {
      return post && typeof post.title === "string" && typeof post.body === "string" && typeof post.dateLabel === "string";
    }

    function isValidTip(tip) {
      return tip && typeof tip.caption === "string" && typeof tip.imageSrc === "string" && typeof tip.dateLabel === "string";
    }

    // ── Utilities ──
    function normalizeText(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    }

    function normalizeBody(value) {
      return String(value || "").replace(/\r\n/g, "\n").trim();
    }

    function getImageFile(value) {
      if (!value || typeof value !== "object") { return null; }
      if (typeof value.name !== "string" || !value.name) { return null; }
      if (typeof value.size === "number" && value.size <= 0) { return null; }
      return value;
    }

    function preparePostImage(file, label, callback) {
      var reader;
      if (!file) { callback(null, null); return; }
      if (typeof file.type === "string" && file.type.indexOf("image/") !== 0) {
        callback("Choose an image file.", null); return;
      }
      if (typeof FileReader === "undefined") {
        callback("This browser cannot read image files.", null); return;
      }
      reader = new FileReader();
      reader.onload = function () {
        var preview = new Image();
        preview.onload = function () {
          var result = resizeImageData(preview, file);
          if (!result) { callback("Image could not be processed.", null); return; }
          callback(null, { src: result, alt: label });
        };
        preview.onerror = function () { callback("Image could not be opened.", null); };
        preview.src = String(reader.result || "");
      };
      reader.onerror = function () { callback("Image could not be read.", null); };
      reader.readAsDataURL(file);
    }

    function resizeImageData(image, file) {
      var canvas, context;
      var width = image.naturalWidth || image.width;
      var height = image.naturalHeight || image.height;
      var scale;
      var type = file && file.type === "image/png" ? "image/png" : "image/jpeg";
      if (!width || !height) { return ""; }
      scale = Math.min(1, 1280 / width, 960 / height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      context = canvas.getContext("2d");
      if (!context) { return ""; }
      if (type === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height); }
      context.drawImage(image, 0, 0, width, height);
      try {
        return type === "image/png" ? canvas.toDataURL(type) : canvas.toDataURL(type, 0.84);
      } catch (e) { return ""; }
    }

    function formatDate(date) {
      return dateFormatter ? dateFormatter.format(date) : date.toDateString();
    }

    function syncAdminState() {
      var isUnlocked = getUnlockedState();
      var deleteBtns = document.querySelectorAll(".blog-delete-btn");
      if (!adminPanel || !composer) { return; }
      adminPanel.classList.toggle("is-unlocked", isUnlocked);
      composer.hidden = !isUnlocked;
      deleteBtns.forEach(function (btn) { btn.style.display = isUnlocked ? "" : "none"; });
    }

    function getUnlockedState() {
      if (!canUseSessionStorage) { return fallbackUnlocked; }
      try { return window.sessionStorage.getItem(unlockKey) === "true"; } catch (e) { return false; }
    }

    function setUnlockedState(value) {
      if (!canUseSessionStorage) { fallbackUnlocked = value; return; }
      try {
        if (value) { window.sessionStorage.setItem(unlockKey, "true"); }
        else { window.sessionStorage.removeItem(unlockKey); }
      } catch (e) { fallbackUnlocked = value; }
    }

    function clearFeedback(target) {
      if (!target) { return; }
      target.textContent = "";
      target.classList.remove("is-error", "is-success");
    }

    function setFeedback(target, message, tone) {
      if (!target) { return; }
      target.textContent = message;
      target.classList.remove("is-error", "is-success");
      if (tone === "error") { target.classList.add("is-error"); }
      if (tone === "success") { target.classList.add("is-success"); }
    }
  }

  function initArticlePage() {
    var shell = document.querySelector("[data-article-page]");
    var articlesStorageKey = "cybercritters_articles";
    var params, articleId, raw, articles, post;

    if (!shell) { return; }

    params = new URLSearchParams(window.location.search);
    articleId = params.get("id");

    function renderNotFound() {
      shell.innerHTML =
        "<p class=\"article-page-not-found\">Article not found. It may have been deleted or this link is no longer valid.</p>" +
        "<a href=\"blog.html\" class=\"article-back-link\">\u2190 Back to Blog</a>";
    }

    if (!articleId) { renderNotFound(); return; }

    try {
      raw = window.localStorage.getItem(articlesStorageKey);
      articles = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(articles)) { articles = []; }
    } catch (e) { articles = []; }

    post = null;
    articles.forEach(function (a) { if (a && a.id === articleId) { post = a; } });

    if (!post) { renderNotFound(); return; }

    document.title = post.title + " \u2014 CyberCritters";

    shell.innerHTML = "";

    var backLink = document.createElement("a");
    backLink.href = "blog.html";
    backLink.className = "article-back-link";
    backLink.textContent = "\u2190 Back to Blog";
    shell.appendChild(backLink);

    var card = document.createElement("article");
    card.className = "article-full-card";

    var meta = document.createElement("div");
    meta.className = "blog-post-meta";
    var chip = document.createElement("span");
    chip.className = "blog-post-type";
    chip.textContent = "Article";
    var dateEl = document.createElement("time");
    dateEl.className = "blog-post-date";
    dateEl.textContent = post.dateLabel;
    if (post.isoDate) { dateEl.setAttribute("datetime", post.isoDate); }
    meta.appendChild(chip);
    meta.appendChild(dateEl);
    card.appendChild(meta);

    if (post.imageSrc) {
      var figure = document.createElement("figure");
      var img = document.createElement("img");
      figure.className = "blog-post-media";
      img.className = "blog-post-image";
      img.src = post.imageSrc;
      img.alt = post.imageAlt || post.title;
      img.loading = "eager";
      img.decoding = "async";
      figure.appendChild(img);
      card.appendChild(figure);
    }

    var titleEl = document.createElement("h1");
    titleEl.className = "article-full-title";
    titleEl.textContent = post.title;
    card.appendChild(titleEl);

    var bodyEl = document.createElement("div");
    bodyEl.className = "article-full-body";
    var paragraphs = String(post.body || "")
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n\s*\n/)
      .map(function (p) { return p.replace(/\s*\n+\s*/g, " ").trim(); })
      .filter(Boolean);
    paragraphs.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      bodyEl.appendChild(p);
    });
    card.appendChild(bodyEl);

    shell.appendChild(card);
  }

});
