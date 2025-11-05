// assets/index.js — wersja debug + fallback
const upload = document.querySelector('.upload');
const imageInput = document.createElement('input');

imageInput.type = 'file';
// rozszerzenia: dodane .jpg
imageInput.accept = '.jpg,.jpeg,.png,.gif';

console.log('[index.js] skrypt załadowany');

document.querySelectorAll('.input_holder').forEach((element) => {
  const input = element.querySelector('.input');
  input.addEventListener('click', () => {
    element.classList.remove('error_shown');
  });
});

upload.addEventListener('click', () => {
  console.log('[index.js] kliknięto upload — otwieram file picker');
  imageInput.click();
});

imageInput.addEventListener('change', async () => {
  console.log('[index.js] imageInput.change');
  resetUploadState();

  const file = imageInput.files[0];
  if (!file) {
    console.log('[index.js] brak pliku (użytkownik anulował)');
    return;
  }
  console.log('[index.js] wybrano plik:', file.name, file.type, file.size);

  const formData = new FormData();
  formData.append('image', file);

  try {
    console.log('[index.js] próbuję wysłać na Imgur...');
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID 774f3ba80197c47',
      },
      body: formData,
    });

    const result = await response.json();
    console.log('[index.js] odpowiedź z Imgur:', result);

    if (result?.data?.link) {
      updateUploadState(result.data.link);
      console.log('[index.js] upload zakończony, link:', result.data.link);
    } else {
      console.warn('[index.js] Imgur nie zwrócił linku — używam fallbacku lokalnego');
      // fallback: lokalny podgląd z URL.createObjectURL
      const localUrl = URL.createObjectURL(file);
      updateUploadState(localUrl);
    }
  } catch (err) {
    console.error('[index.js] błąd uploadu do Imgur:', err);
    // fallback: lokalny podgląd z URL.createObjectURL
    try {
      const localUrl = URL.createObjectURL(file);
      updateUploadState(localUrl);
      console.log('[index.js] ustawiono lokalny podgląd zamiast Imgur');
    } catch (e) {
      console.error('[index.js] fallback nie powiódł się:', e);
      showErrorState();
    }
  }
});

document.querySelector('.go').addEventListener('click', () => {
  console.log('[index.js] kliknięto WEJDŹ');
  const emptyFields = [];
  const params = new URLSearchParams();

  if (!upload.hasAttribute('selected')) {
    emptyFields.push(upload);
    upload.classList.add('error_shown');
    console.log('[index.js] brak wybranego zdjęcia');
  } else {
    params.append('image', upload.getAttribute('selected'));
    console.log('[index.js] użyto zdjęcia:', upload.getAttribute('selected'));
  }

  document.querySelectorAll('.input_holder').forEach((element) => {
    const input = element.querySelector('.input');
    params.append(input.id, input.value);

    if (isEmpty(input.value)) {
      emptyFields.push(element);
      element.classList.add('error_shown');
      console.log('[index.js] puste pole:', input.id);
    }
  });

  if (emptyFields.length > 0) {
    console.log('[index.js] formularz niekompletny, scroll do pierwszego błędu');
    emptyFields[0].scrollIntoView();
  } else {
    console.log('[index.js] formularz ok — forwardToId');
    forwardToId(params);
  }
});

function isEmpty(value) {
  return /^\s*$/.test(value);
}

function resetUploadState() {
  upload.classList.remove('upload_loaded', 'upload_loading', 'error_shown');
  upload.removeAttribute('selected');
  const img = upload.querySelector('.upload_uploaded');
  if (img) img.src = '';
}

function updateUploadState(url) {
  upload.classList.add('upload_loaded');
  upload.setAttribute('selected', url);
  const img = upload.querySelector('.upload_uploaded');
  if (img) img.src = url;
}

function showErrorState() {
  upload.classList.add('error_shown');
}

function forwardToId(params) {
  // przekierowanie względne do pliku id.html w tym samym folderze
  location.href = id.html?${params};
}

const guide = document.querySelector('.guide_holder');
guide.addEventListener('click', () => {
  guide.classList.toggle('unfolded');
});
