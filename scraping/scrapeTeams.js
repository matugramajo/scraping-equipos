import puppeteer from 'puppeteer';
import extractTeams from './extractTeams.js';
import Equipo from '../models/Equipo.js';

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

const scrapeTeams = async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();

        const games = [
            { name: "LoL", categoryUrl: "https://liquipedia.net/leagueoflegends/Category:Argentine_Teams" },
            { name: "CS",  categoryUrl: "https://liquipedia.net/counterstrike/Category:Argentine_Teams",},
            { name: "Valo", categoryUrl: "https://liquipedia.net/valorant/Category:Argentine_Teams",},
            { name: "Fifa",  categoryUrl: "https://liquipedia.net/easportsfc/Category:Argentine_Teams",},
            { name: "R6",  categoryUrl: "https://liquipedia.net/rainbowsix/Category:Argentine_Teams",},
            { name: "Rocket", categoryUrl: "https://liquipedia.net/rocketleague/Category:Argentine_Teams",},
            { name: "PUBG", categoryUrl: "https://liquipedia.net/pubg/Category:Argentine_Teams",},
            { name: "ML", categoryUrl: "https://liquipedia.net/mobilelegends/Category:Argentine_Teams",},
            { name: "Apex", categoryUrl: "https://liquipedia.net/apexlegends/Category:Argentine_Teams",},
            { name: "Ow", categoryUrl: "https://liquipedia.net/overwatch/Category:Argentine_Teams",},
            { name: "AoE", categoryUrl: "https://liquipedia.net/ageofempires/Category:Argentine_Teams",},
        ];

        const allResults = [];
        for (const game of games) {
            const results = await extractTeams(page, game.categoryUrl, game.name);
            allResults.push(...results);
        }

        await saveTeamsToDatabase(allResults);

        return allResults;
    } finally {
        await browser.close();
    }
};

export default scrapeTeams;