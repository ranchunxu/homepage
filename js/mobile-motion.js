/* Loaded after the original content-rendering script. Native scrolling stays native. */
(() => {
  "use strict";

  const root = document.documentElement;
  const touchView = matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let initialized = false;
  let revealObserver = null;
  let loaderObserver = null;
  let introStarted = false;
  let introTimer = null;
  let introFallback = null;

  function completeTypedText() {
    document.querySelectorAll("main [data-tw][data-text], #track [data-type][data-text]")
      .forEach(element => {
        // The old observer can still run, but must not start a second entrance.
        element.dataset.twDone = "1";
        element.dataset.done = "1";
        element.textContent = element.dataset.text;
      });
  }

  function showNode(element) {
    element.classList.add("mm-visible");
    if (revealObserver) revealObserver.unobserve(element);
  }

  function releaseIntro() {
    clearTimeout(introTimer);
    clearTimeout(introFallback);
    if (loaderObserver) loaderObserver.disconnect();
    root.classList.remove("mm-intro-pending", "mm-intro-playing");
  }

  function setupReveals() {
    const selector = [
      "main section .head .stick",
      "#profile .bio",
      "#profile .tags",
      "#track .card",
      ".timeline .tl-item",
      ".interlude blockquote",
      ".interlude .meta",
      "#projGrid .proj",
      "#honorGrid .honor",
      "#certGrid .cert",
      "#contact .contact-card > h3",
      "#contact .contact-card > p",
      "#contact .crow"
    ].join(",");
    const targets = [...document.querySelectorAll(selector)];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) showNode(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });

    const groups = new Map();
    targets.forEach(element => {
      const group = element.parentElement;
      const index = groups.get(group) || 0;
      groups.set(group, index + 1);
      element.style.setProperty("--mm-delay", `${Math.min(index, 3) * 60}ms`);
      element.classList.add("mm-reveal");
    });

    // Establish the starting frame before observing the viewport.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      targets.forEach(element => revealObserver.observe(element));
    }));

    document.addEventListener("focusin", event => {
      const element = event.target.closest?.(".mm-reveal");
      if (element) showNode(element);
    });
  }

  function startIntro() {
    if (introStarted) return;
    introStarted = true;
    if (loaderObserver) loaderObserver.disconnect();
    clearTimeout(introTimer);
    root.classList.remove("mm-intro-pending");
    if (!reducedMotion.matches) root.classList.add("mm-intro-playing");
    setupReveals();
    introTimer = setTimeout(releaseIntro, 1000);
  }

  function setupIntro() {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setupReveals();
      return;
    }

    if (!hero.querySelector(".mm-scroll-cue")) {
      const cue = document.createElement("a");
      cue.className = "mm-scroll-cue mm-press";
      cue.href = "#profile";
      cue.innerHTML = '向下探索 <span aria-hidden="true">↓</span>';
      hero.append(cue);
    }

    hero.querySelectorAll(".solid, .hollow, .who, .motto, .mm-scroll-cue")
      .forEach((element, index) => {
        element.dataset.mmHero = "";
        element.style.setProperty("--mm-delay", `${index * 60}ms`);
      });

    // Even if the old loading script fails, hero content cannot remain hidden.
    introFallback = setTimeout(() => {
      startIntro();
      releaseIntro();
    }, 5000);
    if (!reducedMotion.matches) root.classList.add("mm-intro-pending");

    const loader = document.getElementById("pl");
    const whenLoaded = () => {
      if (loader && !loader.classList.contains("done")) return;
      if (loaderObserver) loaderObserver.disconnect();
      // The original loader slides away in 700ms; don't spend the entrance behind it.
      introTimer = setTimeout(startIntro, loader && !reducedMotion.matches ? 700 : 0);
    };

    if (!loader || loader.classList.contains("done")) {
      whenLoaded();
    } else if ("MutationObserver" in window) {
      loaderObserver = new MutationObserver(whenLoaded);
      loaderObserver.observe(loader, { attributes: true, attributeFilter: ["class"] });
    } else {
      introTimer = setTimeout(startIntro, 3900);
    }
  }

  function setupGallery() {
    document.querySelectorAll("#track .card").forEach((card, cardIndex) => {
      const gallery = card.querySelector(".svc-pops");
      const images = [...card.querySelectorAll(".svc-pop")];
      if (!gallery || !images.length) return;
      const title = card.querySelector("h3")?.textContent || "实践";
      const inner = card.querySelector(".inner");
      const galleryId = `svc-gallery-${cardIndex + 1}`;
      card.classList.add("mm-card");
      gallery.classList.add("mm-gallery");
      gallery.id = galleryId;
      gallery.setAttribute("role", "group");
      gallery.setAttribute("aria-label", `${title}配图`);

      const links = images.map((image, index) => {
        const link = document.createElement("a");
        link.className = "svc-preview";
        link.href = image.getAttribute("src");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${title}配图 ${index + 1}，打开原图`);
        image.alt = `${title}配图 ${index + 1} / ${images.length}`;
        image.decoding = "async";
        link.append(image);
        gallery.append(link);
        return link;
      });

      const note = document.createElement("span");
      note.className = "svc-image-note";
      note.textContent = "点按配图查看原图 ↗";
      gallery.append(note);

      let current = 0;
      let nextButton = null;
      const setCurrent = index => {
        current = index;
        links.forEach((link, linkIndex) => {
          const active = linkIndex === current;
          link.classList.toggle("is-current", active);
          link.tabIndex = active ? 0 : -1;
          link.setAttribute("aria-hidden", String(!active));
        });
        if (nextButton) {
          nextButton.textContent = `配图 ${current + 1} / ${links.length} · 轻点切换 →`;
          nextButton.setAttribute("aria-label", `${title}，当前配图 ${current + 1} / ${links.length}，切换下一张`);
        }
      };

      if (links.length > 1 && inner) {
        nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.className = "svc-next mm-press";
        nextButton.setAttribute("aria-controls", galleryId);
        nextButton.addEventListener("click", () => setCurrent((current + 1) % links.length));
        inner.append(nextButton);
      }
      setCurrent(0);
    });
  }

  function enableMobile() {
    if (initialized || !touchView.matches) return;
    initialized = true;
    try {
      completeTypedText();
      document.querySelectorAll("main .reveal").forEach(element => element.classList.add("in"));
      setupGallery();
      document.querySelectorAll(".proj, .cert, .crow, .ai-fab, .ai-head button, .ai-input button, .ai-sugs button, .skip")
        .forEach(element => element.classList.add("mm-press"));
      root.classList.add("mobile-motion-enabled");
      setupIntro();
    } catch (error) {
      // Enhancement failure must leave all original reading and links available.
      releaseIntro();
      root.classList.remove("mobile-motion-enabled");
      if (revealObserver) revealObserver.disconnect();
      document.querySelectorAll(".mm-reveal").forEach(element => element.classList.add("mm-visible"));
    }
  }

  enableMobile();
  touchView.addEventListener?.("change", enableMobile);
  reducedMotion.addEventListener?.("change", () => {
    if (!reducedMotion.matches) return;
    completeTypedText();
    releaseIntro();
    if (revealObserver) revealObserver.disconnect();
    document.querySelectorAll(".mm-reveal").forEach(element => element.classList.add("mm-visible"));
  });
  if (reducedMotion.matches) completeTypedText();
})();
