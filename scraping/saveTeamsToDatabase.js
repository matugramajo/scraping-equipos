import Equipo from '../models/Equipo';
const saveTeamsToDatabase = async (teamsData) => {
  try {
    for (let team of teamsData) {
      const existingTeam = await Equipo.findOne({ teamName: team.teamName, game: team.game });

      if (!existingTeam) {
        const newTeam = new Equipo(team);
        await newTeam.save();
      } else {
        console.log(`El equipo ${team.teamName} ya existe.`);
      }
    }
    console.log('Equipos insertados o actualizados');
  } catch (error) {
    console.error('Error al guardar equipos:', error);
  }
};

export default saveTeamsToDatabase;
