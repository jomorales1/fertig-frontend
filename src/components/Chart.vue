<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'Chart',
  extends: Line,
  data () {
    return {
      datacollection: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Horas Completadas',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: [60, 40, 20, 50, 10, 10, 20, 40, 50, 70, 90, 100]
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  }
}
</script>

<!--<style>-->
<!--.small {-->
<!--  max-width: 600px;-->
<!--  margin:  150px auto;-->
<!--}-->
<!--</style>-->