//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: new SlashCommandBuilder().setName('anime').setDescription('Despliega informacion relacionada al anime consultado')
	.addStringOption(option => option.setName('nombre')
		.setDescription('nombre del anime a consultar')
		.setRequired(true)),
	async execute(interaction) 
	{
		try
		{
			const animeName = interaction.options.getString('nombre');
		
			const res = await pool.query('SELECT nombre_anime, year_emision, cap_emitidos, estado, genero, calificacion, nombre_director, nombre_estudio, nombre_compositor, nombre_productora FROM Anime, Director, Estudio_de_animacion, Compositor,  Productora, Dirige WHERE nombre_anime LIKE '  + "'%" + `${animeName}` + "%' " +   'AND Dirige.id_director = Director.id AND Dirige.id_anime = Anime.id AND Anime.id_estudio = Estudio_de_animacion.id AND Anime.id_compositor = Compositor.id AND Anime.id_productora = Productora.id;');

			await interaction.editReply("Informacion del anime consultado:\n" + "\n-Nombre: " + `${res.rows[0].nombre_anime}` + "\n\n-Año emision: " + `${res.rows[0].year_emision}` + "\n\n-Capitulos emitidos: " +`${res.rows[0].cap_emitidos}` + "\n\n-Estado: " + `${res.rows[0].estado}` + "\n\n-Genero: " + `${res.rows[0].genero}` + "\n\n-Calificacion: " + `${res.rows[0].calificacion}` +"\n\n-Director: " + `${res.rows[0].nombre_director}` + "\n\n-Estudio: " + `${res.rows[0].nombre_estudio}` + "\n\n-Compositor: " + `${res.rows[0].nombre_compositor}` + "\n\n-Productora: " + `${res.rows[0].nombre_productora}`);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}

	},
};


