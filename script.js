function toggleDropdown(id) {
  const menu = document.getElementById(id);
  const icon = document.getElementById(`${id}-icon`);
  menu.classList.toggle('hidden');
  icon.textContent = menu.classList.contains('hidden') ? '▸' : '▾';

  if (!menu.classList.contains('hidden')) {
    menu.style.maxHeight = menu.scrollHeight + "px";
  } else {
    menu.style.maxHeight = "0";
  }
}

// Mobile menu functionality with search dropdown
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link (but not search input)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });

    // Set up mobile search functionality
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          window.performSearch(this.value);
          // Close mobile menu after search
          mobileMenuBtn.classList.remove('active');
          mobileNav.classList.remove('active');
        }
      });
    }
  }
});

document.addEventListener('click', function(event) {
  const dropdowns = document.querySelectorAll('[id$="-icon"]');
  dropdowns.forEach(function(icon) {
    const dropdownId = icon.id.replace('-icon', '');
    const dropdown = document.getElementById(dropdownId);
    const button = icon.parentElement;

    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('show');
      icon.textContent = '▸';
      button.classList.remove('active');
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  let searchData = [];
  const resultsPerPage = 15;
  let currentPage = 1;
  let currentSearchTerm = '';

  function updateURL(searchTerm, page = 1) {
    const url = new URL(window.location);
    if (searchTerm && searchTerm.trim() !== '') {
      url.searchParams.set('query', searchTerm);
      if (page > 1) {
        url.searchParams.set('page', page);
      } else {
        url.searchParams.delete('page');
      }
    } else {
      url.searchParams.delete('query');
      url.searchParams.delete('page');
    }
    window.history.pushState({}, '', url);
  }

  function getURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      query: urlParams.get('query') || '',
      page: parseInt(urlParams.get('page')) || 1
    };
  }

  function hidePageContent() {
    // Hide the main page content and disable scrolling
    document.body.style.overflow = 'hidden';
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    if (mainContent) {
      mainContent.style.display = 'none';
    }
    if (footer) {
      footer.style.display = 'none';
    }
  }

  function showPageContent() {
    // Show the main page content and enable scrolling
    document.body.style.overflow = 'auto';
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    if (footer) {
      footer.style.display = 'block';
    }
  }

  function renderSearchResults(results, searchTerm) {
    // Remove any existing search overlay
    const existingOverlay = document.getElementById('searchOverlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Hide the underlying page content
    hidePageContent();

    const resultDoc = document.createElement('div');
    resultDoc.id = 'searchOverlay';
    resultDoc.style.position = 'fixed';
    resultDoc.style.top = '0';
    resultDoc.style.left = '0';
    resultDoc.style.width = '100%';
    resultDoc.style.height = '100%';
    resultDoc.style.backgroundColor = '#121212';
    resultDoc.style.zIndex = '10000';
    resultDoc.style.overflow = 'auto';

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageResults = results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(results.length / resultsPerPage);

    resultDoc.innerHTML = `
      <div style="min-height: 100vh; background-color: #181818;">
        <header class="bg-black p-3 flex justify-between items-center">
          <div class="flex items-center space-x-5">
            <a href="index.html"><img src="logos/tsma-logo.png" alt="Train Simulator Mod Archive" class="logo"></a>
            <nav class="nav-links desktop-nav">
              <a href="index.html" class="hover:underline">Home</a>
              <a href="contributors.html" class="hover:underline">Contributors</a>
              <a href="staff.html" class="hover:underline">Staff</a>
              <a href="about.html" class="hover:underline">About</a>
            </nav>
            <button class="mobile-menu-btn" onclick="toggleMobileSearchMenu()">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
          <input id="overlaySearchInput" type="text" placeholder="Search..." class="search-input" value="${searchTerm}" />
          <div id="searchResults" class="hidden ..."></div>
        </header>
        
        <main class="browse-main flex justify-center items-center" style="min-height: calc(100vh - 80px); padding: 2rem 0;">
          <section class="header-section" style="max-width: 1200px; margin: 0 auto; width: 100%; padding: 1 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
              <h1 class="font-bold text-2xl mb-3 text-center" style="color: white;">Search Results for: "${searchTerm}"</h1>
              <button onclick="closeSearchResults()" style="background:rgb(70, 70, 70); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
            </div>
            <p style="color: #ccc; text-align: center; margin-bottom: 2rem;">Found ${results.length} result${results.length !== 1 ? 's' : ''}</p>
            
            ${results.length === 0 ? `
              <div style="text-align: center; padding: 4rem 0; min-height: 400px;">
                <h2 style="color: #ccc; font-size: 1.5rem; margin-bottom: 1rem;">No results found</h2>
                <p style="color: #999;">Try searching with different keywords</p>
              </div>
            ` : `
              <div class="mod-grid" style="
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                margin-bottom: 2rem;
                min-height: ${results.length === 1 ? '400px' : 'auto'};
              ">
                ${pageResults.map(item => `
                  <div class="mod-card" style="
                    background: #2a2a2a;
                    border-radius: 20px;
                    padding: 0.6rem;
                    display: flex;
                    flex-direction: column;
                    min-height: 350px;
                  ">
                    <img src="${item.image}" alt="${item.title}" style="
                      width: 100%;
                      height: 250px;
                      object-fit: cover;
                      border-radius: 20px;
                      cursor: pointer;
                    " onclick="window.location='${item.url || '#'}'">
                    <div style="
                      margin: 1rem 0 0.5rem 0;
                      font-size: 1.25rem;
                      font-weight: 600;
                      line-height: 1.3;
                    ">
                      <a href="${item.url || '#'}" style="color: white; text-decoration: none;" onmouseover="this.style.color='#007acc'; this.style.textDecoration='underline'" onmouseout="this.style.color='white'; this.style.textDecoration='none'">${item.title}</a>
                    </div>
                    <div style="
                      color: #ccc;
                      font-size: 0.875rem;
                      line-height: 1.4;
                      flex-grow: 1;
                      margin-top: 0.5rem;
                    ">${item.description}</div>
                  </div>
                `).join('')}
              </div>
            `}
            
            ${totalPages > 1 ? `
              <div style="text-align: center; padding: 2rem; margin-top: 2rem;">
                ${currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})" class="pagination-btn">Previous</button>` : ''}
                ${Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, startPage + 4);
                  startPage = Math.max(1, endPage - 4);
                  
                  const page = startPage + i;
                  if (page <= endPage && page <= totalPages) {
                    return `<button onclick="changePage(${page})" class="pagination-btn ${page === currentPage ? 'active' : ''}">${page}</button>`;
                  }
                  return '';
                }).join('')}
                ${totalPages > 5 && currentPage < totalPages - 2 ? `<span style="padding: 0.5rem; color: #ccc;">...</span>` : ''}
                ${currentPage < totalPages ? `<button onclick="changePage(${currentPage + 1})" class="pagination-btn">Next</button>` : ''}
              </div>
            ` : ''}
          </section>
        </main>
      </div>
      
      <style>
        .pagination-btn {
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          background: #2a2a2a;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        .pagination-btn:hover {
          background: #3a3a3a;
        }
        .pagination-btn.active {
          background: #007acc;
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger-line {
          width: 25px;
          height: 3px;
          background-color: white;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 2px;
        }
        
        @media (max-width: 768px) {
          .mod-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
          .mod-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (min-width: 1201px) {
          .mod-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      </style>
    `;

    document.body.appendChild(resultDoc);

    // Set up search functionality for the overlay
    const overlaySearchInput = document.getElementById('overlaySearchInput');
    if (overlaySearchInput) {
      overlaySearchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          window.performSearch(this.value);
        }
      });
    }
  }

  // Make functions globally accessible
  window.changePage = function(page) {
    currentPage = page;
    updateURL(currentSearchTerm, page);
    performSearch(currentSearchTerm);
  };

  window.closeSearchResults = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Show the underlying page content
    showPageContent();
    
    // Clear URL parameters when closing search
    updateURL('');
    
    // Clear the search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Clear mobile search input
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
      mobileSearchInput.value = '';
    }
  };

  window.performSearch = function(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    currentSearchTerm = searchTerm;
    
    if (searchTerm === '') {
      window.closeSearchResults();
      updateURL('');
      return;
    }

    // Update URL with search query
    updateURL(searchTerm, currentPage);

    // Fixed the regex replacement issue
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}`, 'i');

    const results = searchData.filter(item => {
      const lowerTitle = item.title.toLowerCase();
      const lowerDesc = item.description.toLowerCase();
      return regex.test(lowerTitle) || regex.test(lowerDesc);
    });

    currentPage = 1; // Reset to first page for new search
    updateURL(searchTerm, 1);
    renderSearchResults(results, searchTerm);
  };

  // Check for URL parameters on page load
  function initializeFromURL() {
    const params = getURLParams();
    if (params.query) {
      currentPage = params.page;
      currentSearchTerm = params.query;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = params.query;
      }
      const mobileSearchInput = document.getElementById('mobileSearchInput');
      if (mobileSearchInput) {
        mobileSearchInput.value = params.query;
      }
      window.performSearch(params.query);
    }
  }

  // Load search data
  fetch('search-index.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
      // Initialize from URL after data is loaded
      initializeFromURL();
    })
    .catch(error => {
      console.error('Error loading search data:', error);
    });

  // Set up search input listener for desktop
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        currentPage = 1;
        window.performSearch(this.value);
      }
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const params = getURLParams();
    if (params.query) {
      currentPage = params.page;
      currentSearchTerm = params.query;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = params.query;
      }
      const mobileSearchInput = document.getElementById('mobileSearchInput');
      if (mobileSearchInput) {
        mobileSearchInput.value = params.query;
      }
      window.performSearch(params.query);
    } else {
      window.closeSearchResults();
    }
  });
});

// Global function for mobile menu in search overlay
window.toggleMobileSearchMenu = function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
  }
};

// Sync search inputs - when one changes, update the other
document.addEventListener('DOMContentLoaded', function() {
  function syncSearchInputs() {
    const desktopSearch = document.getElementById('searchInput');
    const mobileSearch = document.getElementById('mobileSearchInput');
    
    if (desktopSearch && mobileSearch) {
      desktopSearch.addEventListener('input', function() {
        mobileSearch.value = this.value;
      });
      
      mobileSearch.addEventListener('input', function() {
        desktopSearch.value = this.value;
      });
    }
  }
  
  // Call sync function after a short delay to ensure elements are loaded
  setTimeout(syncSearchInputs, 100);
});

