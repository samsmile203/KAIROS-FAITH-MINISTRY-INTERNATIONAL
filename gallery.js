const galleryGrid = document.querySelector('.gallery-grid');
for (let i = 0; i < 23; i++) {
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('gallery-item');
  galleryItem.innerHTML = `
    <img src="images/photo${i + 1}.jpeg" alt="Kairos Faith Ministry International Gallery ${i + 1}" />
    <div class="gallery-caption">
     
    </div>
  `;
  galleryGrid.appendChild(galleryItem);
}