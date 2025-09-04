    async function loadTruRailMods() {
      try {
        const response = await fetch('search-index.json');
        const data = await response.json();
        
        // Filter for TruRail mods using the url field
        const truRailMods = data.filter(mod =>
          mod.url && mod.url.includes('trurail-simulations/')
        );
        
        // Categorize mods based on their URL or title
        const categories = {
          'bundles': [],
          'enhancement-packs': [],
          'horns': [],
          'patches': [],
          'reskins': [],
          'rolling-stock': []
        };
        
        truRailMods.forEach(mod => {
          const url = mod.url.toLowerCase();
          const title = mod.title.toLowerCase();
          const description = mod.description.toLowerCase();
          
          // Define rolling stock keywords
          const rollingStockKeywords = [
            'bethgon', 'hopper', 'caboose', 'tender', 'autoflood',
            'coalporter', 'trinity', 'pullman standard', 'grain hopper',
            'coal hopper', 'fuel tender', 'bay window'
          ];
          
          // Define enhancement pack keywords
          const enhancementPackKeywords = [
            'amtrak ge p42dc ep', 'berkshire texture ep', 'bnsf sd70ace',
            'bnsf dash 9-44cw h1', 'bnsf dash 9-44cw h2', 'p42dc ep',
            'texture ep', 'visual and audible overhaul', 'enhancement'
          ];
          
          if (url.includes('bundle') || title.includes('bundle')) {
            categories.bundles.push(mod);
          } else if (url.includes('enhancement') || title.includes('enhancement') ||
                     enhancementPackKeywords.some(keyword =>
                       title.includes(keyword) || description.includes(keyword) || url.includes(keyword)
                     )) {
            categories['enhancement-packs'].push(mod);
          } else if (url.includes('horn') || url.includes('whistle') || title.includes('horn') || title.includes('whistle')) {
            categories.horns.push(mod);
          } else if (url.includes('patch') || title.includes('patch')) {
            categories.patches.push(mod);
          } else if (rollingStockKeywords.some(keyword =>
            title.includes(keyword) || description.includes(keyword) || url.includes(keyword)
          )) {
            categories['rolling-stock'].push(mod);
          } else {
            // Everything else goes to reskins
            categories.reskins.push(mod);
          }
        });
        
        // Track which category appears first
        let firstCategoryFound = false;
        
        // Render each category
        Object.keys(categories).forEach(categoryKey => {
          const categoryGrid = document.getElementById(`${categoryKey}-grid`);
          const categorySection = document.getElementById(categoryKey);
          
          if (categories[categoryKey].length === 0) {
            // Hide empty categories
            categorySection.style.display = 'none';
            return;
          }
          
          // Add first-category class to the first visible category
          if (!firstCategoryFound) {
            categorySection.classList.add('first-category');
            firstCategoryFound = true;
          } else {
            categorySection.classList.remove('first-category');
          }
          
          categories[categoryKey].forEach(mod => {
            const modCard = document.createElement('div');
            modCard.className = 'mod-card';
            modCard.style.borderRadius = '20px';
            
            modCard.innerHTML = `
              <img src="${mod.image || 'logos/default-image.png'}"
                   alt="${mod.title}"
                   class="mod-image"
                   style="border-radius: 20px; width: 100%; height: 250px; object-fit: cover; cursor: pointer;"
                   onclick="window.location='${mod.url || '#'}'">
              <div class="mod-title">
                <a href="${mod.url || '#'}" class="text-white hover:underline">${mod.title}</a>
              </div>
              <div class="mod-description text-gray-400 text-sm mt-2">${mod.description}</div>
            `;
            
            categoryGrid.appendChild(modCard);
          });
        });
        
        // Add smooth scrolling for category navigation with offset for fixed header
        document.querySelectorAll('.category-nav-link').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetElement.style.display !== 'none') {
              // Calculate offset for fixed header (approximately 80px)
              const headerHeight = document.querySelector('header').offsetHeight + 20; // Add some padding
              const elementPosition = targetElement.offsetTop - headerHeight;
              
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              });
            }
          });
        });
        
      } catch (error) {
        console.error('Error loading mods:', error);
        // Show error message to user
        const mainSection = document.querySelector('.header-section');
        mainSection.innerHTML += `
          <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
            <h3>Error loading mods</h3>
            <p>Unable to load the mod data. Please try refreshing the page.</p>
          </div>
        `;
      }
    }

    document.addEventListener('DOMContentLoaded', loadTruRailMods);