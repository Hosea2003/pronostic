const group_container = document.querySelector(".group-container")
const qualification = document.querySelector("#qualification")
const h_container = document.querySelector("#huitieme")
const q_container =document.querySelector("#quart")
const d_container = document.querySelector("#demi")
const f_container = document.querySelector("#finale")

var huitieme=[]
var quart=[]
var demi=[]
var finale=[]

async function fetchData(){
    // Prendre les données venant de json
    const res =await fetch("countries.json")
    const output =await res.json()
    return output.groupes
}

function match(equipe_1, equipe_2){
    // fonction pour avoir le score de l'équipe 1 et 2
    const score_1=Math.floor(Math.random()*(8))
    const score_2=Math.floor(Math.random()*(8))
    return {
        equipe_1:{equipe:equipe_1, score:score_1},
        equipe_2:{equipe:equipe_2, score:score_2}
    }
}

// Une autre fonction pour les matchs qui nécessitent un vainqueur
function match_finale(equipe_1, equipe_2){
    var score_1=0, score_2=0
    do{
        score_1=Math.floor(Math.random()*(4))
        score_2=Math.floor(Math.random()*(4))
    }while(score_1==score_2)

    var winner=null
    if(score_1 > score_2)winner=equipe_1
    else winner=equipe_2

    return {
        equipe_1:{equipe:equipe_1, score:score_1},
        equipe_2:{equipe:equipe_2, score:score_2},
        winner:winner
    }
}

// 
async function populateGroup(){
    group_container.innerHTML=""
    const groupes=await fetchData()
    groupes.forEach(element => {
        let li="";
        element.equipes.forEach(pays=>{
            li+=`<li><img src="images/flags/${pays.flag}" alt="${pays.equipe}" class="flag">${pays.equipe}</li>`
        })
        const group=`
        <div class="group">
            <div class="head">
                <h3 class="group-name">${element.groupe}</h3>
            </div>
            <ul class="teams">
                ${li}
            </ul>
        </div>
        `
        group_container.innerHTML+=group
    });
}

async function matchGroup(){
    const groups = await fetchData()
    qualification.innerHTML=""
    groups.forEach(element=>{
        matchPoule(element)
    })
}

function matchPoule(group){
    var matches=[]
    const equipes = group.equipes
    equipes.forEach(equipe=>{
        const others=equipes.filter(e=>e!=equipe)
        others.forEach(o=>{
            const m = match(equipe, o)
            const find_it = matches.find(_m=>_m.equipe_1.equipe.id==o.id)
            if(!find_it){
                matches.push(m)
            }
        })
    })
    qualification.innerHTML+=populateQualif(matches, group.groupe)
}

function populateQualif(matches, group_name){
    let tr=""
    var result_equipe=[]
    matches.forEach(m=>{
        tr+=`
        <tr>
            <td>${m.equipe_1.equipe.equipe}</td>
            <td class="flag-td"><img src="images/flags/${m.equipe_1.equipe.flag}" alt="${m.equipe_1.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_1.score} - ${m.equipe_2.score} </td>
            <td class="flag-td"><img src="images/flags/${m.equipe_2.equipe.flag}" alt="${m.equipe_2.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_2.equipe.equipe}</td>
        </tr>
        `


        var equipe_1=result_equipe.find(e=>e.equipe.id==m.equipe_1.equipe.id) 
        if(!equipe_1){
            result_equipe.push({equipe:m.equipe_1.equipe, point:0})
            equipe_1=result_equipe.find(e=>e.equipe.id==m.equipe_1.equipe.id)
        }
        var equipe_2=result_equipe.find(e=>e.equipe.id==m.equipe_2.equipe.id)
        if(!equipe_2){
            result_equipe.push({equipe:m.equipe_2.equipe, point:0})
            equipe_2=result_equipe.find(e=>e.equipe.id==m.equipe_2.equipe.id)
        }
        
        if(m.equipe_1.score > m.equipe_2.score){
            equipe_1.point+=3
        }
        else if(m.equipe_2.score > m.equipe_1.score){
            equipe_2.point+=3
        }
        else if(m.equipe_2.score == m.equipe_1.score){
            equipe_1.point+=1
            equipe_2.point+=1
        }
    })

    result_equipe.sort((a,b)=>a.point > b.point ? -1:1)

    var result_tr=""
    for(let i=0; i< result_equipe.length; i++){
        const equipe=result_equipe[i].equipe
        const point=result_equipe[i].point
        const rank=i+1
        result_tr+=`
        <tr>
            <td>${equipe.equipe}</td>
            <td>${point}</td>
            <td>${rank}</td>
        </tr>
        `
    }

    // prendre les deux premiers
    huitieme.push(
        {
            group:group_name,
            equipes:[
                result_equipe[0].equipe,
                result_equipe[1].equipe 
            ]
        }
    )


    const result=`
    <div class="result-group">
        <h3 class="group-name">Resultat ${group_name}</h3>
        <div class="result-group__table">

            <table class="match-qualif">
                <tbody>
                    ${tr}
                </tbody>
            </table>

            <table class="qualif">
                <thead>
                    <tr>
                        <td>Pays</td>
                        <td>Point</td>
                        <td>Rang</td>
                    </tr>
                </thead>
                <tbody>
                    ${result_tr}
                </tbody>
            </table>
        </div>
    </div>
        `

    return result
}

function huitiemeFinal(){
    var huitieme_result=[]
    var tbody = h_container.querySelector("tbody")
    tbody.innerHTML=""
    
    for(let i=0; i<huitieme.length; i=i+2){
        const group_1=huitieme[i]
        const group_2=huitieme[i+1]
        

        for(let j=0; j<2; j++){
            const other = j==0 ? 1:0

            const equipe_1=group_1.equipes[j]
            const equipe_2=group_2.equipes[other]

            huitieme_result.push(match_finale(equipe_1, equipe_2))
        }
    }

    huitieme_result.forEach(m=>{
        const tr=`
        <tr>
            <td>${m.equipe_1.equipe.equipe}</td>
            <td class="flag-td"><img src="images/flags/${m.equipe_1.equipe.flag}" alt="${m.equipe_1.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_1.score} - ${m.equipe_2.score}</td>
            <td class="flag-td"><img src="images/flags/${m.equipe_2.equipe.flag}" alt="${m.equipe_2.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_2.equipe.equipe}</td>
        </tr>
        `
        tbody.innerHTML+=tr
        quart.push(m.winner)
    })
}

function quartFinale(){
    const tbody=q_container.querySelector("tbody")
    tbody.innerHTML=""
    for(let i=0; i<quart.length; i+=2){
        const equipe_1=quart[i]
        const equipe_2=quart[i+1]

        const m = match_finale(equipe_1, equipe_2)
        tbody.innerHTML+=`
        <tr>
            <td>${m.equipe_1.equipe.equipe}</td>
            <td class="flag-td"><img src="images/flags/${m.equipe_1.equipe.flag}" alt="${m.equipe_1.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_1.score} - ${m.equipe_2.score}</td>
            <td class="flag-td"><img src="images/flags/${m.equipe_2.equipe.flag}" alt="${m.equipe_2.equipe.equipe}" class="flag"></td>
            <td>${m.equipe_2.equipe.equipe}</td>
        </tr>
        `
        demi.push(m.winner)
    }
}

function demiFinale(){
    d_container.innerHTML="<h3>Démi finale</h3>"
    for(let i=0; i<demi.length; i+=2){
        const equipe_1=demi[i]
        const equipe_2=demi[i+1]

        const m=match_finale(equipe_1, equipe_2)
        d_container.innerHTML+=`
        <div class="vs">
            <div class="pays">
                <img src="images/flags/${m.equipe_1.equipe.flag}" alt="${m.equipe_1.equipe.equipe}">
                <h3>${m.equipe_1.equipe.equipe}</h3>
            </div>
            <div class="score">
                <h1>${m.equipe_1.score} - ${m.equipe_2.score}</h1>
            </div>
            <div class="pays">
                <img src="images/flags/${m.equipe_2.equipe.flag}" alt="${m.equipe_2.equipe.equipe}">
                <h3>${m.equipe_2.equipe.equipe}</h3>
            </div>
        </div>
        `
        finale.push(m.winner)
    }
}

function Finale(){
    f_container.innerHTML="<h3>Finale</h3>"
    const equipe_1=finale[0]
    const equipe_2=finale[1]

    const m=match_finale(equipe_1, equipe_2)
    f_container.innerHTML+=`
    <div class="vs">
        <div class="pays">
            <img src="images/flags/${m.equipe_1.equipe.flag}" alt="${m.equipe_1.equipe.equipe}">
            <h3>${m.equipe_1.equipe.equipe}</h3>
        </div>
        <div class="score">
            <h1>${m.equipe_1.score} - ${m.equipe_2.score}</h1>
        </div>
        <div class="pays">
            <img src="images/flags/${m.equipe_2.equipe.flag}" alt="${m.equipe_2.equipe.equipe}">
            <h3>${m.equipe_2.equipe.equipe}</h3>
        </div>
    </div>
    `
    document.querySelector("#winner").textContent=`Félicitation ${m.winner.equipe} pour cette victoire`
}

async function game(){
    await matchGroup()
    huitiemeFinal()
    quartFinale()
    demiFinale()
    Finale()
}

populateGroup()

game()