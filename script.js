
// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".navlinks");

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        });
    });
}


// ==========================================
// 2. AUTOMATIC FOOTER YEAR
// ==========================================

document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
});


// ==========================================
// 3. GALLERY CAROUSEL
// ==========================================

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
    const items = Array.from(gallery.children);
    let offset = 0;

    const visibleCount = () => {
        if (window.innerWidth < 560) return 2;
        if (window.innerWidth < 850) return 3;
        return 5;
    };

    const showGallery = () => {
        const count = Math.min(visibleCount(), items.length);

        items.forEach((item, index) => {
            const position = (index - offset + items.length) % items.length;

            item.style.display = position < count ? "block" : "none";
        });
    };

    const moveGallery = direction => {
        if (!items.length) return;

        offset = (offset + direction + items.length) % items.length;
        showGallery();
    };

    document.querySelector("[data-prev]")?.addEventListener("click", () => {
        moveGallery(-1);
    });

    document.querySelector("[data-next]")?.addEventListener("click", () => {
        moveGallery(1);
    });

    window.addEventListener("resize", showGallery);

    showGallery();

    if (items.length > visibleCount()) {
        setInterval(() => moveGallery(1), 5000);
    }
}


// ==========================================
// 4. EMAILJS CONFIGURATION
// ==========================================

// Replace these three values with your actual EmailJS credentials.

const EMAILJS_PUBLIC_KEY = "O7q83xTuOjCD_SEy_";
const EMAILJS_SERVICE_ID = "service_i3151a3";
const EMAILJS_TEMPLATE_ID = "template_nspbkti";


// ==========================================
// 5. INTERNATIONAL PHONE NUMBER SELECTOR
// ==========================================

const phoneInput = document.querySelector("#phone");

let iti = null;

if (phoneInput) {
    if (typeof window.intlTelInput === "function") {
        try {
            iti = window.intlTelInput(phoneInput, {
                initialCountry: "ng",
                separateDialCode: true,
                nationalMode: true,
                autoPlaceholder: "polite",

                loadUtils: () => import(
                    "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"
                )
            });

        } catch (error) {
            console.error("Phone selector initialization error:", error);
        }
    } else {
        console.error(
            "International phone library failed to load."
        );
    }
}


// ==========================================
// 6. CONTACT FORM AND EMAILJS
// ==========================================

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const status = document.querySelector("#form-status");
    const button = document.querySelector("#send-button");

    const showStatus = (message, isError = false) => {
        if (!status) return;

        status.textContent = message;
        status.classList.add("show");

        status.style.color = isError ? "#d00000" : "#16803c";
    };

    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = document.querySelector("#from_name")?.value.trim() || "";
        const email = document.querySelector("#from_email")?.value.trim() || "";
        const subject = document.querySelector("#subject")?.value.trim() || "";
        const message = document.querySelector("#message")?.value.trim() || "";

        // Check required fields.
        if (!name || !subject || !message || !phoneInput?.value.trim()) {
            showStatus(
                "Please complete all required fields.",
                true
            );
            return;
        }

        // Email is optional, but must be valid if supplied.
        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            showStatus("Please enter a valid email address.", true);
            document.querySelector("#from_email")?.focus();
            return;
        }

        // Check that the phone selector loaded.
        if (!iti) {
            showStatus(
                "The phone number selector could not load. Please refresh the page and try again.",
                true
            );
            return;
        }

        // Wait for phone validation utilities.
        try {
            await iti.promise;
        } catch (error) {
            console.error("Phone validation loading error:", error);

            showStatus(
                "Phone validation could not load. Please refresh and try again.",
                true
            );
            return;
        }

        // Validate phone number.
        if (!iti.isValidNumber()) {
            showStatus(
                "Please enter a valid phone number for your selected country.",
                true
            );

            phoneInput.focus();
            return;
        }

        // Check EmailJS configuration.
       const emailJSConfigured =
    typeof window.emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY.trim().length > 0 &&
    EMAILJS_SERVICE_ID.trim().length > 0 &&
    EMAILJS_TEMPLATE_ID.trim().length > 0 &&
    !EMAILJS_PUBLIC_KEY.includes("YOUR_") &&
    !EMAILJS_SERVICE_ID.includes("YOUR_") &&
    !EMAILJS_TEMPLATE_ID.includes("YOUR_");

        if (!emailJSConfigured) {
            showStatus(
                "The contact form has an issue, Please contact the church by phone Thank you.",
                true
            );
            return;
        }

        const internationalPhone = iti.getNumber();
        const cleanPhone = internationalPhone.replace(/\D/g, "");

        // WhatsApp reply link.
        const whatsappLink =
            `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                "Hello " + name +
                ", thank you for contacting T.H.I.S Latter House."
            )}`;

        // SMS reply link.
        const smsLink =
            `sms:${internationalPhone}?body=${encodeURIComponent(
                "Hello " + name +
                ", thank you for contacting T.H.I.S Latter House."
            )}`;

        // Prevent multiple submissions.
        if (button) {
            button.disabled = true;
            button.textContent = "Sending...";
        }

        if (status) {
            status.classList.remove("show");
        }

        try {
            // Initialize EmailJS.
            await emailjs.init({
                publicKey: EMAILJS_PUBLIC_KEY
            });

            // Send enquiry to the church.
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: name,
                    from_email: email || "Not provided",
                    phone: internationalPhone,
                    subject: subject,
                    message: message,
                    whatsapp_link: whatsappLink,
                    sms_link: smsLink
                }
            );

            showStatus(
                "Thank you! Your message has been sent successfully."
            );

            // Reset form after successful submission.
            contactForm.reset();

            // Restore Nigeria as the default country.
            iti.setCountry("ng");

       } catch (error) {
    console.error("EmailJS submission error:", error);

    const errorMessage =
        error?.text ||
        error?.message ||
        "Unknown EmailJS error";

    showStatus(
        "Please check your internet connection and try again: " + errorMessage,
        true
    );

        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Send Message";
            }
        }
    });
}
