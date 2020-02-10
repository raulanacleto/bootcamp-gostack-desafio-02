module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('encomendas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // serve pra quando deletar uma imagem, setar null a tabela se usuario
        allowNull: true,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        references: { model: 'entregadors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // serve pra quando deletar uma imagem, setar null a tabela se usuario
        allowNull: true,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // serve pra quando deletar uma imagem, setar null a tabela se usuario
        allowNull: true,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('encomendas');
  },
};
