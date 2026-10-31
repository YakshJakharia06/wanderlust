
(() => {
    'use strict';

    // Bootstrap form validation
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });

    // Rating slider: only run on pages containing these elements
    const ratingInput = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');

    if (ratingInput && ratingValue) {
        ratingInput.addEventListener('input', () => {
            ratingValue.textContent = ratingInput.value;
        });
    }
})();


let taxSwitch = document.getElementById("flexSwitchCheckDefault");

if (taxSwitch) {

    let taxInfo = document.getElementsByClassName("tax-info");
    let prices = document.getElementsByClassName("price");

    function toggleTaxInfo() {

        for (let i = 0; i < prices.length; i++) {
            let basePrice = Number(prices[i].dataset.basePrice);
            if (taxSwitch.checked) {
                let totalPrice = basePrice * 1.18;
                prices[i].textContent =
                    `₹${totalPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 2
                    })}`;
                taxInfo[i].textContent = "incl. 18% GST";
                taxInfo[i].style.display = "inline";
            } else {
                prices[i].textContent =
                    `₹${basePrice.toLocaleString("en-IN")}`;
                taxInfo[i].style.display = "none";
            }
        }

        for (let info of taxInfo) {
            if (taxSwitch.checked) {
                info.style.display = "inline";
            } else {
                info.style.display = "none";
            }
        }

    }

    // Run when page loads
    toggleTaxInfo();

    // Run whenever checkbox changes
    taxSwitch.addEventListener("change", toggleTaxInfo);
}



// Filters horizontal scrolling

const filtersViewport = document.getElementById("filtersViewport");
const filtersArrow = document.getElementById("filtersArrow");

if (filtersViewport && filtersArrow) {

    const arrowIcon = filtersArrow.querySelector("i");

    function updateFilterArrow() {

        const hasOverflow =
            filtersViewport.scrollWidth >
            filtersViewport.clientWidth + 2;

        filtersArrow.hidden = !hasOverflow;

        if (!hasOverflow) return;

        const isAtEnd =
            filtersViewport.scrollLeft +
            filtersViewport.clientWidth >=
            filtersViewport.scrollWidth - 2;

        // Change arrow direction at the end
        arrowIcon.className = isAtEnd
            ? "fa-solid fa-angle-left"
            : "fa-solid fa-angle-right";

        filtersArrow.setAttribute(
            "aria-label",
            isAtEnd ? "Show previous filters" : "Show more filters"
        );
    }

    filtersArrow.addEventListener("click", function () {

        const isAtEnd =
            filtersViewport.scrollLeft +
            filtersViewport.clientWidth >=
            filtersViewport.scrollWidth - 2;

        if (isAtEnd) {

            // Return to the beginning
            filtersViewport.scrollTo({
                left: 0,
                behavior: "smooth"
            });

        } else {

            // Reveal more filters
            filtersViewport.scrollBy({
                left: filtersViewport.clientWidth * 0.75,
                behavior: "smooth"
            });

        }
    });

    filtersViewport.addEventListener("scroll", updateFilterArrow);

    window.addEventListener("resize", updateFilterArrow);

    // Check after page loads
    updateFilterArrow();
}


document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", function () {
        console.log("Clicked element:", this);
        console.log("Paragraph:", this.querySelector("p"));

        let category = this.querySelector("p")?.textContent.trim();

        console.log("Category:", category);

        if (!category) {
            console.error("Category text not found!");
            return;
        }

        window.location.href =
            `/listings?category=${encodeURIComponent(category)}`;
    });
});