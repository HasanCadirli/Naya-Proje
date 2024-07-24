document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.row');
    const products = Array.from(document.querySelectorAll('.col'));

    const getProductData = (product) => {
        let priceText = product.querySelector('.fw-bolder').parentElement.textContent;
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
        return { product, price, rating };
    };

    const sortProducts = (criteria, order = 'asc') => {
        const sortedProducts = products.map(getProductData).sort((a, b) => {
            if (criteria === 'price') {
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (criteria === 'rating') {
                return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            }
        });

        productsContainer.innerHTML = '';
        sortedProducts.forEach(item => productsContainer.appendChild(item.product));
    };

    document.querySelector('.dropdown-menu').addEventListener('click', function(event) {
        if (event.target.matches('.dropdown-item')) {
            const sortOption = event.target.textContent.trim();
            if (sortOption === 'Price High to Low') {
                sortProducts('price', 'desc');
            } else if (sortOption === 'Price Low to High') {
                sortProducts('price', 'asc');
            } else if (sortOption === 'Rating High to Low') {
                sortProducts('rating', 'desc');
            } else if (sortOption === 'Rating Low to High') {
                sortProducts('rating', 'asc');
            }
        }
    });
});
