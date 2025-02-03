'use strict';

document.addEventListener("DOMContentLoaded", function () {
  // 헤더 동적 로드 (중복 제거)
  fetch("../html/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    })
    .catch(error => console.error("헤더 로드 실패:", error));

  // 로그인 사용자 정보 불러오기
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // 리뷰 관련 요소 가져오기
  const reviewsList = document.getElementById('reviews-list');
  const averageRatingValue = document.getElementById('average-rating-value');
  const reviewForm = document.getElementById('review-form');
  const reviewText = document.getElementById('review-text');
  const ratingSelect = document.getElementById('rating');

  let ratings = [5, 4]; // 기존 초기 평점 데이터

  // 평균 평점 계산 함수
  function calculateAverageRating() {
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1); // 소수점 첫째 자리까지 표시
  }

  // 평균 평점 업데이트 함수
  function updateAverageRating() {
    averageRatingValue.textContent = calculateAverageRating();
  }

  // 페이지 로드 시 평균 평점 표시
  updateAverageRating();

  // 이미지 hover 효과
  window.showImage = function () {
    document.getElementById('hoverImage').style.display = 'block';
  };

  window.hideImage = function () {
    document.getElementById('hoverImage').style.display = 'none';
  };

  // **🎯 리뷰 작성 이벤트 처리 + Axios 사용 (JSON 서버 연동)**
  reviewForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 입력 값 가져오기
    const reviewContent = reviewText.value.trim();
    const ratingValue = parseInt(ratingSelect.value, 10);

    // 필수 입력 확인
    if (!reviewContent || isNaN(ratingValue)) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 로그인한 사용자 정보 추가
    const nickname = loggedInUser ? loggedInUser.clientName : "익명";

    // 새로운 리뷰 객체 생성
    const newReview = {
      nickname: nickname,
      review: reviewContent,
      rating: ratingValue,
      timestamp: new Date().toISOString(), // 서버 저장 시각
    };

    try {
      // **🎯 Axios를 사용하여 서버에 데이터 전송**
      const response = await axios.post("http://localhost:3000/reviews", newReview);

      if (response.status === 201) {
        // 리뷰 목록에 추가
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `<p><strong>${nickname}:</strong> ${reviewContent} (평점: ${ratingValue}점)</p>`;
        reviewsList.appendChild(reviewElement);

        // 평점 데이터에 추가
        ratings.push(ratingValue);

        // 평균 평점 업데이트
        updateAverageRating();

        // 입력 필드 초기화
        reviewForm.reset();

        // 성공 메시지 표시
        alert('리뷰가 성공적으로 등록되었습니다!');
      }
    } catch (error) {
      console.error("서버로 데이터 전송 중 오류 발생:", error);
      alert("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    }
  });

  // **🎯 서버에서 기존 리뷰 불러오기 (초기화 시)**
  async function loadReviews() {
    try {
      const response = await axios.get("http://localhost:3000/reviews");
      const reviews = response.data;

      reviews.forEach(review => {
        // 리뷰 요소 생성
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `<p><strong>${review.nickname}:</strong> ${review.review} (평점: ${review.rating}점)</p>`;
        reviewsList.appendChild(reviewElement);

        // 기존 평점 데이터 추가
        ratings.push(review.rating);
      });

      // 평균 평점 업데이트
      updateAverageRating();
    } catch (error) {
      console.error("서버에서 리뷰를 불러오는 중 오류 발생:", error);
    }
  }

  // 페이지 로드 시 서버에서 기존 리뷰 불러오기
  loadReviews();
});
