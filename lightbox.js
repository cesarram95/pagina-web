const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalOverlay = document.querySelector('.modal-overlay');

  function openModal(imageUrl, caption, copyright) {
    modalImage.src = imageUrl;

    modalCaption.textContent = caption;
    const copyrightEl = document.getElementById('modalCopyright');
    if (copyright) {
      copyrightEl.textContent = copyright;
      copyrightEl.style.display = 'block';
    } else {
      copyrightEl.textContent = '';
      copyrightEl.style.display = 'none';
    }
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function getImgUrl(el) {
    const img = el.querySelector('img');
    return img ? img.getAttribute('src') : (el.dataset.bg || null);
  }

  // Navigation functionality
  let allImageElements = [];
  let currentImageIndex = -1;

  function collectAllImages() {
    allImageElements = [];
    // Collect work images
    document.querySelectorAll('.work-img').forEach(img => {
      allImageElements.push({type: 'work', element: img});
    });
    // Collect installation images
    document.querySelectorAll('.install-img').forEach(img => {
      allImageElements.push({type: 'install', element: img});
    });
  }

  function openModalForElement(imgElement) {
    collectAllImages();
    currentImageIndex = allImageElements.findIndex(item => item.element === imgElement);
    updateNavButtons();

    if (imgElement.classList.contains('work-img')) {
      const url = getImgUrl(imgElement);
      if (url) {
        const work = imgElement.closest('.work');
        const meta = work.querySelector('.work-meta');
        const artist = meta.querySelector('.artist').textContent.trim();
        const title = meta.querySelector('.title-line').textContent.trim();
        const medium = meta.querySelector('.medium').textContent.trim();
        const dims = meta.querySelector('.dims').textContent.trim();
        const caption = `${artist}\n${title}\n${medium}\n${dims}`;
        const copyright = work.getAttribute('data-copyright');
        openModal(url, caption, copyright);
      }
    } else if (imgElement.classList.contains('install-img')) {
      const url = getImgUrl(imgElement);
      if (url) {
        const installItem = imgElement.closest('.install-item');
        const caption = installItem.querySelector('.cap').textContent.trim();
        const copyright = installItem.getAttribute('data-copyright');
        openModal(url, caption, copyright);
      }
    }
  }

  function updateNavButtons() {
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    if (currentImageIndex <= 0) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }

    if (currentImageIndex >= allImageElements.length - 1) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }

  document.getElementById('modalPrev').addEventListener('click', () => {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      openModalForElement(allImageElements[currentImageIndex].element);
    }
  });

  document.getElementById('modalNext').addEventListener('click', () => {
    if (currentImageIndex < allImageElements.length - 1) {
      currentImageIndex++;
      openModalForElement(allImageElements[currentImageIndex].element);
    }
  });

  // Update click handlers to use new navigation system
  document.querySelectorAll('.work-img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      openModalForElement(this);
    });
  });

  document.querySelectorAll('.install-img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      openModalForElement(this);
    });
  });
