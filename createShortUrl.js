const shortenForm = document.getElementById('shorten-form');
const shortenResult = document.getElementById('shorten-result');

shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = shortenForm.querySelector('#shorten-form > input[name="url"]').value;
    const token = localStorage.getItem('token');
    const shortenUrl = 'https://www.shorten-url-api.infobrains.club/api/private/urls';

    shortenResult.style.opacity = "0";

    // Check if the URL is reachable
    try {
        const testResponse = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    
    } catch (error) {
        await Swal.fire({
            title: "Invalid URL!",
            html: `<b>The URL seems invalid or unreachable</b><br><br>
           Your input: <a href="${url}" target="_blank" style="color: red; text-decoration: none; font-weight: bold;">"${url}"</a> <br><br>
           <b>Suggested Fix:</b> Check for any typo and Make sure it starts with "https://" (or with any other valid protocal acronym).<br>
           Example: https://example.com`,
            icon: "warning",
            confirmButtonColor: "#ff9603",
            confirmButtonText: "OK",
            background: "#fffed2",
            color: "#e35f01",
            customClass: {
                popup: 'custom-alert',
                title: 'custom-alert-title',
                confirmButton: 'custom-alert-button'
            }
        });
        return;
    }
    

    setTimeout(async () => {
        shortenResult.classList.add('result');
        shortenResult.innerHTML = `<p>Making URL...</p>`;
        shortenResult.style.opacity = "1";

        try {
            const response = await fetch(shortenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url })
            });

            const jsonResponse = await response.json();

            if (response.status === 500) {
                alert('Internal server error');
                return;
            }

            if (response.status === 401) {
                alert('Unauthorized');
                localStorage.removeItem('token');
                window.location.href = '/index.html';
                return;
            }

            if (response.status === 400) {
                alert(jsonResponse.error.details);
                return;
            }

            if (response.status === 201) {
                const shortUrl = jsonResponse.data.shortUrl;

                shortenResult.style.opacity = "0";
                setTimeout(() => {
                    shortenResult.innerHTML = `
                        <p>URL successfully shortened!</p>
                        <a href="${shortUrl}" target="_blank">Follow link</a>
                        <button id="copyButton" style="margin-top: 20px; display: inline-block;">Copy</button>`;

                    shortenResult.style.opacity = "1";

                    document.getElementById("copyButton").addEventListener("click", () => {
                        navigator.clipboard.writeText(shortUrl).then(() => {
                            Swal.fire({
                                title: "Copied!",
                                text: "The URL was copied to clipboard successfully.",
                                icon: "success",
                                confirmButtonColor: "#ff9603",
                                confirmButtonText: "OK",
                                background: "#fffed2",
                                color: "#e35f01",
                                customClass: {
                                    popup: 'custom-alert',
                                    title: 'custom-alert-title',
                                    confirmButton: 'custom-alert-button'
                                }
                            });
                        }).catch(err => {
                            console.error("Failed to copy: ", err);
                        });
                    });
                }, 500); // Fade-in delay
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    }, 500); // Fade-out delay
});
