import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ Ní điền thông tin cấu hình Firebase của dự án vào đây
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hàm đăng bài
window.handleCreatePost = async function() {
    const author = document.getElementById("postAuthor").value || "Vô danh";
    const content = document.getElementById("postContent").value;

    if (!content.trim()) {
        alert("Ní chưa nhập nội dung kìa!");
        return;
    }

    try {
        await addDoc(collection(db, "posts"), {
            author: author,
            content: content,
            timestamp: serverTimestamp(),
            reactions: { like: 0 },
            comments: []
        });
        document.getElementById("postContent").value = "";
        alert("Đăng bài thành công!");
        loadPosts();
    } catch (e) {
        console.error("Lỗi đăng bài: ", e);
    }
};

// Hàm tải danh sách bài viết
async function loadPosts() {
    const feed = document.getElementById("postsFeed");
    feed.innerHTML = "<p style='text-align:center;'>Đang tải...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        feed.innerHTML = "";
        
        if(querySnapshot.empty) {
            feed.innerHTML = "<p style='text-align:center; color:var(--text-sub);'>Chưa có bài viết nào cả!</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h4 style="margin:0 0 8px 0; color:#60a5fa;">👤 ${data.author}</h4>
                <p style="margin:0; font-size:1.05rem;">${data.content}</p>
            `;
            feed.appendChild(card);
        });
    } catch (e) {
        feed.innerHTML = "<p style='text-align:center; color:red;'>Lỗi tải dữ liệu từ Firebase!</p>";
    }
}

// Chạy load bài khi vừa vào web
loadPosts();