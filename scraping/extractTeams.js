const extractTeams = async (page, categoryUrl, game) => {
    await page.goto(categoryUrl, { waitUntil: "domcontentloaded" });

    const teamNames = await page.evaluate(() => {
        const teams = document.querySelectorAll(".mw-category-group ul li a");
        return Array.from(teams).map((team) => team.textContent?.trim());
    });

    const results = [];
    for (const team of teamNames) {
        if (!team) continue;

        const teamUrl = `${categoryUrl.split("/Category")[0]}/${encodeURIComponent(team)}`;
        await page.goto(teamUrl, { waitUntil: "domcontentloaded" });

        const isDisbanded = await page.evaluate(() => 
            document.body.textContent?.includes("Disbanded:") ?? false
        );
        if (isDisbanded) continue;

        const teamInfo = await page.evaluate(
            (game, teamUrl) => {
                const teamName = document.querySelector(".infobox-header")?.textContent?.trim() || "";
                const cleanedTeamName = teamName.replace(/\[e\]\[h\]/g, "").trim();
                const logoElement = document.querySelector(".infobox-image img");
                const logoUrl = logoElement ? logoElement.src : "";
                return { teamName: cleanedTeamName, game, logoUrl, equipoUrl: teamUrl };
            },
            game,
            teamUrl
        );

        if (teamInfo.teamName && teamInfo.logoUrl) {
            results.push(teamInfo);
        }
    }

    return results.filter((value, index, self) =>
        index === self.findIndex((t) => t.teamName === value.teamName)
    );
};

export default extractTeams;