const express = require('express');
const path = require('path'); // <-- 1. Adicionado para garantir o caminho correto
const sequelize = require('./config/database');

// Importar os Modelos (para o Sequelize criar as tabelas)
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

// Importar as Rotas Externas
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = 3000;

// === MIDDLEWARES ===
// Permite que o Express entenda JSON no corpo (body) das requisições
app.use(express.json()); 

// === CAMINHO SEGURO PARA A PASTA PUBLIC ===
// Isso garante que o Express ache a pasta public em qualquer sistema ou terminal
app.use(express.static(path.join(__dirname, 'public'))); 

// === DEFINIR OS RELACIONAMENTOS ===
// Um Curso tem muitas Aulas. Uma Aula pertence a um Curso.
Course.hasMany(Lesson, { onDelete: 'CASCADE' });
Lesson.belongsTo(Course);

// Relação de Matrícula: Muitos Alunos para Muitos Cursos
User.belongsToMany(Course, { through: 'Enrollments' });
Course.belongsToMany(User, { through: 'Enrollments' });

// === VINCULAR AS ROTAS ===
// Toda rota dentro de courseRoutes começará com "/courses"
app.use('/courses', courseRoutes);

// === SINCRONIZAR O BANCO DE DADOS ===
// O '{ alter: true }' atualiza as tabelas se você fizer mudanças nos modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso! 💾');
    app.listen(PORT, () => {
        console.log(`Servidor rodando com sucesso em: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('ERRO CRÍTICO: Não foi possível conectar ao banco de dados:', err);
  });
