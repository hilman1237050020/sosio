// LocalStorage CRUD Service
// Tidak perlu server/database - semua data disimpan di browser

export interface Report {
    id: string;
    category: string;
    description: string;
    isAnonymous: boolean;
    reporterName?: string;
    reporterEmail?: string;
    status: 'pending' | 'investigating' | 'resolved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
    notes?: string;
}

export interface Reviewer {
    id: string;
    name: string;
    email: string;
    password: string;
    cases: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    value: string;
    icon: string;
    color: string;
    reportCount: number;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'reviewer' | 'user';
    phone?: string;
    department?: string;
    joinDate?: string;
}

export interface UserSettings {
    emailNotif: boolean;
    newCaseNotif: boolean;
    statusUpdateNotif: boolean;
    weeklyReport: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    twoFactorEnabled: boolean;
}

// Storage Keys
const STORAGE_KEYS = {
    REPORTS: 'sosio_reports',
    REVIEWERS: 'sosio_reviewers',
    CATEGORIES: 'sosio_categories',
    USERS: 'sosio_users',
    CURRENT_USER: 'sosio_current_user',
    USER_SETTINGS: 'sosio_user_settings',
    LAST_REPORT_ID: 'lastReportId',
};

// Helper functions
const generateId = () => 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
const generateReportId = () => 'ETK-' + Math.random().toString(36).substr(2, 9).toUpperCase();

// Generic CRUD operations
function getAll<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function getById<T extends { id: string }>(key: string, id: string): T | null {
    const items = getAll<T>(key);
    return items.find(item => item.id === id) || null;
}

function create<T extends { id?: string }>(key: string, item: T): T {
    const items = getAll<T>(key);
    const newItem = { ...item, id: item.id || generateId() };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
}

function update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = getAll<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(key, JSON.stringify(items));
    return items[index];
}

function remove(key: string, id: string): boolean {
    const items = getAll<{ id: string }>(key);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
}

// =====================
// REPORTS CRUD
// =====================
export const ReportsService = {
    getAll: (): Report[] => getAll<Report>(STORAGE_KEYS.REPORTS),

    getById: (id: string): Report | null => getById<Report>(STORAGE_KEYS.REPORTS, id),

    getByStatus: (status: Report['status']): Report[] => {
        return getAll<Report>(STORAGE_KEYS.REPORTS).filter(r => r.status === status);
    },

    create: (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Report => {
        const report: Report = {
            ...data,
            id: generateReportId(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return create<Report>(STORAGE_KEYS.REPORTS, report);
    },

    update: (id: string, updates: Partial<Report>): Report | null => {
        return update<Report>(STORAGE_KEYS.REPORTS, id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },

    delete: (id: string): boolean => remove(STORAGE_KEYS.REPORTS, id),

    updateStatus: (id: string, status: Report['status'], notes?: string): Report | null => {
        return ReportsService.update(id, { status, notes });
    },

    assignReviewer: (reportId: string, reviewerId: string): Report | null => {
        return ReportsService.update(reportId, { assignedTo: reviewerId });
    },

    getStats: () => {
        const reports = ReportsService.getAll();
        return {
            total: reports.length,
            pending: reports.filter(r => r.status === 'pending').length,
            investigating: reports.filter(r => r.status === 'investigating').length,
            resolved: reports.filter(r => r.status === 'resolved').length,
            rejected: reports.filter(r => r.status === 'rejected').length,
        };
    },

    getByCategory: () => {
        const reports = ReportsService.getAll();
        const categoryCount: Record<string, number> = {};
        reports.forEach(r => {
            categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
        });
        return categoryCount;
    },
};

// =====================
// REVIEWERS CRUD
// =====================
export const ReviewersService = {
    getAll: (): Reviewer[] => getAll<Reviewer>(STORAGE_KEYS.REVIEWERS),

    getById: (id: string): Reviewer | null => getById<Reviewer>(STORAGE_KEYS.REVIEWERS, id),

    getActive: (): Reviewer[] => {
        return getAll<Reviewer>(STORAGE_KEYS.REVIEWERS).filter(r => r.status === 'active');
    },

    create: (data: Omit<Reviewer, 'id' | 'cases' | 'createdAt'>): Reviewer => {
        const reviewer: Reviewer = {
            ...data,
            id: generateId(),
            cases: 0,
            createdAt: new Date().toISOString(),
        };
        return create<Reviewer>(STORAGE_KEYS.REVIEWERS, reviewer);
    },

    update: (id: string, updates: Partial<Reviewer>): Reviewer | null => {
        return update<Reviewer>(STORAGE_KEYS.REVIEWERS, id, updates);
    },

    delete: (id: string): boolean => remove(STORAGE_KEYS.REVIEWERS, id),

    incrementCases: (id: string): Reviewer | null => {
        const reviewer = ReviewersService.getById(id);
        if (!reviewer) return null;
        return ReviewersService.update(id, { cases: reviewer.cases + 1 });
    },

    toggleStatus: (id: string): Reviewer | null => {
        const reviewer = ReviewersService.getById(id);
        if (!reviewer) return null;
        return ReviewersService.update(id, {
            status: reviewer.status === 'active' ? 'inactive' : 'active'
        });
    },
};

// =====================
// CATEGORIES CRUD
// =====================
export const CategoriesService = {
    getAll: (): Category[] => {
        const categories = getAll<Category>(STORAGE_KEYS.CATEGORIES);
        if (categories.length === 0) {
            // Initialize with default categories
            const defaults: Omit<Category, 'id'>[] = [
                { name: 'Plagiarisme', value: 'plagiarisme', icon: '📝', color: 'bg-red-100 text-red-700', reportCount: 0 },
                { name: 'Penyalahgunaan AI', value: 'ai-abuse', icon: '🤖', color: 'bg-orange-100 text-orange-700', reportCount: 0 },
                { name: 'Hacking WiFi Kampus', value: 'wifi-hacking', icon: '📡', color: 'bg-yellow-100 text-yellow-700', reportCount: 0 },
                { name: 'Akses Ilegal ke Sistem', value: 'illegal-access', icon: '🔓', color: 'bg-pink-100 text-pink-700', reportCount: 0 },
                { name: 'Penyebaran Data Pribadi', value: 'data-breach', icon: '🔐', color: 'bg-purple-100 text-purple-700', reportCount: 0 },
                { name: 'Cyberbullying', value: 'cyberbullying', icon: '💬', color: 'bg-blue-100 text-blue-700', reportCount: 0 },
            ];
            defaults.forEach(cat => CategoriesService.create(cat));
            return getAll<Category>(STORAGE_KEYS.CATEGORIES);
        }
        return categories;
    },

    getById: (id: string): Category | null => getById<Category>(STORAGE_KEYS.CATEGORIES, id),

    getByValue: (value: string): Category | null => {
        return getAll<Category>(STORAGE_KEYS.CATEGORIES).find(c => c.value === value) || null;
    },

    create: (data: Omit<Category, 'id'>): Category => {
        return create<Category>(STORAGE_KEYS.CATEGORIES, { ...data, id: generateId() });
    },

    update: (id: string, updates: Partial<Category>): Category | null => {
        return update<Category>(STORAGE_KEYS.CATEGORIES, id, updates);
    },

    delete: (id: string): boolean => remove(STORAGE_KEYS.CATEGORIES, id),

    incrementReportCount: (categoryValue: string): void => {
        const category = CategoriesService.getByValue(categoryValue);
        if (category) {
            CategoriesService.update(category.id, { reportCount: category.reportCount + 1 });
        }
    },
};

// =====================
// AUTH / USERS
// =====================
export const AuthService = {
    getUsers: (): User[] => getAll<User>(STORAGE_KEYS.USERS),

    register: (data: Omit<User, 'id'>): User => {
        const user: User = { ...data, id: generateId() };
        return create<User>(STORAGE_KEYS.USERS, user);
    },

    login: (email: string, password: string): User | null => {
        const users = getAll<User>(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
        return user || null;
    },

    logout: (): void => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    getCurrentUser: (): User | null => {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    isLoggedIn: (): boolean => {
        return !!AuthService.getCurrentUser();
    },

    isAdmin: (): boolean => {
        const user = AuthService.getCurrentUser();
        return user?.role === 'admin';
    },

    isReviewer: (): boolean => {
        const user = AuthService.getCurrentUser();
        return user?.role === 'reviewer' || user?.role === 'admin';
    },

    updateProfile: (updates: Partial<User>): User | null => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return null;

        const users = getAll<User>(STORAGE_KEYS.USERS);
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
            return users[index];
        }
        return null;
    },

    changePassword: (currentPassword: string, newPassword: string): boolean => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return false;

        const users = getAll<User>(STORAGE_KEYS.USERS);
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1 && users[index].password === currentPassword) {
            users[index].password = newPassword;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    // Initialize default admin
    initDefaultAdmin: (): void => {
        const users = getAll<User>(STORAGE_KEYS.USERS);
        if (!users.find(u => u.role === 'admin')) {
            AuthService.register({
                email: 'admin@university.ac.id',
                password: 'admin123',
                name: 'Admin System',
                role: 'admin',
                phone: '+62 811-1234-5678',
                department: 'IT Department',
                joinDate: '2020-01-01',
            });
        }
    },
};

// =====================
// USER SETTINGS
// =====================
export const UserSettingsService = {
    getSettings: (): UserSettings => {
        const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
        if (data) {
            return JSON.parse(data);
        }
        // Default settings
        return {
            emailNotif: true,
            newCaseNotif: true,
            statusUpdateNotif: true,
            weeklyReport: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00',
            twoFactorEnabled: false,
        };
    },

    saveSettings: (settings: Partial<UserSettings>): UserSettings => {
        const current = UserSettingsService.getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
        return updated;
    },
};

// Initialize default data on first load
export const initializeStorage = (): void => {
    CategoriesService.getAll(); // This will create defaults if empty
    AuthService.initDefaultAdmin();

    // Initialize default reviewers if empty
    const reviewers = ReviewersService.getAll();
    if (reviewers.length === 0) {
        const defaultReviewers = [
            { name: 'Dr. Ahmad Wijaya', email: 'ahmad@university.ac.id', password: 'reviewer123', status: 'active' as const, phone: '+62 812-3456-7890', department: 'Teknik Informatika', joinDate: '2020-01-15' },
            { name: 'Prof. Siti Nurhaliza', email: 'siti@university.ac.id', password: 'reviewer123', status: 'active' as const, phone: '+62 812-9876-5432', department: 'Sistem Informasi', joinDate: '2019-06-20' },
            { name: 'Dr. Budi Santoso', email: 'budi@university.ac.id', password: 'reviewer123', status: 'active' as const, phone: '+62 813-1111-2222', department: 'Ilmu Komputer', joinDate: '2021-03-10' },
            { name: 'Dra. Ratna Dewi', email: 'ratna@university.ac.id', password: 'reviewer123', status: 'inactive' as const, phone: '+62 814-3333-4444', department: 'Teknologi Pendidikan', joinDate: '2018-09-01' },
        ];
        defaultReviewers.forEach(r => ReviewersService.create(r as any));
    }

    // Initialize dummy reports if empty
    const reports = ReportsService.getAll();
    if (reports.length === 0) {
        const dummyReports: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>[] = [
            // Plagiarisme cases
            {
                category: 'plagiarisme',
                description: 'Ditemukan kesamaan 85% pada tugas akhir mahasiswa dengan karya ilmiah yang sudah dipublikasi sebelumnya. Mahasiswa menggunakan metode copy-paste tanpa menyebutkan sumber asli.',
                isAnonymous: true,
                status: 'investigating',
                assignedTo: 'ahmad@university.ac.id',
                notes: '[2024-12-10] Sedang melakukan pengecekan similarity dengan Turnitin.',
            },
            {
                category: 'plagiarisme',
                description: 'Laporan skripsi mahasiswa diduga menjiplak dari skripsi kakak tingkat tahun 2020. Struktur bab dan referensi sangat mirip.',
                isAnonymous: false,
                reporterName: 'Dosen Pembimbing A',
                reporterEmail: 'dosena@university.ac.id',
                status: 'pending',
            },
            {
                category: 'plagiarisme',
                description: 'Paper submission untuk konferensi internasional terindikasi plagiat dari jurnal lokal yang tidak terindeks.',
                isAnonymous: true,
                status: 'resolved',
                assignedTo: 'siti@university.ac.id',
                notes: '[2024-12-05] Kasus selesai. Mahasiswa diberikan sanksi akademik berupa pengulangan mata kuliah.',
            },

            // Penyalahgunaan AI cases
            {
                category: 'ai-abuse',
                description: 'Mahasiswa menggunakan ChatGPT untuk mengerjakan seluruh tugas esai mata kuliah Etika Profesi tanpa pemahaman materi. Jawaban sangat generic dan tidak sesuai konteks.',
                isAnonymous: false,
                reporterName: 'Dosen Pengampu Etika',
                reporterEmail: 'etika.dosen@university.ac.id',
                status: 'investigating',
                assignedTo: 'budi@university.ac.id',
                notes: '[2024-12-12] Mahasiswa dipanggil untuk klarifikasi.',
            },
            {
                category: 'ai-abuse',
                description: 'Ditemukan kode program tugas praktikum yang 100% dihasilkan oleh AI. Mahasiswa tidak bisa menjelaskan logika program ketika ditanya.',
                isAnonymous: true,
                status: 'pending',
            },
            {
                category: 'ai-abuse',
                description: 'Penggunaan AI untuk membuat proposal penelitian tanpa verifikasi data. Beberapa referensi yang dicantumkan ternyata tidak ada.',
                isAnonymous: true,
                status: 'resolved',
                assignedTo: 'ahmad@university.ac.id',
                notes: '[2024-12-08] Mahasiswa mengakui kesalahan dan memperbaiki proposal.',
            },

            // Hacking WiFi cases
            {
                category: 'wifi-hacking',
                description: 'Terdeteksi aktivitas mencurigakan dari MAC address tertentu yang mencoba brute force password WiFi kampus. IP berasal dari Lab Komputer Gedung A.',
                isAnonymous: false,
                reporterName: 'IT Security Team',
                reporterEmail: 'itsec@university.ac.id',
                status: 'investigating',
                assignedTo: 'ahmad@university.ac.id',
                notes: '[2024-12-13] Koordinasi dengan tim keamanan IT untuk identifikasi pelaku.',
            },
            {
                category: 'wifi-hacking',
                description: 'Mahasiswa kedapatan menggunakan aplikasi packet sniffer untuk mencuri credentials login WiFi kampus.',
                isAnonymous: true,
                status: 'resolved',
                assignedTo: 'budi@university.ac.id',
                notes: '[2024-12-01] Pelaku teridentifikasi dan diberikan sanksi skorsing 1 semester.',
            },

            // Akses Ilegal cases
            {
                category: 'illegal-access',
                description: 'Ditemukan percobaan akses ilegal ke sistem informasi akademik (SIAKAD) untuk mengubah nilai mata kuliah.',
                isAnonymous: false,
                reporterName: 'Admin SIAKAD',
                reporterEmail: 'siakad@university.ac.id',
                status: 'investigating',
                assignedTo: 'siti@university.ac.id',
                notes: '[2024-12-11] Log akses sedang dianalisis.',
            },
            {
                category: 'illegal-access',
                description: 'Mahasiswa mencoba login ke akun dosen menggunakan password yang diduga dicuri melalui phishing.',
                isAnonymous: true,
                status: 'pending',
            },

            // Penyebaran Data Pribadi cases
            {
                category: 'data-breach',
                description: 'Data pribadi mahasiswa termasuk NIM, alamat, dan nomor HP disebarluaskan di grup WhatsApp tanpa izin.',
                isAnonymous: true,
                status: 'investigating',
                assignedTo: 'ahmad@university.ac.id',
                notes: '[2024-12-14] Koordinasi dengan pihak kemahasiswaan.',
            },
            {
                category: 'data-breach',
                description: 'Screenshot nilai ujian mahasiswa disebar di media sosial oleh akun anonim.',
                isAnonymous: false,
                reporterName: 'Korban Mahasiswa',
                reporterEmail: 'mahasiswa123@student.university.ac.id',
                status: 'pending',
            },

            // Cyberbullying cases
            {
                category: 'cyberbullying',
                description: 'Akun Instagram fake dibuat untuk menyebarkan foto dan informasi memalukan tentang seorang mahasiswi. Aksi ini berkelanjutan selama 2 minggu.',
                isAnonymous: true,
                status: 'investigating',
                assignedTo: 'siti@university.ac.id',
                notes: '[2024-12-13] Berkoordinasi dengan pihak keamanan untuk identifikasi pelaku.',
            },
            {
                category: 'cyberbullying',
                description: 'Grup chat kelas digunakan untuk mengejek dan mengintimidasi mahasiswa tertentu secara berulang.',
                isAnonymous: true,
                status: 'resolved',
                assignedTo: 'budi@university.ac.id',
                notes: '[2024-12-09] Mediasi berhasil dilakukan. Pelaku meminta maaf dan berjanji tidak mengulangi.',
            },
            {
                category: 'cyberbullying',
                description: 'Komentar hate speech di forum kampus online yang menargetkan mahasiswa berdasarkan SARA.',
                isAnonymous: false,
                reporterName: 'BEM Fakultas',
                reporterEmail: 'bem@student.university.ac.id',
                status: 'pending',
            },
        ];

        // Create reports with staggered dates
        const now = new Date();
        dummyReports.forEach((report, index) => {
            const createdDate = new Date(now);
            createdDate.setDate(now.getDate() - (index * 2)); // Each report 2 days apart

            const newReport: Report = {
                ...report,
                id: `ETK-${String(index + 1).padStart(3, '0')}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                createdAt: createdDate.toISOString(),
                updatedAt: createdDate.toISOString(),
            };

            const reports = getAll<Report>(STORAGE_KEYS.REPORTS);
            reports.push(newReport);
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
        });

        // Update category report counts
        const allReports = ReportsService.getAll();
        const categories = CategoriesService.getAll();
        categories.forEach(cat => {
            const count = allReports.filter(r => r.category === cat.value).length;
            CategoriesService.update(cat.id, { reportCount: count });
        });

        // Update reviewer case counts
        const reviewersList = ReviewersService.getAll();
        reviewersList.forEach(reviewer => {
            const caseCount = allReports.filter(r => r.assignedTo === reviewer.email).length;
            ReviewersService.update(reviewer.id, { cases: caseCount });
        });
    }

    // Initialize user settings if not exists
    if (!localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)) {
        UserSettingsService.getSettings(); // This creates defaults
    }
};
