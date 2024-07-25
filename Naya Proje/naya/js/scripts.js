document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.row');
    const products = Array.from(document.querySelectorAll('.col'));
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const getProductData = (product) => {
        let priceText = product.querySelector('.card-body').textContent || product.querySelector('.fw-bolder').parentElement.textContent;
        let price;

        // Remove the non-numeric characters and extract the price
        priceText = priceText.replace(/\s/g, '').replace(/[^\d\.-]/g, '');

        if (priceText.includes('-')) {
            const priceRange = priceText.split('-').map(price => parseFloat(price.replace('$', '').trim()));
            price = (priceRange[0] + priceRange[1]) / 2; // Take the average of the price range
        } else {
            price = parseFloat(priceText.replace('$', ''));
        }

        const rating = product.querySelectorAll('.bi-star-fill').length;
        const isOnSale = product.querySelector('.badge') !== null; // Check if the product has a "Sale" badge
        const productName = product.querySelector('.fw-bolder') ? product.querySelector('.fw-bolder').textContent.toLowerCase() : '';
        return { product, price, rating, isOnSale, productName };
    };

    const sortProducts = (criteria, order = 'asc') => {
        const sortedProducts = products
            .map(getProductData)
            .sort((a, b) => {
                // Sort by sale status first
                if (a.isOnSale !== b.isOnSale) {
                    return a.isOnSale ? -1 : 1; // Sale items should come first
                }
                
                // Then sort by criteria
                if (criteria === 'price') {
                    return order === 'asc' ? a.price - b.price : b.price - a.price;
                } else if (criteria === 'rating') {
                    return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
                }
            });

        productsContainer.innerHTML = '';
        sortedProducts.forEach(item => productsContainer.appendChild(item.product));
    };

    const filterProducts = () => {
        const searchText = searchInput.value.toLowerCase();
        products.forEach(product => {
            const productName = getProductData(product).productName;
            if (productName.includes(searchText)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    };

    searchButton.addEventListener('click', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    // Initial sorting: show sale items first
    sortProducts('price', 'asc'); // Default to price sorting or any other criteria as needed

    document.querySelector('.dropdown-menu').addEventListener('click', function(event) {
        if (event.target.matches('.dropdown-item')) {
            const sortOption = event.target.textContent.trim();
            if (sortOption === 'Price High to Low') {
                sortProducts('price', 'desc');
            } else if (sortOption === 'Price Low to High') {
                sortProducts('price', 'asc');
            } else if (sortOption === 'Rating Low to High') {
                sortProducts('rating', 'asc');
            } else if (sortOption === 'Rating High to Low') {
                sortProducts('rating', 'desc');
            }
        }
    });
});
