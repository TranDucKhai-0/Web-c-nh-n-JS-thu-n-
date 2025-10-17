// --------- Hàm icon theo weathercode (giống file weather.jsx của bạn) ----------
function getWeatherIcon(code){
  if (code === 0) return "☀️ Trời quang";
  if (code >= 1 && code <= 3) return "🌤️ Có mây";
  if (code >= 45 && code <= 48) return "🌫️ Sương mù";
  if (code >= 51 && code <= 57) return "🌦️ Mưa phùn";
  if (code >= 61 && code <= 67) return "🌧️ Mưa nhẹ";
  if (code >= 71 && code <= 77) return "❄️ Tuyết";
  if (code >= 80 && code <= 82) return "🌧️🌧️ Mưa to";
  if (code === 95) return "⛈️ Dông nhẹ";
  if (code >= 96 && code <= 99) return "🌩️ Dông mạnh";
  return "❔ Không xác định";
}

// --------- Gọi API Open-Meteo ----------
const API =
  "https://api.open-meteo.com/v1/forecast?latitude=10.75&longitude=106.67&current_weather=true&daily=temperature_2m_max,windspeed_10m_max,weathercode&timezone=auto";

const currentBox = document.getElementById("current-weather");
const forecastBox = document.getElementById("forecast");

async function loadWeather(){
  try{
    const res = await fetch(API);
    const data = await res.json();

    // ----- Hiện tại -----
    const cw = data.current_weather; // {temperature, windspeed, weathercode, ...}
    currentBox.innerHTML = `
      <p>Thời tiết: ${getWeatherIcon(cw.weathercode)}</p>
      <p>🌡️ Nhiệt độ hiện tại: ${cw.temperature}°C</p>
      <p>💨 Tốc độ gió: ${cw.windspeed} km/h</p>
    `;

    // ----- 7 ngày -----
    const d = data.daily;
    // d.time[], d.temperature_2m_max[], d.windspeed_10m_max[], d.weathercode[]
    forecastBox.innerHTML = ""; // clear
    d.time.forEach((date, i) => {
      const card = document.createElement("div");
      card.className = "day";
      const label = new Date(date).toLocaleDateString("vi-VN", {
        weekday: "long", day: "2-digit", month: "2-digit"
      });
      card.innerHTML = `
        <p><b>${label}</b></p>
        <p>Thời tiết: ${getWeatherIcon(d.weathercode[i])}</p>
        <p>Nhiệt độ tối đa: ${d.temperature_2m_max[i]}°C</p>
        <p>💨 Gió tối đa: ${d.windspeed_10m_max[i]} km/h</p>
      `;
      forecastBox.appendChild(card);
    });
  }catch(err){
    console.error("Lỗi:", err);
    currentBox.innerHTML = `<p style="color:red">Không tải được dữ liệu thời tiết.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);
