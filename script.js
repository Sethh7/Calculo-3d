// Configurações ajustáveis
const CONFIG = {
  // Bambu Lab A1: máx. 1300 W @220V / 350 W @110V (pico, aquecimento da mesa).
  // Valor abaixo = consumo médio estimado durante a impressão (kW).
  potenciaKw: 0.15,
  tarifaKwh: 0.80,         // tarifa base (R$/kWh)
  multiplicadorAms: 3,     // multiplicador do preço final com AMS
  adicionalBandeira: {     // adicional por kWh (R$)
    verde: 0,
    amarela: 0.01885,
    vermelha: 0.07877 // patamar 2
  }
};

const $ = id => document.getElementById(id);
const num = id => parseFloat($(id).value) || 0;
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function calcular() {
  const bandeira = document.querySelector('input[name="bandeira"]:checked').value;

  const filamento = num("filamento") / 1000 * num("peso");
  const energia = CONFIG.potenciaKw * num("tempo") *
    (CONFIG.tarifaKwh + CONFIG.adicionalBandeira[bandeira]);
  const mao = num("maoHoras") * num("maoValor");
  const maquina = num("tempo") * num("maquina");
  const custo = filamento + energia + mao + maquina;
  const lucro = custo * num("lucro") / 100;
  const base = custo + lucro;
  const total = $("ams").checked ? base * CONFIG.multiplicadorAms : base;

  $("rFil").textContent = brl(filamento);
  $("rEn").textContent = brl(energia);
  $("rMao").textContent = brl(mao);
  $("rMaq").textContent = brl(maquina);
  $("rCusto").textContent = brl(custo);
  $("rLucro").textContent = brl(lucro);
  $("rAms").textContent = brl(total - base);
  $("total").textContent = brl(total);
}

$("form").addEventListener("input", calcular);
calcular();