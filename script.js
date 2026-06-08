document.addEventListener('DOMContentLoaded', () => {
	const user = document.body.dataset.githubUser || 'nelutuinfinite';
	const endpoint = `https://api.github.com/users/${user}/repos?per_page=100`;
	const container = document.getElementById('projects-container');
	const footer = document.getElementById('projects-footer');

	if (!container) return;

	fetch(endpoint)
		.then((resp) => {
			if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
			return resp.json();
		})
		.then((repos) => {
			if (!Array.isArray(repos)) throw new Error('Răspuns invalid de la GitHub');
			repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
			const top = repos.slice(0, 5);
			if (top.length == 0) {
				container.innerHTML = '<p>Niciun repository găsit.</p>';
				return;
			}
			top.forEach((repo) => {
				const card = document.createElement('article');
				card.className = 'project-card';
				const desc = repo.description || 'Fără descriere disponibilă';
				card.innerHTML = `
					<h3 class="repo-name"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
					<p class="repo-desc">${desc}</p>
					<div class="repo-meta">
						<span class="lang">${repo.language || '—'}</span>
						<span class="stars">⭐ ${repo.stargazers_count}</span>
						<span class="forks">🍴 ${repo.forks_count}</span>
					</div>
				`;
				container.appendChild(card);
			});
			footer.innerHTML = `<a class="more-link" href="https://github.com/${user}?tab=repositories" target="_blank" rel="noopener noreferrer">Vezi toate proiectele pe GitHub</a>`;
		})
		.catch((err) => {
			container.innerHTML = `<p class="error">Eroare la încărcarea proiectelor: ${err.message}</p>`;
			console.error(err);
		});
});
