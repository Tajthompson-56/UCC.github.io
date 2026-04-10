/**
 * app.js — UCC IT Department PWA
 * Client-side JavaScript
 *
 * Authors: Marsha-Ann Genus (20233913) & Tajay Thompson (20205199)
 * Module:  ITT307 Internet Authoring II — Spring 2026
 */

'use strict';

/* ═══════════════════════════════════════
   STAFF DATA
═══════════════════════════════════════ */
var STAFF = [
    { name: 'Dr. Otis Osbourne',    role: 'Head of Department / Senior Lecturer',   phone: '+18769680001', email: 'o.osbourne@ucc.edu.jm',  initials: 'OO' },
    { name: 'Prof. Sandra Clarke',  role: 'Senior Lecturer — Networks & Security',  phone: '+18769680002', email: 's.clarke@ucc.edu.jm',     initials: 'SC' },
    { name: 'Mr. Kevin Williams',   role: 'Lecturer — Web Development',             phone: '+18769680003', email: 'k.williams@ucc.edu.jm',   initials: 'KW' },
    { name: 'Ms. Tracey-Ann Brown', role: 'Lecturer — Database Systems',            phone: '+18769680004', email: 't.brown@ucc.edu.jm',      initials: 'TB' },
    { name: 'Mr. Andre Thompson',   role: 'Lecturer — Software Engineering',        phone: '+18769680005', email: 'a.thompson@ucc.edu.jm',   initials: 'AT' },
    { name: 'Dr. Patricia Henry',   role: 'Lecturer — Artificial Intelligence',     phone: '+18769680006', email: 'p.henry@ucc.edu.jm',      initials: 'PH' },
    { name: 'Mr. Damion Reid',      role: 'Lab Technician / IT Support',            phone: '+18769680007', email: 'd.reid@ucc.edu.jm',       initials: 'DR' },
    { name: 'Ms. Alicia Morgan',    role: 'Department Secretary / Administration',  phone: '+18769680008', email: 'a.morgan@ucc.edu.jm',     initials: 'AM' }
];

/* ═══════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════ */
function navigate(page) {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });

    var view = document.getElementById('view-' + page);
    var nav  = document.getElementById('nav-' + page);
    if (view) view.classList.add('active');
    if (nav)  nav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Keyboard support for nav items */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
        });
    });
});

/* ═══════════════════════════════════════
   STAFF DIRECTORY
═══════════════════════════════════════ */
function renderStaff(list) {
    var el = document.getElementById('staffList');
    if (!el) return;

    if (!list.length) {
        el.innerHTML = '<p style="text-align:center;color:var(--muted);padding:2rem;font-size:14px">No staff members found.</p>';
        return;
    }

    el.innerHTML = list.map(function(s) {
        return '<div class="staff-card">' +
                   '<div class="staff-avatar">' + escHtml(s.initials) + '</div>' +
                   '<div class="staff-info">' +
                       '<div class="staff-name">' + escHtml(s.name) + '</div>' +
                       '<div class="staff-role">' + escHtml(s.role) + '</div>' +
                       '<div class="staff-contacts">' +
                           '<a href="tel:' + escHtml(s.phone) + '" class="contact-btn call">&#128222; Call</a>' +
                           '<a href="mailto:' + escHtml(s.email) + '" class="contact-btn email">&#9993; Email</a>' +
                       '</div>' +
                   '</div>' +
               '</div>';
    }).join('');
}

function filterStaff() {
    var q = document.getElementById('staffSearch').value.toLowerCase();
    renderStaff(STAFF.filter(function(s) {
        return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
    }));
}

/* ═══════════════════════════════════════
   COURSES
   Fetches courses.php which queries MySQL
   and returns JSON. courses.php has its own
   built-in fallback if the DB is down.
═══════════════════════════════════════ */
function renderCourses(list) {
    var el = document.getElementById('courseList');
    if (!el) return;

    if (!list || !list.length) {
        el.innerHTML = '<p class="error">No course data available. Please try again later.</p>';
        return;
    }

    el.innerHTML = list.map(function(c) {
        return '<div class="course-item"' +
                   ' data-year="'  + escHtml(String(c.year))           + '"' +
                   ' data-name="'  + escHtml(c.name.toLowerCase())     + '"' +
                   ' data-code="'  + escHtml(c.code.toLowerCase())     + '">' +
               '  <div class="course-header">' +
               '    <span class="course-code">' + escHtml(c.code) + '</span>' +
               '    <span class="course-name-text">' + escHtml(c.name) + '</span>' +
               '    <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
               '      <polyline points="6 9 12 15 18 9"></polyline>' +
               '    </svg>' +
               '  </div>' +
               '  <div class="course-details">' +
               '    <p><strong>Description:</strong> '    + escHtml(c.description)   + '</p>' +
               '    <p><strong>Prerequisites:</strong> '  + escHtml(c.prerequisite)  + '</p>' +
               '    <p><strong>Credit Hours:</strong> '   + escHtml(String(c.credits)) + '</p>' +
               '    <p><strong>Year / Semester:</strong> Year ' + escHtml(String(c.year)) + ' &mdash; Semester ' + escHtml(String(c.semester)) + '</p>' +
               '  </div>' +
               '</div>';
    }).join('');

    attachCourseAccordion();
    filterCourses(); /* apply any active filter after render */
}

function attachCourseAccordion() {
    document.querySelectorAll('.course-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var item   = header.closest('.course-item');
            var isOpen = item.classList.contains('open');

            document.querySelectorAll('.course-item').forEach(function(el) {
                el.classList.remove('open');
                el.querySelector('.course-details').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('open');
                item.querySelector('.course-details').style.maxHeight = '500px';
                setTimeout(function() {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

function filterCourses() {
    var query   = document.getElementById('courseSearch') ? document.getElementById('courseSearch').value.toLowerCase() : '';
    var yearBtn = document.querySelector('.filter-btn.active');
    var year    = yearBtn ? yearBtn.dataset.year : 'all';
    var items   = document.querySelectorAll('.course-item');
    var visible = 0;

    items.forEach(function(item) {
        var matchSearch = item.dataset.name.includes(query) || item.dataset.code.includes(query);
        var matchYear   = (year === 'all') || (item.dataset.year === year);
        if (matchSearch && matchYear) { item.style.display = ''; visible++; }
        else                          { item.style.display = 'none'; }
    });

    var noResults = document.getElementById('no-results');
    if (noResults) noResults.style.display = (items.length > 0 && visible === 0) ? 'block' : 'none';
}

/* Fetch courses.php — that file handles DB + fallback itself */
function loadCourses() {
    fetch('courses.php')
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(data) {
            renderCourses(data);
        })
        .catch(function(err) {
            console.error('[Courses] Failed to load:', err);
            var el = document.getElementById('courseList');
            if (el) el.innerHTML = '<p class="error">Could not load courses. Please check your connection and refresh.</p>';
        });
}

/* ═══════════════════════════════════════
   SOCIAL MEDIA TABS
═══════════════════════════════════════ */
function switchSocial(platform, btn) {
    document.querySelectorAll('.social-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.social-frame-wrap').forEach(function(f) { f.classList.remove('active'); });
    btn.classList.add('active');
    var frame = document.getElementById('sf-' + platform);
    if (frame) frame.classList.add('active');
}

/* ═══════════════════════════════════════
   EMAIL FAB
═══════════════════════════════════════ */
function openEmailFab() {
    var m = document.getElementById('emailModal');
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeEmailFab() {
    var m = document.getElementById('emailModal');
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function handleModalClick(e) {
    if (e.target === document.getElementById('emailModal')) closeEmailFab();
}

function sendEmail() {
    var name    = document.getElementById('email-name').value.trim();
    var from    = document.getElementById('email-from').value.trim();
    var subject = document.getElementById('email-subject').value.trim() || 'IT Department Enquiry';
    var body    = document.getElementById('email-body').value.trim()    || 'To whom it may concern,';

    if (!name || !from) { showToast('Please enter your name and email address.'); return; }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from)) { showToast('Please enter a valid email address.'); return; }

    var hod      = 'ithod@ucc.edu.jm';
    var fullBody = 'From: ' + name + ' <' + from + '>\n\n' + body;
    var url      = 'https://mail.google.com/mail/?view=cm'
                 + '&to='   + encodeURIComponent(hod)
                 + '&su='   + encodeURIComponent(subject)
                 + '&body=' + encodeURIComponent(fullBody);

    window.open(url, '_blank', 'noopener,noreferrer');
    closeEmailFab();
    showToast('Opening Gmail compose...');
}

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
var _toastTimer = null;
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function() { t.classList.remove('show'); }, 3200);
}

/* ═══════════════════════════════════════
   PWA — INSTALL PROMPT
═══════════════════════════════════════ */
var _deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    _deferredPrompt = e;
    var btn = document.getElementById('installBtn');
    if (btn) btn.classList.add('visible');
});
function installApp() {
    if (!_deferredPrompt) return;
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then(function(r) {
        if (r.outcome === 'accepted') showToast('App installed successfully!');
        _deferredPrompt = null;
        var btn = document.getElementById('installBtn');
        if (btn) btn.classList.remove('visible');
    });
}
window.addEventListener('appinstalled', function() {
    var btn = document.getElementById('installBtn');
    if (btn) btn.classList.remove('visible');
    showToast('UCC IT App installed!');
});

/* ═══════════════════════════════════════
   OFFLINE DETECTION
═══════════════════════════════════════ */
function updateOnlineStatus() {
    var banner = document.getElementById('offline-banner');
    if (banner) banner.classList.toggle('show', !navigator.onLine);
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

/* ═══════════════════════════════════════
   SERVICE WORKER
═══════════════════════════════════════ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(r)  { console.log('[SW] Registered. Scope: ' + r.scope); })
            .catch(function(e) { console.error('[SW] Registration failed:', e); });
    });
}

/* ═══════════════════════════════════════
   UTILITY
═══════════════════════════════════════ */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ═══════════════════════════════════════
   INIT — runs when DOM is ready
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

    /* Render staff directory */
    renderStaff(STAFF);

    var staffSearch = document.getElementById('staffSearch');
    if (staffSearch) staffSearch.addEventListener('input', filterStaff);

    /* Load courses from courses.php */
    loadCourses();

    /* Course search box */
    var courseSearch = document.getElementById('courseSearch');
    if (courseSearch) courseSearch.addEventListener('input', filterCourses);

    /* Year filter buttons */
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            filterCourses();
        });
    });

    /* Check online status on load */
    updateOnlineStatus();
});