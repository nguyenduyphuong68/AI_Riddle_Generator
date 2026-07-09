/* ==========================================================================
   AI Riddle Generator - Database Client & Mock LLM (Nested Schema Edition)
   ========================================================================== */

export const initialProfiles = [
    {
        PK: "USER#usr_123456",
        SK: "PROFILE",
        EntityType: "USER",
        Email: "giaovien.nguyen@school.edu",
        Role: "Teacher",
        Name: "Cô Nguyễn Thị Mai",
        CreatedAt: "2026-06-15T08:00:00Z"
    },
    {
        PK: "USER#usr_789101",
        SK: "PROFILE",
        EntityType: "USER",
        Email: "phuhuynh.tran@family.vn",
        Role: "Parent",
        Name: "Chú Trần Văn Thu",
        CreatedAt: "2026-06-16T09:12:00Z"
    }
];

// Initial mock database records matching the nested API schema
const initialRiddles = [
    {
        PK: "USER#usr_123456",
        SK: "RIDDLE#ACROSTIC#rid_9b1deb4d",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#ACROSTIC",
        GSI1SK: 45,
        riddle_id: "rid_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        keyword: "Hồ Gươm",
        metadata: {
            age_group: "Cấp 1",
            genre: "Acrostic",
            topic: "Địa lý",
            language: "vi"
        },
        content: {
            raw_text: "H - Hương hoa sữa bay đầu phố nhỏ,\nÔ - Ôm lòng hoài niệm ngàn năm qua,\nG - Gươm báu Rùa thần trao tay trả,\nƯ - Ước vọng Tháp cổ in chiều tà,\nƠ - Ơn nghĩa vua Lê còn ghi mãi,\nM - Màu nước xanh rêu bóng cây già.",
            rendered_html: "<p><strong>H</strong> - Hương hoa sữa bay đầu phố nhỏ,<br><strong>Ô</strong> - Ôm lòng hoài niệm ngàn năm qua,<br><strong>G</strong> - Gươm báu Rùa thần trao tay trả,<br><strong>Ư</strong> - Ước vọng Tháp cổ in chiều tà,<br><strong>Ơ</strong> - Ơn nghĩa vua Lê còn ghi mãi,<br><strong>M</strong> - Màu nước xanh rêu bóng cây già.</p>",
            hints: [
                "Đây là một hồ nước nổi tiếng nằm ở trung tâm thủ đô Hà Nội.",
                "Nơi này gắn liền với truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Vàng."
            ]
        },
        community: {
            created_by: "usr_123456",
            creator_role: "Teacher",
            is_public: true,
            upvotes: 45,
            views: 150
        },
        sys_timestamps: {
            created_at: "2026-06-19T14:57:14Z",
            updated_at: "2026-06-19T14:57:14Z"
        }
    },
    {
        PK: "USER#usr_123456",
        SK: "RIDDLE#HISTORY-LIT#rid_4c2deb5e",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#HISTORY-LIT",
        GSI1SK: 56,
        riddle_id: "rid_4c2deb5e-4c7e-5cbe-8cee-3c0c7b3dcb6e",
        keyword: "Bánh Chưng",
        metadata: {
            age_group: "Cấp 1",
            genre: "History-Lit",
            topic: "Lịch sử",
            language: "vi"
        },
        content: {
            raw_text: "Ruột xanh nếp trắng gói lá dong,\nNhân mỡ đậu xanh luộc suốt đêm,\nMón bánh ngày xuân dâng tiên tổ,\nTấm lòng Lang Liêu hiếu nghĩa vẹn.",
            rendered_html: "<p>Ruột xanh nếp trắng gói lá dong,<br>Nhân mỡ đậu xanh luộc suốt đêm,<br>Món bánh ngày xuân dâng tiên tổ,<br>Tấm lòng Lang Liêu hiếu nghĩa vẹn.</p>",
            hints: [
                "Món bánh truyền thống không thể thiếu trong ngày Tết Nguyên Đán.",
                "Bánh hình vuông được gói bằng lá dong bên ngoài."
            ]
        },
        community: {
            created_by: "usr_123456",
            creator_role: "Teacher",
            is_public: true,
            upvotes: 56,
            views: 120
        },
        sys_timestamps: {
            created_at: "2026-06-16T10:15:00Z",
            updated_at: "2026-06-16T10:15:00Z"
        }
    },
    {
        PK: "USER#usr_789101",
        SK: "RIDDLE#SCIENCE-MATH#rid_7e2deb6f",
        EntityType: "RIDDLE",
        GSI1PK: "FEATURED#SCIENCE-MATH",
        GSI1SK: 32,
        riddle_id: "rid_7e2deb6f-5d8f-6dae-9dde-4d0d7b3dcb6f",
        keyword: "Hình chữ nhật",
        metadata: {
            age_group: "Cấp 1",
            genre: "Science-Math",
            topic: "Toán học",
            language: "vi"
        },
        content: {
            raw_text: "Có bốn góc vuông thẳng hàng,\nHai cặp cạnh đối song song dài ngắn,\nĐo chiều rộng rồi đo chiều dài,\nDiện tích nhân hai, đố bé là hình gì?",
            rendered_html: "<p>Có bốn góc vuông thẳng hàng,<br>Hai cặp cạnh đối song song dài ngắn,<br>Đo chiều rộng rồi đo chiều dài,<br>Diện tích nhân hai, đố bé là hình gì?</p>",
            hints: [
                "Một hình học phẳng quen thuộc có 4 góc vuông.",
                "Nếu có thêm hai cạnh kề bằng nhau thì sẽ trở thành hình vuông."
            ]
        },
        community: {
            created_by: "usr_789101",
            creator_role: "Parent",
            is_public: true,
            upvotes: 32,
            views: 80
        },
        sys_timestamps: {
            created_at: "2026-06-15T09:20:00Z",
            updated_at: "2026-06-15T09:20:00Z"
        }
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

    // Register a new profile
    registerUser: (name, email, role) => {
        const profiles = DynamoDBClient.getProfiles();
        const existing = profiles.find(p => p.Email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return { success: false, error: 'Email này đã được đăng ký tài khoản!' };
        }

        const newUserId = "usr_" + Math.floor(Math.random() * 1000000);
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

    // Get personal library scoped by user PK
    getUserLibrary: (userId) => {
        const library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        return library.filter(r => r.PK === `USER#${userId}`);
    },

    // Save riddle to personal library
    saveRiddle: (userId, riddle) => {
        const library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        const duplicate = library.some(r => r.PK === `USER#${userId}` && r.content?.raw_text === riddle.content?.raw_text);
        
        if (!duplicate) {
            const savedItem = {
                ...riddle,
                PK: `USER#${userId}`,
                SK: `RIDDLE#${(riddle.metadata?.genre || 'GENERAL').toUpperCase()}#${riddle.riddle_id || 'rid_' + Date.now()}`,
                riddle_id: riddle.riddle_id || "rid_" + Math.floor(Math.random() * 1000000)
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
            likedIds = likedIds.filter(id => id !== `${userId}_${riddleId}`);
            if (riddle && riddle.community) {
                riddle.community.upvotes = Math.max(0, riddle.community.upvotes - 1);
                riddle.GSI1SK = riddle.community.upvotes;
            }
        } else {
            likedIds.push(`${userId}_${riddleId}`);
            if (riddle && riddle.community) {
                riddle.community.upvotes += 1;
                riddle.GSI1SK = riddle.community.upvotes;
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

// Simulated Local Riddle Text Generation (matches the API JSON schema outputs)
export function generateMockRiddleText(keyword, age_group, genre, lang = "vi", topic = "Địa lý") {
    const normKeyword = keyword.trim().toLowerCase();
    let rawText = "";
    let hints = [];

    // Fallback dictionary search
    if (normKeyword === "hồ gươm" || normKeyword === "ho guom") {
        rawText = "H - Hương hoa sữa bay đầu phố nhỏ,\nÔ - Ôm lòng hoài niệm ngàn năm qua,\nG - Gươm báu Rùa thần trao tay trả,\nƯ - Ước vọng Tháp cổ in chiều tà,\nƠ - Ơn nghĩa vua Lê còn ghi mãi,\nM - Màu nước xanh rêu bóng cây già.";
        hints = ["Đây là một hồ nước ở Hà Nội.", "Giữa hồ có Tháp Rùa nổi tiếng gắn với truyền thuyết Lê Lợi trả gươm báu."];
    } else if (normKeyword === "bánh chưng" || normKeyword === "banh chung") {
        rawText = "B - Bếp lửa hồng đêm ba mươi Tết,\nÁ - Ấm lòng con trẻ đón xuân sang,\nN - Nếp bọc thịt đỗ xanh thơm mát,\nH - Hòa quyện tình yêu nước Việt Nam,\nC - Chỉ hồng buộc chặt dong xanh mướt,\nH - Hương vị Lang Liêu hiếu thảo dâng,\nƯ - Ước nguyện no ấm muôn gia đình,\nN - Nồi bánh sùng sục khói thơm lừng,\nG - Gửi gắm tình quê nghĩa quê nhà.";
        hints = ["Món bánh truyền thống vào dịp Tết Nguyên Đán Việt Nam.", "Bánh hình vuông bọc ngoài bằng lá dong."];
    } else if (normKeyword === "thánh gióng" || normKeyword === "thanh giong") {
        rawText = "Lên ba chưa biết nói cười,\nNghe tin giặc dữ đứng dậy đòi đi,\nSắt gươm sắt ngựa vươn mình phi,\nTre ngà nhổ sạch, giặc tan biến liền.";
        hints = ["Một trong Tứ bất tử trong thần thoại Việt Nam.", "Cậu bé làng Phù Đổng ăn cơm cà lớn nhanh như thổi."];
    } else if (normKeyword === "hình chữ nhật" || normKeyword === "hinh chu nhat") {
        rawText = "Có bốn góc vuông thẳng hàng,\nHai cặp cạnh đối song song dài ngắn,\nĐo chiều rộng rồi đo chiều dài,\nDiện tích nhân hai, đố bé là hình gì?";
        hints = ["Một hình học phẳng quen thuộc có 4 góc vuông.", "Nếu có thêm hai cạnh kề bằng nhau thì sẽ trở thành hình vuông."];
    } else if (normKeyword === "trái đất" || normKeyword === "trai dat" || normKeyword === "earth") {
        rawText = lang === "vi" 
            ? "Ngôi nhà chung của muôn loài,\nMàu xanh dương thẳm quay quanh mặt trời,\nCó bầu khí quyển tuyệt vời,\nLà hành tinh thứ ba, đố em biết tên?" 
            : "A beautiful marble in deep blue,\nThird from the Sun where trees once grew,\nWith air and oceans for me and you,\nWhat is the planet we're talking to?";
        hints = [
            lang === "vi" ? "Hành tinh duy nhất có sự sống được biết đến." : "Our home planet in the Solar System.",
            lang === "vi" ? "Được gọi là 'Hành tinh Xanh'." : "It is called the Blue Planet."
        ];
    } else {
        rawText = `Đây là câu đố ngẫu nhiên cho từ khóa "${keyword}".\nMột nét vẽ thông minh trên trang sách mở,\nGợi mở tư duy cho bé yêu học hỏi mỗi ngày.`;
        hints = [
            `Đáp án thuộc thể loại ${genre} trong chủ đề ${topic}.`,
            `Từ khóa bắt đầu bằng chữ "${keyword[0]}" và có độ dài ${keyword.length} ký tự.`
        ];
    }

    // Dynamic HTML generation
    const renderedHtml = `<p>${rawText.replace(/\n/g, '<br>')}</p>`;

    const id = "rid_" + Math.floor(Math.random() * 1000000);
    return {
        riddle_id: id,
        keyword: keyword,
        metadata: {
            age_group: age_group,
            genre: genre,
            topic: topic,
            language: lang
        },
        content: {
            raw_text: rawText,
            rendered_html: renderedHtml,
            hints: hints
        },
        community: {
            created_by: "usr_guest",
            creator_role: "Guest",
            is_public: true,
            upvotes: 0,
            views: 1
        },
        sys_timestamps: {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    };
}
