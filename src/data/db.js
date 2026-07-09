/* ==========================================================================
   AI Riddle Generator - Database Client & Mock LLM (Dynamic Acrostic Edition)
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

// Acrostic dynamic generator dictionary mapping
const acrosticMapVi = {
    'a': 'Ai ai cũng chăm chỉ học hành,',
    'b': 'Bạn bè mến thương cùng dạo bước,',
    'c': 'Chăm ngoan học tập rạng tương lai,',
    'd': 'Dưới mái trường thân yêu học hỏi,',
    'đ': 'Đường đi mở lối vạn ước mơ,',
    'e': 'Em yêu cuộc sống đẹp muôn màu,',
    'g': 'Gìn giữ non sông Tổ quốc mình,',
    'h': 'Học hỏi điều hay mỗi ngày mới,',
    'i': 'In dấu kỷ niệm tuổi học trò,',
    'k': 'Kiến thức mở ra thế giới rộng,',
    'l': 'Lớp học rộn vang những tiếng cười,',
    'm': 'Mơ ước bay cao cùng cánh diều,',
    'n': 'Nhớ ơn thầy cô dạy nên người,',
    'o': 'Ôm trọn hoài bão tuổi thơ ngây,',
    'p': 'Phát triển tài năng vượt thử thách,',
    'q': 'Quê hương mến yêu đẹp vô ngần,',
    'r': 'Rèn luyện thân thể khoẻ mỗi ngày,',
    's': 'Sách vở nâng niu từng trang viết,',
    't': 'Tương lai rạng ngời đang đón chờ,',
    'u': 'Ươm mầm tri thức dựng ngày mai,',
    'v': 'Vươn xa thế giới rộng bao la,',
    'x': 'Xanh tươi lớp học rợp bóng cây,',
    'y': 'Yêu thương gia đình ấm áp lòng.'
};

const acrosticMapEn = {
    'a': 'Always shine bright like a star,',
    'b': 'Be kind and helpful to your friends,',
    'c': 'Clever ideas fill your mind,',
    'd': 'Dream big and reach for the sky,',
    'e': 'Explore the wonders of the world,',
    'g': 'Great things are waiting for you,',
    'h': 'Happy smiles and endless fun,',
    'i': 'Imagine everything you can be,',
    'k': 'Knowledge grows with every page,',
    'l': 'Learn something new every day,',
    'm': 'Make awesome memories together,',
    'n': 'Nice words can change someone\'s day,',
    'o': 'Open your heart to adventure,',
    'p': 'Play and laugh under the sun,',
    'q': 'Quiet moments teach us deep,',
    'r': 'Read stories of magical lands,',
    's': 'Smile and let your light guide you,',
    't': 'Try your best in all you do,',
    'u': 'Understand the beauty of life,',
    'v': 'Victory comes to brave hearts,',
    'x': 'Xylophones playing a sweet song,',
    'y': 'Young minds will build a better place,',
    'z': 'Zealous hearts will win the day.'
};

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
    getProfiles: () => {
        return JSON.parse(localStorage.getItem('amplify_profiles')) || [];
    },

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

    getAllRiddles: () => {
        return JSON.parse(localStorage.getItem('amplify_riddles')) || [];
    },

    getUserLibrary: (userId) => {
        const library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        return library.filter(r => r.PK === `USER#${userId}`);
    },

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

    deleteRiddle: (userId, riddleId) => {
        let library = JSON.parse(localStorage.getItem('amplify_library')) || [];
        library = library.filter(r => !(r.PK === `USER#${userId}` && r.riddle_id === riddleId));
        localStorage.setItem('amplify_library', JSON.stringify(library));
    },

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

    hasUserLiked: (userId, riddleId) => {
        const likedIds = JSON.parse(localStorage.getItem('liked_riddle_ids')) || [];
        return likedIds.includes(`${userId}_${riddleId}`);
    }
};

// Simulated Local Riddle Text Generation (matches the API JSON schema outputs)
export function generateMockRiddleText(keyword, age_group, genre, lang = "vi", topic = "Địa lý") {
    const normKeyword = keyword.trim().toLowerCase();
    
    // Check for pre-made matches first
    if (normKeyword === "hồ gươm" || normKeyword === "ho guom") {
        return {
            riddle_id: "rid_9b1deb4d",
            keyword: "Hồ Gươm",
            metadata: { age_group, genre, topic, language: lang },
            content: {
                raw_text: "H - Hương hoa sữa bay đầu phố nhỏ,\nÔ - Ôm lòng hoài niệm ngàn năm qua,\nG - Gươm báu Rùa thần trao tay trả,\nƯ - Ước vọng Tháp cổ in chiều tà,\nƠ - Ơn nghĩa vua Lê còn ghi mãi,\nM - Màu nước xanh rêu bóng cây già.",
                rendered_html: "<p><strong>H</strong> - Hương hoa sữa bay đầu phố nhỏ,<br><strong>Ô</strong> - Ôm lòng hoài niệm ngàn năm qua,<br><strong>G</strong> - Gươm báu Rùa thần trao tay trả,<br><strong>Ư</strong> - Ước vọng Tháp cổ in chiều tà,<br><strong>Ơ</strong> - Ơn nghĩa vua Lê còn ghi mãi,<br><strong>M</strong> - Màu nước xanh rêu bóng cây già.</p>",
                hints: ["Đây là một hồ nước ở Hà Nội.", "Tên hồ gắn liền với truyền thuyết trả gươm báu của vua Lê Lợi."]
            },
            community: { created_by: "usr_123456", creator_role: "Teacher", is_public: true, upvotes: 45, views: 150 },
            sys_timestamps: { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        };
    }
    
    if (normKeyword === "bánh chưng" || normKeyword === "banh chung") {
        return {
            riddle_id: "rid_4c2deb5e",
            keyword: "Bánh chưng",
            metadata: { age_group, genre, topic, language: lang },
            content: {
                raw_text: "B - Bếp lửa hồng đêm ba mươi Tết,\nÁ - Ấm lòng con trẻ đón xuân sang,\nN - Nếp bọc thịt đỗ xanh thơm mát,\nH - Hòa quyện tình yêu nước Việt Nam,\nC - Chỉ hồng buộc chặt dong xanh mướt,\nH - Hương vị Lang Liêu hiếu thảo dâng,\nƯ - Ước nguyện no ấm muôn gia đình,\nN - Nồi bánh sùng sục khói thơm lừng,\nG - Gửi gắm tình quê nghĩa quê nhà.",
                rendered_html: "<p><strong>B</strong> - Bếp lửa hồng đêm ba mươi Tết,<br><strong>Á</strong> - Ấm lòng con trẻ đón xuân sang,<br><strong>N</strong> - Nếp bọc thịt đỗ xanh thơm mát,<br><strong>H</strong> - Hòa quyện tình yêu nước Việt Nam,<br><strong>C</strong> - Chỉ hồng buộc chặt dong xanh mướt,<br><strong>H</strong> - Hương vị Lang Liêu hiếu thảo dâng,<br><strong>Ư</strong> - Ước nguyện no ấm muôn gia đình,<br><strong>N</strong> - Nồi bánh sùng sục khói thơm lừng,<br><strong>G</strong> - Gửi gắm tình quê nghĩa quê nhà.</p>",
                hints: ["Món bánh truyền thống vào dịp Tết Nguyên Đán Việt Nam.", "Bánh hình vuông bọc ngoài bằng lá dong."]
            },
            community: { created_by: "usr_123456", creator_role: "Teacher", is_public: true, upvotes: 56, views: 120 },
            sys_timestamps: { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        };
    }

    if (normKeyword === "thánh gióng" || normKeyword === "thanh giong") {
        return {
            riddle_id: "rid_thanhgióng",
            keyword: "Thánh Gióng",
            metadata: { age_group, genre, topic, language: lang },
            content: {
                raw_text: "Lên ba chưa biết nói cười,\nNghe tin giặc dữ đứng dậy đòi đi,\nSắt gươm sắt ngựa vươn mình phi,\nTre ngà nhổ sạch, giặc tan biến liền.",
                rendered_html: "<p>Lên ba chưa biết nói cười,<br>Nghe tin giặc dữ đứng dậy đòi đi,<br>Sắt gươm sắt ngựa vươn mình phi,<br>Tre ngà nhổ sạch, giặc tan biến liền.</p>",
                hints: ["Một trong Tứ bất tử trong thần thoại Việt Nam.", "Cậu bé làng Phù Đổng ăn cơm cà lớn nhanh như thổi."]
            },
            community: { created_by: "usr_123456", creator_role: "Teacher", is_public: true, upvotes: 38, views: 90 },
            sys_timestamps: { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        };
    }

    if (normKeyword === "hình chữ nhật" || normKeyword === "hinh chu nhat") {
        return {
            riddle_id: "rid_7e2deb6f",
            keyword: "Hình chữ nhật",
            metadata: { age_group, genre, topic, language: lang },
            content: {
                raw_text: "Có bốn góc vuông thẳng hàng,\nHai cặp cạnh đối song song dài ngắn,\nĐo chiều rộng rồi đo chiều dài,\nDiện tích nhân hai, đố bé là hình gì?",
                rendered_html: "<p>Có bốn góc vuông thẳng hàng,<br>Hai cặp cạnh đối song song dài ngắn,<br>Đo chiều rộng rồi đo chiều dài,<br>Diện tích nhân hai, đố bé là hình gì?</p>",
                hints: ["Một hình học phẳng quen thuộc có 4 góc vuông.", "Nếu có thêm hai cạnh kề bằng nhau thì sẽ trở thành hình vuông."]
            },
            community: { created_by: "usr_789101", creator_role: "Parent", is_public: true, upvotes: 32, views: 80 },
            sys_timestamps: { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        };
    }

    // Dynamic Acrostic generation for custom keywords if user selects Acrostic
    if (genre === 'Acrostic') {
        const letters = keyword.replace(/[\s\d_.\-\+]+/g, '').toLowerCase().split('');
        const lines = [];
        letters.forEach(char => {
            const map = lang === 'en' ? acrosticMapEn : acrosticMapVi;
            const lineText = map[char] || (lang === 'en' ? `Quietly exploring new paths,` : `Ươm mầm những điều tốt đẹp nhất,`);
            lines.push(`${char.toUpperCase()} - ${lineText}`);
        });
        const rawText = lines.length > 0 ? lines.join('\n') : `V - Vui tươi rộn rã tiếng hát,\nU - Ươm mầm tương lai tươi sáng,\nI - In dấu kỷ niệm tuổi thơ.`;
        const renderedHtml = `<p>${rawText.replace(/\n/g, '<br>')}</p>`;

        return {
            riddle_id: "rid_" + Math.floor(Math.random() * 1000000),
            keyword: keyword,
            metadata: { age_group, genre, topic, language: lang },
            content: {
                raw_text: rawText,
                rendered_html: renderedHtml,
                hints: [
                    lang === 'vi' ? `Mật mã được tạo từ các chữ cái trong từ khóa "${keyword}".` : `Acrostic spelled by letters in "${keyword}".`,
                    lang === 'vi' ? `Chủ đề kiến thức liên quan tới: ${topic}.` : `Knowledge subject is related to ${topic}.`
                ]
            },
            community: { created_by: "usr_guest", creator_role: "Guest", is_public: true, upvotes: 0, views: 1 },
            sys_timestamps: { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        };
    }

    // General default text generation for other genres
    let rawText = "";
    let hints = [];
    if (genre === 'History-Lit') {
        rawText = `Nơi đây lưu dấu thời gian,\nNgàn năm văn hiến sử vàng chói chang.\nĐố em đáp án rõ ràng,\nLà tên từ khóa "${keyword}" đó nha!`;
        hints = [`Một câu đố thuộc chủ đề ${topic}.`, `Từ khóa bắt đầu bằng chữ "${keyword[0]}".`];
    } else if (genre === 'Science-Math') {
        rawText = `Logic con số vòng quanh,\nTính toán đo đạc nhanh nhanh đoán liền.\nĐáp án là một từ quen,\nChính là từ khóa "${keyword}" của ta!`;
        hints = [`Hãy suy luận logic trong chủ đề ${topic}.`, `Từ khóa có độ dài ${keyword.length} chữ cái.`];
    } else if (genre === 'Modern-Meme') {
        rawText = `Bắt trend mạng xã hội vui,\nĐoán ngay từ lóng để cười thả ga.\nKhông đâu xa lạ chúng ta,\nTừ khóa "${keyword}" đố em tìm ra!`;
        hints = [`Từ lóng bắt trend dí dỏm.`, `Liên quan đến chủ đề ${topic}.`];
    } else {
        rawText = `Đây là câu đố ngẫu nhiên cho từ khóa "${keyword}".\nMột nét vẽ thông minh trên trang sách mở,\nGợi mở tư duy cho bé yêu học hỏi mỗi ngày.`;
        hints = [
            `Đáp án thuộc thể loại ${genre} trong chủ đề ${topic}.`,
            `Từ khóa bắt đầu bằng chữ "${keyword[0]}" và có độ dài ${keyword.length} ký tự.`
        ];
    }

    const renderedHtml = `<p>${rawText.replace(/\n/g, '<br>')}</p>`;

    return {
        riddle_id: "rid_" + Math.floor(Math.random() * 1000000),
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
