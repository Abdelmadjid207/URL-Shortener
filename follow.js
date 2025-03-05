const facee = document.getElementById('face');
const faceText = facee.querySelector("h4");

document.addEventListener("mousemove", (e) => {
    const rect = facee.getBoundingClientRect(); // Get face position
    const x = e.clientX - (rect.left + rect.width / 2); // Centering the movement
    const y = e.clientY - (rect.top + rect.height / 2);

    faceText.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`; // Move slightly
});

document.addEventListener("mouseleave", () => {
    faceText.style.transform = "translate(0, 0)"; // Reset
});


facee.addEventListener('mouseleave', () => {
    faceText.style.transform = 'translate(0, 0)'; // Reset position when not hovering
});

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        const faceRect = facee.getBoundingClientRect();
        const faceCenterX = faceRect.left + faceRect.width / 2;
        const faceCenterY = faceRect.top + faceRect.height / 2;

        const inputRect = e.target.getBoundingClientRect();
        const inputX = inputRect.left + inputRect.width / 2;
        const inputY = inputRect.top + inputRect.height / 2;

        // Calculate movement within a limited range inside `.face`
        const offsetX = (inputX - faceCenterX) * 0.1; // Adjust movement intensity
        const offsetY = (inputY - faceCenterY) * 0.1;

        // Move the text inside the `.face`
        faceText.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    input.addEventListener("blur", () => {
        // Reset the text position when input is unfocused
        faceText.style.transform = "translate(0, 0)";
    });
});

console.log(facee, faceText, inputs);