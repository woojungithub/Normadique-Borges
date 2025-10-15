document.addEventListener('DOMContentLoaded', () => {
    // 요소들을 선택하는 부분
    const travelCheckbox = document.getElementById('travel');
    const foodCheckbox = document.getElementById('food');// '어떤 여행지를...' 문단
    const temperatureQuestion = document.getElementById('temperatureQuestion');
    const foodQuestion = document.getElementById('foodQuestion');

    // 'temperature-options' ID를 사용해 정확한 요소를 선택
    const temperatureCheckboxes = document.getElementById('temperature-options'); 
    const foodFeatureCheckboxes = document.getElementById('foodFeature-options');

    const allCheckbox_tem = document.getElementById('all-tem');
    const coldCheckbox = document.getElementById('cold');
    const warmCheckbox = document.getElementById('warm');
    const hotCheckbox = document.getElementById('hot');
    const temitemCheckboxes = document.querySelectorAll('.mr-2'); 
    
    const allCheckbox_food = document.getElementById('all-food');
    const vetCheckbox = document.getElementById('vet');
    const meatCheckbox = document.getElementById('meat');
    const specialCheckbox = document.getElementById('special');
    const fooditemCheckboxes = document.querySelectorAll('.mr-3')

    const confirmButton = document.getElementById('confirmButton');
    const recommendationSection = document.getElementById('recommendation');
    const recommendedText = document.getElementById('rec-sec');
    

    // '여행지' 체크박스에 따라 하위 체크박스들을 숨기거나 보이게 하는 기능
    travelCheckbox.addEventListener('change', () => {
        if (travelCheckbox.checked) {
            temperatureQuestion.style.display = 'block';
            temperatureCheckboxes.style.display = 'flex';
        } else {
            temperatureQuestion.style.display = 'none';
            temperatureCheckboxes.style.display = 'none';
        }
    });

    foodCheckbox.addEventListener('change', () => {
        if (foodCheckbox.checked) {
            foodQuestion.style.display = 'block';
            foodFeatureCheckboxes.style.display = 'flex';
        } else {
            foodQuestion.style.display = 'none';
            foodFeatureCheckboxes.style.display = 'none';
        }
    });
    

    // 초기에 '어떤 여행지를...' 섹션을 숨김
    temperatureQuestion.style.display = 'none';
    temperatureCheckboxes.style.display = 'none';
    foodQuestion.style.display = 'none';
    foodFeatureCheckboxes.style.display = 'none';

    // '전체' 체크박스와 하위 체크박스들의 동기화 (기후버전)
    allCheckbox_tem.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        temitemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    temitemCheckboxes.forEach(checkbox => {
        if (checkbox.id !== 'all-tem') {
            checkbox.addEventListener('change', () => {
                const allItemsChecked_tem = coldCheckbox.checked && warmCheckbox.checked && hotCheckbox.checked;
                allCheckbox_tem.checked = allItemsChecked_tem;
            });
        }
    });

    // '전체' 체크박스와 하위 체크박스들의 동기화 (음식버전)
    allCheckbox_food.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        fooditemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    fooditemCheckboxes.forEach(checkbox => {
        if (checkbox.id !== 'all-food') {
            checkbox.addEventListener('change', () => {
                const allItemsChecked_food = vetCheckbox.checked && meatCheckbox.checked && specialCheckbox.checked;
                allCheckbox_food.checked = allItemsChecked_food;
            });
        }
    });

    // '확인' 버튼 클릭 시 로직
    confirmButton.addEventListener('click', () => {
        fetch('../travelData.json') // JSON 파일 로드
            .then(response => response.json())
            .then(recommendations => {
                const travelChecked = travelCheckbox.checked;
                const foodChecked = foodCheckbox.checked;

                const warmChecked = warmCheckbox.checked;
                const coldChecked = coldCheckbox.checked;
                const hotChecked = hotCheckbox.checked;

                const meatChecked = meatCheckbox.checked;
                const vetChecked = vetCheckbox.checked;
                const specialChecked = specialCheckbox.checked;

                const selectedConditions = [];

                recommendationSection.innerHTML = '';
                recommendationSection.classList.remove('hidden');

                // 조건 필터링.
                if (travelChecked) {
                    if (allCheckbox_tem.checked || (coldChecked && warmChecked && hotChecked)) {
                        selectedConditions.push("cold", "warm", "hot");
                    } else {
                        if (coldChecked) selectedConditions.push("cold");
                        if (warmChecked) selectedConditions.push("warm");
                        if (hotChecked) selectedConditions.push("hot");
                    }
                }

                if (foodChecked) {
                    if (allCheckbox_food.checked || (vetChecked && meatChecked && specialChecked)) {
                        selectedConditions.push("vet", "meat", "special");
                    } else {
                        if (vetChecked) selectedConditions.push("vet");
                        if (meatChecked) selectedConditions.push("meat");
                        if (specialChecked) selectedConditions.push("special");
                    }
                }

                //안 골랐을 때.
                if (selectedConditions.length === 0) {
                    alert("원하는 검색어를 선택해주세요");
                    recommendationSection.classList.add('hidden');
                    return;
                }

                // 선택된 조건에 맞는 추천 목록을 필터링.
                const filteredRecommendations = recommendations.filter(item => {
                    return item.conditions.some(condition => selectedConditions.includes(condition));
                });


                if (travelCheckbox.checked && foodCheckbox.checked) {
                    recommendedText.textContent = " 추천 여행지 & 음식 목록";
                } else if (travelCheckbox.checked) {
                    recommendedText.textContent = " 추천 여행지 목록";
                } else {
                    recommendedText.textContent = " 추천 음식 목록";
                }
                recommendationSection.appendChild(recommendedText);

                // 새 카드 생성
                if (filteredRecommendations.length > 0) {
                    filteredRecommendations.forEach(item => {
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

                        recommendationSection.appendChild(card);
                    });
                } else {
                    // 필터링 결과가 없을 때의 메시지
                    const noResult = document.createElement('p');
                    noResult.textContent = "해당 조건에 맞는 추천 목록이 없습니다.";
                    noResult.classList.add('text-center');
                    recommendationSection.appendChild(noResult);
                }
                const mainContainer = document.querySelector('.max-w-2xl');
                if (mainContainer) {
                    mainContainer.classList.add('expanded-container');
                }
            })
            .catch(error => {
                console.error('Error fetching travel data:', error);
                alert('여행 정보를 불러오는 데 실패했습니다.');
            });
    });
});
