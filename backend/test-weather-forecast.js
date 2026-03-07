import weatherService from './services/weatherService.js';

async function testWeatherForecast() {
  try {
    console.log('🌤️ Testing Weather Forecast API...\n');

    const testCity = 'Hinganghat';
    console.log(`Fetching 7-day forecast for ${testCity}...\n`);

    const forecast = await weatherService.fetchCompleteForecast(testCity, 7);

    console.log('✅ Forecast Data Retrieved:\n');
    console.log(`City: ${forecast.city}`);
    console.log(`Region: ${forecast.region}`);
    console.log(`Source: ${forecast.source}\n`);

    console.log('📊 Current Weather:');
    console.log(`  Temperature: ${forecast.current.temperature}°C`);
    console.log(`  Feels Like: ${forecast.current.feelsLike}°C`);
    console.log(`  Humidity: ${forecast.current.humidity}%`);
    console.log(`  Rainfall: ${forecast.current.rainfall} mm`);
    console.log(`  Condition: ${forecast.current.description}`);
    console.log(`  Wind Speed: ${forecast.current.windSpeed} km/h`);
    console.log(`  UV Index: ${forecast.current.uv}`);
    console.log(`  Visibility: ${forecast.current.visibility} km\n`);

    console.log(`📅 ${forecast.forecast.length}-Day Forecast:\n`);
    forecast.forecast.forEach((day, index) => {
      console.log(`Day ${index + 1}: ${day.date}`);
      console.log(`  Max: ${day.maxTemp}°C | Min: ${day.minTemp}°C | Avg: ${day.avgTemp}°C`);
      console.log(`  Condition: ${day.condition}`);
      console.log(`  Rainfall: ${day.totalRainfall} mm (${day.chanceOfRain}% chance)`);
      console.log(`  Humidity: ${day.avgHumidity}%`);
      console.log(`  Sunrise: ${day.sunrise} | Sunset: ${day.sunset}`);
      console.log(`  Moon Phase: ${day.moonPhase}\n`);
    });

    if (forecast.alerts && forecast.alerts.length > 0) {
      console.log('⚠️ Weather Alerts:');
      forecast.alerts.forEach(alert => {
        console.log(`  - ${alert.headline || alert.event}`);
      });
    } else {
      console.log('✅ No weather alerts\n');
    }

    console.log('🎉 Weather forecast test completed successfully!\n');

  } catch (error) {
    console.error('❌ Error testing weather forecast:', error.message);
  }
}

testWeatherForecast();
