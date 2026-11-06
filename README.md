# T.H.I.S Latter House Church of Christ Website

A responsive multi-page church website using a red-and-white visual identity.

## Pages
- `index.html` — Home page and hero section
- `about.html` — Who We Are, church introduction and founder section
- `ministries.html` — What We Do
- `giving.html` — Online Giving with editable church bank-account placeholders
- `media.html` — YouTube and Facebook links
- `contact.html` — Contact information and EmailJS-powered enquiry form

## Before publishing

### 1. Replace photo placeholders
The SVGs in `images/` are clearly labelled visual placeholders. Replace them with real church photos, keeping the same filenames:
- `hero-worship.svg`
- `church-worship.svg`
- `gallery-1.svg` through `gallery-5.svg`

You may use JPG/PNG photos instead, but update the matching image paths in the HTML files.

### 2. Configure EmailJS
The contact form is wired to the EmailJS browser SDK. It will not send email until you create an EmailJS account and fill in the three constants near the bottom of `script.js`:
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`

Create an EmailJS template using these variables:
- `{{from_name}}`
- `{{reply_to}}`
- `{{phone}}`
- `{{subject}}`
- `{{message}}`

Set the template's recipient to the church's intended email address inside your EmailJS dashboard. Do not put private account passwords or email login credentials in this website.

### 3. Complete Online Giving details
Open `giving.html` and replace:
- `[INSERT CHURCH ACCOUNT NAME]`
- `[INSERT BANK NAME]`
- `[INSERT ACCOUNT NUMBER]`
- `[INSERT ACCOUNT TYPE, IF APPLICABLE]`

Verify the account details with the church before publishing.

### 4. Check church details
The site currently displays:
- T.H.I.S Latter House Church of Christ
- 11 Kumoluyi St, Ifako-Ijaiye, Lagos 101232, Nigeria
- 0803 425 6526 / 0806 233 7970
- Founder: Pastor Oluseyi Gbase

## Run locally
Unzip the folder and open `index.html` in a browser. For best results, use a local development server or your web host so the EmailJS SDK can load correctly.
