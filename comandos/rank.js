//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: new SlashCommandBuilder().setName('rank')
	.setDescription('Despliega un ranking de los mejores animes, se puede filtrar por genero o por año de emision')
	.addStringOption(option => option.setName('genero')
	.setDescription('genero principal de los animes para el ranking'))
	.addStringOption(option => option.setName('año')
	.setDescription('año de emision de los animes a visualizar en el ranking')),

	async execute(interaction) 
	{
		const genero = interaction.options.getString('genero');
		const year = interaction.options.getString('año');

		if(genero != null)
		{
			const res1 = await pool.query('SELECT nombre_anime, calificacion, year_emision FROM Anime WHERE genero = ' + "'" +`${genero}` + "'" +'ORDER BY calificacion DESC;');
			var filaGenero = "";
			res1.rows.forEach(element => (filaGenero = filaGenero + "| -Nombre: " + `${element.nombre_anime}` + " | -Calificacion: "+ `${element.calificacion}` + " | -Año emision: " + `${element.year_emision}` + " |" + "\n\n"));

			await interaction.editReply("Ranking genero " + genero + ":\n\n" + filaGenero);
		}

		else if(year != null)
		{
			const res2 = await pool.query('SELECT nombre_anime, calificacion, genero FROM Anime WHERE year_emision = ' + `${year}` + 'ORDER BY calificacion DESC;');

			var filaYear = "";
			res2.rows.forEach(element => (filaYear = filaYear + "| -Nombre: " + `${element.nombre_anime}` + " | -Calificacion: "+ `${element.calificacion}` + " | -Genero: " + `${element.genero}` + " |" + "\n\n"));

			await interaction.editReply("Ranking animes del " + year + ":\n\n" + filaYear);

		}

		else
		{
				await interaction.editReply("Error en la ejecucion del comando, intente de nuevo");

		
		}

	},
};

	


		




