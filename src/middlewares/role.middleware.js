// Vérifie que l'utilisateur est authentifié et a un rôle autorisé
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }

    next();
  };
};

module.exports = {
  requireRoles,
};