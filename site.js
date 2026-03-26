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
});
