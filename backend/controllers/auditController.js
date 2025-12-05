const { AuditLog, User } = require('../models');

// Obtener todos los logs de auditoría con paginación
exports.getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const table = req.query.table || null;

    const where = {};
    if (table) {
      where.table_name = table;
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
          required: false
        }
      ],
      order: [['changed_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      logs: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener logs de un registro específico
exports.getLogsByRecord = async (req, res) => {
  try {
    const { table, recordId } = req.params;

    const logs = await AuditLog.findAll({
      where: {
        table_name: table,
        record_id: recordId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
          required: false
        }
      ],
      order: [['changed_at', 'DESC']]
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
