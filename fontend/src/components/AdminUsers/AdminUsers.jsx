// src/components/AdminUsers/AdminUsers.jsx
import { useState, useEffect } from "react";
import { Search, Trash2, RefreshCw, Shield, User, Mail, Calendar, Copy, Check } from "lucide-react";
import { api } from "../../services/api";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllUsers();
      console.log("👥 Users data:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải người dùng...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="header-left">
          <h2>👥 Quản lý người dùng</h2>
          <span className="user-count">Tổng: {users.length} người dùng</span>
        </div>
        <button className="refresh-btn" onClick={fetchUsers}>
          <RefreshCw size={18} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th className="id-col">ID</th>
              <th className="user-col">Người dùng</th>
              <th className="email-col">Email</th>
              <th className="role-col">Vai trò</th>
              <th className="date-col">Ngày tạo</th>
              <th className="action-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Không có người dùng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="id-cell">
                    <div className="uuid-wrapper">
                      <span className="uuid-text" title={user.id}>
                        {user.id}
                      </span>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(user.id)}
                        title="Sao chép ID"
                      >
                        {copiedId === user.id ? (
                          <Check size={14} className="copied-icon" />
                        ) : (
                          <Copy size={14} className="copy-icon" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="user-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <span className="avatar-initial">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="email-cell">
                    <div className="email-wrapper">
                      <Mail size={14} className="email-icon" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="role-cell">
                    <span className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}>
                      {user.role === "ADMIN" ? (
                        <>
                          <Shield size={14} />
                          Admin
                        </>
                      ) : (
                        <>
                          <User size={14} />
                          User
                        </>
                      )}
                    </span>
                  </td>
                  <td className="date-cell">
                    <div className="date-wrapper">
                      <Calendar size={14} className="date-icon" />
                      <span>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="action-cell">
                    <button
                      className={`delete-btn ${user.role === "ADMIN" ? "disabled" : ""}`}
                      onClick={() => deleteUser(user.id)}
                      disabled={user.role === "ADMIN"}
                      title={user.role === "ADMIN" ? "Không thể xóa Admin" : "Xóa người dùng"}
                    >
                      <Trash2 size={16} />
                      <span>Xóa</span>
                    </button>
                    {user.role === "ADMIN" && (
                      <span className="admin-protected">🛡️</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
