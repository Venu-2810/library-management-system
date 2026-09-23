const TOKEN_KEY = "college_library_token";
const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
};
async function request(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers || {}
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(endpoint, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return data;
}
const api = {
  // Auth
  async register(collegeRegistrationNo, password, confirmPassword) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ collegeRegistrationNo, password, confirmPassword })
    });
  },
  async login(collegeRegistrationNo, password) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ collegeRegistrationNo, password })
    });
  },
  async getMe() {
    return request("/api/auth/me");
  },
  // Books
  async getBooks(params) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.availability) query.set("availability", params.availability);
    if (params?.author) query.set("author", params.author);
    const qs = query.toString();
    return request(`/api/books${qs ? `?${qs}` : ""}`);
  },
  async getBookById(id) {
    return request(`/api/books/${id}`);
  },
  async addBook(bookData) {
    return request("/api/books", {
      method: "POST",
      body: JSON.stringify(bookData)
    });
  },
  async updateBook(id, bookData) {
    return request(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData)
    });
  },
  async deleteBook(id) {
    return request(`/api/books/${id}`, {
      method: "DELETE"
    });
  },
  // Borrow transactions
  async getMyBooks() {
    const res = await request("/api/borrow/my-books");
    return {
      borrows: res.borrows.map((b) => ({
        ...b,
        collegeRegistrationNo: b.studentRegistrationNo || b.collegeRegistrationNo
      }))
    };
  },
  async borrowBook(bookId, studentRegistrationNo) {
    return request("/api/borrow/request", {
      method: "POST",
      body: JSON.stringify({ bookId, studentRegistrationNo })
    });
  },
  async issueBookStaff(bookId, studentRegistrationNo) {
    return this.borrowBook(bookId, studentRegistrationNo);
  },
  async getAllBorrows(params) {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const res = await request(
      `/api/borrow/all${qs ? `?${qs}` : ""}`
    );
    return {
      total: res.total,
      borrows: res.borrows.map((b) => ({
        ...b,
        collegeRegistrationNo: b.studentRegistrationNo || b.collegeRegistrationNo
      }))
    };
  },
  async returnBook(borrowId) {
    return request(`/api/borrow/${borrowId}/return`, {
      method: "POST"
    });
  },
  // Notifications
  async getNotifications() {
    const res = await request("/api/notifications");
    return {
      unreadCount: res.unreadCount,
      notifications: res.notifications.map((n) => ({
        ...n,
        collegeRegistrationNo: n.recipient !== "ALL_STUDENTS" && n.recipient !== "STAFF_ADMIN" ? n.recipient : void 0
      }))
    };
  },
  async markNotificationAsRead(id) {
    return request(`/api/notifications/${id}/read`, {
      method: "PATCH"
    });
  },
  async markAllNotificationsAsRead() {
    return request("/api/notifications/mark-all-read", {
      method: "POST"
    });
  },
  async broadcastNotification(data) {
    return request("/api/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  async sendNotification(data) {
    return this.broadcastNotification({
      recipient: data.collegeRegistrationNo || data.userId || "ALL_STUDENTS",
      title: data.title,
      message: data.message,
      type: data.type
    });
  },
  // Admin
  async getAdminStats() {
    return request("/api/admin/stats");
  },
  async getAdminStudents() {
    return request("/api/admin/students");
  },
  async getAllStudents() {
    return this.getAdminStudents();
  },
  async toggleStudentStatus(id, active) {
    return request(`/api/admin/students/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active })
    });
  },
  async getAdminSettings() {
    const res = await request("/api/admin/settings");
    const s = res.settings;
    return {
      settings: {
        ...s,
        loanPeriodDays: s.borrowDurationDays || 14,
        fineRatePerDay: s.dailyPenalty || 10,
        maxBooksPerStudent: 5,
        allowRenewal: true
      }
    };
  },
  async getSettings() {
    return this.getAdminSettings();
  },
  async updateAdminSettings(settingsData) {
    const payload = {
      ...settingsData,
      dailyPenalty: settingsData.fineRatePerDay ?? settingsData.dailyPenalty,
      borrowDurationDays: settingsData.loanPeriodDays ?? settingsData.borrowDurationDays
    };
    return request("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  async updateSettings(settingsData) {
    return this.updateAdminSettings(settingsData);
  }
};
export {
  api,
  authStorage
};
