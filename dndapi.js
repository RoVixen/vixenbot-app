const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function MakeDnDEmbed(args){
    var embed={
        title:`D&D 5e ${args.categoria}: ${args.elemento}`,
        description: args.desc,
        fields: args.fields,
        footer: {
            text: 'Programmed by: RoVixen#3625',
            icon_url: 'https://cdn.discordapp.com/avatars/459197631533678623/f9cb4c8f77eecba5901394cc76e5fe79.webp?size=40',
        }
    };

    return embed;
}

function CapitalizeAll(toCap){
    return toCap.split("_").map((entry)=>{
        return entry[0].toUpperCase()+entry.slice(1);
    }).join(" ");
}

function BuildFields(result){

    if(result.name)
        delete result.name;

    if(result.desc)
        delete result.desc;

    let fields=[];

    for(const entry in result){
        if((result[entry]!==null && result[entry]!==undefined)){
            let name=CapitalizeAll(entry);

            if(typeof result[entry] == "object"){
                if(result[entry].constructor.name=="Array"){
                    result[entry]=result[entry].reduce((prev, current) => {
                        return prev+=" "+(typeof current == "object"?
                            current.name:
                            current
                        );
                    },"");
                }else{
                    result[entry]=result[entry].name;
                }
            }

            if(result[entry]===true)
                result[entry]="Yes";

            if(result[entry]===false)
                delete result[entry];
            
            if(result[entry])
                fields.push({
                    name,
                    value:result[entry].toString()
                });
        }
    }

    return fields;
}

function Query(graphqlQuery){
    return new Promise((resolve,reject)=>{
        fetch("https://www.dnd5eapi.co/graphql?query="+graphqlQuery,{
            method: 'GET', // or 'PUT'
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
        .then(response=>resolve(response?.data))
        .catch(error => reject('Error while querying:'+error))
        ;
    });
}

const comandos={
    help:()=>{
        return new Promise((resolve)=>{
            resolve(MakeDnDEmbed({
                categoria:"Help",
                elemento:"",
                desc:"/!\\ La busqueda se tiene que hacer siempre en ingles /!\\",
                fields:[
                    {
                        name:"{{dnd spell [spell name]",
                        value:"Busca un hechizo por su nombre"
                    },
                    {
                        name:"{{dnd monster [monster name]",
                        value:"Busca un monstruo por su nombre"
                    }
                ]
            }));
        });
    },
    spell:(spellName)=>{
        return new Promise((resolve,reject)=>{
            Query(`{
                spell(filter:{
                    name:"${spellName}"
                }){
                    name
                    desc
                    level
                    concentration
                    ritual
                    casting_time
                    duration
                    components
                    material
                    school{
                      name
                    }
                    classes{
                      name
                    }
                    higher_level
                }
            }`).then((result)=>{
                if(!result.spell){
                    resolve({
                        title:"404 Spell not found"
                    });
                    return;
                }
                result=result.spell;
                
                if(result.level === 0)
                    result.level="Cantrip";
                
                resolve(MakeDnDEmbed({
                    categoria:"Spell",
                    elemento:result.name,
                    desc:result.desc.join("\n\n"),
                    fields:BuildFields(result)
                }));

            }).catch(error=>reject(error));
        });
    },
    monster:(monsterName)=>{
        return new Promise((resolve,reject)=>{
            Query(`{
                monster(filter:{
                    name:"${monsterName}"
                }){
                    name
                    type
                    size
                    alignment
                    challenge_rating
                    xp
                    armor_class
                    hit_points
                    speed{
                      walk
                      fly
                      swim
                      climb
                      burrow
                      hover
                    }
                    strength
                    dexterity
                    constitution
                    intelligence
                    wisdom
                    charisma
                    proficiencies{
                      proficiency{
                        name 
                      }
                      value
                    }
                }
            }`).then((result)=>{
                if(!result.monster){
                    resolve({
                        title:"404 Monster not found"
                    });
                    return;
                }
                result=result.monster;
                
                //setting the type for not too long
                result.type=`${result.size} ${result.type} ${result.alignment}`;
                delete result.size;
                delete result.alignment;

                //challenge and xp
                result.challenge_rating=`${result.challenge_rating} (${result.xp} XP)`;
                delete result.xp;

                //speed
                let speedText=[];
                for(const speedName in result.speed){
                    if(result.speed[speedName])
                        speedText.push(`${CapitalizeAll(speedName)}: ${result.speed[speedName]}`);
                }
                result.speed=speedText.join(" ");
                
                //stats
                result.stats=`
                    Str: ${result.strength}
                    Dex: ${result.dexterity}
                    Con: ${result.constitution}
                    Int: ${result.intelligence}
                    Wis: ${result.wisdom}
                    Cha: ${result.charisma}
                `;
                delete result.strength;
                delete result.dexterity;
                delete result.constitution;
                delete result.intelligence;
                delete result.wisdom;
                delete result.charisma;

                //proficencies
                if(result.proficiencies?.constructor?.name=="Array"){
                    result.proficiencies=result.proficiencies.reduce((prev,current) => {
                       return prev+current.proficiency.name.slice(6)+": +"+current.value+"\n";
                    },"")
                }

                //

                resolve(MakeDnDEmbed({
                    categoria:"Monster",
                    elemento:result.name,
                    desc:undefined,
                    fields:BuildFields(result)
                }));

            }).catch(error=>reject(error));
        });
    }
};

function Resolve(params,message){
    message.channel.sendTyping();

    const command=params.shift();
    const toSearchName=params.map((word)=>{
        return word[0].toUpperCase()+word.slice(1);
    }).join(" ");

    if(!comandos[command]){
        message.channel.send(`La categoria o comando ${command} no existe`);
        comandos.help().then((toEmbed)=>{
            message.channel.send({embeds:[toEmbed]});
        });
        return;
    }

    comandos[command](toSearchName).then((toEmbed)=>{
        message.channel.send({embeds:[toEmbed]});
    });
}

module.exports=Resolve;