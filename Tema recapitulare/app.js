const section = document.querySelector('#gallery');
const search = document.querySelector('#search');
const fetchLoading = document.querySelector('#loading');
const fetchError = document.querySelector('#error');
const fetchEmpty = document.querySelector('#empty');
const form = document.forms['addPhotoForm'];
const errorForm = document.querySelector('#addPhotoForm .error');
const successForm = document.querySelector('#addPhotoForm .success');

/**
 *
 * Funcție creare și adăugare element în DOM
 *
 */
function addPhotoDom(el) {
	const figure = document.createElement('figure');

	const imgLink = document.createElement('a');
	imgLink.href = el.url;
	imgLink.target = '_blank';

	const img = document.createElement('img');
	img.src = el.url;
	img.alt = el.title;

	const imgTitle = document.createElement('figcaption');
	imgTitle.textContent = el.title;

	const deleteBtn = document.createElement('button');
	deleteBtn.className = 'delete';
	deleteBtn.title = 'Șterge fotografia';
	deleteBtn.textContent = '✖';

	imgLink.append(img);
	figure.append(imgLink, imgTitle, deleteBtn);
	section.prepend(figure);
}

/**
 *
 * Funție afișare fotografii din API
 *
 */
async function getPhotos() {
	const url = 'https://jsonplaceholder.typicode.com/photos?_limit=12';

	fetchLoading.style.display = 'block';

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Eroare HTTP: ${response.status}`);
		}

		const result = await response.json();

		if (result.length === 0) {
			fetchEmpty.style.display = 'block';
		}

		result.forEach((el) => {
			addPhotoDom(el);
		});

		fetchLoading.style.display = 'none';
	} catch (error) {
		fetchLoading.style.display = 'none';
		fetchError.textContent = error.message;
		fetchError.style.display = 'block';
	}
}

/**
 *
 * Funcție validare și adăugare fotografie în API/DOM prin formular
 *
 */
form.addEventListener('submit', async (el) => {
	el.preventDefault();

	const formData = new FormData(form);
	const url = formData.get('url');
	const title = formData.get('title');

	// Validăm titlul
	if (title.length < 3 || title.length > 200) {
		errorForm.textContent =
			'Titlul trebuie să conțină între 3 și 200 caractere';
		errorForm.style.display = 'block';
		return;
	}

	// Validăm url-ul
	try {
		new URL(url);
	} catch (error) {
		errorForm.textContent = 'URL-ul trebuie să înceapă cu http:// sau https://';
		errorForm.style.display = 'block';
		return;
	}

	const data = {
		title: title,
		url: url,
	};

	// Fetch API
	try {
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/photos',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			},
		);

		if (response.status === 201 || response.ok) {
			// Dacă avem un răspuns pozitiv, adăugăm elementul în DOM
			addPhotoDom(data);

			successForm.textContent = 'Fotografia a fost adăugată cu succes!';
			successForm.style.display = 'block';
			errorForm.style.display = 'none';

			form.reset();
		} else {
			throw new Error(`Eroare server: ${response.status}`);
		}
	} catch (error) {
		errorForm.textContent =
			'A apărut o eroare de rețea. Vă rugăm să verificați conexiunea.';
		errorForm.style.display = 'block';
	}
});

/**
 *
 * Funcție ștergere fotografie
 *
 */
function deletePhoto() {
	section.addEventListener('click', (el) => {
		if (el.target.classList.contains('delete')) {
			const confirmAlert = confirm('Sigur vrei să ștergi această fotografie?');

			if (confirmAlert) {
				el.target.parentElement.remove();
			}
		}
	});
}

/**
 *
 * Funcție căutare fotografie
 *
 */
function searchPhotos() {
	search.addEventListener('keyup', (el) => {
		const inputValue = el.value;

		const figures = section.querySelectorAll('figure');

		figures.forEach((el) => {
			const title = el.querySelector('figcaption');
			if (title.textContent.match(search.value)) {
				title.parentElement.style.display = 'block';
			} else {
				title.parentElement.style.display = 'none';
			}
		});
	});
}

/**
 *
 * Apelare funcție
 *
 */
getPhotos();
deletePhoto();
searchPhotos();
