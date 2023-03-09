$('[data-toggle="tooltip"]').tooltip();

let colorArray = ['#e86890', '#ef23d7', '#2040aa',
  '#89fc6a', '#A6DEE6', '#9400D3', '#1AFF33', '#bd322b',
  '#f3a0ea', '#f89a41', '#fce753', '#99E6E6', '#6666FF'
];

let options = {
tooltips: {
mode: 'index'
},
responsive: true,
maintainAspectRatio: false,
legend: {display: false},
elements: {
point: {
hoverRadius: 4
},
},
scales: {
xAxes: [{

gridLines: {
display:false
},
ticks: {
display: false
}
}],

yAxes: [{
gridLines: {
display:true
},

ticks: {
display: true,
beginAtZero: true

}
}]
}
}

function getGlobalGraph() {
  $.ajax({
    url:"api/getGlobalHistory",
      method: "GET",
      success: function(data){

      if(data.success != true) {
      $(".serv").text("Error fetching server graph");
      }
    else {
      let builder = [];
      let t = [];

      data.timestamps.forEach(element => {
        t.push(moment.unix(element).format('MM/DD/YYYY (hh:mm:ss a)'));
      });

      data.servers.forEach((element, key) => {
         builder.push({
          label: element.name,
          data: element.cnt,
          borderWidth: 2,
          fill: false,
          lineTension: 0,
          pointRadius: 0,
          pointHitRadius: 10,
          pointBackgroundColor: colorArray[key+1],
          pointBorderColor: colorArray[key+1],
          borderColor: colorArray[key+1],
          backgroundColor: colorArray[key+1] + "22",
        })
      });
      
      options.legend.display = true;

      new Chart("myChart", {
          type: "line",
          data: {
          labels: t,
          datasets: builder,
          },
          options: options
          });
        }
  }
  });
}

  function getServerGraph() {
    $.ajax({
      url: "../api/getServerHistory",
      data: {
        id: $("#id").val()
      },
      method: "GET",
      success: function (data) {

        if (data.success != true) {
          $(".serv").text("Error fetching server graph");
        } else {

          let t = [];

          data.timestamps.forEach(element => {
            t.push(moment.unix(element).format('MM/DD/YYYY (hh:mm:ss a)'));
          });

          new Chart("myChart", {
            type: "line",
            data: {
              labels: t,
              datasets: [{
                label: $("#name").val(),
                lineTension: 0,
                pointRadius: 0,
                pointHitRadius: 10,
                data: data.cnt,
                borderWidth: 2,
                fill: true,
                pointBackgroundColor: colorArray[$("#id").val()],
                borderColor: colorArray[$("#id").val()],
                backgroundColor: colorArray[$("#id").val()] + "22",
              }],
            },
            options: options
          });
        }
      }
    });
  }

  var isToggled = true;

  $("#toggle").click(function () {
    if (isToggled == true) {
      $(".chart").show();
      $("#toggle").text("Hide Chart");


      isToggled = false;
    } else {
      $(".chart").hide();
      $("#toggle").text("Show Chart");
      isToggled = true;
    }
  });

  $('.copybtn').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  function setTooltip(btn, message) {
    $(btn).tooltip('hide')
      .attr('data-original-title', message)
      .tooltip('show');
  }

  function hideTooltip(btn) {
    setTimeout(function () {
      $(btn).tooltip('hide');
    }, 1000);
  }

  var clipboard = new ClipboardJS('.copybtn');

  clipboard.on('success', function (e) {
    setTooltip(e.trigger, 'Copied to Clipboard');
    hideTooltip(e.trigger);
  });