
const map = L.map('map').setView([-5.52, -47.49], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);


async function buscarCoordenadas(local){

    const responde = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${local}`
    );

    const data = await responde.json();

    if(data.length === 0){
        alert("Local não encontrado");
        return null
    }

    return[
        parseFloat(data[0].lat),
        parseFloat(data[0].lon)
    ]
};


async function calcularRota(origem,destino){
    const url =
        `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;

    const response = await fetch(url)

    const data = await response.json();

    console.log(data)

    return data.routes[0];
}


document.querySelector(".inputRota")
.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const origemTexto =
    document.getElementById('origem').value;

    const destinoTexto = 
    document.getElementById('destino').value;

    
    const origem =
    await buscarCoordenadas(origemTexto);

    const destino =
    await buscarCoordenadas(destinoTexto);

    
    const rota =
    await calcularRota(origem, destino)

    console.log(rota)

    
    L.geoJSON(rota.geometry).addTo(map);


    
    const distancia = rota.distance / 1000;

    
    const tempo = Math.ceil(rota.duration / 60);

    document.getElementById('distancia').textContent = `${distancia.toFixed(2)} km`
    document.getElementById('tempo').textContent = `${tempo} min`;

    const tipoVeiculo = document.querySelector('input[name="veiculo"]:checked').value;

         let tarifaBase;
         let valorKm;
         let valorMin;

        if(tipoVeiculo === "carro"){
            tarifaBase = 5;
            valorKm = 2;
            valorMin = 0.4;
        }else{
            tarifaBase = 3;
            valorKm = 1;
            valorMin = 0.2;
        };

    const preco =
        tarifaBase +
(       distancia * valorKm) + (tempo * valorMin);


document.getElementById('preco').textContent = `R${preco.toFixed(2)}`

    const bounds = L.latLngBounds([
        origem,
        destino
    ]);

    map.fitBounds(bounds)

    
    
});
const Status = document.querySelector('.status');
const mensagem = document.querySelector('.mensagemStatus');
const loader = document.querySelector('.loader');
const btnVeiculo = document.querySelector('.btn-veiculo');

btnVeiculo.addEventListener('click', () => {
    Status.style.display = "flex";
    mensagem.textContent = 'Procurando Motorista...';

    loader.style.display = "block";

    setTimeout(() => {
        mensagem.textContent = 'Motorista encontrado!';
        loader.style.display = 'none'
    }, 10000)

})

