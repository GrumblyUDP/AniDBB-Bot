//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: 	new SlashCommandBuilder().setName('source')
	.setDescription('Despliega informacion de la fuente de origen del anime consultado')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre del anime que se quiera consultar su fuente')
	.setRequired(true))
	,
	async execute(interaction) 
	{
		const sourceName = interaction.options.getString('nombre');
		
		const res = await pool.query('SELECT a.nombre_anime, e.nombre_escritor, f.year, f.formato, f.isbn, f.editorial, f.estado FROM Anime AS a, Fuente AS f, Escritor AS e WHERE a.nombre_anime LIKE ' + "'%" + `${sourceName}` + "%' " +  'AND f.id_anime = a.id AND f.id_escritor = e.id;');

		await interaction.editReply("Informacion sobre la fuente del anime consultado:\n" + "\n-Nombre Fuente: " + `${res.rows[0].nombre_anime}` + "\n\n-Nombre Escritor: " + `${res.rows[0].nombre_escritor}` + "\n\n-Año de publicacion: " +`${res.rows[0].year}` + "\n\n-Formato: " + `${res.rows[0].formato}` + "\n\n-ISBN: " + `${res.rows[0].isbn}` + "\n\n-Editorial: " + `${res.rows[0].editorial}` +"\n\n-Estado: " + `${res.rows[0].estado}`);
	
	},
};
