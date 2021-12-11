//Estructura comando desde afuera del main
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Pool} = require('pg');

const config = { user: 'postgres', host: 'localhost', password: 'postgres', database: 'anidbb'};

const pool = new Pool(config);

module.exports = {
	data: 	new SlashCommandBuilder().setName('voice')
	.setDescription('Despliega informacion relacionada al actor de voz consultado')
	.addStringOption(option => option.setName('nombre')
	.setDescription('nombre del actor a consultar')
	.setRequired(true))
	,
	async execute(interaction) 
	{

		try
		{
			const actName = interaction.options.getString('nombre');

				const res = await pool.query('SELECT nombre_actor, edad, nombre_personaje, nombre_anime FROM Actor_de_voz, Personajes, Anime, Graba WHERE nombre_actor LIKE ' + "'%" + `${actName}` + "%' " + 'AND Personajes.id_actor = Actor_de_voz.id AND Actor_de_voz.id = Graba.id_actor AND Anime.id = Graba.id_anime;');

				var personajes = "";
				res.rows.forEach(element => (personajes = personajes + "-" + `${element.nombre_personaje}` + "\n\t"));
				
				var animes = "";
				res.rows.forEach(element => (animes = animes + "-" + `${element.nombre_anime}` + "\n\t"));

				await interaction.editReply("Informacion sobre actor/actriz: \n" + "\n-Nombre: " + `${res.rows[0].nombre_actor}` + "\n" + "\n-Edad: " + `${res.rows[0].edad}` + "\n" + "\n-Personajes interpretados: \n" + "\t" + personajes + "\n-Animes en los que ha participado: \n" + "\t" + animes);

		}
		catch (error)
		{
			console.log(error);
			await interaction.editReply("Error: Intenta nuevamente");
		}
	
	},
};
