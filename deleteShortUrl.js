const deleteShortUrl = async (urlId) => {
    const API_BASE_URL = 'https://www.shorten-url-api.infobrains.club/api/private/urls';
    const token = localStorage.getItem('token');

    if (!urlId) {
        showAlert("Invalid URL ID!", "error");
        return;
    }

    const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to recover this shortened URL!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff9603",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        background: "#fffed2",
        color: "#e35f01",
        customClass: {
            popup: 'small-prompt',
            confirmButton: 'styled-confirm-btn',
            cancelButton: 'styled-cancel-btn'
        }
    });

    if (!confirmDelete.isConfirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${urlId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showAlert(`Error: ${errorData.message || response.statusText}`, "error");
            return;
        }

        await Swal.fire({
            title: "Deleted!",
            text: "The URL was deleted successfully.",
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

        location.reload(); // Now refresh after alert is shown

    } catch (error) {
        console.error("Delete failed:", error);
        showAlert("Failed to delete URL. Try again.", "error");
    }
};
