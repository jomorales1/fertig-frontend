<script>
import { Line , mixins} from 'vue-chartjs'
const{ reactiveProp } = mixins
export default {
  name: 'Chart',
  extends: Line,
  mixins: [reactiveProp],
  props:{labelsSet:{
    Type: Array,
      required: true,
      default: null
  },dataSet:{
    Type:Array,
      required: true,
      default: null
    },labelString:{
        Type: String,
        required: true,
    },
  },
  data(){
    return{
      // chartdata: {
      //   labels: this.labelsSet,
      //   datasets: [
      //     {
      //       label: this.labelString,
      //       backgroundColor: '#f87979',
      //       data: this.dataSet
      //     }
      //   ]
      // },
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
  methods:{

  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  computed:{
  }

}
</script>

<!--<style>-->
<!--.small {-->
<!--  max-width: 600px;-->
<!--  margin:  150px auto;-->
<!--}-->
<!--</style>-->