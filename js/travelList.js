document.addEventListener('DOMContentLoaded', () => {
    const recommendationSection = document.getElementById('recommendation');

    fetch('../travelData.json') // JSON 파일 로드
        .then(response => response.json())
        .then(recommendations => {
            // 데이터 로드에 성공하면, 각 항목에 대해 카드 생성
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
            });
        })
        .catch(error => {
            console.error('Error fetching travel data:', error);
            // 에러 발생 시 사용자에게 알림
            recommendationSection.innerHTML = '<p class="text-center text-red-500">여행지 목록을 불러오는 데 실패했습니다.</p>';
        });
});
