document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.querySelector(".menu-toggle");
  var siteMenu = document.getElementById("site-menu");
  var menuCloseTargets = document.querySelectorAll("[data-menu-close], [data-menu-link]");
  var body = document.body;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var BLOG_ADMIN_PASSWORD = "Critters2026";
  var BLOG_ARTICLES_STORAGE_KEY = "cybercritters_articles";
  var BLOG_IGGY_STORAGE_KEY = "cybercritters_iggy_tips";
  var BLOG_UNLOCK_KEY = "cybercritters_blog_admin_unlocked";
  var BLOG_PUBLISH_TOKEN_KEY = "cybercritters_github_publish_token";
  var ARTICLE_DRAFT_STORAGE_KEY = "cybercritters_article_draft_v3";
  var BLOG_REMOTE_CONFIG = {
    owner: "CyberCrittersCEO",
    repo: "CyberCrittersWebsite",
    branch: "main",
    articlesPath: "data/articles.json",
    tipsPath: "data/iggy-tips.json"
  };
  var canUseLocalStorage = supportsStorage("localStorage");
  var canUseSessionStorage = supportsStorage("sessionStorage");
  var fallbackArticles = [];
  var fallbackTips = [];
  var fallbackUnlocked = false;
  var fallbackDraft = null;
  var dateFormatter =
    typeof Intl !== "undefined" && Intl.DateTimeFormat
      ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" })
      : null;

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
  initArticleEditorPage();
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
    var tipForm = document.querySelector("[data-tip-form]");
    var formFeedback = document.querySelector("[data-blog-form-feedback]");
    var storedArticles;
    var storedTips;

    if (!articlesFeed && !iggyFeed) {
      return;
    }

    storedArticles = [];
    storedTips = [];
    renderArticles(storedArticles);
    renderTips(storedTips);
    loadBlogFeedItems(BLOG_ARTICLES_STORAGE_KEY, fallbackArticles, isValidArticle).then(function (items) {
      storedArticles = items;
      renderArticles(storedArticles);
    });
    loadBlogFeedItems(BLOG_IGGY_STORAGE_KEY, fallbackTips, isValidTip).then(function (items) {
      storedTips = items;
      renderTips(storedTips);
    });
    syncAdminState();

    if (unlockForm) {
      unlockForm.addEventListener("submit", function (event) {
        var entered;
        event.preventDefault();
        entered = unlockInput ? unlockInput.value.trim() : "";

        if (entered !== BLOG_ADMIN_PASSWORD) {
          setFeedback(adminFeedback, "Password incorrect. Admin access is still locked.", "error");
          return;
        }

        setUnlockedState(true);
        syncAdminState();
        unlockForm.reset();
        clearFeedback(adminFeedback);
        setFeedback(formFeedback, "Admin access unlocked. The article builder is ready on its own page.", "success");
      });
    }

    if (lockButton) {
      lockButton.addEventListener("click", function () {
        setUnlockedState(false);
        syncAdminState();
        clearFeedback(formFeedback);
        setFeedback(adminFeedback, "Admin access locked again.", "success");
        if (unlockInput) { unlockInput.focus(); }
      });
    }

    if (tipForm) {
      tipForm.addEventListener("submit", function (event) {
        var formData, caption, imageFile;
        event.preventDefault();

        if (!getUnlockedState()) {
          setFeedback(formFeedback, "Unlock the admin tools before posting.", "error");
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
          var now, newTip, next;

          if (error) {
            setFeedback(formFeedback, error, "error");
            return;
          }

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
          setFeedback(formFeedback, "Publishing tip to GitHub...", "success");
          saveSharedBlogItems(BLOG_IGGY_STORAGE_KEY, next, "Publish Iggy Tip: " + caption).then(function () {
            storedTips = next;
            if (iggyFeed) {
              iggyFeed.insertBefore(createTipCard(newTip), iggyFeed.firstChild);
            }
            syncEmpty();
            syncAdminState();
            tipForm.reset();
            setFeedback(formFeedback, "Tip published for every visitor.", "success");
          }).catch(function (saveError) {
            setFeedback(formFeedback, getPublishErrorMessage(saveError, "Could not publish the tip."), "error");
          });
        });
      });
    }

    function renderArticles(articles) {
      var fragment;

      if (!articlesFeed) {
        return;
      }

      articlesFeed.innerHTML = "";

      if (!articles.length) {
        syncEmpty();
        return;
      }

      fragment = document.createDocumentFragment();
      articles.forEach(function (article) {
        fragment.appendChild(createArticleCard(article));
      });
      articlesFeed.appendChild(fragment);
      syncEmpty();
    }

    function renderTips(tips) {
      var fragment;

      if (!iggyFeed) {
        return;
      }

      iggyFeed.innerHTML = "";

      if (!tips.length) {
        syncEmpty();
        return;
      }

      fragment = document.createDocumentFragment();
      tips.forEach(function (tip) {
        fragment.appendChild(createTipCard(tip));
      });
      iggyFeed.appendChild(fragment);
      syncEmpty();
    }

    function syncEmpty() {
      if (articlesEmpty && articlesFeed) { articlesEmpty.hidden = articlesFeed.children.length > 0; }
      if (iggyEmpty && iggyFeed) { iggyEmpty.hidden = iggyFeed.children.length > 0; }
    }

    function createArticleCard(post) {
      var article = document.createElement("article");
      var meta = document.createElement("div");
      var date = document.createElement("time");
      var titleEl;
      var image;
      var summary;
      var summaryEl;
      var editLink;
      var deleteBtn;
      var readMoreLink;
      var cardFooter = document.createElement("div");
      var articleUrl = post.id ? "article.html?id=" + encodeURIComponent(post.id) : null;
      var editUrl = post.id ? "article-editor.html?edit=" + encodeURIComponent(post.id) : null;

      article.className = "blog-post-card blog-post-card--local";

      meta.className = "blog-post-meta";
      meta.appendChild(createChip("blog-post-type", "Article"));

      if (post.author) {
        meta.appendChild(createChip("blog-post-topic", post.author));
      }

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

      summary = getArticleExcerpt(post);
      if (summary) {
        summaryEl = document.createElement("p");
        summaryEl.className = "blog-post-summary";
        summaryEl.textContent = summary;
      }

      if (articleUrl) {
        readMoreLink = document.createElement("a");
        readMoreLink.href = articleUrl;
        readMoreLink.className = "blog-read-more";
        readMoreLink.textContent = "Read full article \u2192";
      }

      if (editUrl) {
        editLink = document.createElement("a");
        editLink.href = editUrl;
        editLink.className = "blog-read-more blog-edit-link";
        editLink.textContent = "Edit article";
        editLink.style.display = getUnlockedState() ? "" : "none";
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
        storedArticles = storedArticles.filter(function (articleItem) { return articleItem.id !== post.id; });
        saveSharedBlogItems(BLOG_ARTICLES_STORAGE_KEY, storedArticles, "Delete article: " + post.title).then(function () {
          if (article.parentNode) { article.parentNode.removeChild(article); }
          syncEmpty();
        }).catch(function (saveError) {
          loadBlogFeedItems(BLOG_ARTICLES_STORAGE_KEY, fallbackArticles, isValidArticle).then(function (items) {
            storedArticles = items;
            renderArticles(storedArticles);
          });
          setFeedback(formFeedback, getPublishErrorMessage(saveError, "Could not delete the article."), "error");
        });
      });

      cardFooter.className = "blog-card-footer";
      if (readMoreLink) { cardFooter.appendChild(readMoreLink); }
      if (editLink) { cardFooter.appendChild(editLink); }
      cardFooter.appendChild(deleteBtn);

      article.appendChild(meta);
      article.appendChild(titleEl);
      if (image) { article.appendChild(image); }
      if (summaryEl) { article.appendChild(summaryEl); }
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
        storedTips = storedTips.filter(function (tipItem) { return tipItem.id !== tip.id; });
        saveSharedBlogItems(BLOG_IGGY_STORAGE_KEY, storedTips, "Delete Iggy Tip: " + tip.caption).then(function () {
          if (card.parentNode) { card.parentNode.removeChild(card); }
          syncEmpty();
        }).catch(function (saveError) {
          loadBlogFeedItems(BLOG_IGGY_STORAGE_KEY, fallbackTips, isValidTip).then(function (items) {
            storedTips = items;
            renderTips(storedTips);
          });
          setFeedback(formFeedback, getPublishErrorMessage(saveError, "Could not delete the tip."), "error");
        });
      });

      card.appendChild(img);
      card.appendChild(caption);
      card.appendChild(deleteBtn);

      return card;
    }

    function syncAdminState() {
      var isUnlocked = getUnlockedState();
      var adminActions = document.querySelectorAll(".blog-delete-btn, .blog-edit-link");

      if (adminPanel && composer) {
        adminPanel.classList.toggle("is-unlocked", isUnlocked);
        composer.hidden = !isUnlocked;
      }

      adminActions.forEach(function (action) {
        action.style.display = isUnlocked ? "" : "none";
      });
    }
  }

  function initArticleEditorPage() {
    var page = document.querySelector("[data-article-editor-page]");
    var gate = document.querySelector("[data-editor-gate]");
    var workspace = document.querySelector("[data-article-editor]");
    var unlockForm = document.querySelector("[data-editor-unlock-form]");
    var unlockInput = document.getElementById("editor-admin-password");
    var gateFeedback = document.querySelector("[data-editor-gate-feedback]");
    var workspaceTitle = document.querySelector(".article-editor-page-title--workspace");
    var workspaceCopy = workspace ? workspace.querySelector(".article-editor-page-copy") : null;
    var titleInput = document.querySelector("[data-editor-title]");
    var authorInput = document.querySelector("[data-editor-author]");
    var coverInput = document.querySelector("[data-editor-cover]");
    var canvas = document.querySelector("[data-editor-canvas]");
    var feedback = document.querySelector("[data-editor-feedback]");
    var publishButton = document.querySelector("[data-editor-publish]");
    var resetButton = document.querySelector("[data-editor-reset]");
    var blockStyleSelect = document.querySelector("[data-editor-block-style]");
    var fontSelect = document.querySelector("[data-editor-font]");
    var fontSizeSelect = document.querySelector("[data-editor-font-size]");
    var textColorInput = document.querySelector("[data-editor-text-color]");
    var toolButtons = document.querySelectorAll("[data-editor-command]");
    var insertButtons = document.querySelectorAll("[data-editor-insert]");
    var inlineImageInput = document.querySelector("[data-editor-inline-image]");
    var paletteButtons = document.querySelectorAll("[data-palette-block]");
    var activeEditable = null;
    var savedRange = null;
    var draftTimer = null;
    var currentCoverImage = null;
    var restoredDraft = false;
    var pendingImageBlock = null;
    var draggedBlock = null;
    var draggedPaletteType = "";
    var blockSequence = 0;
    var editArticleId = new URLSearchParams(window.location.search).get("edit");
    var editingArticle = null;

    if (!page) {
      return;
    }

    enableEditorStylingMode();
    syncEditorState();

    if (unlockForm) {
      unlockForm.addEventListener("submit", function (event) {
        var entered;
        event.preventDefault();
        entered = unlockInput ? unlockInput.value.trim() : "";

        if (entered !== BLOG_ADMIN_PASSWORD) {
          setFeedback(gateFeedback, "Password incorrect. Admin access is still locked.", "error");
          return;
        }

        setUnlockedState(true);
        clearFeedback(gateFeedback);
        unlockForm.reset();
        syncEditorState();
        if (titleInput) { titleInput.focus(); }
      });
    }

    if (!canvas) {
      return;
    }

    [titleInput, authorInput].forEach(function (field) {
      if (!field) { return; }
      field.addEventListener("input", scheduleDraftSave);
    });

    if (coverInput) {
      coverInput.addEventListener("change", function () {
        var file = getImageFile(coverInput.files && coverInput.files[0]);
        if (!file) {
          currentCoverImage = null;
          scheduleDraftSave();
          return;
        }

        preparePostImage(file, normalizeText(titleInput && titleInput.value) || "Article cover image", function (error, imageData) {
          if (error) {
            setFeedback(feedback, error, "error");
            return;
          }

          currentCoverImage = imageData;
          setFeedback(feedback, "Cover image ready.", "success");
          scheduleDraftSave();
        });
      });
    }

    toolButtons.forEach(function (button) {
      button.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });

      button.addEventListener("click", function () {
        runEditorCommand(button.getAttribute("data-editor-command"));
      });
    });

    paletteButtons.forEach(function (button) {
      button.addEventListener("dragstart", function (event) {
        draggedPaletteType = button.getAttribute("data-palette-block") || "";
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("text/plain", draggedPaletteType);
        }
      });

      button.addEventListener("dragend", clearDragState);
    });

    insertButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var type = button.getAttribute("data-editor-insert");
        var block = addBlock(type);

        if (type === "image") {
          startImageSelection(block);
        }
      });
    });

    if (inlineImageInput) {
      inlineImageInput.addEventListener("change", function () {
        var file = getImageFile(inlineImageInput.files && inlineImageInput.files[0]);
        if (!file || !pendingImageBlock) { return; }

        preparePostImage(file, normalizeText(titleInput && titleInput.value) || "Article image", function (error, imageData) {
          if (error) {
            setFeedback(feedback, error, "error");
            return;
          }

          setImageBlockData(pendingImageBlock, imageData);
          pendingImageBlock = null;
          scheduleDraftSave();
          setFeedback(feedback, "Inline image inserted.", "success");
          inlineImageInput.value = "";
        });
      });
    }

    canvas.addEventListener("dragover", function (event) {
      var afterElement;

      if (!draggedBlock && !draggedPaletteType) {
        return;
      }

      event.preventDefault();
      afterElement = getDropTarget(event.clientY);
      highlightDropTarget(afterElement);
    });

    canvas.addEventListener("drop", function (event) {
      var afterElement;
      var insertedBlock;

      if (!draggedBlock && !draggedPaletteType) {
        return;
      }

      event.preventDefault();
      afterElement = getDropTarget(event.clientY);

      if (draggedBlock) {
        if (afterElement) {
          canvas.insertBefore(draggedBlock, afterElement);
        } else {
          canvas.appendChild(draggedBlock);
        }
      } else if (draggedPaletteType) {
        insertedBlock = addBlock(draggedPaletteType, null, afterElement, true);
        if (draggedPaletteType === "image") {
          startImageSelection(insertedBlock);
        }
      }

      clearDragState();
      scheduleDraftSave();
    });

    canvas.addEventListener("dragleave", function (event) {
      if (!canvas.contains(event.relatedTarget)) {
        clearDropHighlights();
      }
    });

    if (blockStyleSelect) {
      blockStyleSelect.addEventListener("change", function () {
        if (!ensureActiveEditable()) { return; }
        restoreSelection();
        focusEditor(activeEditable);
        document.execCommand("formatBlock", false, "<" + blockStyleSelect.value.toLowerCase() + ">");
        rememberSelection();
        scheduleDraftSave();
      });
    }

    if (fontSelect) {
      fontSelect.addEventListener("change", function () {
        if (!ensureActiveEditable()) { return; }
        restoreSelection();
        focusEditor(activeEditable);
        enableEditorStylingMode();
        document.execCommand("fontName", false, fontSelect.value);
        rememberSelection();
        scheduleDraftSave();
      });
    }

    if (fontSizeSelect) {
      fontSizeSelect.addEventListener("change", function () {
        if (!ensureActiveEditable()) { return; }
        restoreSelection();
        focusEditor(activeEditable);
        enableEditorStylingMode();
        document.execCommand("fontSize", false, fontSizeSelect.value);
        rememberSelection();
        scheduleDraftSave();
      });
    }

    if (textColorInput) {
      textColorInput.addEventListener("input", function () {
        if (!ensureActiveEditable()) { return; }
        restoreSelection();
        focusEditor(activeEditable);
        enableEditorStylingMode();
        document.execCommand("foreColor", false, textColorInput.value);
        rememberSelection();
        scheduleDraftSave();
      });
    }

    if (publishButton) {
      publishButton.addEventListener("click", function () {
        var title = normalizeText(titleInput && titleInput.value);
        var author = normalizeText(authorInput && authorInput.value) || "CyberCritters team";
        var sanitizedBody = serializeCanvasHtml();
        var bodyText = extractPlainTextFromHtml(sanitizedBody);
        var now;
        var articleData;

        if (!getUnlockedState()) {
          setFeedback(feedback, "Unlock the article builder before publishing.", "error");
          return;
        }

        if (!title) {
          setFeedback(feedback, "Article title is required.", "error");
          return;
        }

        if (!bodyText) {
          setFeedback(feedback, "Article body is required.", "error");
          return;
        }

        now = new Date();
        articleData = {
          id: editingArticle && editingArticle.id ? editingArticle.id : "article-" + now.getTime(),
          title: title,
          author: author,
          body: bodyText,
          bodyHtml: sanitizedBody,
          imageSrc: currentCoverImage ? currentCoverImage.src : "",
          imageAlt: currentCoverImage ? currentCoverImage.alt : title,
          isoDate: editingArticle && editingArticle.isoDate ? editingArticle.isoDate : now.toISOString().slice(0, 10),
          dateLabel: editingArticle && editingArticle.dateLabel ? editingArticle.dateLabel : formatDate(now)
        };

        if (editingArticle && editingArticle.editedAt) {
          articleData.editedAt = editingArticle.editedAt;
        }

        if (editingArticle) {
          articleData.editedAt = now.toISOString();
        }

        setFeedback(feedback, editingArticle ? "Saving article changes to GitHub..." : "Publishing article to GitHub...", "success");
        loadBlogFeedItems(BLOG_ARTICLES_STORAGE_KEY, fallbackArticles, isValidArticle).then(function (storedArticles) {
          var articleWasFound = false;
          var nextArticles;

          if (editingArticle) {
            nextArticles = storedArticles.map(function (articleItem) {
              if (articleItem && articleItem.id === editingArticle.id) {
                articleWasFound = true;
                return articleData;
              }
              return articleItem;
            });

            if (!articleWasFound) {
              throw new Error("The original article could not be found. Refresh the blog and try again.");
            }
          } else {
            nextArticles = [articleData].concat(storedArticles);
          }

          return saveSharedBlogItems(
            BLOG_ARTICLES_STORAGE_KEY,
            nextArticles,
            editingArticle ? "Edit article: " + title : "Publish article: " + title
          );
        }).then(function () {
          if (editingArticle) {
            editingArticle = articleData;
            setFeedback(feedback, "Article changes saved for every visitor.", "success");
            updateDraftStatus("Editing the published article.");
            return;
          }

          clearEditorDraft();
          resetEditor(false);
          addDefaultBlocks();
          setFeedback(feedback, "Article published for every visitor.", "success");
          updateDraftStatus("Draft cleared after publishing.");
        }).catch(function (saveError) {
          setFeedback(feedback, getPublishErrorMessage(saveError, editingArticle ? "Could not save the article changes." : "Could not publish the article."), "error");
        });
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (editArticleId) {
          if (!window.confirm("Discard local edits and reload the published article?")) {
            return;
          }

          restoreArticleForEditing(editArticleId);
          return;
        }

        if (!window.confirm("Start a fresh article? This clears the current draft from this browser.")) {
          return;
        }

        clearEditorDraft();
        resetEditor(true);
        addDefaultBlocks();
        updateDraftStatus("Draft cleared.");
        if (titleInput) { titleInput.focus(); }
      });
    }

    function syncEditorState() {
      var isUnlocked = getUnlockedState();

      if (gate) { gate.hidden = isUnlocked; }
      if (workspace) { workspace.hidden = !isUnlocked; }

      if (isUnlocked && !restoredDraft) {
        if (editArticleId) {
          restoreArticleForEditing(editArticleId);
        } else {
          restoreDraft();
        }
        restoredDraft = true;
      }
    }

    function restoreArticleForEditing(articleId) {
      resetEditor(false);
      if (publishButton) { publishButton.textContent = "Save changes"; }
      if (resetButton) { resetButton.textContent = "Reload article"; }
      if (workspaceTitle) { workspaceTitle.textContent = "Edit published article"; }
      if (workspaceCopy) { workspaceCopy.textContent = "Update the article here, then save the changes back to the live blog."; }
      updateDraftStatus("Loading published article...");

      loadBlogFeedItems(BLOG_ARTICLES_STORAGE_KEY, fallbackArticles, isValidArticle).then(function (articles) {
        var matchedArticle = null;

        articles.forEach(function (articleItem) {
          if (articleItem && articleItem.id === articleId) {
            matchedArticle = articleItem;
          }
        });

        if (!matchedArticle) {
          editingArticle = null;
          addDefaultBlocks();
          updateDraftStatus("Published article could not be loaded.");
          setFeedback(feedback, "Could not find that article. Return to the blog and choose Edit article again.", "error");
          return;
        }

        editingArticle = matchedArticle;
        if (titleInput) { titleInput.value = matchedArticle.title || ""; }
        if (authorInput) { authorInput.value = matchedArticle.author || ""; }
        if (matchedArticle.imageSrc) {
          currentCoverImage = {
            src: matchedArticle.imageSrc,
            alt: matchedArticle.imageAlt || matchedArticle.title || "Article cover image"
          };
        }

        if (matchedArticle.bodyHtml) {
          addBlock("paragraph", { html: matchedArticle.bodyHtml }, null, true);
        } else if (matchedArticle.body) {
          addBlock("paragraph", { html: textToParagraphHtml(matchedArticle.body) }, null, true);
        } else {
          addDefaultBlocks();
        }

        updateDraftStatus("Editing published article.");
        clearFeedback(feedback);
        if (titleInput) { titleInput.focus(); }
      }).catch(function () {
        editingArticle = null;
        addDefaultBlocks();
        updateDraftStatus("Published article could not be loaded.");
        setFeedback(feedback, "Could not load that article. Check your connection and try again.", "error");
      });
    }

    function restoreDraft() {
      var draft = getStoredDraft();

      resetEditor(false);

      if (!draft) {
        addDefaultBlocks();
        updateDraftStatus("Draft not saved yet.");
        return;
      }

      if (titleInput) { titleInput.value = draft.title || ""; }
      if (authorInput) { authorInput.value = draft.author || ""; }
      if (draft.coverImageSrc) {
        currentCoverImage = {
          src: draft.coverImageSrc,
          alt: draft.coverImageAlt || draft.title || "Article cover image"
        };
      }

      if (Array.isArray(draft.blocks) && draft.blocks.length) {
        draft.blocks.forEach(function (blockData) {
          addBlock(blockData.type, blockData, null, true);
        });
      } else if (typeof draft.bodyHtml === "string" && draft.bodyHtml) {
        addBlock("paragraph", { html: draft.bodyHtml }, null, true);
      } else {
        addDefaultBlocks();
      }

      updateDraftStatus(draft.savedAt ? "Draft restored from " + formatDateTime(draft.savedAt) + "." : "Draft restored.");
    }

    function resetEditor(clearFeedbackMessage) {
      if (titleInput) { titleInput.value = ""; }
      if (authorInput) { authorInput.value = ""; }
      if (coverInput) { coverInput.value = ""; }
      if (canvas) { canvas.innerHTML = ""; }
      currentCoverImage = null;
      activeEditable = null;
      savedRange = null;
      pendingImageBlock = null;
      draggedBlock = null;
      draggedPaletteType = "";
      clearDropHighlights();
      updateCanvasState();

      if (clearFeedbackMessage) {
        clearFeedback(feedback);
      }
    }

    function rememberSelection() {
      var selection = window.getSelection();

      if (!selection || !selection.rangeCount) {
        return;
      }

      if (!canvas.contains(selection.anchorNode)) {
        return;
      }

      savedRange = selection.getRangeAt(0).cloneRange();
    }

    function restoreSelection() {
      var selection = window.getSelection();

      if (!savedRange || !selection) {
        return;
      }

      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    function runEditorCommand(commandName) {
      var url;

      if (!ensureActiveEditable()) {
        setFeedback(feedback, "Select a text block first, then apply the formatting.", "error");
        return;
      }

      restoreSelection();
      focusEditor(activeEditable);
      enableEditorStylingMode();

      if (commandName === "createLink") {
        url = window.prompt("Enter the link URL", "https://");
        if (!url) { return; }
        if (!isSafeUrl(url, "href")) {
          setFeedback(feedback, "Use a safe link such as https://example.com.", "error");
          return;
        }
        document.execCommand("createLink", false, url);
      } else {
        document.execCommand(commandName, false, null);
      }

      if (commandName === "removeFormat") {
        document.execCommand("unlink", false, null);
      }

      if (activeEditable) {
        activeEditable.innerHTML = sanitizeArticleMarkup(activeEditable.innerHTML);
      }
      rememberSelection();
      scheduleDraftSave();
    }

    function scheduleDraftSave() {
      if (editArticleId) {
        updateDraftStatus("Editing published article.");
        return;
      }

      window.clearTimeout(draftTimer);
      draftTimer = window.setTimeout(saveDraft, 220);
    }

    function saveDraft() {
      var draft = {
        title: normalizeText(titleInput && titleInput.value),
        author: normalizeText(authorInput && authorInput.value),
        bodyHtml: serializeCanvasHtml(),
        blocks: serializeBlocksToDraft(),
        coverImageSrc: currentCoverImage ? currentCoverImage.src : "",
        coverImageAlt: currentCoverImage ? currentCoverImage.alt : "",
        savedAt: new Date().toISOString()
      };
      var hasContent = draft.title || draft.author || draft.coverImageSrc || draft.blocks.length || extractPlainTextFromHtml(draft.bodyHtml);
      var saved;

      if (!hasContent) {
        clearEditorDraft();
        updateDraftStatus("Draft not saved yet.");
        return;
      }

      saved = saveStoredDraft(draft);
      updateDraftStatus(saved ? "Draft saved at " + formatDateTime(draft.savedAt) + "." : "Draft could not be saved in this browser.");
    }

    function clearEditorDraft() {
      saveStoredDraft(null);
    }

    function addDefaultBlocks() {
      if (canvas.querySelector(".editor-block")) {
        return;
      }

      addBlock("heading", null, null, true);
      addBlock("paragraph", null, null, true);
    }

    function addBlock(type, data, referenceNode, skipSave) {
      var block = createBlock(type, data);
      var firstEditable;

      if (!block) {
        return null;
      }

      if (referenceNode) {
        canvas.insertBefore(block, referenceNode);
      } else {
        canvas.appendChild(block);
      }

      wireBlock(block);
      updateCanvasState();
      firstEditable = block.querySelector("[data-block-editable]");

      if (firstEditable && !skipSave) {
        setActiveEditable(firstEditable);
        focusEditor(firstEditable);
      }

      if (!skipSave) {
        scheduleDraftSave();
      }

      return block;
    }

    function createBlock(type, data) {
      var block = document.createElement("section");
      var blockId = "editor-block-" + (++blockSequence);
      var innerHtml = "";
      var safeType = String(type || "").toLowerCase();

      block.className = "editor-block editor-block--" + safeType;
      block.setAttribute("data-block-type", safeType);
      block.setAttribute("data-block-id", blockId);

      if (safeType === "paragraph") {
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Paragraph</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface\">" +
            "<div class=\"editor-block-editable\" data-block-editable data-placeholder=\"Write a paragraph\" contenteditable=\"true\">" +
              sanitizeArticleMarkup(data && data.html ? data.html : "<p>Start writing a new paragraph here.</p>") +
            "</div>" +
          "</div>";
      } else if (safeType === "heading") {
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Section heading</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface\">" +
            "<div class=\"editor-block-editable\" data-block-editable data-placeholder=\"Add a section heading\" contenteditable=\"true\">" +
              sanitizeArticleMarkup(data && data.html ? data.html : "<h2>Section heading</h2><p>Add supporting details below this heading.</p>") +
            "</div>" +
          "</div>";
      } else if (safeType === "callout") {
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Callout</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface\">" +
            "<div class=\"editor-block-editable\" data-block-editable data-placeholder=\"Highlight a key message\" contenteditable=\"true\">" +
              sanitizeArticleMarkup(data && data.html ? data.html : "<blockquote class=\"article-callout\">Highlight an important quote, warning, or takeaway here.</blockquote>") +
            "</div>" +
          "</div>";
      } else if (safeType === "two-column") {
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Two-column layout</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface editor-block-surface--columns\">" +
            "<div class=\"editor-column-shell\">" +
              "<p class=\"editor-column-label\">Left column</p>" +
              "<div class=\"editor-block-editable\" data-block-editable data-column=\"left\" data-placeholder=\"Left column content\" contenteditable=\"true\">" +
                sanitizeArticleMarkup(data && data.columns && data.columns.left ? data.columns.left : "<h3>Left column</h3><p>Add content for the first column.</p>") +
              "</div>" +
            "</div>" +
            "<div class=\"editor-column-shell\">" +
              "<p class=\"editor-column-label\">Right column</p>" +
              "<div class=\"editor-block-editable\" data-block-editable data-column=\"right\" data-placeholder=\"Right column content\" contenteditable=\"true\">" +
                sanitizeArticleMarkup(data && data.columns && data.columns.right ? data.columns.right : "<h3>Right column</h3><p>Add content for the second column.</p>") +
              "</div>" +
            "</div>" +
          "</div>";
      } else if (safeType === "divider") {
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Divider</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface\">" +
            "<div class=\"editor-divider-preview\"><span></span></div>" +
          "</div>";
      } else if (safeType === "image") {
        block.setAttribute("data-image-src", data && data.src ? data.src : "");
        block.setAttribute("data-image-alt", data && data.alt ? data.alt : "");
        innerHtml =
          "<div class=\"editor-block-chrome\">" +
            "<button type=\"button\" class=\"editor-block-handle\" data-block-handle draggable=\"true\" aria-label=\"Drag block\">::</button>" +
            "<span class=\"editor-block-label\">Image</span>" +
            "<button type=\"button\" class=\"editor-block-delete\" data-block-delete aria-label=\"Delete block\">Delete</button>" +
          "</div>" +
          "<div class=\"editor-block-surface editor-block-surface--image\">" +
            "<div class=\"editor-image-frame\" data-image-frame></div>" +
            "<div class=\"editor-image-controls\">" +
              "<button type=\"button\" class=\"blog-button blog-button-secondary editor-image-button\" data-block-image-select>Choose image</button>" +
            "</div>" +
            "<div class=\"editor-block-editable editor-block-editable--caption\" data-block-editable data-image-caption data-placeholder=\"Optional caption\" contenteditable=\"true\">" +
              sanitizeArticleMarkup(data && data.captionHtml ? data.captionHtml : "") +
            "</div>" +
          "</div>";
      } else {
        return null;
      }

      block.innerHTML = innerHtml;

      if (safeType === "image") {
        renderImageBlock(block);
      }

      return block;
    }

    function wireBlock(block) {
      var deleteButton = block.querySelector("[data-block-delete]");
      var handle = block.querySelector("[data-block-handle]");
      var imageButton = block.querySelector("[data-block-image-select]");

      if (deleteButton) {
        deleteButton.addEventListener("click", function () {
          if (block.parentNode) {
            block.parentNode.removeChild(block);
          }
          if (activeEditable && !canvas.contains(activeEditable)) {
            activeEditable = null;
          }
          updateCanvasState();
          scheduleDraftSave();
        });
      }

      if (handle) {
        handle.addEventListener("dragstart", function (event) {
          draggedBlock = block;
          block.classList.add("is-dragging");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", block.getAttribute("data-block-id") || "");
          }
        });

        handle.addEventListener("dragend", clearDragState);
      }

      if (imageButton) {
        imageButton.addEventListener("click", function () {
          startImageSelection(block);
        });
      }

      Array.prototype.slice.call(block.querySelectorAll("[data-block-editable]")).forEach(function (editable) {
        bindEditable(editable);
      });
    }

    function bindEditable(editable) {
      editable.addEventListener("focus", function () {
        setActiveEditable(editable);
        rememberSelection();
      });

      editable.addEventListener("click", function () {
        setActiveEditable(editable);
        rememberSelection();
      });

      editable.addEventListener("keyup", function () {
        setActiveEditable(editable);
        rememberSelection();
      });

      editable.addEventListener("mouseup", function () {
        setActiveEditable(editable);
        rememberSelection();
      });

      editable.addEventListener("input", function () {
        setActiveEditable(editable);
        rememberSelection();
        scheduleDraftSave();
      });

      editable.addEventListener("paste", function () {
        window.setTimeout(function () {
          editable.innerHTML = sanitizeArticleMarkup(editable.innerHTML);
          setActiveEditable(editable);
          rememberSelection();
          scheduleDraftSave();
        }, 0);
      });
    }

    function setActiveEditable(editable) {
      activeEditable = editable;
      Array.prototype.slice.call(canvas.querySelectorAll(".editor-block")).forEach(function (block) {
        block.classList.toggle("is-active", block.contains(editable));
      });
    }

    function ensureActiveEditable() {
      if (activeEditable && canvas.contains(activeEditable)) {
        return true;
      }

      activeEditable = canvas.querySelector("[data-block-editable]");
      if (activeEditable) {
        setActiveEditable(activeEditable);
      }

      return !!activeEditable;
    }

    function startImageSelection(block) {
      pendingImageBlock = block;
      if (inlineImageInput) {
        inlineImageInput.click();
      }
    }

    function setImageBlockData(block, imageData) {
      if (!block || block.getAttribute("data-block-type") !== "image") {
        return;
      }

      block.setAttribute("data-image-src", imageData && imageData.src ? imageData.src : "");
      block.setAttribute("data-image-alt", imageData && imageData.alt ? imageData.alt : normalizeText(titleInput && titleInput.value) || "Article image");
      renderImageBlock(block);
    }

    function renderImageBlock(block) {
      var frame = block.querySelector("[data-image-frame]");
      var src = block.getAttribute("data-image-src") || "";
      var alt = block.getAttribute("data-image-alt") || "Article image";

      if (!frame) {
        return;
      }

      if (!src) {
        frame.innerHTML = "<div class=\"editor-image-placeholder\">Choose an image for this block.</div>";
        return;
      }

      frame.innerHTML =
        "<img class=\"editor-image-preview\" src=\"" + escapeHtmlAttribute(src) + "\" alt=\"" + escapeHtmlAttribute(alt) + "\" />";
    }

    function serializeBlocksToDraft() {
      return Array.prototype.slice.call(canvas.querySelectorAll(".editor-block")).map(function (block) {
        var type = block.getAttribute("data-block-type");
        var draft = { type: type };

        if (type === "paragraph" || type === "heading" || type === "callout") {
          draft.html = sanitizeArticleMarkup(getEditableHtml(block));
        } else if (type === "two-column") {
          draft.columns = {
            left: sanitizeArticleMarkup(getEditableHtml(block, "left")),
            right: sanitizeArticleMarkup(getEditableHtml(block, "right"))
          };
        } else if (type === "image") {
          draft.src = block.getAttribute("data-image-src") || "";
          draft.alt = block.getAttribute("data-image-alt") || "";
          draft.captionHtml = sanitizeArticleMarkup(getCaptionHtml(block));
        }

        return draft;
      });
    }

    function serializeCanvasHtml() {
      return sanitizeArticleMarkup(
        Array.prototype.slice.call(canvas.querySelectorAll(".editor-block"))
          .map(function (block) {
            return serializeBlockHtml(block);
          })
          .filter(Boolean)
          .join("")
      );
    }

    function serializeBlockHtml(block) {
      var type = block.getAttribute("data-block-type");
      var leftHtml;
      var rightHtml;
      var src;
      var alt;
      var captionHtml;

      if (type === "paragraph" || type === "heading" || type === "callout") {
        return sanitizeArticleMarkup(getEditableHtml(block));
      }

      if (type === "two-column") {
        leftHtml = sanitizeArticleMarkup(getEditableHtml(block, "left"));
        rightHtml = sanitizeArticleMarkup(getEditableHtml(block, "right"));
        return (
          "<div class=\"article-layout article-layout-two-column\">" +
            "<div class=\"article-layout-column\">" + leftHtml + "</div>" +
            "<div class=\"article-layout-column\">" + rightHtml + "</div>" +
          "</div>"
        );
      }

      if (type === "divider") {
        return "<hr />";
      }

      if (type === "image") {
        src = block.getAttribute("data-image-src") || "";
        alt = block.getAttribute("data-image-alt") || "Article image";
        captionHtml = sanitizeArticleMarkup(getCaptionHtml(block));

        if (!src) {
          return "";
        }

        return (
          "<figure class=\"article-inline-figure\">" +
            "<img class=\"article-inline-image\" src=\"" + escapeHtmlAttribute(src) + "\" alt=\"" + escapeHtmlAttribute(alt) + "\" />" +
            (captionHtml ? "<figcaption>" + captionHtml + "</figcaption>" : "") +
          "</figure>"
        );
      }

      return "";
    }

    function getEditableHtml(block, columnName) {
      var selector = columnName ? "[data-column=\"" + columnName + "\"]" : "[data-block-editable]";
      var editable = block.querySelector(selector);
      return editable ? editable.innerHTML : "";
    }

    function getCaptionHtml(block) {
      var caption = block.querySelector("[data-image-caption]");
      return caption ? caption.innerHTML : "";
    }

    function getDropTarget(pointerY) {
      var blocks = Array.prototype.slice.call(canvas.querySelectorAll(".editor-block")).filter(function (block) {
        return block !== draggedBlock;
      });
      var closest = { offset: Number.NEGATIVE_INFINITY, element: null };

      blocks.forEach(function (block) {
        var rect = block.getBoundingClientRect();
        var offset = pointerY - rect.top - rect.height / 2;

        if (offset < 0 && offset > closest.offset) {
          closest = { offset: offset, element: block };
        }
      });

      return closest.element;
    }

    function highlightDropTarget(block) {
      clearDropHighlights();

      if (block) {
        block.classList.add("is-drop-target");
      } else {
        canvas.classList.add("is-drop-at-end");
      }
    }

    function clearDropHighlights() {
      canvas.classList.remove("is-drop-at-end");
      Array.prototype.slice.call(canvas.querySelectorAll(".editor-block")).forEach(function (block) {
        block.classList.remove("is-drop-target");
      });
    }

    function clearDragState() {
      if (draggedBlock) {
        draggedBlock.classList.remove("is-dragging");
      }
      draggedBlock = null;
      draggedPaletteType = "";
      clearDropHighlights();
    }

    function updateCanvasState() {
      canvas.classList.toggle("is-empty", canvas.querySelectorAll(".editor-block").length === 0);
    }
  }

  function initArticlePage() {
    var shell = document.querySelector("[data-article-page]");
    var params;
    var articleId;
    var articles;
    var post;

    if (!shell) { return; }

    params = new URLSearchParams(window.location.search);
    articleId = params.get("id");

    function renderNotFound() {
      shell.innerHTML =
        "<p class=\"article-page-not-found\">Article not found. It may have been deleted or this link is no longer valid.</p>" +
        "<a href=\"blog.html\" class=\"article-back-link\">\u2190 Back to Blog</a>";
    }

    if (!articleId) {
      renderNotFound();
      return;
    }

    loadBlogFeedItems(BLOG_ARTICLES_STORAGE_KEY, fallbackArticles, isValidArticle).then(function (loadedArticles) {
      articles = loadedArticles;
      post = null;
      articles.forEach(function (articleItem) {
        if (articleItem && articleItem.id === articleId) {
          post = articleItem;
        }
      });

      if (!post) {
        renderNotFound();
        return;
      }

      document.title = post.title + " \u2014 CyberCritters";
      shell.innerHTML = "";

      var backLink = document.createElement("a");
      backLink.href = "blog.html";
      backLink.className = "article-back-link";
      backLink.textContent = "\u2190 Back to Blog";
      shell.appendChild(backLink);

      var card = document.createElement("article");
      card.className = "article-full-card";

      var titleEl = document.createElement("h1");
      titleEl.className = "article-full-title";
      titleEl.textContent = post.title;
      card.appendChild(titleEl);

      if (post.imageSrc) {
        var figure = document.createElement("figure");
        var image = document.createElement("img");
        figure.className = "blog-post-media article-full-media";
        image.className = "blog-post-image";
        image.src = post.imageSrc;
        image.alt = post.imageAlt || post.title;
        image.loading = "eager";
        image.decoding = "async";
        figure.appendChild(image);
        card.appendChild(figure);
      }

      var byline = document.createElement("div");
      byline.className = "article-full-byline";

      var authorEl = document.createElement("p");
      authorEl.className = "article-full-author";
      authorEl.textContent = post.author || "CyberCritters team";
      byline.appendChild(authorEl);

      var dateEl = document.createElement("time");
      dateEl.className = "article-full-date";
      dateEl.textContent = post.dateLabel;
      if (post.isoDate) { dateEl.setAttribute("datetime", post.isoDate); }
      byline.appendChild(dateEl);
      card.appendChild(byline);

      var bodyEl = document.createElement("div");
      bodyEl.className = "article-full-body";
      renderArticleBody(bodyEl, post);
      card.appendChild(bodyEl);

      shell.appendChild(card);
    }).catch(renderNotFound);
  }

  function supportsStorage(storageName) {
    var storage;
    var probe = "__cybercritters_probe__";

    try {
      storage = window[storageName];
      storage.setItem(probe, probe);
      storage.removeItem(probe);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getStoredItems(key, fallback, validator) {
    var raw;
    var parsed;

    if (!canUseLocalStorage) {
      return fallback.slice();
    }

    try {
      raw = window.localStorage.getItem(key);
      parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(validator);
    } catch (error) {
      return [];
    }
  }

  function saveStoredItems(key, items, fallback) {
    if (!canUseLocalStorage) {
      fallback.length = 0;
      items.forEach(function (item) {
        fallback.push(item);
      });
      return true;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(items));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadBlogFeedItems(key, fallback, validator) {
    var localItems = getStoredItems(key, fallback, validator);

    return fetchSharedBlogItems(key, validator).then(function (remoteItems) {
      return remoteItems;
    }).catch(function () {
      return localItems;
    });
  }

  function fetchSharedBlogItems(key, validator) {
    var path = getSharedBlogPath(key);

    if (!path || typeof window.fetch !== "function") {
      return Promise.reject(new Error("Shared blog storage is unavailable."));
    }

    return window.fetch(path + "?v=" + Date.now(), { cache: "no-store" }).then(function (response) {
      if (!response.ok) {
        throw new Error("Shared blog file could not be loaded.");
      }
      return response.json();
    }).then(function (items) {
      if (!Array.isArray(items)) {
        return [];
      }
      return items.filter(validator);
    });
  }

  function saveSharedBlogItems(key, items, message) {
    var token = getPublishToken();
    var path = getSharedBlogPath(key);
    var apiUrl;

    if (!token) {
      return Promise.reject(new Error("GitHub token is required to publish shared blog content."));
    }

    if (!path || typeof window.fetch !== "function") {
      return Promise.reject(new Error("Shared blog storage is unavailable."));
    }

    apiUrl =
      "https://api.github.com/repos/" +
      encodeURIComponent(BLOG_REMOTE_CONFIG.owner) +
      "/" +
      encodeURIComponent(BLOG_REMOTE_CONFIG.repo) +
      "/contents/" +
      path;

    return window.fetch(apiUrl + "?ref=" + encodeURIComponent(BLOG_REMOTE_CONFIG.branch), {
      headers: createGitHubHeaders(token)
    }).then(function (response) {
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("GitHub could not read the current blog file.");
      }

      return response.json();
    }).then(function (currentFile) {
      var body = {
        message: message || "Update CyberCritters blog content",
        content: utf8ToBase64(JSON.stringify(items, null, 2) + "\n"),
        branch: BLOG_REMOTE_CONFIG.branch
      };

      if (currentFile && currentFile.sha) {
        body.sha = currentFile.sha;
      }

      return window.fetch(apiUrl, {
        method: "PUT",
        headers: createGitHubHeaders(token),
        body: JSON.stringify(body)
      });
    }).then(function (response) {
      if (response.status === 401 || response.status === 403) {
        clearPublishToken();
        throw new Error("GitHub rejected the publishing token.");
      }

      if (response.status === 409) {
        throw new Error("The blog file changed on GitHub. Refresh the page and try again.");
      }

      if (!response.ok) {
        throw new Error("GitHub could not save the blog file.");
      }

      saveStoredItems(key, items, key === BLOG_ARTICLES_STORAGE_KEY ? fallbackArticles : fallbackTips);
      return response.json();
    });
  }

  function getSharedBlogPath(key) {
    if (key === BLOG_ARTICLES_STORAGE_KEY) {
      return BLOG_REMOTE_CONFIG.articlesPath;
    }

    if (key === BLOG_IGGY_STORAGE_KEY) {
      return BLOG_REMOTE_CONFIG.tipsPath;
    }

    return "";
  }

  function createGitHubHeaders(token) {
    return {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function getPublishToken() {
    var token = "";

    if (canUseSessionStorage) {
      try {
        token = window.sessionStorage.getItem(BLOG_PUBLISH_TOKEN_KEY) || "";
      } catch (error) {
        token = "";
      }
    }

    if (!token) {
      token = window.prompt(
        "Paste a GitHub fine-grained token with Contents: Read and write access for CyberCrittersWebsite. It will only be kept for this browser tab."
      ) || "";
      token = token.trim();

      if (token && canUseSessionStorage) {
        try {
          window.sessionStorage.setItem(BLOG_PUBLISH_TOKEN_KEY, token);
        } catch (error) {}
      }
    }

    return token;
  }

  function clearPublishToken() {
    if (!canUseSessionStorage) {
      return;
    }

    try {
      window.sessionStorage.removeItem(BLOG_PUBLISH_TOKEN_KEY);
    } catch (error) {}
  }

  function getPublishErrorMessage(error, fallbackMessage) {
    var detail = error && error.message ? " " + error.message : "";
    return fallbackMessage + detail;
  }

  function utf8ToBase64(value) {
    var bytes = new TextEncoder().encode(String(value || ""));
    var binary = "";
    var chunkSize = 0x8000;
    var index;

    for (index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunkSize));
    }

    return window.btoa(binary);
  }

  function getStoredDraft() {
    var raw;
    var parsed;

    if (!canUseLocalStorage) {
      return isValidArticleDraft(fallbackDraft) ? fallbackDraft : null;
    }

    try {
      raw = window.localStorage.getItem(ARTICLE_DRAFT_STORAGE_KEY);
      parsed = raw ? JSON.parse(raw) : null;
      return isValidArticleDraft(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function saveStoredDraft(value) {
    if (!canUseLocalStorage) {
      fallbackDraft = value;
      return true;
    }

    try {
      if (!value) {
        window.localStorage.removeItem(ARTICLE_DRAFT_STORAGE_KEY);
      } else {
        window.localStorage.setItem(ARTICLE_DRAFT_STORAGE_KEY, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function getUnlockedState() {
    if (!canUseSessionStorage) {
      return fallbackUnlocked;
    }

    try {
      return window.sessionStorage.getItem(BLOG_UNLOCK_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function setUnlockedState(value) {
    if (!canUseSessionStorage) {
      fallbackUnlocked = value;
      return;
    }

    try {
      if (value) {
        window.sessionStorage.setItem(BLOG_UNLOCK_KEY, "true");
      } else {
        window.sessionStorage.removeItem(BLOG_UNLOCK_KEY);
      }
    } catch (error) {
      fallbackUnlocked = value;
    }
  }

  function isValidArticle(post) {
    return (
      !!post &&
      typeof post.title === "string" &&
      typeof post.dateLabel === "string" &&
      (typeof post.body === "string" || typeof post.bodyHtml === "string")
    );
  }

  function isValidTip(tip) {
    return tip && typeof tip.caption === "string" && typeof tip.imageSrc === "string" && typeof tip.dateLabel === "string";
  }

  function isValidArticleDraft(draft) {
    return (
      !!draft &&
      typeof draft.title === "string" &&
      typeof draft.author === "string" &&
      typeof draft.coverImageSrc === "string" &&
      typeof draft.coverImageAlt === "string" &&
      typeof draft.savedAt === "string" &&
      (
        typeof draft.bodyHtml === "string" ||
        Array.isArray(draft.blocks)
      )
    );
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getImageFile(value) {
    if (!value || typeof value !== "object") { return null; }
    if (typeof value.name !== "string" || !value.name) { return null; }
    if (typeof value.size === "number" && value.size <= 0) { return null; }
    return value;
  }

  function preparePostImage(file, label, callback) {
    var reader;

    if (!file) {
      callback(null, null);
      return;
    }

    if (typeof file.type === "string" && file.type.indexOf("image/") !== 0) {
      callback("Choose an image file.", null);
      return;
    }

    if (typeof FileReader === "undefined") {
      callback("This browser cannot read image files.", null);
      return;
    }

    reader = new FileReader();
    reader.onload = function () {
      var preview = new Image();

      preview.onload = function () {
        var result = resizeImageData(preview, file);
        if (!result) {
          callback("Image could not be processed.", null);
          return;
        }

        callback(null, { src: result, alt: label });
      };

      preview.onerror = function () {
        callback("Image could not be opened.", null);
      };

      preview.src = String(reader.result || "");
    };

    reader.onerror = function () {
      callback("Image could not be read.", null);
    };

    reader.readAsDataURL(file);
  }

  function resizeImageData(image, file) {
    var canvas;
    var context;
    var width = image.naturalWidth || image.width;
    var height = image.naturalHeight || image.height;
    var scale;
    var type = file && file.type === "image/png" ? "image/png" : "image/jpeg";

    if (!width || !height) {
      return "";
    }

    scale = Math.min(1, 1280 / width, 960 / height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext("2d");

    if (!context) {
      return "";
    }

    if (type === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }

    context.drawImage(image, 0, 0, width, height);

    try {
      return type === "image/png" ? canvas.toDataURL(type) : canvas.toDataURL(type, 0.84);
    } catch (error) {
      return "";
    }
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

  function formatDate(date) {
    return dateFormatter ? dateFormatter.format(date) : date.toDateString();
  }

  function formatDateTime(isoString) {
    var parsedDate = new Date(isoString);

    if (Number.isNaN(parsedDate.getTime())) {
      return "a recent moment";
    }

    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function getArticleExcerpt(post) {
    var source = typeof post.bodyHtml === "string" && post.bodyHtml ? post.bodyHtml : post.body;
    var text = typeof source === "string" ? extractPlainTextFromHtml(source) : "";

    if (!text) {
      return "";
    }

    if (text.length <= 180) {
      return text;
    }

    return text.slice(0, 177).trim() + "...";
  }

  function extractPlainTextFromHtml(value) {
    var source = String(value || "");
    var container = document.createElement("div");

    if (source.indexOf("<") !== -1 && source.indexOf(">") !== -1) {
      container.innerHTML = source;
      return normalizeText(container.textContent || "");
    }

    return normalizeText(source);
  }

  function textToParagraphHtml(value) {
    var paragraphs = String(value || "")
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n\s*\n/)
      .map(function (paragraph) { return paragraph.replace(/\s*\n+\s*/g, " ").trim(); })
      .filter(Boolean);

    return paragraphs.map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph) + "</p>";
    }).join("");
  }

  function renderArticleBody(target, post) {
    var sanitizedHtml = typeof post.bodyHtml === "string" ? sanitizeArticleMarkup(post.bodyHtml) : "";
    var paragraphs;

    target.innerHTML = "";

    if (sanitizedHtml) {
      target.innerHTML = sanitizedHtml;
      return;
    }

    paragraphs = String(post.body || "")
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n\s*\n/)
      .map(function (paragraph) { return paragraph.replace(/\s*\n+\s*/g, " ").trim(); })
      .filter(Boolean);

    paragraphs.forEach(function (text) {
      var paragraph = document.createElement("p");
      paragraph.textContent = text;
      target.appendChild(paragraph);
    });
  }

  function sanitizeArticleMarkup(markup) {
    var template = document.createElement("template");

    template.innerHTML = String(markup || "");
    sanitizeNodeChildren(template.content);

    return template.innerHTML;
  }

  function sanitizeNodeChildren(parentNode) {
    Array.prototype.slice.call(parentNode.childNodes).forEach(function (childNode) {
      sanitizeNode(childNode);
    });
  }

  function sanitizeNode(node) {
    var blockedTags = { SCRIPT: true, STYLE: true, IFRAME: true, OBJECT: true, EMBED: true, LINK: true, META: true };
    var allowedTags = {
      A: true,
      B: true,
      BLOCKQUOTE: true,
      BR: true,
      DIV: true,
      EM: true,
      FIGCAPTION: true,
      FIGURE: true,
      FONT: true,
      H2: true,
      H3: true,
      HR: true,
      I: true,
      IMG: true,
      LI: true,
      OL: true,
      P: true,
      SPAN: true,
      STRONG: true,
      U: true,
      UL: true
    };
    var tagName;

    if (!node || !node.parentNode) {
      return;
    }

    if (node.nodeType === 3) {
      node.textContent = String(node.textContent || "").replace(/\u200b/g, "");
      return;
    }

    if (node.nodeType !== 1) {
      node.parentNode.removeChild(node);
      return;
    }

    tagName = node.tagName.toUpperCase();

    if (tagName === "FONT") {
      node = normalizeLegacyFontNode(node);
      tagName = node.tagName.toUpperCase();
    }

    if (blockedTags[tagName]) {
      node.parentNode.removeChild(node);
      return;
    }

    if (!allowedTags[tagName]) {
      sanitizeNodeChildren(node);
      unwrapNode(node);
      return;
    }

    sanitizeElementAttributes(node, tagName);
    sanitizeNodeChildren(node);

    if (tagName === "A") {
      if (!node.getAttribute("href")) {
        unwrapNode(node);
        return;
      }
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }

    if (tagName === "IMG" && !node.getAttribute("src")) {
      node.parentNode.removeChild(node);
    }
  }

  function sanitizeElementAttributes(node, tagName) {
    var allowedClassNames = {
      "article-callout": true,
      "article-inline-figure": true,
      "article-inline-image": true,
      "article-layout": true,
      "article-layout-column": true,
      "article-layout-two-column": true
    };

    Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
      var attrName = attribute.name.toLowerCase();
      var attrValue = attribute.value;

      if (attrName === "class") {
        var cleanClasses = attrValue
          .split(/\s+/)
          .filter(function (className) { return !!allowedClassNames[className]; })
          .join(" ");

        if (cleanClasses) {
          node.setAttribute("class", cleanClasses);
        } else {
          node.removeAttribute("class");
        }

        return;
      }

      if (attrName === "style") {
        var cleanStyle = sanitizeInlineStyle(attrValue);
        if (cleanStyle) {
          node.setAttribute("style", cleanStyle);
        } else {
          node.removeAttribute("style");
        }
        return;
      }

      if (tagName === "A" && attrName === "href") {
        if (isSafeUrl(attrValue, "href")) {
          node.setAttribute("href", attrValue);
        } else {
          node.removeAttribute("href");
        }
        return;
      }

      if (tagName === "IMG" && attrName === "src") {
        if (isSafeUrl(attrValue, "src")) {
          node.setAttribute("src", attrValue);
        } else {
          node.removeAttribute("src");
        }
        return;
      }

      if (tagName === "IMG" && attrName === "alt") {
        node.setAttribute("alt", attrValue);
        return;
      }

      node.removeAttribute(attribute.name);
    });
  }

  function sanitizeInlineStyle(styleValue) {
    var allowedProperties = {
      "background-color": true,
      "color": true,
      "font-family": true,
      "font-size": true,
      "text-align": true
    };

    return String(styleValue || "")
      .split(";")
      .map(function (part) {
        var pieces = part.split(":");
        var property = normalizeText(pieces.shift()).toLowerCase();
        var value = normalizeText(pieces.join(":"));

        if (!property || !value || !allowedProperties[property]) {
          return "";
        }

        if (!isSafeStyleValue(property, value)) {
          return "";
        }

        return property + ": " + value;
      })
      .filter(Boolean)
      .join("; ");
  }

  function isSafeStyleValue(property, value) {
    var cleanValue = String(value || "").trim();

    if (!cleanValue) {
      return false;
    }

    if (/url\s*\(|expression|javascript:/i.test(cleanValue)) {
      return false;
    }

    if (property === "text-align") {
      return /^(left|center|right|justify)$/i.test(cleanValue);
    }

    if (property === "font-size") {
      return /^(\d+(\.\d+)?(px|rem|em|%)|xx-small|x-small|small|medium|large|x-large|xx-large)$/i.test(cleanValue);
    }

    if (property === "font-family") {
      return /^[a-z0-9 ,"'_-]+$/i.test(cleanValue);
    }

    if (property === "color" || property === "background-color") {
      return /^#[0-9a-f]{3,8}$/i.test(cleanValue) || /^rgba?\([\d\s.,%]+\)$/i.test(cleanValue) || /^[a-z]+$/i.test(cleanValue);
    }

    return false;
  }

  function isSafeUrl(url, type) {
    var value = String(url || "").trim();
    var relativePathPattern = /^[a-z0-9][a-z0-9._/-]*$/i;

    if (!value) {
      return false;
    }

    if (type === "src") {
      return /^(https?:|data:image\/|\/|\.\/|\.\.\/)/i.test(value) || relativePathPattern.test(value);
    }

    return /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(value) || relativePathPattern.test(value);
  }

  function normalizeLegacyFontNode(fontNode) {
    var span = document.createElement("span");
    var face = fontNode.getAttribute("face");
    var color = fontNode.getAttribute("color");
    var size = fontNode.getAttribute("size");
    var sizeMap = {
      "1": "0.75rem",
      "2": "0.875rem",
      "3": "1rem",
      "4": "1.15rem",
      "5": "1.35rem",
      "6": "1.7rem",
      "7": "2rem"
    };

    if (face) {
      span.style.fontFamily = face;
    }

    if (color) {
      span.style.color = color;
    }

    if (size && sizeMap[size]) {
      span.style.fontSize = sizeMap[size];
    }

    while (fontNode.firstChild) {
      span.appendChild(fontNode.firstChild);
    }

    fontNode.parentNode.replaceChild(span, fontNode);
    return span;
  }

  function unwrapNode(node) {
    var parent = node.parentNode;

    if (!parent) {
      return;
    }

    while (node.firstChild) {
      parent.insertBefore(node.firstChild, node);
    }

    parent.removeChild(node);
  }

  function enableEditorStylingMode() {
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch (error) {
      return;
    }
  }

  function focusEditor(editor) {
    if (!editor) {
      return;
    }

    editor.focus();
  }

  function insertEditorSnippet(editor, type) {
    var html = "";

    if (type === "paragraph") {
      html = "<p>Start writing a new paragraph here.</p>";
    } else if (type === "heading") {
      html = "<h2>Section heading</h2><p>Add supporting details below this heading.</p>";
    } else if (type === "callout") {
      html = "<blockquote class=\"article-callout\">Highlight an important quote, warning, or takeaway here.</blockquote>";
    } else if (type === "two-column") {
      html =
        "<div class=\"article-layout article-layout-two-column\">" +
          "<div class=\"article-layout-column\"><h3>Left column</h3><p>Add content for the first column.</p></div>" +
          "<div class=\"article-layout-column\"><h3>Right column</h3><p>Add content for the second column.</p></div>" +
        "</div>";
    } else if (type === "divider") {
      html = "<hr />";
    }

    if (!html) {
      return;
    }

    insertHtmlAtCursor(editor, html);
  }

  function insertEditorImage(editor, imageData) {
    var html;

    if (!imageData || !imageData.src) {
      return;
    }

    html =
      "<figure class=\"article-inline-figure\">" +
        "<img class=\"article-inline-image\" src=\"" + escapeHtmlAttribute(imageData.src) + "\" alt=\"" + escapeHtmlAttribute(imageData.alt || "Article image") + "\" />" +
      "</figure>";

    insertHtmlAtCursor(editor, html);
  }

  function insertHtmlAtCursor(editor, html) {
    var selection = window.getSelection();
    var range;
    var fragment;
    var lastNode;

    focusEditor(editor);

    if (!selection || !selection.rangeCount || !editor.contains(selection.anchorNode)) {
      editor.insertAdjacentHTML("beforeend", html);
      return;
    }

    range = selection.getRangeAt(0);
    range.deleteContents();
    fragment = range.createContextualFragment(html);
    lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      range = document.createRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function escapeHtmlAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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

  function updateDraftStatus(message) {
    var status = document.querySelector("[data-editor-draft-status]");
    if (!status) { return; }
    status.textContent = message;
  }

});

(function initClickSpark() {
  if (typeof document === "undefined") { return; }
  var SPARK_COUNT = 8;
  var DURATION = 400;
  var START_RADIUS = 15;
  var EXTRA = 15;
  var LENGTH = 10;
  var STROKE = 2;
  var COLOR = "#ffd35f";
  var SVG_NS = "http://www.w3.org/2000/svg";

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function spawn(x, y) {
    var size = (START_RADIUS + EXTRA + LENGTH) * 2 + STROKE * 2;
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.style.position = "fixed";
    svg.style.left = (x - size / 2) + "px";
    svg.style.top = (y - size / 2) + "px";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "9999";

    var lines = [];
    for (var i = 0; i < SPARK_COUNT; i++) {
      var line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("stroke", COLOR);
      line.setAttribute("stroke-width", String(STROKE));
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
      lines.push(line);
    }
    document.body.appendChild(svg);

    var cx = size / 2;
    var cy = size / 2;
    var start = null;

    function frame(ts) {
      if (start === null) { start = ts; }
      var t = Math.min(1, (ts - start) / DURATION);
      var eased = easeOutCubic(t);
      var offset = eased * EXTRA;
      var segLen = LENGTH * (1 - eased);
      var opacity = 1 - eased;

      for (var i = 0; i < SPARK_COUNT; i++) {
        var a = (i / SPARK_COUNT) * Math.PI * 2;
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var r1 = START_RADIUS + offset;
        var r2 = r1 + segLen;
        lines[i].setAttribute("x1", cx + cos * r1);
        lines[i].setAttribute("y1", cy + sin * r1);
        lines[i].setAttribute("x2", cx + cos * r2);
        lines[i].setAttribute("y2", cy + sin * r2);
        lines[i].setAttribute("stroke-opacity", opacity);
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        svg.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener("click", function (e) {
    spawn(e.clientX, e.clientY);
  }, { passive: true });
})();
