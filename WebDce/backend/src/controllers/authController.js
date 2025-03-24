import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import LdapAuth from 'ldapauth-fork';
import db from '../models/index.js';
const { User } = db; // Lấy User từ db (chỉ sử dụng này)

dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Nếu là user AD → kiểm tra có cấu hình LDAP không
    if (user.isADUser) {
      if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_SEARCH_BASE) {
        console.warn('⚠️ LDAP config is missing');
        return res.status(500).json({ message: 'LDAP chưa được cấu hình đúng' });
      }

      const ldap = new LdapAuth({
        url: process.env.LDAP_URL,
        bindDN: process.env.LDAP_BIND_DN,
        bindCredentials: process.env.LDAP_BIND_PASSWORD,
        searchBase: process.env.LDAP_SEARCH_BASE,
        searchFilter: '(sAMAccountName={{username}})',
        reconnect: true
      });

      ldap.authenticate(username, password, async (err, ldapUser) => {
        if (err || !ldapUser) {
          console.warn('⚠️ LDAP authentication failed:', err?.message || 'No user');
          return res.status(401).json({ message: 'LDAP đăng nhập thất bại' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            role: user.role,
            isADUser: user.isADUser
          }
        });
      });
    } else {
      // ✅ Local user login
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          role: user.role,
          isADUser: user.isADUser
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
