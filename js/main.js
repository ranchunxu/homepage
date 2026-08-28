(function () {
  'use strict';

  const cfg = window.RESUME_CONFIG || {};
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const icon = (name) => '<i data-lucide="' + name + '"></i>';
  const bentoClass = (index) => index === 0 ? ' bento-featured' : index === 3 ? ' bento-wide' : '';
  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  function renderMeta() {
    document.title = cfg.meta.title || document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && cfg.meta.description) {
      metaDesc.setAttribute('content', cfg.meta.description);
    }
    $('#brandMark').textContent = cfg.meta.brandMark || 'ZS';
    $('#brandText').textContent = cfg.meta.brandText || '在线简历';
  }

  function renderHero() {
    const hero = cfg.hero || {};
    $('#heroGreet').textContent = hero.greeting || '你好，我是';
    $('#heroName').textContent = hero.name || '你的姓名';
    $('#heroNameEn').textContent = hero.nameEn || '';
    $('#heroDesc').textContent = hero.desc || '';
    $('#typedText').textContent = '';
    const heroAvatar = $('#heroAvatar');
    if (heroAvatar) {
      heroAvatar.src = (cfg.about && cfg.about.photo) || 'assets/avatar.webp';
      heroAvatar.alt = (cfg.about && cfg.about.name || '李家恩') + '的头像';
    }
  }

  function renderAbout() {
    const about = cfg.about || {};
    $('#aboutPhoto').src = about.photo || 'assets/avatar.webp';
    $('#aboutPhoto').alt = about.name + '的个人照片';
    $('#photoBadge').textContent = about.badge || 'ZS';
    $('#mediaName').textContent = about.name || '你的姓名';
    $('#mediaRole').textContent = about.role || '目标岗位';
    $('#aboutIntroTitle').textContent = about.introTitle || '';
    $('#aboutIntro').textContent = about.intro || '';
    $('#aboutMotto').textContent = about.motto || '';

    $('#infoList').innerHTML = (about.info || []).map(function (item) {
      return '<li class="info-item"><span class="info-icon">' + icon(item.icon) +
        '</span><span class="info-label">' + escapeHtml(item.label) +
        '</span><strong>' + escapeHtml(item.value) + '</strong></li>';
    }).join('');
  }

  function renderSkills() {
    const skills = cfg.skills || {};
    $('#servicesGrid').innerHTML = (cfg.services || []).map(function (item, index) {
      return '<article class="service-card bento-item' + bentoClass(index) + '"><span class="service-icon">' + icon(item.icon) +
        '</span><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.desc) + '</p></article>';
    }).join('');

    const tags = (skills.tags || []).map(function (tag) {
      return '<span class="skill-tag">' + escapeHtml(tag) + '</span>';
    }).join('');
    const bars = (skills.bars || []).map(function (bar) {
      return '<div class="skill-bar"><div class="skill-bar-head"><span>' + escapeHtml(bar.name) +
        '</span><em data-value="' + Number(bar.value) + '">0%</em></div><div class="skill-bar-track">' +
        '<div class="skill-bar-fill" style="--value:' + Number(bar.value) + '%"></div></div></div>';
    }).join('');
    $('#skillBars').innerHTML = bars;
    $('#skillBars').insertAdjacentHTML('beforebegin', '<div class="skill-tags">' + tags + '</div>');
  }

  function renderPersonality() {
    const personality = cfg.personality || {};
    $('#personalityIntro').textContent = personality.intro || '';
    $('#personalityGrid').innerHTML = (personality.cards || []).map(function (item, index) {
      return '<article class="personality-card bento-item' + bentoClass(index) + '"><span class="personality-icon">' + icon(item.icon) +
        '</span><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.desc) + '</p></article>';
    }).join('');
    $('#personalityTags').innerHTML = (personality.tags || []).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    $('#personalityGroups').innerHTML = (personality.groups || []).map(function (group) {
      const summary = group.summary || (group.points || []).join('；');
      return '<article class="personality-group"><h4>' + escapeHtml(group.title) +
        '</h4><p>' + escapeHtml(summary) + '</p></article>';
    }).join('');
  }

  function renderExperience() {
    $('#timeline').innerHTML = (cfg.experience || []).map(function (item, index) {
      const points = (item.points || []).map(function (point) {
        return '<li>' + escapeHtml(point) + '</li>';
      }).join('');
      return '<li class="timeline-item reveal"><span class="timeline-dot"></span>' +
        '<time>' + escapeHtml(item.period) + '</time>' +
        '<div class="timeline-card"><h3>' + escapeHtml(item.title) + '</h3>' +
        '<p class="timeline-major">' + escapeHtml(item.major) + '</p><ul>' + points + '</ul></div></li>';
    }).join('');
  }

  function renderProjects() {
    $('#projectGrid').innerHTML = (cfg.projects || []).map(function (item, index) {
      const tech = (item.tech || []).map(function (name) {
        return '<span>' + escapeHtml(name) + '</span>';
      }).join('');
      const openLink = item.link && item.link !== '#'
        ? '<a class="project-card-open" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener" aria-label="打开' + escapeHtml(item.title) + '项目"></a>'
        : '';
      const links = '<div class="project-links"><a class="project-link" href="' + escapeHtml(item.link || '#') +
        '" aria-label="查看项目"><i data-lucide="arrow-up-right"></i></a>' +
        '<a class="project-link" href="' + escapeHtml(item.source || '#') +
        '" aria-label="查看源码"><i data-lucide="github"></i></a></div>';
      return '<article class="project-card bento-item' + bentoClass(index) + '">' + openLink + '<div class="project-cover">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '项目封面" loading="lazy" decoding="async">' +
        links + '</div><div class="project-body"><h3>' + escapeHtml(item.title) +
        '</h3><p>' + escapeHtml(item.desc) + '</p><div class="project-tech">' + tech + '</div></div></article>';
    }).join('');
  }

  function renderContact() {
    const contact = cfg.contact || {};
    $('#contactGrid').innerHTML = (contact.items || []).map(function (item) {
      const body = '<span class="contact-icon">' + icon(item.icon) + '</span>' +
        '<div class="contact-copy"><span class="contact-label">' + escapeHtml(item.label) +
        '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
      if (item.href) {
        return '<a class="contact-card" href="' + escapeHtml(item.href) + '" target="_blank" rel="noopener">' +
          body + '<i data-lucide="arrow-up-right" class="contact-arrow"></i></a>';
      }
      return '<div class="contact-card"><span class="contact-icon">' + icon(item.icon) + '</span>' +
        '<div class="contact-copy"><span class="contact-label">' + escapeHtml(item.label) +
        '</span><strong>' + escapeHtml(item.value) + '</strong></div>' +
        '<button class="copy-btn" type="button" data-copy="' + escapeHtml(item.value) + '">复制</button></div>';
    }).join('');

    $('#contactTags').innerHTML = (contact.tags || []).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    const footerText = $('#footerText');
    if (footerText) {
      const name = cfg.about && cfg.about.name ? cfg.about.name : '你的姓名';
      footerText.textContent = '© ' + new Date().getFullYear() + ' ' + name + ' · 个人在线简历';
    }
  }

  function renderDotNav() {
    const items = [
      ['hero', '首页'],
      ['about', '关于我'],
      ['skills', '专业能力'],
      ['personality', '个人特质'],
      ['experience', '学习经历'],
      ['projects', '项目作品'],
      ['contact', '联系方式']
    ];
    $('#dotNav').innerHTML = items.map(function (item) {
      return '<a href="#' + item[0] + '" data-section="' + item[0] + '"><span>' + item[1] + '</span></a>';
    }).join('');
  }

  function initParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles = [];
    let particleColor = 'rgba(255,255,255,.55)';

    function readColor() {
      particleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle').trim() || particleColor;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(72, Math.floor(width * height / 22000)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.7
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/, (1 - dist / 130) * 0.25 + ')');
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    readColor();
    resize();
    window.addEventListener('resize', resize);
    draw();
    window.__refreshParticleColor = readColor;
  }

  function initHeroParallax() {
    const hero = $('#hero');
    const bg = $('.bg-layer');
    if (!hero || !bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layers = $$('[data-depth]', hero);

    function onMove(event) {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      bg.style.transform = 'translate3d(' + (x * -16).toFixed(2) + 'px,' +
        (y * -12).toFixed(2) + 'px,0) scale(1.045)';
      layers.forEach(function (el) {
        const depth = parseFloat(el.dataset.depth) || 1;
        el.style.translate = (x * -22 * depth).toFixed(2) + 'px ' + (y * -16 * depth).toFixed(2) + 'px';
      });
    }

    window.addEventListener('pointermove', onMove, { passive: true });
  }

  function initRoleRotation() {
    const roles = (cfg.hero && cfg.hero.roles) || [];
    if (!roles.length) return;
    const target = $('#typedText');
    let roleIndex = 0;
    target.textContent = roles[0];

    function switchTo(nextIndex) {
      target.classList.add('is-switching');
      window.setTimeout(function () {
        target.textContent = roles[nextIndex];
        target.classList.remove('is-switching');
        roleIndex = nextIndex;
      }, 280);
    }

    window.setInterval(function () {
      switchTo((roleIndex + 1) % roles.length);
    }, 3000);
  }

  function initTheme() {
    // 固定黑金深色主题，不提供白天/黑夜切换
    document.documentElement.dataset.theme = 'dark';
  }

  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)).toFixed(4) + ')';
      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  function initSkillCounters() {
    const wrap = $('.skills-bars-wrap');
    const values = $$('.skill-bar em', wrap || document);
    if (!wrap || !values.length) return;

    function animate() {
      values.forEach(function (em) {
        const target = parseInt(em.dataset.value || em.textContent, 10) || 0;
        const duration = 1100;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          em.textContent = Math.round(target * eased) + '%';
          if (progress < 1) window.requestAnimationFrame(tick);
        }

        window.requestAnimationFrame(tick);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(wrap);
    } else {
      animate();
    }
  }

  function initCardSpotlight() {
    if (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    $$('.bento-item, .personality-group').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--spot-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerenter', function () {
        card.style.setProperty('--spot-opacity', '1');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--spot-opacity', '0.7');
      });
    });
  }

  function initBgm() {
    const audio = $('#bgm');
    const button = $('#bgmToggle');
    if (!audio || !button) return;

    function setPlaying(playing) {
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
      button.innerHTML = icon(playing ? 'volume-2' : 'music');
      if (window.lucide) window.lucide.createIcons();
    }

    button.addEventListener('click', function () {
      if (audio.paused) {
        audio.volume = 0.06;
        audio.play().then(function () {
          setPlaying(true);
        }).catch(function () {
          setPlaying(false);
        });
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    audio.addEventListener('play', function () { setPlaying(true); });
    audio.addEventListener('pause', function () { setPlaying(false); });
  }

  function initNav() {
    const navToggle = $('#navToggle');
    const siteNav = $('#siteNav');

    function closeNav() {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = icon('menu');
      if (window.lucide) window.lucide.createIcons();
    }

    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = icon(isOpen ? 'x' : 'menu');
      if (window.lucide) window.lucide.createIcons();
    });

    $$('#siteNav a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  function initActiveNav() {
    const links = $$('#dotNav a');
    const navLinks = $$('#siteNav a');
    const sections = links.map(function (link) {
      return document.getElementById(link.dataset.section);
    }).filter(Boolean);

    function update() {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      sections.forEach(function (section, index) {
        if (section.offsetTop <= probe) current = index;
      });
      links.forEach(function (link, index) {
        link.classList.toggle('active', index === current);
      });
      const activeSection = sections[current];
      navLinks.forEach(function (link) {
        const targetId = (link.getAttribute('href') || '').replace('#', '');
        link.classList.toggle('active', targetId === (activeSection && activeSection.id));
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initPageLoad() {
    const finish = function () {
      window.setTimeout(function () {
        document.body.classList.add('is-loaded');
      }, 140);
    };
    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
    }
    window.setTimeout(finish, 2600);
  }

  function initBackToTop() {
    const button = $('#backToTop');
    if (!button) return;

    function update() {
      button.classList.toggle('is-visible', window.scrollY > 480);
    }

    button.addEventListener('click', function () {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initCopyButtons() {
    $$('.copy-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        const value = button.dataset.copy || '';
        const done = function () {
          button.textContent = '已复制';
          window.setTimeout(function () { button.textContent = '复制'; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(done).catch(function () { done(); });
        } else {
          const input = document.createElement('textarea');
          input.value = value;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          done();
        }
      });
    });
  }

  renderMeta();
  renderHero();
  renderAbout();
  renderSkills();
  renderPersonality();
  renderExperience();
  renderProjects();
  renderContact();
  renderDotNav();
  initRoleRotation();
  initParticles();
  initHeroParallax();
  initTheme();
  initBgm();
  initNav();
  initActiveNav();
  initReveal();
  initPageLoad();
  initBackToTop();
  initScrollProgress();
  initSkillCounters();
  initCardSpotlight();
  initCopyButtons();

  if (window.lucide) window.lucide.createIcons();
})();
