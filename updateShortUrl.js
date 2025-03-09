const updateShortUrl = async (urlId) => {



    if (!urlId) {
        await Swal.fire({
            title: "Invalid URL!",
            html: `<b>The URL seems invalid or unreachable</b><br><br>
           Your input: <a href="${newUrl}" target="_blank" style="color: red; text-decoration: none; font-weight: bold;">"${newUrl}"</a> <br><br>
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

    const { value: newUrl } = await Swal.fire({
        title: "Update URL",
        input: "text",
        inputPlaceholder: "Enter new URL",
        showCancelButton: true,
        confirmButtonColor: "#ff9603",
        cancelButtonColor: "#d33",
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        background: "#fffed2",
        color: "#e35f01",
        inputAttributes: {
            style: "background-color: #eee; padding: 10px; border-radius: 10px; width: 100%;"
        },
        customClass: {
            popup: 'small-prompt',
            confirmButton: 'styled-confirm-btn',
            cancelButton: 'styled-cancel-btn'
        }
    });

    try {
        const testResponse = await fetch(newUrl, { method: 'HEAD', mode: 'no-cors' });
    
    } catch (error) {
        await Swal.fire({
            title: "Invalid URL!",
            html: `<b>The URL seems invalid or unreachable</b><br><br>
           Your input: <a href="${newUrl}" target="_blank" style="color: red; text-decoration: none; font-weight: bold;">"${newUrl}"</a> <br><br>
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
    


    if (!newUrl) return; // User canceled

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://www.shorten-url-api.infobrains.club/api/private/urls/${urlId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ url: newUrl })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showAlert(`Failed to update URL: ${errorData.message || response.statusText}`, "error");
            return;
        }

        await Swal.fire({
            title: "Updated!",
            text: "The URL was updated successfully.",
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

        location.reload(); // Refresh the page after success alert

    } catch (error) {
        console.error("Error updating URL:", error);
        showAlert("Error updating the URL.", "error");
    }
};
