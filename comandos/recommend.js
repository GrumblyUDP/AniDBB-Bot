//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: new SlashCommandBuilder().setName('recommend')
	.setDescription('Se muestra informacion de un anime escogido aleatoriamente de los mejores calificados')
	.addStringOption(option => option.setName('genero')
	.setDescription('genero de la recomendacion'))
	.addStringOption(option => option.setName('año')
	.setDescription('año de emision del anime a recomendar'))
	,
	async execute(interaction) 
	{
		try
		{
				const genero = interaction.options.getString('genero');
				const year = interaction.options.getString('año');

				if(genero != null)
				{
					const res1 = await pool.query('SELECT nombre_anime, calificacion, year_emision FROM Anime WHERE genero = '  + "'" +`${genero}` + "'" + ' AND calificacion >= 7.5 ORDER BY RANDOM() LIMIT 1;');

					var filaGenero = "";
					res1.rows.forEach(element => (filaGenero = filaGenero + "| -Nombre: " + `${element.nombre_anime}` + " | -Calificacion: "+ `${element.calificacion}` + " | -Año emision: " + `${element.year_emision}` + " |" + "\n\n"));

					if(res1.rows.length != 0)
					{
						await interaction.editReply("Anime elegido de los mejores calificados del genero " + genero + ":\n\n" + filaGenero);
					}
					
					else throw new error('Genero no esta en la bdd');
				}

				else if(year != null)
				{
					const res2 = await pool.query('SELECT nombre_anime, calificacion, genero FROM Anime WHERE year_emision = ' + `${year}` +  ' AND calificacion >= 7.5 ORDER BY RANDOM() LIMIT 1;');

					var filaYear = "";
					res2.rows.forEach(element => (filaYear = filaYear + "| -Nombre: " + `${element.nombre_anime}` + " | -Calificacion: "+ `${element.calificacion}` + " | -Genero: " + `${element.genero}` + " |" + "\n\n"));

					if(res2.rows.length != 0)
					{

						await interaction.editReply("Anime elegido de los mejores calificados del año " + year + ":\n\n" + filaYear);
					}

					else throw new error('Año no esta en la bdd');
				}

				else
				{
						await interaction.editReply("Error: Intenta nuevamente");
				
				}

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}
	},
};
