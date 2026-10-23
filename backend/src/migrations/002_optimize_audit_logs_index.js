/**
 * Migration 002: Optimasi index tabel audit_logs untuk ORDER BY created_at
 * Mencegah out of sort memory pada query audit logs / dashboard analytics
 */
module.exports = {
  up: async (sequelize) => {
    try {
      const [indexes] = await sequelize.query("SHOW INDEX FROM `audit_logs` WHERE Key_name = 'idx_audit_logs_created_at'");
      if (indexes.length === 0) {
        await sequelize.query("CREATE INDEX `idx_audit_logs_created_at` ON `audit_logs` (`created_at` DESC, `deleted_at`)");
      }
    } catch (e) {
      // Abaikan jika tabel audit_logs belum siap
    }
  }
};
