import { recommendations } from './recommendations.js';

document.addEventListener('DOMContentLoaded', () => {
    const recommendationSection = document.getElementById('recommendation');
    
    recommendations.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('recommendation-card');

    // 카드 내부 HTML 구성
    card.innerHTML = `
        <div class="max-w-2xl w-full bg-white shadow-lg rounded-lg border border-blue-500 p-4">
            <h3 class="card-title">${item.name}</h3>
            <img src="${item.image}" alt="${item.name}" class="card-image">
            <p class="card-text">${item.info}</p>
            <a href="#" class="link">자세히 보기</a>
        </div>
    `;

    // 생성된 카드를 페이지에 추가
    recommendationSection.appendChild(card);
    })
});