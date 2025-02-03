// document.addEventListener("DOMContentLoaded", () => {
//     let reviews = [
//         { id: 1, user: "user1", rating: 5, comment: "Great!" },
//         { id: 2, user: "user2", rating: 3, comment: "Okay." }
//     ];

//     let users = [
//         { id: 1, username: "user1", banned: false },
//         { id: 2, username: "user2", banned: false }
//     ];

//     const stats = { averageRating: 0, totalReviews: reviews.length };

//     function updateStats() {
//         document.getElementById("averageRating").textContent = stats.averageRating;
//         document.getElementById("totalReviews").textContent = reviews.length;
//     }

//     function renderReviews() {
//         const reviewTableBody = document.getElementById("reviewTableBody");
//         reviewTableBody.innerHTML = "";
//         reviews.forEach(review => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${review.user}</td>
//                 <td>${review.rating}</td>
//                 <td>${review.comment}</td>
//                 <td>
//                     <button class="delete" onclick="deleteReview(${review.id})">삭제</button>
//                 </td>
//             `;
//             reviewTableBody.appendChild(row);
//         });
//         updateStats();
//     }

//     function renderUsers() {
//         const userTableBody = document.getElementById("userTableBody");
//         userTableBody.innerHTML = "";
//         users.forEach(user => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${user.username}</td>
//                 <td>${user.banned ? "차단됨" : "활성"}</td>
//                 <td>
//                     ${user.banned 
//                         ? `<button class="unban" onclick="unbanUser(${user.id})">해제</button>` 
//                         : `<button class="ban" onclick="banUser(${user.id})">차단</button>`}
//                 </td>
//             `;
//             userTableBody.appendChild(row);
//         });
//     }

//     window.deleteReview = (id) => {
//         reviews = reviews.filter(review => review.id !== id);
//         renderReviews();
//     };

//     window.banUser = (id) => {
//         users = users.map(user => 
//             user.id === id ? { ...user, banned: true } : user
//         );
//         renderUsers();
//     };

//     window.unbanUser = (id) => {
//         users = users.map(user => 
//             user.id === id ? { ...user, banned: false } : user
//         );
//         renderUsers();
//     };

//     renderReviews();
//     renderUsers();


// });

document.addEventListener("DOMContentLoaded", () => {
    let reviews = [];
    let users = [];

    const stats = { averageRating: 0, totalReviews: reviews.length };

    function updateStats() {
        document.getElementById("averageRating").textContent = stats.averageRating;
        document.getElementById("totalReviews").textContent = reviews.length;
    }

    async function fetchReviews() {
        try {
            const reviewsResponse = await axios.get("http://localhost:3000/reviews");
            reviews = reviewsResponse.data;
            renderReviews();
        } catch (error) {
            console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    async function fetchUsers() {
        try {
            const response = await axios.get("http://localhost:3000/clientData");
            users = response.data;
            renderUsers();
        } catch (error) {
            console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    async function deleteReview(id) {
        try {
            const getResponse = await axios.get('http://localhost:3000/reviews');
            const findreview = getResponse.data.find(review => review.id );

            await axios.delete(`http://localhost:3000/reviews/${findreview.id}`);
            reviews = reviews.filter(review => review.id !== id);
            renderReviews();
        } catch (error) {
            console.error("리뷰 삭제 중 오류 발생:", error);
        }
    }

    async function deleteUser(id) {
        try {
            const getResponse = await axios.get('http://localhost:3000/clientData');
            const finduser = getResponse.data.find(user => user.id);

            await axios.delete(`http://localhost:3000/clientData/${finduser.id}`);
            users = users.filter(user => user.id !== id);
            renderUsers();
        } catch (error) {
            console.error("사용자 강제 탈퇴 중 오류 발생:", error);
        }
    }

    function calculateAverageRating() {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }

    function updateStats() {
        document.getElementById("averageRating").textContent = calculateAverageRating();
        document.getElementById("totalReviews").textContent = reviews.length;
    }

    function renderReviews() {
        const reviewTableBody = document.getElementById("reviewTableBody");
        reviewTableBody.innerHTML = "";
        reviews.forEach(review => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${review.nickname}</td>
                <td>${review.rating}</td>
                <td>${review.review}</td>
                <td>
                    <button class="delete">삭제</button>
                </td>
            `;
            row.querySelector(".delete").addEventListener("click", () => deleteReview(review.id));
            reviewTableBody.appendChild(row);
        });
        updateStats();
    }

    function renderUsers() {
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.clientName}</td>
                <td>
                    <button class="delete">강제탈퇴</button>
                </td>
            `;
            row.querySelector(".delete").addEventListener("click", () => deleteUser(user.id));
            userTableBody.appendChild(row);
        });
    }

    fetchReviews();
    fetchUsers();
});
