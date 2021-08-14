const COLORS = {
  confirmed: "#fff000",
  recovered: "#008000",
  deaths: "#373c43",
};

const CASE_STATUS = {
  confirmed: "confirmed",
  recovered: "recovered",
  deaths: "deaths",
};

let body = document.querySelector("body");
let countries_list;
let all_time_chart, days_chart, recover_rate_chart;

window.onload = async () => {
  console.log("ready ... ");
  await loadData("Global");
};

loadData = async (country) => {
  startLoading();
  await initAllTimesChart();
  await loadSummary(country);
  await loadAllTimeChart(country);
  endLoading();
};

startLoading = () => {
  body.classList.add("loading");
};
endLoading = () => {
  body.classList.remove("loading");
};
isGlobal = (country) => {
  return country === "Global";
};
numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

showConfirmedTotal = (total) => {
  document.querySelector("#confirmed-total").textContent =
    numberWithCommas(total);
};

showRecoveredTotal = (total) => {
  document.querySelector("#recovered-total").textContent =
    numberWithCommas(total);
};

showDeathsTotal = (total) => {
  document.querySelector("#deaths-total").textContent = numberWithCommas(total);
};

loadSummary = async (country) => {
  //country =Myanmar
  let summaryData = await covidApi.getSummary();
  let summary = summaryData.Global;
  if (!isGlobal(country)) {
    summary = summaryData.Countries.filters((e) => e.Slug === country[0]);
  }
  // console.log(summaryData);
  showConfirmedTotal(summary.TotalConfirmed);
  showRecoveredTotal(summary.TotalRecovered);
  showDeathsTotal(summary.TotalDeaths);

  //load countries table

  let casesByCountries = summaryData.Countries.sort(
    (a, b) => b.TotalConfirmed - a.TotalConfirmed
  );

  let table_countries = document.querySelector("#table-countries tbody");
  table_countries.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    let row = `
        <tr>
            <td>${numberWithCommas(casesByCountries[i].Country)}</td>
            <td>${numberWithCommas(casesByCountries[i].TotalConfirmed)}</td>
            <td>${numberWithCommas(casesByCountries[i].TotalRecovered)}</td>
            <td>${numberWithCommas(casesByCountries[i].TotalDeaths)}</td>     
        </tr>
        `;
    table_countries.innerHTML += row;
  }
};

initAllTimesChart = async () => {
  let options = {
    chart: {
      type: "line",
    },
    colors: [COLORS.confirmed, COLORS.recovered, COLORS.deaths],
    series: [],
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    stroke: {
      curve: "smooth",
    },
  };

  all_time_chart = new ApexCharts(
    document.querySelector("#all-time-chart"),
    options
  );

  all_time_chart.render();
};

renderData = (country_data) => {
  let res = [];
  country_data.forEach((e) => {
    res.push(e.Cases);
  });
  return res;
};

renderWorldData = (world_data, status) => {
  let res = [];
  world_data.forEach((e) => {
    switch (status) {
      case CASE_STATUS.confirmed:
        res.push(e.TotalConfirmed);
        break;
      case CASE_STATUS.recovered:
        res.push(e.TotalRecovered);
        break;
      case CASE_STATUS.deaths:
        res.push(e.TotalDeaths);
        break;
    }
  });
  return res;
};

loadAllTimeChart = async (country) => {
  let labels = [];
  let confirmed_data, recovered_data, deaths_data;
  if (isGlobal(country)) {
    let world_data = await covidApi.getWorldAllTimeCases();
    world_data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    world_data.forEach((e) => {
      let d = new Date(e.Date);
      labels.push(`${d.getFullYear()}- ${d.getMonth() + 1} -${d.getDate()}}`);
    });
    confirm_data = renderWorldData(world_data, CASE_STATUS.confirmed);
    recovered_data = renderWorldData(world_data, CASE_STATUS.recovered);
    deaths_data = renderWorldData(world_data, CASE_STATUS.deaths);
    // console.log(world_data);
  } else {
    let confirmed = await covidApi.getCountryAllTimesCases(
      country,
      CASE_STATUS.confirmed
    );
    let recovered = await covidApi.getCountryAllTimesCases(
      country,
      CASE_STATUS.recovered
    );
    let deaths = await covidApi.getCountryAllTimesCases(
      country,
      CASE_STATUS.recovered
    );
    confirmed_data = renderDate(confirmed);
    recovered_data = renderDate(recovered);
    deaths_data = renderDate(deaths);

    confirmed.forEach((e) => {
      let d = new Date(e.Date);
      labels.push(`${d.getFullYear()}-${d.getMonth() + 1} - ${d.getDate()}`);
    });

    let series = [
      {
        name: "Confirmed",
        data: confirmed_data,
      },
      {
        name: "Recovered",
        data: recovered_data,
      },
      {
        name: "Deaths",
        data: deaths_data,
      },
    ];
    all_time_chart.updateOptions({
      series: series,
      xaxis: {
        categories: labels,
      },
    });
  }
};
