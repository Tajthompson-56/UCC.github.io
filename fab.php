<?php
/**
 * fab.php — Floating Action Button + Email Modal
 * Included in index.php via: <?php include 'fab.php'; ?>
 *
 * Authors: Marsha-Ann Genus (20233913) & Tajay Thompson (20205199)
 * Module:  ITT307 Internet Authoring II — Spring 2026
 */
$hod_email     = 'ithod@ucc.edu.jm';
$email_subject = 'IT Department Enquiry';
$email_body    = 'To whom it may concern,';
?>

<!-- FLOATING ACTION BUTTON -->
<button class="fab"
        onclick="openEmailFab()"
        title="Email the Head of Department"
        aria-label="Email the Head of Department"
        aria-haspopup="dialog">
  &#9993;
</button>

<!-- EMAIL COMPOSE MODAL -->
<div class="modal-overlay"
     id="emailModal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="emailModalTitle"
     onclick="handleModalClick(event)">
  <div class="modal-sheet">
    <div class="modal-handle" aria-hidden="true"></div>
    <button class="modal-close-btn" onclick="closeEmailFab()" aria-label="Close">&#10005;</button>

    <div class="modal-title" id="emailModalTitle">Email the HOD</div>
    <p class="modal-sub">
      Send a message to the Head of the IT Department at
      <strong><?php echo htmlspecialchars($hod_email); ?></strong>
    </p>

    <div class="email-field">
      <label for="email-to">To</label>
      <input type="email" id="email-to"
             value="<?php echo htmlspecialchars($hod_email); ?>"
             readonly style="color:var(--muted)">
    </div>
    <div class="email-field">
      <label for="email-name">Your Name</label>
      <input type="text" id="email-name"
             placeholder="e.g. Marsha-Ann Genus"
             autocomplete="name">
    </div>
    <div class="email-field">
      <label for="email-from">Your Email</label>
      <input type="email" id="email-from"
             placeholder="your.email@student.ucc.edu.jm"
             autocomplete="email">
    </div>
    <div class="email-field">
      <label for="email-subject">Subject</label>
      <input type="text" id="email-subject"
             value="<?php echo htmlspecialchars($email_subject); ?>">
    </div>
    <div class="email-field">
      <label for="email-body">Message</label>
      <textarea id="email-body" rows="5"
                placeholder="<?php echo htmlspecialchars($email_body); ?>"></textarea>
    </div>
    <button class="email-send-btn" onclick="sendEmail()">
      &#9993;&nbsp; Send Message
    </button>
  </div>
</div>