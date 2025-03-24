# DCE-Web Project

DCE-Web là dự án quản lý ca làm việc. Dưới đây là các hướng dẫn về cách commit, lấy mã nguồn từ Git và chạy Docker cho dự án.

---

## **Hướng dẫn Commit mã nguồn lên Git**

### **1. Khởi tạo Git repository (nếu chưa có)**

1.Nếu bạn chưa khởi tạo Git repository cho dự án, chạy lệnh sau trong thư mục dự án:
git init

2. Thêm các file vào Git
git add .

3. Kiểm tra trạng thái
git status

4. Commit các thay đổi
git commit -m "Nội dung hoặc sự thay đổi"

5. Thêm remote repository (GitHub)
git remote add origin https://github.com/thanhdoptit/DCE-WEB.git

6. Push các thay đổi lên GitHub

git push -u origin master

## **2. Lấy mã nguồn từ Git (Clone Repository)

1. Clone Repository
git clone https://github.com/yourusername/DCE-WEB.git


2. Checkout commit cụ thể (dựa trên commit hash)
Lấy danh sách các commit: Để xem lịch sử các commit và tìm commit hash, bạn sử dụng lệnh:


git log
Kết quả của git log sẽ trông giống như sau:


commit 5f5d6c8a5473b3e9f1d9c945b8f9a7a9fa1ab87a (HEAD -> master)
Author: Your Name <your.email@example.com>
Date:   Fri Mar 20 10:32:50 2025 +0700

    Commit message here

commit 12d45f7ab4451b6a1b9bb3b1a16ff34f84034e3e
Author: Your Name <your.email@example.com>
Date:   Fri Mar 19 16:20:00 2025 +0700

  
3.Checkout commit cụ thể: Sau khi tìm thấy commit hash, bạn có thể checkout đến commit đó bằng cách sử dụng lệnh:


git checkout <commit-hash>
Ví dụ:

git checkout 5f5d6c8a5473b3e9f1d9c945b8f9a7a9fa1ab87a

##**4. Chạy docker ( hiện tại đang để chạy mỗi MySQL, vì backend và frontend đang trong quá trình dev, backend và fronted sẽ thủ công).

Cài docker, mở cmd vào thư mục WebDce (nơi có file docker-compose.yml) và chạy lệnh :

docker-compose up --build

chạy xong chạy lệnh 

docker ps 

để kiểm tra xem các images đã up chưa.




