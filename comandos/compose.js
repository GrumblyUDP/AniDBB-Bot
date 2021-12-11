//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: new SlashCommandBuilder().setName('compose').setDescription('Despliega informacion relacionada al compositor de la cancion ingresada y del anime que forma parte')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre de la composicion a consultar')
	.setRequired(true)),
	async execute(interaction) 
	{
		try
		{
			const composName = interaction.options.getString('nombre');

			const res = await pool.query('SELECT cs.nombre_composicion, c.nombre_compositor, c.edad, a.nombre_anime FROM Composiciones AS cs, Compositor AS c, Anime AS a WHERE cs.nombre_composicion LIKE '  + "'%" + `${composName}` + "%' " +  'AND cs.id_compositor = c.id AND a.id_compositor = c.id;');

			await interaction.editReply("Informacion sobre la composicion: \n" + "\n-Nombre composicion: " + `${res.rows[0].nombre_composicion}` + "\n" + "\n-Compositor: " + `${res.rows[0].nombre_compositor}` + "\n" + "\n-Edad: " + `${res.rows[0].edad}` + "\n\n-Anime de la composicion: " + `${res.rows[0].nombre_anime}`);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}
	
	},
};


