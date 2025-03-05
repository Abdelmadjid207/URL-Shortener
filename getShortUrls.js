const shortenUrlList = document.getElementById('shorten-list');

const getShortUrls = async () => {
    const url = 'https://www.shorten-url-api.infobrains.club/api/private/urls';
    const token = localStorage.getItem('token');
    const page = 1;
    const limit = 10;

    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Unauthorized. Redirecting to login.');
                localStorage.removeItem('token');
                window.location.href = '/index.html';
            } else if (response.status === 500) {
                alert('Internal Server Error. Please try again later.');
            } else {
                alert(`Error: ${response.statusText}`);
            }
            return;
        }

        const jsonResponse = await response.json();
        const data = jsonResponse.data;

        if (!shortenUrlList) return;

        // Clear previous entries
        shortenUrlList.innerHTML = '';

        data.forEach((shortUrl) => {
            const li = document.createElement('li');
            li.style.listStyle = "none";
            li.style.backgroundColor = data.indexOf(shortUrl) % 2 === 0 ? '#fcd163' : '#ff9603';
            li.innerHTML = `
                <div class="shorten-url">
                    <p><strong> ${data.indexOf(shortUrl) + 1}. Shortened:</strong> 
                        <a href="${shortUrl.shortUrl}" target="_blank" rel="noopener noreferrer">
                            ${shortUrl.shortUrl}
                        </a>
                    </p>
                    <p><strong>Original:</strong> ${shortUrl.originalUrl}</p>
                    <p><strong>Clicks:</strong> ${shortUrl.clicks}</p>
                    <p><strong>Created At:</strong> ${new Date(shortUrl.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> ${new Date(shortUrl.updatedAt).toLocaleString()}</p>
                </div>
            `;
            shortenUrlList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching URLs:', error);
        alert('Failed to load URLs. Please check your internet connection.');
    }
};

// Fetch URLs when the page loads
getShortUrls();
