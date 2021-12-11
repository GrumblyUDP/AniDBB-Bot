//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: 	new SlashCommandBuilder().setName('studio')
	.setDescription('Despliega informacion del estudio de animacion consultado')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre del estudio a consultar')
	.setRequired(true))
	,
	async execute(interaction) 
	{
		try
		{
			const studioName = interaction.options.getString('nombre');

			const res = await pool.query('SELECT e.nombre_estudio, a.nombre_anime FROM estudio_de_animacion AS e, anime AS a WHERE e.nombre_estudio LIKE ' + "'%" + `${studioName}` + "%' " + 'AND a.id_estudio = e.id;');


			var animesDone = "";
			res.rows.forEach(element => (animesDone = animesDone + "-" + `${element.nombre_anime}` + "\n\t"));
			

			await interaction.editReply("Informacion sobre el estudio consultado: \n" + "\n-Nombre: " + `${res.rows[0].nombre_estudio}` + "\n" + "\n-Animes hechos por este estudio: \n" + "\t" + animesDone);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}

	},
};
