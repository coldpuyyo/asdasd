'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const nameInput = signupForm.querySelector("#nameInput"),
        emailInput = signupForm.querySelector("#emailInput"),
        passwordInput = signupForm.querySelector("#passwordInput"),
        confirmPasswordInput = signupForm.querySelector("#confirmPasswordInput");

    //  폼의 submit 이벤트 리스너 추가
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value.trim();
        const enteredConfirmPassword = confirmPasswordInput.value.trim();

        if (!nameInput.value.trim() || !enteredEmail || !enteredPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (!validateEmail(enteredEmail)) {
            alert("유효한 이메일 주소를 입력하세요.");
            return;
        }

        if (enteredPassword !== enteredConfirmPassword) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
            return;
        }

        const formData = new FormData(signupForm);
        const clientData = Object.fromEntries(formData);

        try {
            await axios.post('http://localhost:3000/clientData', clientData);

            alert("회원가입이 완료되었습니다!");

            location.href = './login.html';
        } catch (err) {
            console.error('데이터 전송 중 오류 발생:', err.message);
            alert('데이터 전송에 실패했습니다. 다시 시도해주세요.');
        }
    });

    //  이메일 형식 검사 함수
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
});
