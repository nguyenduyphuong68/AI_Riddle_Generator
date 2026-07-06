/* ==========================================================================
   AI Riddle Generator - Database Client with User Registration
   ========================================================================== */

const initialProfiles = [
    {
        PK: "USER#u102",
        SK: "PROFILE",
        EntityType: "USER",
        Email: "giaovien.nguyen@school.edu",
        Role: "Teacher",
        Name: "Cô Nguyễn Thị Mai",
        CreatedAt: "2026-06-15T08:00:00Z"
    },
    {
        PK: "USER#u103",
        SK: "PROFILE",
        EntityType: "USER",
        Email: "phuhuynh.tran@family.vn",
        Role: "Parent",
        Name: "Chú Trần Văn Thu",
        CreatedAt: "2026-06-16T09:12:00Z"
    },
    {
        PK: "USER#u104",
        SK: "PROFILE",
        EntityType: "USER",
        Email: "hocsinh.le@student.edu.vn",
        Role: "Student",
        Name: "Em Lê Minh Trí (Cấp 2)",
        CreatedAt: "2026-06-17T14:30:00Z"
    }
];

const initialRiddles = [
    {
        PK: "USER#u102",
        SK: "RIDDLE#ACROSTIC#r987",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#ACROSTIC",
        GSI1SK: 45,
        riddle_id: "r987",
        keyword: "Hồ Gươm",
        age_group: "Cấp 1",
        genre: "Acrostic",
        riddle_content: "H - Hương hoa sữa bay đầu phố nhỏ,\nÔ - Ôm lòng hoài niệm ngàn năm qua,\nG - Gươm báu Rùa thần trao tay trả,\nƯ - Ước vọng Tháp cổ in chiều tà,\nƠ - Ơn nghĩa vua Lê còn ghi mãi,\nM - Màu nước xanh rêu bóng cây già.",
        hints: ["Đây là một hồ nước ở Hà Nội", "Giữa hồ có Tháp Rùa nổi tiếng gắn với truyền thuyết Lê Lợi trả gươm."],
        upvotes: 45,
        created_at: "2026-06-15T08:05:00Z"
    },
    {
        PK: "USER#u102",
        SK: "RIDDLE#HISTORY-LIT#r988",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#HISTORY-LIT",
        GSI1SK: 56,
        riddle_id: "r988",
        keyword: "Bánh Chưng",
        age_group: "Cấp 1",
        genre: "History-Lit",
        riddle_content: "Ruột xanh nếp trắng gói lá dong,\nNhân mỡ đậu xanh luộc suốt đêm,\nMón bánh ngày xuân dâng tiên tổ,\nTấm lòng Lang Liêu hiếu nghĩa vẹn.",
        hints: ["Món bánh truyền thống không thể thiếu trong ngày Tết Nguyên Đán.", "Bánh hình vuông được gói bằng lá dong."],
        upvotes: 56,
        created_at: "2026-06-16T10:15:00Z"
    },
    {
        PK: "USER#u102",
        SK: "RIDDLE#SCIENCE-MATH#r989",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#SCIENCE-MATH",
        GSI1SK: 32,
        riddle_id: "r989",
        keyword: "Hình chữ nhật",
        age_group: "Cấp 1",
        genre: "Science-Math",
        riddle_content: "Có bốn góc vuông thẳng hàng,\nHai cặp cạnh đối song song dài ngắn,\nĐo chiều rộng rồi đo chiều dài,\nDiện tích nhân hai, đố bé là hình gì?",
        hints: ["Một hình học phẳng quen thuộc có 4 góc vuông.", "Nếu có thêm hai cạnh kề bằng nhau thì sẽ trở thành hình vuông."],
        upvotes: 32,
        created_at: "2026-06-15T09:20:00Z"
    },
    {
        PK: "USER#u102",
        SK: "RIDDLE#MODERN-MEME#r990",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#MODERN-MEME",
        GSI1SK: 62,
        riddle_id: "r990",
        keyword: "Flex",
        age_group: "Cấp 2",
        genre: "Modern-Meme",
        riddle_content: "Khoe điểm mười, khoe cúp học sinh,\nNhưng khoe khéo léo để bạn cùng vui,\nMột từ lóng hot khắp cõi mạng,\nHành động gồng cơ, em biết chữ chi?",
        hints: ["Từ lóng giới trẻ hay dùng để chỉ việc khoe khoành tích một cách dí dỏm.", "Bắt nguồn từ tiếng Anh có nghĩa là gồng cơ bắp."],
        upvotes: 62,
        created_at: "2026-06-17T15:00:00Z"
    }
];

// Initialize LocalStorage Database keys if empty
if (!localStorage.getItem('amplify_profiles')) {
    localStorage.setItem('amplify_profiles', JSON.stringify(initialProfiles));
}
if (!localStorage.getItem('amplify_riddles')) {
    localStorage.setItem('amplify_riddles', JSON.stringify(initialRiddles));
}
if (!localStorage.getItem('amplify_library')) {
    localStorage.setItem('amplify_library', JSON.stringify([]));
}
if (!localStorage.getItem('liked_riddle_ids')) {
    localStorage.setItem('liked_riddle_ids', JSON.stringify([]));
}

export const DynamoDBClient = {
    // Get all profiles
    getProfiles: () => {
        return JSON.parse(localStorage.getItem('amplify_profiles')) || [];
    },

    // Register a new profile (Cognito signup simulator)
    registerUser: (name, email, role) => {
        const profiles = DynamoDBClient.getProfiles();
        
        // Prevent duplicate email registrations
        const existing = profiles.find(p => p.Email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return { success: false, error: 'Email này đã được đăng ký tài khoản!' };
        }

        const newUserId = "u" + Math.floor(Math.random() * 10000);
        const newProfile = {
            PK: `USER#${newUserId}`,
            SK: "PROFILE",
            EntityType: "USER",
            Email: email,
            Role: role,
            Name: name,
            CreatedAt: new Date().toISOString()
        };

        profiles.push(newProfile);
        localStorage.setItem('amplify_profiles', JSON.stringify(profiles));
        return { success: true, user: newProfile };
    },

    // Get all public feed riddles
    getAllRiddles: () => {
        return JSON.parse(localStorage.getItem('amplify_riddles')) || [];
    },

    // Get personal library scoped by voter PK
    getUserLibrary: (userId) => {
        const library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        return library.filter(r => r.PK === `USER#${userId}`);
    },

    // Save riddle to personal library scoped by active user
    saveRiddle: (userId, riddle) => {
        const library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        // Check duplication
        const duplicate = library.some(r => r.PK === `USER#${userId}` && r.riddle_content === riddle.riddle_content);
        if (!duplicate) {
            const savedItem = {
                ...riddle,
                PK: `USER#${userId}`,
                SK: `RIDDLE#${riddle.genre.toUpperCase()}#r` + Math.floor(Math.random() * 100000),
                riddle_id: riddle.riddle_id || "r" + Math.floor(Math.random() * 100000)
            };
            library.push(savedItem);
            localStorage.setItem('amplify_library', JSON.stringify(library));
        }
    },

    // Delete riddle from personal library
    deleteRiddle: (userId, riddleId) => {
        let library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        library = library.filter(r => !(r.PK === `USER#${userId}` && r.riddle_id === riddleId));
        localStorage.setItem('amplify_library', JSON.stringify(library));
    },

    // Toggle Upvotes
    upvoteRiddle: (userId, riddleId) => {
        const riddles = DynamoDBClient.getAllRiddles();
        let likedIds = JSON.parse(localStorage.getItem('liked_riddle_ids')) || [];
        const isLiked = likedIds.includes(`${userId}_${riddleId}`);
        
        const riddle = riddles.find(r => r.riddle_id === riddleId);
        
        if (isLiked) {
            // Unlike
            likedIds = likedIds.filter(id => id !== `${userId}_${riddleId}`);
            if (riddle) {
                riddle.upvotes = Math.max(0, riddle.upvotes - 1);
            }
        } else {
            // Like
            likedIds.push(`${userId}_${riddleId}`);
            if (riddle) {
                riddle.upvotes += 1;
            }
        }
        
        localStorage.setItem('liked_riddle_ids', JSON.stringify(likedIds));
        localStorage.setItem('amplify_riddles', JSON.stringify(riddles));
        return { success: true };
    },

    // Check if voter has upvoted
    hasUserLiked: (userId, riddleId) => {
        const likedIds = JSON.parse(localStorage.getItem('liked_riddle_ids')) || [];
        return likedIds.includes(`${userId}_${riddleId}`);
    }
};

// Simulation of the LLM Bedrock output
export function generateMockRiddleText(keyword, age_group, genre, lang = "vi") {
    const normKeyword = keyword.trim().toLowerCase();
    
    // Check for pre-made matches first
    if (normKeyword === "hồ gươm" || normKeyword === "ho guom") {
        return {
            keyword: "Hồ Gươm",
            riddle_content: "H - Hương hoa sữa bay đầu phố nhỏ,\nÔ - Ôm lòng hoài niệm ngàn năm qua,\nG - Gươm báu Rùa thần trao tay trả,\nƯ - Ước vọng Tháp cổ in chiều tà,\nƠ - Ơn nghĩa vua Lê còn ghi mãi,\nM - Màu nước xanh rêu bóng cây già.",
            hints: ["Đây là một thắng cảnh ở trung tâm Hà Nội.", "Tên hồ gắn liền với truyền thuyết trả gươm báu của vua Lê Lợi."]
        };
    }
    
    if (normKeyword === "bánh chưng" || normKeyword === "banh chung") {
        return {
            keyword: "Bánh chưng",
            riddle_content: "B - Bếp lửa hồng đêm ba mươi Tết,\nÁ - Ấm lòng con trẻ đón xuân sang,\nN - Nếp bọc thịt đỗ xanh thơm mát,\nH - Hòa quyện tình yêu nước Việt Nam,\nC - Chỉ hồng buộc chặt dong xanh mướt,\nH - Hương vị Lang Liêu hiếu thảo dâng,\nƯ - Ước nguyện no ấm muôn gia đình,\nN - Nồi bánh sùng sục khói thơm lừng,\nG - Gửi gắm tình quê nghĩa quê nhà.",
            hints: ["Món bánh truyền thống vào dịp Tết Nguyên Đán Việt Nam.", "Bánh hình vuông bọc ngoài bằng lá dong."]
        };
    }

    if (normKeyword === "thánh gióng" || normKeyword === "thanh giong") {
        return {
            keyword: "Thánh Gióng",
            riddle_content: "Lên ba chưa biết nói cười,\nNghe tin giặc dữ đứng dậy đòi đi,\nSắt gươm sắt ngựa vươn mình phi,\nTre ngà nhổ sạch, giặc tan biến liền.",
            hints: ["Một trong Tứ bất tử trong thần thoại Việt Nam.", "Cậu bé làng Phù Đổng ăn cơm cà lớn nhanh như thổi."]
        };
    }

    if (normKeyword === "trái đất" || normKeyword === "trai dat" || normKeyword === "earth") {
        return {
            keyword: lang === "vi" ? "Trái Đất" : "Earth",
            riddle_content: lang === "vi" 
                ? "Ngôi nhà chung của muôn loài,\nMàu xanh dương thẳm quay quanh mặt trời,\nCó bầu khí quyển tuyệt vời,\nLà hành tinh thứ ba, đố em biết tên?" 
                : "A beautiful marble in deep blue,\nThird from the Sun where trees once grew,\nWith air and oceans for me and you,\nWhat is the planet we're talking to?",
            hints: [
                lang === "vi" ? "Hành tinh duy nhất có sự sống được biết đến." : "Our home planet in the Solar System.",
                lang === "vi" ? "Được gọi là 'Hành tinh Xanh'." : "It is called the Blue Planet."
            ]
        };
    }

    if (normKeyword === "hình chữ nhật" || normKeyword === "hinh chu nhat") {
        return {
            keyword: "Hình chữ nhật",
            riddle_content: "Có bốn góc vuông thẳng hàng,\nHai cặp cạnh đối song song dài ngắn,\nĐo chiều rộng rồi đo chiều dài,\nDiện tích nhân hai, đố bé là hình gì?",
            hints: ["Một hình học phẳng quen thuộc có 4 góc vuông.", "Nếu có thêm hai cạnh kề bằng nhau thì sẽ trở thành hình vuông."]
        };
    }

    if (normKeyword === "flex") {
        return {
            keyword: "Flex",
            riddle_content: "Khoe điểm mười, khoe cúp học sinh,\nNhưng khoe khéo léo để bạn cùng vui,\nMột từ lóng hot khắp cõi mạng,\nHành động gồng cơ, em biết chữ chi?",
            hints: ["Từ lóng giới trẻ hay dùng để chỉ việc khoe khoành tích một cách dí dỏm.", "Bắt nguồn từ tiếng Anh có nghĩa là gồng cơ bắp."]
        };
    }

    // Default fallback
    return {
        keyword: keyword,
        riddle_content: `Đây là câu đố ngẫu nhiên cho từ khóa "${keyword}".\nMột nét vẽ thông minh trên trang sách mở,\nGợi mở tư duy cho bé yêu học hỏi mỗi ngày.`,
        hints: [
            `Đáp án thuộc thể loại ${genre}.`,
            `Từ khóa bắt đầu bằng chữ "${keyword[0]}" và có độ dài ${keyword.length} ký tự.`
        ]
    };
}
