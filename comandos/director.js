//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: 	new SlashCommandBuilder().setName('director')
	.setDescription('Despliega informacion relacionada al director consultado')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre del director a consultar')
	.setRequired(true)),
	async execute(interaction) 
	{
		try
		{
			const directName = interaction.options.getString('nombre');

			const res = await pool.query('SELECT DISTINCT nombre_director, edad, nombre_anime, nombre_estudio FROM Director, Anime, Estudio_de_animacion, Dirige WHERE nombre_director LIKE ' + "'%" + `${directName}` + "%' " + 'AND Dirige.id_director = Director.id AND Dirige.id_anime = Anime.id AND Anime.id_estudio = Estudio_de_animacion.id;' );

			var estudios = "";
			res.rows.forEach(element => (estudios = estudios + "-" + `${element.nombre_estudio}` + "\n\t"));
		
			var animes = "";
			res.rows.forEach(element => (animes = animes + "-" + `${element.nombre_anime}` + "\n\t"));

			await interaction.editReply("Informacion sobre director/directora: \n" + "\n-Nombre: " + `${res.rows[0].nombre_director}` + "\n" + "\n-Edad: " + `${res.rows[0].edad}` + "\n" + "\n-Animes dirigidos: \n" + "\t" + animes + "\n-Estudios en los que ha trabajado: \n" + "\t" + estudios);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}
	
	},
};
