/* ============================================================
   CODECRAFT — script.js
   ============================================================ */

/* ──────────────────────────────────────────────
   1. NAVBAR — تغيير الخلفية عند التمرير
   ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ──────────────────────────────────────────────
   2. HAMBURGER — قائمة الجوال
   ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// إغلاق القائمة عند الضغط على أي رابط
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ──────────────────────────────────────────────
   3. TYPED TEXT — كتابة تلقائية في الهيرو
   ────────────────────────────────────────────── */
const typedEl   = document.getElementById('typedText');
const phrases   = [
  'بدقة واحترافية.',
  'بأحدث التقنيات.',
  'بأسرع وقت ممكن.',
  'بجودة لا تُضاهى.',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

function typeEffect() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    // انتهى الكتابة — استراحة ثم ابدأ الحذف
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // انتهى الحذف — انتقل للجملة التالية
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

/* ──────────────────────────────────────────────
   4. COUNTER — عداد الأرقام في الهيرو
   ────────────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target   = +el.dataset.target;
    const duration = 2000; // ms
    const step     = target / (duration / 16);
    let current    = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  });
}

// تشغيل العداد عند وصول قسم الهيرو للشاشة
const heroSection = document.getElementById('home');
let counterStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counterStarted) {
    counterStarted = true;
    animateCounters();
  }
}, { threshold: 0.4 });

counterObserver.observe(heroSection);

/* ──────────────────────────────────────────────
   5. REVEAL — ظهور البطاقات عند التمرير
   ────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // تأخير متتالي لكل بطاقة
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ──────────────────────────────────────────────
   6. PROJECT FILTER — فلترة المشاريع
   ────────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // تفعيل الزر المختار
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;

      if (match) {
        card.classList.remove('hidden');
        // إعادة تشغيل animation
        card.classList.remove('visible');
        void card.offsetWidth; // force reflow
        card.classList.add('visible');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ──────────────────────────────────────────────
   7. CONTACT FORM — التحقق من النموذج
   ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = message;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // التحقق من الاسم
  if (name.length < 3) {
    showError('name', 'nameError', 'الرجاء إدخال اسم صحيح (3 أحرف على الأقل)');
    valid = false;
  } else {
    clearError('name', 'nameError');
  }

  // التحقق من البريد
  if (!emailRegex.test(email)) {
    showError('email', 'emailError', 'الرجاء إدخال بريد إلكتروني صحيح');
    valid = false;
  } else {
    clearError('email', 'emailError');
  }

  // التحقق من الرسالة
  if (message.length < 10) {
    showError('message', 'messageError', 'الرجاء كتابة رسالة مفصّلة (10 أحرف على الأقل)');
    valid = false;
  } else {
    clearError('message', 'messageError');
  }

  if (!valid) return;

  // إرسال حقيقي عبر Formspree
  submitBtn.textContent = 'جاري الإرسال...';
  submitBtn.disabled = true;

  const formData = new FormData(contactForm);

  fetch('https://formspree.io/f/mvkgdoyd', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        formSuccess.style.display = 'block';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      } else {
        alert('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
      }
    })
    .catch(() => {
      alert('تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.');
    })
    .finally(() => {
      submitBtn.textContent = 'إرسال الرسالة';
      submitBtn.disabled = false;
    });
});

// مسح الخطأ عند الكتابة
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, `${id}Error`);
  });
});

/* ──────────────────────────────────────────────
   8. BACK TO TOP — زر العودة للأعلى
   ────────────────────────────────────────────── */
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────
   9. FOOTER YEAR — سنة ديناميكية
   ────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
