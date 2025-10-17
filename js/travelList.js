document.addEventListener('DOMContentLoaded', () => {
    const recommendationSection = document.getElementById('recommendation');
    const sortSelect = document.getElementById('sort-select');
    let travelItems = [];
    let originalTravelItems = []; // 원본 순서를 저장할 배열

    // 카드를 렌더링하는 함수
    const renderCards = (items) => {
        // 기존 카드들을 모두 제거
        while (recommendationSection.firstChild) {
            recommendationSection.removeChild(recommendationSection.firstChild);
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('recommendation-card');

            card.innerHTML = `
                <div class="max-w-2xl w-full bg-white shadow-lg rounded-lg border border-blue-500 p-4">
                    <h3 class="card-title">${item.name}</h3>
                    <img src="${item.image}" alt="${item.name}" class="card-image">
                    <p class="card-text">${item.info}</p>
                    <a href="#" class="link">자세히 보기</a>
                </div>
            `;
            recommendationSection.appendChild(card);
        });
    };

    fetch('./travelData.json') // JSON 파일 로드
        .then(response => response.json())
        .then(recommendations => {
            // 'travel' 타입인 항목만 필터링
            originalTravelItems = recommendations.filter(item => item.type === 'travel');
            travelItems = [...originalTravelItems]; // 렌더링 및 정렬에 사용할 복사본
            renderCards(travelItems); // 초기 목록 렌더링
        })
        .catch(error => {
            console.error('Error fetching travel data:', error);
            recommendationSection.innerHTML = '<p class="text-center text-red-500">여행지 목록을 불러오는 데 실패했습니다.</p>';
        });

    // 정렬 드롭다운 이벤트 리스너
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        if (sortBy === 'asc') {
            travelItems.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'desc') {
            travelItems.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            travelItems = [...originalTravelItems]; // 기본 순서로 되돌리기
        }
        renderCards(travelItems);
    });
});
