const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function MakeDnDEmbed(args){
    var embed={
        title:`D&D 5e ${args.categoria}: ${args.elemento}`,
        description: args.desc,
        fields: args.fields,
        footer: {
            text: 'Programado por: RoVixen#3625',
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
        }
    };

    return embed;
}

function Query(graphqlQuery){
    return new Promise((resolve,reject)=>{
        fetch("https://www.dnd5eapi.co/graphql?query="+graphqlQuery,{
            method: 'GET', // or 'PUT'
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
        .then(response=>resolve(response.data?.spell))
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
                    casting_time
                    duration
                    components
                    school{
                      name
                    }
                    classes{
                      name
                    }
                    concentration
                    ritual
                    higher_level
                    level
                }
            }`).then((result)=>{
                if(!result){
                    resolve({
                        title:"404 Spell not found"
                    });
                    return;
                }
                
                let fields=[];
                for(const entry in result){
                    if(!(result[entry]===null || result[entry]===undefined)){
                        let name=entry[0].toUpperCase()+entry.slice(1);

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


                        if(result[entry]===true){
                            result[entry]="Yes";
                        }
                        
                        fields.push({
                            name,
                            value:result[entry]
                        });
                    }
                }
                
                resolve(MakeDnDEmbed({
                    categoria:"Spell",
                    elemento:result.name,
                    desc:result.desc,
                    fields:fields
                }));

            }).catch(error=>reject(error));
        });
    },
    monster:{

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