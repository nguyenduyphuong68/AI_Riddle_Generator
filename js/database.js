/* ==========================================================================
   AI Riddle Generator - Database & Mock Generation Engine
   ========================================================================== */

// Default riddles for the "Featured Riddles" community feed
export const initialFeaturedRiddles = [
    {
        id: "feat-1",
        keyword: "Hồ Gươm",
        text: "Giữa lòng Hà Nội cổ kính,\nNước xanh biếc in bóng tháp rùa,\nNơi vua Lê trả lại thanh kiếm quý,\nCho Rùa Vàng dưới làn nước trong xanh.",
        hint1: "Đây là một thắng cảnh nổi tiếng ở trung tâm Hà Nội.",
        hint2: "Tên hồ gắn liền với truyền thuyết trả gươm của vua Lê Lợi.",
        answer: "Hồ Gươm",
        grade: "primary",
        genre: "history-lit",
        upvotes: 42,
        creator: "Cô Nguyễn Mai (Tiểu học Hoàn Kiếm)",
        lang: "vi"
    },
    {
        id: "feat-2",
        keyword: "HỌC TẬP",
        text: "H - Hành trình tích lũy mỗi ngày qua,\nO - Óc sáng tư duy rộng bao la,\nC - Cần mẫn rèn luyện tài trí rộng,\nT - Tương lai tươi sáng đợi chúng ta,\nA - Anh tài rạng rỡ cùng đất nước,\nP - Phục vụ quê hương mãi tiến xa.",
        hint1: "Các chữ cái đầu dòng ghép lại thành một từ chỉ công việc của học sinh.",
        hint2: "Hoạt động diễn ra chủ yếu ở trường học.",
        answer: "Học Tập",
        grade: "primary",
        genre: "acrostic",
        upvotes: 28,
        creator: "Hệ thống AI (Mẫu Acrostic)",
        lang: "vi"
    },
    {
        id: "feat-3",
        keyword: "Hình chữ nhật",
        text: "Có bốn góc vuông vắn,\nHai cặp cạnh song song,\nChiều dài lớn hơn rộng,\nĐố em biết hình chi?",
        hint1: "Một hình học phẳng quen thuộc có 4 cạnh.",
        hint2: "Nếu hai cạnh kề bằng nhau, nó sẽ trở thành hình vuông.",
        answer: "Hình chữ nhật",
        grade: "primary",
        genre: "science-math",
        upvotes: 35,
        creator: "Thầy Lê Minh (THCS Nguyễn Du)",
        lang: "vi"
    },
    {
        id: "feat-4",
        keyword: "Bánh chưng",
        text: "Ruột xanh, nếp trắng, nhân đậu mỡ,\nLá dong gói chặt, lạt giang buộc tròn,\nNấu suốt đêm thâu chờ Tết đến,\nNhớ ơn Lang Liêu thuở xa xưa.",
        hint1: "Món bánh truyền thống vào ngày Tết Nguyên Đán Việt Nam.",
        hint2: "Bánh có hình vuông, làm từ nếp, đậu xanh và thịt heo.",
        answer: "Bánh chưng",
        grade: "primary",
        genre: "history-lit",
        upvotes: 56,
        creator: "Cô Trần Thị Thu (Phụ huynh)",
        lang: "vi"
    },
    {
        id: "feat-5",
        keyword: "Flex",
        text: "Khoe khoang khéo léo chẳng phô trương,\nThuật ngữ thịnh hành khắp phố phường,\nĐạt cúp học sinh hay điểm tốt,\nChia sẻ niềm vui, chớ cậy thường!",
        hint1: "Một từ lóng giới trẻ dùng để chỉ hành động khoe thành tích một cách vui vẻ.",
        hint2: "Từ này bắt nguồn từ tiếng Anh, có nghĩa đen là gồng cơ bắp.",
        answer: "Flex",
        grade: "secondary",
        genre: "modern-meme",
        upvotes: 61,
        creator: "Hệ thống AI (Meme Mode)",
        lang: "vi"
    },
    {
        id: "feat-6",
        keyword: "CLOUD",
        text: "C - Computing power at massive scale,\nL - Linking servers that never fail,\nO - Operating in the virtual space,\nU - Uploading files in any place,\nD - Database solutions that always prevail.",
        hint1: "Look at the first letters of each line.",
        hint2: "Where we store files, host web pages, and deploy AI models (like AWS).",
        answer: "Cloud",
        grade: "secondary",
        genre: "acrostic",
        upvotes: 19,
        creator: "System Developer AI",
        lang: "en"
    }
];

// Dictionary of lines for creating dynamic acrostic riddles on the fly
const acrosticDictionaryVi = {
    A: "Anh dũng kiên cường vượt gian lao",
    Ă: "Ăn quả nhớ kẻ trồng cây cao",
    Â: "Âm vang tiếng trống gọi tương lai",
    B: "Bước chân vươn tới những đỉnh cao",
    C: "Cần mẫn học hành sớm tới trưa",
    D: "Duy trì ý chí chẳng ngại ngần",
    Đ: "Đường dài thử thách chí nam nhi",
    E: "Em là mầm non của quê hương",
    Ê: "Êm đềm tiếng mẹ hát ru đêm",
    G: "Gìn giữ quê hương nước non nhà",
    H: "Hành trình tri thức rộng bao la",
    I: "In đậm tình thầy nghĩa bạn xưa",
    K: "Khát vọng vươn xa tới bầu trời",
    L: "Lòng biết ơn sâu thấu mẹ cha",
    M: "Mở rộng tầm mắt đón tương lai",
    N: "Ngày mai tươi sáng đón chờ ta",
    O: "Óc sáng tư duy giải đề khó",
    Ô: "Ôm ấp ước mơ tuổi học trò",
    Ơ: "Ơn nghĩa thầy cô chắp cánh bay",
    P: "Phát huy truyền thống của ông cha",
    Q: "Quyết chí kiên cường không lùi bước",
    R: "Rèn luyện tài năng hiến nước nhà",
    S: "Sáng tạo tư duy mới mỗi ngày",
    T: "Tương lai tươi đẹp ở ngày mai",
    U: "Uống nước nhớ nguồn đạo lý xưa",
    Ư: "Ước vọng bay cao thoả đam mê",
    V: "Vun đắp ngày mai thật sáng tươi",
    X: "Xây dựng tương lai rực rỡ cười",
    Y: "Yêu thương bè bạn bốn phương trời"
};

const acrosticDictionaryEn = {
    A: "Always dreaming of skies so blue",
    B: "Building ideas that are brand new",
    C: "Creating paths for me and you",
    D: "Daring to try and follow through",
    E: "Exploring worlds that wait for you",
    F: "Finding the light when night is through",
    G: "Growing in knowledge, strong and true",
    H: "Helping each other start anew",
    I: "Imaging things we all can do",
    J: "Journeying on to paths anew",
    K: "Knowing the steps to guide us through",
    L: "Learning lessons that pulled us through",
    M: "Making a difference, shining through",
    N: "Never giving up on what is true",
    O: "Opening doors to start anew",
    P: "Pushing limits of what we knew",
    Q: "Questioning facts with a better view",
    R: "Reaching the stars, a dream come true",
    S: "Solving the puzzles with a clue",
    T: "Together we stand, a solid crew",
    U: "Understanding the world's review",
    V: "Vibrantly living, through and through",
    W: "Working hard for a better view",
    X: "X-raying options to select a few",
    Y: "Yearning for wisdom, fresh as dew",
    Z: "Zealously guarding the values grew"
};

// Simple generator logic that matches direct keywords OR creates dynamic acrostics/clues
export function generateMockRiddle(keyword, grade, genre, lang) {
    const normKeyword = keyword.trim().toLowerCase();
    
    // 1. Check if we have preset matches to simulate a perfect high-quality generation
    if (normKeyword === "hồ gươm" || normKeyword === "ho guom") {
        return {
            keyword: "Hồ Gươm",
            text: "Giữa lòng Hà Nội cổ kính,\nNước xanh biếc in bóng tháp rùa,\nNơi vua Lê trả lại thanh kiếm quý,\nCho Rùa Vàng dưới làn nước trong xanh.",
            hint1: "Đây là một địa danh lịch sử nổi tiếng tại thủ đô nước ta.",
            hint2: "Nơi đây có Tháp Rùa nổi lên giữa mặt nước hồ xanh.",
            answer: "Hồ Gươm",
            grade: grade,
            genre: "history-lit",
            lang: lang
        };
    }
    
    if (normKeyword === "bánh chưng" || normKeyword === "banh chung") {
        return {
            keyword: "Bánh chưng",
            text: "Ruột xanh nếp trắng nhân đỗ mỡ,\nLá dong bọc ngoài lạt giang buộc chặt,\nĐặt lên bàn thờ cúng gia tiên ngày Tết,\nNhớ Lang Liêu thuở xưa dâng bánh vua cha.",
            hint1: "Loại bánh đặc sản miền Bắc gói lá dong xanh vuông vắn.",
            hint2: "Thường ăn kèm dưa hành vào dịp Tết Nguyên Đán.",
            answer: "Bánh chưng",
            grade: grade,
            genre: "history-lit",
            lang: lang
        };
    }

    if (normKeyword === "thánh gióng" || normKeyword === "thanh giong") {
        return {
            keyword: "Thánh Gióng",
            text: "Lên ba chưa biết nói cười,\nNghe tin giặc dữ đứng dậy đòi đi,\nSắt gươm sắt ngựa vươn mình phi,\nTre ngà nhổ sạch, giặc tan biến liền.",
            hint1: "Một trong Tứ bất tử trong thần thoại Việt Nam.",
            hint2: "Cậu bé làng Phù Đổng ăn cơm cà lớn nhanh như thổi.",
            answer: "Thánh Gióng",
            grade: grade,
            genre: "history-lit",
            lang: lang
        };
    }
    
    if (normKeyword === "trái đất" || normKeyword === "trai dat" || normKeyword === "earth") {
        return {
            keyword: lang === "vi" ? "Trái Đất" : "Earth",
            text: lang === "vi" 
                ? "Ngôi nhà chung của muôn loài,\nMàu xanh dương thẳm quay quanh mặt trời,\nCó bầu khí quyển tuyệt vời,\nLà hành tinh thứ ba, đố em biết tên?" 
                : "A beautiful marble in deep blue,\nThird from the Sun where trees once grew,\nWith air and oceans for me and you,\nWhat is the planet we're talking to?",
            hint1: lang === "vi" ? "Hành tinh duy nhất có sự sống được biết đến." : "Our home planet in the Solar System.",
            hint2: lang === "vi" ? "Được gọi là 'Hành tinh Xanh'." : "It is called the Blue Planet.",
            answer: lang === "vi" ? "Trái Đất" : "Earth",
            grade: grade,
            genre: "science-math",
            lang: lang
        };
    }

    // 2. Generate dynamically if not pre-defined
    const cleanKeyword = keyword.trim().replace(/\s+/g, '');
    const chars = cleanKeyword.toUpperCase().split('');
    
    if (genre === "acrostic") {
        // Build Acrostic Riddle
        let lines = [];
        const dict = lang === "vi" ? acrosticDictionaryVi : acrosticDictionaryEn;
        
        chars.forEach(char => {
            // Normalize character to map to our A-Z dictionary keys
            let mappedChar = char;
            if (lang === "vi") {
                // Keep Vietnamese letters but handle edge cases if they aren't in dict
                if (!dict[mappedChar]) {
                    // Stripped down normalization as fallback
                    mappedChar = mappedChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                }
            } else {
                mappedChar = mappedChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            }
            
            const baseLine = dict[mappedChar] || (lang === "vi" ? `Ý chí vươn lên cùng chữ ${char}` : `Looking forward with letter ${char}`);
            lines.push(`<span class="acrostic-letter">${char}</span> - ${baseLine.substring(4)}`);
        });
        
        return {
            keyword: keyword,
            text: lines.join("\n"),
            hint1: lang === "vi" 
                ? "Hãy chú ý đến các chữ cái đầu dòng (ghép lại từ trên xuống dưới)." 
                : "Look at the starting letters of each verse written in color.",
            hint2: lang === "vi"
                ? `Đáp án này gồm ${cleanKeyword.length} chữ cái liên quan đến chủ đề học hỏi.`
                : `This keyword has ${cleanKeyword.length} characters. Check the letters highlighted in pink.`,
            answer: keyword,
            grade: grade,
            genre: "acrostic",
            lang: lang,
            isAcrostic: true
        };
    } else {
        // Build General Riddle based on type
        let text = "";
        let hint1 = "";
        let hint2 = "";
        
        if (lang === "vi") {
            if (genre === "history-lit") {
                text = `Nơi khơi nguồn của câu đố trí tuệ,\nLiên tưởng ngay đến bí mật "${keyword}",\nDân ta thường nhắc xưa nay,\nĐố bạn nhỏ giải được câu này lập công!`;
                hint1 = "Đáp án này thuộc nhóm Kiến thức Văn học / Lịch sử.";
                hint2 = `Khái niệm này có tên bắt đầu bằng chữ "${keyword[0]}".`;
            } else if (genre === "modern-meme") {
                text = `Trend này cực hot trên mạng xã hội,\nNhìn qua đoán ngay ${keyword} vui nhộn,\nHọc sinh Cấp 2 thường hay truyền tai,\nĐọc lên một phát cười vui suốt ngày!`;
                hint1 = "Thuộc văn hóa mạng xã hội lành mạnh, trẻ trung.";
                hint2 = `Xem lại từ khóa gốc: bắt đầu bằng chữ "${keyword[0]}" và kết thúc bằng "${keyword[keyword.length - 1]}".`;
            } else if (genre === "music-art") {
                text = `Giai điệu vui tươi vẽ nên sắc màu,\n"${keyword}" là nguồn cảm hứng bay cao,\nNhững nốt nhạc ngân vang réo rắt,\nĐố em đoán được tác phẩm nhiệm màu?`;
                hint1 = "Liên quan đến âm nhạc, hội họa hoặc văn hóa nghệ thuật.";
                hint2 = `Từ khóa này có độ dài ${keyword.length} ký tự.`;
            } else { // science-math or general
                text = `Một bài toán khó cần lời giải hay,\nLiên tưởng khoa học quanh ta mỗi ngày,\nTên của thực thể "${keyword}" đây,\nThông thái đoán trúng nhận ngay điểm mười!`;
                hint1 = "Một thuật ngữ thuộc lĩnh vực Khoa học, Tự nhiên hoặc Toán học.";
                hint2 = `Từ khóa có ${keyword.length} ký tự. Hãy đọc kỹ câu hỏi nhé!`;
            }
        } else { // English
            text = `A mysterious puzzle for you to solve,\nWhere answers of "${keyword}" slowly evolve,\nThink of its meaning, look at its size,\nGuess it correct to win the first prize!`;
            hint1 = `The topic belongs to the category of ${genre.replace('-', ' ')}.`;
            hint2 = `The keyword has ${keyword.length} letters, starting with "${keyword[0]}".`;
        }
        
        return {
            keyword: keyword,
            text: text,
            hint1: hint1 || "Think of something related to the provided keyword.",
            hint2: hint2 || `The word starts with "${keyword[0]}" and has ${keyword.length} letters.`,
            answer: keyword,
            grade: grade,
            genre: genre,
            lang: lang
        };
    }
}
