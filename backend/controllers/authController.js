const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Login con validación de password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({
      where: { email, active: true, deleted_at: null }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Validar password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('[Auth] Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user?.id || req.userId, {
      attributes: { exclude: ['password_hash', 'deleted_at', 'created_by', 'updated_by'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cambiar password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user?.id || req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Validar password actual
    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Password actual incorrecto' });
    }
    
    // Hashear y guardar nuevo password
    user.password_hash = await User.hashPassword(newPassword);
    await user.save();
    
    res.json({ message: 'Password actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
