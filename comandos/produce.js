//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = 
{
	data: 	new SlashCommandBuilder().setName('produce')
	.setDescription('Muestra todos los animes producidos por la productora consultada')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre de la productora  a consultar')
	.setRequired(true))
	,
	async execute(interaction) 
	{
		try
		{
			const productora = interaction.options.getString('nombre');

			const queryFullName = await pool.query('SELECT nombre_productora FROM Productora WHERE nombre_productora LIKE ' + "'%" + `${productora}` + "%' ");

			const fullName = queryFullName.rows[0].nombre_productora;

			const res = await pool.query('SELECT nombre_anime FROM Anime, Productora WHERE nombre_productora LIKE '+ "'%" + `${productora}` + "%' " + 'AND Anime.id_productora = Productora.id;');

			var producidos = "";
			res.rows.forEach(element => (producidos= producidos + "-" + `${element.nombre_anime}` + "\n"));

			await interaction.editReply("Animes producidos por " + fullName + ": \n" + producidos);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}
	},
};
