import { useEffect, useState } from "react"

export default function Shots(){
    const [dataset, setDataset] = useState([]);

    function Shot(description, shot, team, player, coordinates){
        this.description = description;
        this.shotType = shot;
        this.team = team;
        this.player = player;
        this.coordinates = coordinates;
    }

    async function getPlayData(){
        const repsonse = await fetch('https://statsapi.web.nhl.com/api/v1/game/2021020517/feed/live', {mode: 'cors'})
        const data = await repsonse.json()
        return await data.liveData.plays.allPlays;   
    }

    function getShots(play){
        if(play.result.event === "Goal" || play.result.event === "Shot"){
            return true;
        }
    }

    function getShotData(array, shots){
        array.forEach((sData) => {
            const shot = new Shot(sData.result.description, sData.result.secondaryType, sData.team.name, sData.players[0].player.fullName, sData.coordinates);
            shots.push(shot);
        });

        setDataset(shots);
    }

    async function createShotDataList(){
        let shots = [];
        const playData = await getPlayData();
        const shotData =  await playData.filter(getShots);
        getShotData(shotData, shots);
    }

    useEffect(()=>{
        createShotDataList();
    }, []);

    return(
        <svg viewBox="0 0 100 50">
        {dataset.map((shot) => (
          <circle
            cx={shot.coordinates.x}
            cy={shot.coordinates.y}
            r="3"
          />
        ))}
      </svg>
    )
}