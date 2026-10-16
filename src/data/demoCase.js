/**
 * Realistic demonstration cases for judges and users.
 * The demo utilizes messy real-world field names and HTML attributes.
 */

export const DEMO_CASE = {
  purpose: 'newsletter signup',
  organizationName: 'Bharat Pulse Weekly Media Ltd.',
  
  // Realistic messy HTML form
  htmlContent: `<form id="sub_form_v2" action="/api/v1/subscribe" method="POST">
  <!-- CSRF Protection Token -->
  <input type="hidden" name="_csrf_token" value="d9a1f28b3c4e5" />
  
  <!-- Primary Contact -->
  <div class="form-group">
    <label for="usr_eml">Subscriber Email *</label>
    <input type="email" id="usr_eml" name="user_email" placeholder="name@domain.com" required autocomplete="email" />
  </div>

  <!-- Mobile phone (Unnecessary for email digest) -->
  <div class="form-group">
    <label for="mob">WhatsApp / Mobile No</label>
    <input type="tel" id="mob" name="mob_no" placeholder="9876543210" autocomplete="tel" />
  </div>

  <!-- Excessive Date of Birth -->
  <div class="form-group">
    <label for="birth">Date of Birth</label>
    <input type="date" id="birth" name="dob" />
  </div>

  <!-- Disproportionate National ID -->
  <div class="form-group">
    <label for="uid">Aadhaar Card Number (12 digits)</label>
    <input type="text" id="uid" name="aadhaar_number" placeholder="XXXX XXXX XXXX" maxlength="14" />
  </div>

  <!-- Invasive Medical History -->
  <div class="form-group">
    <label for="med_hist">Medical History & Allergies (Optional)</label>
    <textarea id="med_hist" name="medical_history" placeholder="List existing health conditions or chronic illnesses..."></textarea>
  </div>

  <!-- Intrusive GPS Coordinates -->
  <div class="form-group">
    <label for="loc_coords">Device GPS Geolocation</label>
    <input type="text" id="loc_coords" name="gps_location" placeholder="18.5204° N, 73.8567° E" />
  </div>

  <!-- Legitimate Topic Preferences -->
  <div class="form-group">
    <label for="pref_topics">Preferred Newsletter Topics</label>
    <input type="text" id="pref_topics" name="favorite_topics" placeholder="Technology, Economy, Law, Health" />
  </div>

  <button type="submit" id="btn_submit">Subscribe Now</button>
</form>`,

  // Equivalent Field List
  fieldListContent: `user_email
mob_no
dob
aadhaar_number
medical_history
gps_location
favorite_topics
_csrf_token`,
};

export const ADDITIONAL_DEMOS = [
  {
    id: 'ecommerce_checkout',
    name: 'Online Checkout (E-Commerce)',
    purpose: 'online shopping checkout',
    organizationName: 'Deccan Artisans Retail Pvt Ltd',
    fieldListContent: `recipient_name, shipping_address, pin_code, contact_mobile, user_email, card_number, cvv, card_expiry, aadhaar_number, medical_history`,
  },
  {
    id: 'job_application',
    name: 'Software Engineer Job Application',
    purpose: 'job application',
    organizationName: 'Swayambhu Cloud Systems',
    fieldListContent: `full_name, user_email, contact_phone, resume, current_company, years_experience, highest_qualification, pan_no, bank_ac, ifsc, gps_location`,
  },
  {
    id: 'doctor_appointment',
    name: 'Clinical Appointment Booking',
    purpose: 'appointment booking',
    organizationName: 'Arogya Multi-Specialty Clinic',
    fieldListContent: `patient_name, contact_mobile, email_address, appointment_date, appointment_time, health_condition, blood_group, aadhaar_number`,
  },
];
