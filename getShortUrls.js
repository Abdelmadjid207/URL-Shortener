const API_BASE_URL = 'https://www.shorten-url-api.infobrains.club/api/private/urls';
const shortenUrlList = document.getElementById('shorten-list');


const loadingSpinner = document.createElement('div');
loadingSpinner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <div class="spinner" style="
            width: 16px; height: 16px;
            border: 2px solid #fff;
            border-top: 2px solid #ff9603;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <span>Loading URLs...</span>
    </div>
`;

const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);


const getAllShortUrls = async () => {
    const token = localStorage.getItem('token');
    let page = 1;
    let allUrls = [];

    shortenUrlList.innerHTML = '';
    shortenUrlList.appendChild(loadingSpinner);
    
    try {
        while (true) {
            const response = await fetch(`${API_BASE_URL}?page=${page}`, {
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

            if (!data || data.length === 0) break; // Stop if no more data

            allUrls = allUrls.concat(data);
            page++; // Fetch the next page
        }

        if (!shortenUrlList) return;
        shortenUrlList.innerHTML = '';
        allUrls.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));


        allUrls.forEach((shortUrl, index) => {
            const li = document.createElement('li');
            li.style.listStyle = "none";
            li.style.backgroundColor = index % 2 === 0 ? '#fcd163' : '#ff9603';
            
            li.style.opacity = "0";
            li.style.transform = "translateY(10px)";
            li.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";

            li.innerHTML = `
                <div class="shorten-url">
                    <p><strong>${index + 1}. Shortened:</strong> 
                        <a href="${shortUrl.shortUrl}" target="_blank">${shortUrl.shortUrl}</a>
                    </p>
                    <p><strong>Original:</strong> ${shortUrl.originalUrl}</p>
                    <p><strong>Clicks:</strong> ${shortUrl.clicks}</p>
                    <p><strong>Created At:</strong> ${new Date(shortUrl.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> ${new Date(shortUrl.updatedAt).toLocaleString()}
                    
                    <!-- Buttons for Delete, Update, and Analytics -->
                    <button onclick="deleteShortUrl('${shortUrl.id}')" class="hidden">🗑 Delete</button>
                    <button onclick="updateShortUrl('${shortUrl.id}')" class="hidden">✏️ Update</button>
                </div>
            `;
            shortenUrlList.appendChild(li);

            setTimeout(() => {
                li.style.opacity = "1";
                li.style.transform = "translateY(0)";
            }, 100 * index);
        });

    } catch (error) {
        console.error('Error fetching URLs:', error);
        alert('Failed to load URLs. Please check your internet connection.');
    }
};

getAllShortUrls();

