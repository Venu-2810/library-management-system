import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "college_library_jwt_secure_secret_key_2026";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      collegeRegistrationNo: user.collegeRegistrationNo,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Authentication required. Please log in." });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ message: "Invalid or expired session. Please log in again." });
      return;
    }
    req.user = decoded;
    next();
  });
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied. You do not have permission to access this resource."
      });
      return;
    }
    next();
  };
}
export {
  authenticateToken,
  generateToken,
  requireRole
};
